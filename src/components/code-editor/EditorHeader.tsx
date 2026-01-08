"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "../ui/theme-toggle";
import { Toolbar } from "./Toolbar";
import { EditorHeaderProps } from "@/types/appTypes";


export function EditorHeader({
    yUndoManager,
    language,
    roomId,
    copied,
    isRunning,
    onCopy,
    onRun,
    onLanguageChange,
}: EditorHeaderProps) {
    return (
        <div className="flex items-center justify-between p-2 border-b border-black dark:border-gray-700">
            <Toolbar
                yUndoManager={yUndoManager}
            />

            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg rounded-r-xl pl-4 py-0 text-base font-mono shadow-sm">
                <span className="font-semibold">Room ID:</span>
                <span className="text-lg">{roomId}</span>
                <button
                    onClick={onCopy}
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

                <Select value={language} onValueChange={onLanguageChange}>
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

                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1">
                    <ThemeToggle />
                </div>

                <Button
                    onClick={onRun}
                    disabled={isRunning}
                    className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                >
                    {isRunning ? "Running..." : "Run Code"}
                </Button>
            </div>
        </div>
    );
}
