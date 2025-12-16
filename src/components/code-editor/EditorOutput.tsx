"use client";

interface EditorOutputProps {
    output: string;
}

export function EditorOutput({ output }: EditorOutputProps) {
    return (
        <div className="h-48 border-t border-gray-400 dark:border-gray-700 p-2 font-mono overflow-auto bg-white dark:bg-gray-900">
            <div className="font-semibold">Output:</div>
            <pre>{output}</pre>
        </div>
    );
}
