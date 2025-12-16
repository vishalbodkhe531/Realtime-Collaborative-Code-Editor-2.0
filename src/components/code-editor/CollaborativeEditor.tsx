"use client";

import * as Y from "yjs";
import { useCallback, useEffect, useState } from "react";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

import { oneDark } from "@codemirror/theme-one-dark";
import { yCollab } from "y-codemirror.next";

import { useRoom } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";

import { templates } from "../../data/templates";
import { useRoomActions } from "../../hooks/useRoomActions";

import { EditorHeader } from "./EditorHeader";
import { EditorOutput } from "./EditorOutput";
import { Sidebar } from "./Sidebar";


function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function getLanguageExtension(lang: string): Extension {
  switch (lang) {
    case "cpp":
      return cpp();
    case "python":
      return python();
    case "java":
      return java();
    default:
      return javascript();
  }
}


const lightEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#ffffff",
      color: "#111827",
    },
    ".cm-gutters": {
      backgroundColor: "#f3f4f6",
      color: "#6b7280",
      border: "none",
    },
  },
  { dark: false }
);

const darkEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0f172a",
      color: "#e5e7eb",
    },
    ".cm-gutters": {
      backgroundColor: "#020617",
      color: "#94a3b8",
      border: "none",
    },
  },
  { dark: true }
);


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
  const [view, setView] = useState<EditorView | null>(null);
  const [yUndoManager, setYUndoManager] = useState<Y.UndoManager | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);


  useEffect(() => {
    if (!element || !provider) return;

    const ydoc = provider.getYDoc();
    const ytext = ydoc.getText("codemirror");

    const undoManager = new Y.UndoManager(ytext);
    setYUndoManager(undoManager);

    provider.awareness.setLocalStateField("user", {
      name: username,
      color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
      picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      roomId,
      typing: false,
    });

    const extensions: Extension[] = [
      basicSetup,
      getLanguageExtension(language),

      ...(isDarkMode() ? [oneDark] : []),

      isDarkMode() ? darkEditorTheme : lightEditorTheme,

      yCollab(ytext, provider.awareness, { undoManager }),
    ];

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions,
    });

    const editor = new EditorView({
      state,
      parent: element,
    });

    setView(editor);

    return () => editor.destroy();
  }, [element, provider, username, roomId]);


  useEffect(() => {
    if (!view || !yUndoManager) return;

    const observer = new MutationObserver(() => {
      view.dispatch({
        effects: StateEffect.reconfigure.of([
          basicSetup,
          getLanguageExtension(language),
          ...(isDarkMode() ? [oneDark] : []),
          isDarkMode() ? darkEditorTheme : lightEditorTheme,
          yCollab(
            provider.getYDoc().getText("codemirror"),
            provider.awareness,
            { undoManager: yUndoManager }
          ),
        ]),
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [view, language, provider, yUndoManager]);


  const handleLanguageChange = (lang: string) => {
    if (!view || !yUndoManager) return;

    setLanguage(lang);

    view.dispatch({
      effects: StateEffect.reconfigure.of([
        basicSetup,
        getLanguageExtension(lang),
        ...(isDarkMode() ? [oneDark] : []),
        isDarkMode() ? darkEditorTheme : lightEditorTheme,
        yCollab(
          provider.getYDoc().getText("codemirror"),
          provider.awareness,
          { undoManager: yUndoManager }
        ),
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
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

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
            className="flex-1 overflow-auto border-b border-gray-300 dark:border-gray-700"
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
