"use client";

import { useState } from "react";
import { useRoomActions } from "../../hooks/useRoomActions";

import { EditorHeader } from "./EditorHeader";
import { EditorOutput } from "./EditorOutput";
import { Sidebar } from "./Sidebar";
import { useCollaborativeEditor } from "./data/useCollaborativeEditor";

export function CollaborativeEditor({
  username,
  roomId,
}: {
  username: string;
  roomId: string;
}) {
  const [copied, setCopied] = useState(false);

  const {
    ref,
    view,
    yUndoManager,
    language,
    changeLanguage,
  } = useCollaborativeEditor(username, roomId);

  const { handleExit, handleRun, isRunning, output } = useRoomActions({
    username,
    roomId,
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
            onLanguageChange={changeLanguage}
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
