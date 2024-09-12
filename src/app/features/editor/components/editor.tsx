"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useState } from "react";

import { selectionDependentTools } from "@/app/features/editor/const";
import { useEditor } from "@/app/features/editor/hooks/useEditor";
import { Navbar } from "@/app/features/editor/components/navbar";
import { Sidebar } from "@/app/features/editor/components/sidebar";
import { Toolbar } from "@/app/features/editor/components/toolbar";
import { Footer } from "@/app/features/editor/components/footer";
import { ActiveTool, Editor as EditorType } from "@/app/features/editor/type";
import { ShapeSidebar } from "@/app/features/editor/components/shapeSidebar";
import { FillColorSidebar } from "@/app/features/editor/components/fillColorSidebar";
import { StrokeColorSidebar } from "@/app/features/editor/components/strokeColorSidebar";
import { StrokeWidthSidebar } from "@/app/features/editor/components/strokeWidthSidebar";

export const Editor = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      if (tool === "draw") {
        // TODO: Enable draw mode
      }

      if (activeTool === "draw") {
        // TODO: Disable draw mode
      }

      setActiveTool(tool);
    },
    [activeTool],
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor as EditorType}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor as EditorType}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor as EditorType}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor as EditorType}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
