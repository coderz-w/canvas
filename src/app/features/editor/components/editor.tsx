"use client";

import { fabric } from "fabric";
import { useRef, useEffect } from "react";

import { useEditor } from "../hooks/useEditor";

export default function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { init } = useEditor();
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({ initialCanvas: canvas, initialContainer: containerRef.current! });
  }, [init]);
  return (
    <div className=" h-full flex">
      <div className=" flex-1 h-full bg-muted" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
