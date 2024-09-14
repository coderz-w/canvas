import { fabric } from "fabric";
import { useEffect } from "react";

interface UseHotkeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({
  canvas,
  undo,
  redo,
  copy,
  paste,
}: UseHotkeysProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlKey = event.ctrlKey || event.metaKey;
      const isInput = ["INPUT", "TEXTAREA"].includes(
        (event.target as HTMLElement).tagName,
      );

      if (isInput) return;

      // Delete key
      if (event.keyCode === 46) {
        canvas?.getActiveObjects().forEach((object) => canvas?.remove(object));
        canvas?.discardActiveObject();
        canvas?.renderAll();
      }

      // Ctrl + Z (Undo)
      if (isCtrlKey && event.key === "z") {
        event.preventDefault();
        undo();
      }

      // Ctrl + Y (Redo)
      if (isCtrlKey && event.key === "y") {
        event.preventDefault();
        redo();
      }

      // Ctrl + C (Copy)
      if (isCtrlKey && event.key === "c") {
        event.preventDefault();
        copy();
      }

      // Ctrl + V (Paste)
      if (isCtrlKey && event.key === "v") {
        event.preventDefault();
        paste();
      }

      // Ctrl + A (Select All)
      if (isCtrlKey && event.key === "a") {
        event.preventDefault();
        canvas?.discardActiveObject();

        const allObjects = canvas
          ?.getObjects()
          .filter((object) => object.selectable);

        if (allObjects && allObjects.length > 0) {
          canvas?.setActiveObject(
            new fabric.ActiveSelection(allObjects, { canvas }),
          );
        }

        canvas?.renderAll();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, undo, redo, copy, paste]); // Only rebind if dependencies change
};
