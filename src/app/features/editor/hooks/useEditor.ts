import { fabric } from "fabric";
import { useCallback, useState, useMemo } from "react";

import { useAutoResize } from "@/app/features/editor/hooks/useAutoResize";
import { useCanvasEvents } from "@/app/features/editor/hooks/useCanvasEvents";
import { useClipboard } from "@/app/features/editor/hooks/useClipboard";
import {
  BuildEditorProps,
  Editor,
  EditorHookProps,
} from "@/app/features/editor/type";
import {
  CIRCLE_OPTIONS,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
} from "@/app/features/editor/const";
import { createFilter, isTextType } from "@/app/features/editor/utils";

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);
  const [imageFilter, setImageFilter] = useState<string>("none");

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback });

  const { copy, paste } = useClipboard({ canvas });
  useAutoResize({ canvas, container });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        imageFilter,
        setImageFilter,
        copy,
        paste,
      });
    } else {
      return undefined;
    }
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    copy,
    paste,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: "#fff",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    [],
  );

  return { init, editor };
};

const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  strokeDashArray,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  setStrokeDashArray,
  fontFamily,
  setFontFamily,
  imageFilter,
  setImageFilter,
  copy,
  paste,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    if (!center) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    canvas._centerObject(object, center);
  };
  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    delete2Active: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    getActiveOpacity: () => {
      return canvas.getActiveObjects()[0]?.opacity || 1;
    },
    setImageFilter2Active: (filter: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;
          const effect = createFilter(filter);
          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
      canvas.renderAll();
    },
    setOpacity2Active: (opacity: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.opacity = opacity;
      });
      canvas.renderAll();
    },
    setFontWeight2Active: (weight: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("fontWeight", weight);
        }
      });
      canvas.renderAll();
    },
    setFontStyle2Active: (style: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("fontStyle", style);
        }
      });
      canvas.renderAll();
    },
    setFontLinethrough2Active: (through: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("linethrough", through);
        }
      });
      canvas.renderAll();
    },
    setFontUnderline2Active: (underline: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("underline", underline);
        }
      });
      canvas.renderAll();
    },
    setFontFamily2Active: (font: string) => {
      setFontFamily(font);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("fontFamily", font);
        }
      });
      canvas.renderAll();
    },
    setTextAlign2Active: (align: string) => {
      canvas.getActiveObjects().forEach((object) => {
        object._set("textAlign", align);
      });
      canvas.renderAll();
    },
    setFontSize2Active: (size: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("fontSize", size);
        }
      });
      canvas.renderAll();
    },
    getActiveStrokeWidth: () => {
      return canvas.getActiveObjects()[0]?.strokeWidth || 1;
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });
      canvas.renderAll();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },
    addImage: (url: string) => {
      fabric.Image.fromURL(
        url,
        (img) => {
          const workspace = getWorkspace();
          img.scaleToWidth(workspace?.width || 0);
          img.scaleToHeight(workspace?.height || 0);

          addToCanvas(img);
        },
        { crossOrigin: "anonymous" },
      );
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        },
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        },
      );

      addToCanvas(object);
    },
    setFillColor2Active: (color: string) => {
      setFillColor(color);
      canvas?.getActiveObjects().forEach((object) => {
        object.set("fill", color);
      });
      canvas?.renderAll();
    },
    setStrokeColor2Active: (color: string) => {
      setStrokeColor(color);
      canvas?.getActiveObjects().forEach((object) => {
        //text没有strokeColor
        if (isTextType(object.type)) {
          object.set("fill", color);

          return;
        }

        object.set("stroke", color);
      });
      canvas.freeDrawingBrush.color = color;
      canvas?.renderAll();
    },
    setStrokeWidth2Active: (width: number) => {
      setStrokeWidth(width);
      canvas?.getActiveObjects().forEach((object) => {
        object.set("strokeWidth", width);
      });
      canvas.freeDrawingBrush.width = width;
      canvas?.renderAll();
    },
    setStrokeDashArray2Active: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      // Currently, gradients & patterns are not supported
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      const value =
        selectedObject.get("fontFamily" as keyof fabric.Object) || fontFamily;

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      const value =
        selectedObject.get("fontWeight" as keyof fabric.Object) || FONT_WEIGHT;

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      const value =
        selectedObject.get("fontStyle" as keyof fabric.Object) || "normal";

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      const value =
        selectedObject.get("linethrough" as keyof fabric.Object) || false;

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      const value =
        selectedObject.get("underline" as keyof fabric.Object) || false;

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      const value =
        selectedObject.get("textAlign" as keyof fabric.Object) || "left";

      // Currently, gradients & patterns are not supported
      return value;
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      const value =
        selectedObject.get("fontSize" as keyof fabric.Object) || FONT_SIZE;

      // Currently, gradients & patterns are not supported
      return value;
    },
    fillColor,
    strokeWidth,
    strokeColor,
    selectedObjects,
    fontFamily,
    imageFilter,
    setImageFilter,
    copy,
    paste,
    canvas,
  };
};
