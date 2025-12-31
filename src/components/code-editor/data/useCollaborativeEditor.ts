"use client";

import * as Y from "yjs";
import { useCallback, useEffect, useState } from "react";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { yCollab } from "y-codemirror.next";

import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { getLanguageExtension, templates } from "./templates";
import { darkEditorTheme, isDarkMode, lightEditorTheme } from "./editor-theme";
import { useRoom } from "@liveblocks/react";
import { useUserContext } from "@/context/userContext";


export function useCollaborativeEditor(
    username: string,
    roomId: string
) {
    const room = useRoom();
    const provider = getYjsProviderForRoom(room);

    const [element, setElement] = useState<HTMLElement | null>(null);
    const [view, setView] = useState<EditorView | null>(null);
    const [yUndoManager, setYUndoManager] = useState<Y.UndoManager | null>(null);
    const [language, setLanguage] = useState("javascript");
    const { setCode, setLangInContext } = useUserContext();

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
            roomId,
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

        const editor = new EditorView({ state, parent: element });
        setView(editor);

        return () => editor.destroy();
    }, [element, provider, username, roomId]);

    useEffect(() => {
        if (!view || !yUndoManager) return;

        const updateCode = () => {
            setCode(view.state.doc.toString()); // editor code set in context
        };

        updateCode(); 

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

        setLangInContext(language);

        return () => observer.disconnect();
    }, [view, language, provider, yUndoManager]);

    const changeLanguage = (lang: string) => {
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

    return {
        ref,
        view,
        yUndoManager,
        language,
        changeLanguage,
    };
}
