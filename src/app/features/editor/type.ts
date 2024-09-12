import { fabric } from "fabric";
export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "ai"
  | "remove-bg"
  | "settings"
  | "templates";

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  selectedObjects: fabric.Object[];
};

export interface Editor {
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  setFillColor2Active: (color: string) => void;
  setStrokeWidth2Active: (width: number) => void;
  setStrokeColor2Active: (color: string) => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[];
  canvas: fabric.Canvas;
}
export interface EditorHookProps {
  clearSelectionCallback: () => void;
}
