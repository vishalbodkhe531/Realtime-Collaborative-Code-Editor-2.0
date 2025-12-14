"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { useCallback, useEffect, useState } from "react";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import { Avatars } from "./Avatars";
import { Button } from "@/components/ui/button";
import { Toolbar } from "./Toolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templates } from "./templates";
import { useRoomActions } from "../hooks/useRoomActions";

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
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-black">
            <Toolbar
              yUndoManager={yUndoManager}
              onLanguageChange={handleLanguageChange}
            />

            <div className="flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-lg rounded-r-xl pl-4 py-0 text-base text-gray-900 font-mono shadow-sm">
              <span className="font-semibold">Room ID:</span>
              <span className="text-lg">{roomId}</span>
              <button
                onClick={handleCopy}
                className={`ml-3 px-6 py-2 text-sm text-white rounded-r-xl cursor-pointer active:scale-95 transition ${copied
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600"
                  }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Language:</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40 cursor-pointer">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-green-500 cursor-pointer text-white hover:bg-green-600"
              >
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>

          <div
            ref={ref}
            className="flex-1 p-2 overflow-auto border-b border-gray-700"
          ></div>

          <div className="h-48 border-t border-gray-400 text-black p-2 font-mono overflow-auto">
            <div>Output:</div>
            <pre>{output}</pre>
          </div>
        </div>

        <div className="flex flex-col w-64 border-l border-gray-300 bg-gray-50">
          <div className="flex-1 overflow-auto p-2">
            <Avatars currentRoomId={roomId} currentUser={username} />
          </div>
          <div className="p-2 border-t border-gray-300">
            <Button
              onClick={handleExit}
              className="w-full bg-orange-500 cursor-pointer text-white hover:bg-red-600"
            >
              Exit Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
