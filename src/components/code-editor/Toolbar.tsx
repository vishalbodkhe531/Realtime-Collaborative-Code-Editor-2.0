"use client";

import * as Y from "yjs";
import { RedoIcon, UndoIcon } from "./Icons";

type Props = {
  yUndoManager: Y.UndoManager | null;
};

export function Toolbar({ yUndoManager }: Props) {
  if (!yUndoManager) return null;

  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={() => yUndoManager.undo()}
        aria-label="Undo"
        className="flex items-center justify-center h-8 w-8 rounded-md
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          shadow
          border border-gray-200 dark:border-gray-700
          hover:text-gray-900 dark:hover:text-white
          hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
          transition"
      >
        <UndoIcon />
      </button>

      <button
        onClick={() => yUndoManager.redo()}
        aria-label="Redo"
        className="flex items-center justify-center h-8 w-8 rounded-md
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          shadow
          border border-gray-200 dark:border-gray-700
          hover:text-gray-900 dark:hover:text-white
          hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
          transition"
      >
        <RedoIcon />
      </button>
    </div>
  );
}
