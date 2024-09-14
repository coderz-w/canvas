import { fabric } from "fabric";
import { useCallback, useRef } from "react";

import { JSON_KEYS } from "../const";

interface UseHistoryHookProps {
  canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryHookProps) => {
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    console.log(undoStack.current.length > 1);

    return undoStack.current.length > 1;
  }, []);

  const canRedo = useCallback(() => {
    return redoStack.current.length > 0;
  }, []);

  const save = useCallback(() => {
    if (!canvas) return;

    const currentState = canvas.toJSON(JSON_KEYS);
    const json = JSON.stringify(currentState);

    if (!skipSave.current) {
      const lastState = undoStack.current[undoStack.current.length - 1];

      if (lastState !== json) {
        // 避免保存相同状态
        undoStack.current.push(json);
      }
    }
  }, [canvas]);

  const undo = useCallback(() => {
    if (canUndo() && undoStack.current.length > 1) {
      skipSave.current = true;
      redoStack.current.push(undoStack.current.pop() as string); // 将当前状态放入 redo 栈

      const prevState = JSON.parse(
        undoStack.current[undoStack.current.length - 1],
      );
      canvas?.clear().renderAll();
      canvas?.loadFromJSON(prevState, () => {
        canvas.renderAll();
        skipSave.current = false;
      });
    }
  }, [canUndo, canvas]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;

      const lastState = JSON.parse(redoStack.current.pop() as string);
      console.log(redoStack.current.length);
      undoStack.current.push(JSON.stringify(lastState)); // 重做操作时，将状态重新存入 undo 栈
      canvas?.clear().renderAll();
      canvas?.loadFromJSON(lastState, () => {
        canvas.renderAll();
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas]);

  return { save, canRedo, canUndo, undo, redo, undoStack };
};
