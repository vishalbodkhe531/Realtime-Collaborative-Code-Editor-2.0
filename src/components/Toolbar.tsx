import * as Y from "yjs";
import styles from "./Toolbar.module.css";
import { RedoIcon, UndoIcon } from "./Icons";

type Props = {
  yUndoManager: Y.UndoManager | null;
  onLanguageChange?: (lang: string) => void;
};



export function Toolbar({ yUndoManager }: Props) {
  if (!yUndoManager) return null;
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={() => yUndoManager.undo()}
        aria-label="undo"
      >
        <UndoIcon />
      </button>
      <button
        className={styles.button}
        onClick={() => yUndoManager.redo()}
        aria-label="redo"
      >
        <RedoIcon />
      </button>

    </div>

  );
}
