"use client";

import * as Y from "yjs";
import { RedoIcon, UndoIcon } from "./Icons";
import { Button } from "../ui/button";


export function Toolbar({ yUndoManager }: { yUndoManager: Y.UndoManager | null }) {
  if (!yUndoManager) return null;

  return (
    <div className="flex gap-2 p-2">
      <Button
        size="icon"
        variant="outline"
        onClick={() => yUndoManager.undo()}
        aria-label="Undo"
        className="cursor-pointer"
      >
        <UndoIcon />
      </Button>

      <Button
        size="icon"
        variant="outline"
        onClick={() => yUndoManager.redo()}
        aria-label="Redo"
        className="cursor-pointer"
      >
        <RedoIcon />
      </Button>
    </div>
  );
}
