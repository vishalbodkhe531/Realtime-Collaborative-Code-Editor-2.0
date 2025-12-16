"use client";

import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { useRoom } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { EditorView, basicSetup } from "codemirror";
import { useCallback, useEffect, useState } from "react";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import { useRoomActions } from "../../hooks/useRoomActions";
import { templates } from "../../data/templates";

import { EditorHeader } from "./EditorHeader";
import { EditorOutput } from "./EditorOutput";
import { Sidebar } from "./Sidebar";

export function CollaborativeEditor({
  username,
  roomId,
}: {
  username: string;
  roomId: string;
}) {
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [yUndoManager, setYUndoManager] = useState<Y.UndoManager | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [view, setView] = useState<EditorView | null>(null);
  const [copied, setCopied] = useState(false);

  const ref = useCallback((node: HTMLElement | null) => setElement(node), []);

  useEffect(() => {
    if (!element || !room || !provider) return;
    const ydoc = provider.getYDoc();
    const ytext = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);
    setYUndoManager(undoManager);

    const localState = provider.awareness.getLocalState() as
      | { user?: { name: string; color: string; picture: string } }
      | undefined;

    const info =
      localState?.user ?? {
        name: username,
        color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
        picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      };

    provider.awareness.setLocalStateField("user", {
      ...info,
      roomId,
      typing: false,
    });

    let typingTimeout: NodeJS.Timeout;

    const startExtensions: Extension[] = [
      basicSetup,
      javascript(),
      yCollab(ytext, provider.awareness, {
        undoManager,
        cursorBuilder: (user: any) => {
          const cursor = document.createElement("span");
          cursor.style.borderLeft = `2px solid ${user.color || "#ffa500"}`;
          cursor.style.marginLeft = cursor.style.marginRight = "0px";
          cursor.style.height = "1em";

          const label = document.createElement("div");
          label.style.position = "absolute";
          label.style.background = user.color || "#ffa500";
          label.style.color = "white";
          label.style.fontSize = "0.7em";
          label.style.padding = "1px 4px";
          label.style.borderRadius = "4px";
          label.style.top = "-1.2em";
          label.style.left = "0";
          label.textContent = user.name || "User";

          const wrapper = document.createElement("span");
          wrapper.style.position = "relative";
          wrapper.appendChild(cursor);
          wrapper.appendChild(label);

          return wrapper;
        },
      } as any),

      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          const local = provider.awareness.getLocalState() as { user?: any };
          provider.awareness.setLocalStateField("user", {
            ...local?.user,
            typing: true,
          });
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            const local2 = provider.awareness.getLocalState() as { user?: any };
            provider.awareness.setLocalStateField("user", {
              ...local2?.user,
              typing: false,
            });
          }, 1000);
        }
      }),
    ];

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: startExtensions,
    });

    const newView = new EditorView({ state, parent: element });
    setView(newView);

    return () => {
      clearTimeout(typingTimeout);
      newView.destroy();
    };
  }, [element, room, username, roomId, provider]);

  const handleLanguageChange = (lang: string) => {
    if (!lang || !view || !yUndoManager) return;
    setLanguage(lang);

    let langExt: Extension = javascript();
    if (lang === "cpp") langExt = cpp();
    else if (lang === "python") langExt = python();
    else if (lang === "java") langExt = java();

    view.dispatch({
      effects: StateEffect.reconfigure.of([
        basicSetup,
        langExt,
        yCollab(provider.getYDoc().getText("codemirror"), provider.awareness, {
          undoManager: yUndoManager,
        }),
      ]),
    });

    const ytext = provider.getYDoc().getText("codemirror");
    ytext.delete(0, ytext.length);
    ytext.insert(0, templates[lang]);
  };

  const { handleExit, handleRun, isRunning, output } = useRoomActions({
    username,
    roomId,
    provider,
    view,
    language,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (

    <div className="select-none">
      <div className="flex h-screen w-screen">
        <div className="flex-1 flex flex-col relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

          <EditorHeader
            yUndoManager={yUndoManager}
            language={language}
            roomId={roomId}
            copied={copied}
            isRunning={isRunning}
            onCopy={handleCopy}
            onRun={handleRun}
            onLanguageChange={handleLanguageChange}
          />

          <div
            ref={ref}
            className="relative flex-grow overflow-auto p-2 border-b border-gray-700 dark:border-gray-600"
          />

          <EditorOutput output={output} />
        </div>

        <Sidebar
          roomId={roomId}
          username={username}
          onExit={handleExit}
        />
      </div>
    </div>

  );
}


