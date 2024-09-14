import { fabric } from "fabric";
import { useEffect } from "react";

interface useCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: React.Dispatch<React.SetStateAction<fabric.Object[]>>;
  clearSelectionCallback: () => void;
  save: () => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
}: useCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback();
      });
      canvas.on("object:added", () => {
        save();
      });
      canvas.on("object:removed", () => {
        save();
      });
      canvas.on("object:modified", () => {
        save();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
      }
    };
  }, [canvas, setSelectedObjects, clearSelectionCallback, save]);
};
