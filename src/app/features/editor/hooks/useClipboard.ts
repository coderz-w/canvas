import { fabric } from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<any>(null);

  const copy = useCallback(() => {
    canvas?.getActiveObject()?.clone((cloned: any) => {
      clipboard.current = cloned;
    });
  }, [canvas]);

  const paste = useCallback(() => {
    if (!clipboard.current) return;

    clipboard.current.clone((clonedObj: any) => {
      canvas?.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 40,
        top: clonedObj.top + 20,
        evented: true,
      });

      //    复制的是选区
      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj: any) => {
          canvas?.add(obj);
        });
        // 更新选取位置
        clonedObj.setCoords();
      } else {
        canvas?.add(clonedObj);
      }

      //   一次copy后多次paste位置偏移
      clipboard.current.top += 40;
      clipboard.current.left += 20;
      canvas?.setActiveObject(clonedObj);
      canvas?.requestRenderAll();
    });
  }, [canvas]);

  return { copy, paste };
};
