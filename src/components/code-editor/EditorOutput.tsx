"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface EditorOutputProps {
    output: string;
    onClear: (isClearOtp: boolean) => void;
}

export function EditorOutput({ output, onClear }: EditorOutputProps) {
    return (
        <div className="h-48 border-t border-gray-400 dark:border-gray-700 p-2 font-mono overflow-auto bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
                <div className="font-semibold">Output:</div>
                <Button variant={"destructive"} className="rounded-full cursor-pointer" onClick={() => onClear(true)}><Trash2 size={16} /></Button>
            </div>
            <pre>{output}</pre>
        </div>
    );
}
