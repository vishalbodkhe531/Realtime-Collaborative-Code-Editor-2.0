"use client";

import { useState } from "react";
import { useRoomActions } from "../../hooks/useRoomActions";

import { EditorHeader } from "./EditorHeader";
import { EditorOutput } from "./EditorOutput";
import { Sidebar } from "./Sidebar";
import { useCollaborativeEditor } from "./data/useCollaborativeEditor";

type Props = {
    username: string;
    roomId: string;
};

export function EditorShell({ username, roomId }: Props) {
    const [copied, setCopied] = useState(false);
    const [showOutput, setShowOutput] = useState(false);

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


    const handleRunWithOutput = async () => {
        setShowOutput(true);
        await handleRun();
    };


    const handleClearOutput = (check: boolean) => {
        setShowOutput(false);
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
                        onRun={handleRunWithOutput}
                        onLanguageChange={changeLanguage}
                    />

                    <div
                        ref={ref}
                        className="flex-1 overflow-auto border-b border-gray-300 dark:border-gray-700"
                    />

                    {showOutput && (
                        <EditorOutput
                            output={output}
                            onClear={handleClearOutput}
                        />
                    )}
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