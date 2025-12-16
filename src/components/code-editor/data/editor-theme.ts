
import { EditorView } from "codemirror";

export const isDarkMode = () => {
    return document.documentElement.classList.contains("dark");
}

export const lightEditorTheme = EditorView.theme(
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

export const darkEditorTheme = EditorView.theme(
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