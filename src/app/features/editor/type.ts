import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
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
  strokeDashArray: number[];
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  selectedObjects: fabric.Object[];
  setStrokeDashArray: (dashArray: number[]) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
};

export interface Editor {
  bringForward: () => void;
  sendBackwards: () => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  setFontStyle2Active: (style: string) => void;
  setOpacity2Active: (opacity: number) => void;
  setFontWeight2Active: (weight: number) => void;
  setFillColor2Active: (color: string) => void;
  setStrokeWidth2Active: (width: number) => void;
  setStrokeColor2Active: (color: string) => void;
  setFontFamily2Active: (fontFamily: string) => void;
  setFontLinethrough2Active: (linethrough: boolean) => void;
  setTextAlign2Active: (align: string) => void;
  setFontUnderline2Active: (underline: boolean) => void;
  setStrokeDashArray2Active: (dashArray: number[]) => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveFontStyle: () => string;
  getActiveOpacity: () => number;
  getActiveStrokeDashArray: () => number[];
  getActiveTextAlign: () => string;
  getActiveFontFamily: () => string;
  getActiveFontWeight: () => number;
  getActiveFontLinethrough: () => boolean;
  getActiveFontUnderline: () => boolean;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[];
  fontFamily: string;
  canvas: fabric.Canvas;
}
export interface EditorHookProps {
  clearSelectionCallback: () => void;
}
