"use client";
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { SavedFileProps } from "@/types/appTypes";

export default function SavedCodeMirror({
    code,
    language,
    readOnly = false,
}: SavedFileProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);

    const getLanguageExtension = () => {
        switch (language) {
            case "python":
                return python();
            case "javascript":
            default:
                return javascript();
        }
    };

    useEffect(() => {
        if (!editorRef.current || viewRef.current) return;

        const state = EditorState.create({
            doc: code,
            extensions: [
                basicSetup,
                getLanguageExtension(),
                oneDark,
                EditorView.editable.of(!readOnly),
            ],
        });

        viewRef.current = new EditorView({
            state,
            parent: editorRef.current,
        });

        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [code, language, readOnly]);

    return <div ref={editorRef} className="h-full w-full" />;
}
