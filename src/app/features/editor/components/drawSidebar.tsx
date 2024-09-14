import { useState } from "react";

import { ActiveTool, Editor } from "@/app/features/editor/type";
import { STROKE_COLOR, STROKE_WIDTH } from "@/app/features/editor/const";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/app/features/editor/components/colorPicker";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DrawSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const DrawSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const initialColorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const initialWidthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const [colorValue, setColorValue] = useState(initialColorValue);
  const [widthValue, setWidthValue] = useState(initialWidthValue);

  const onClose = () => {
    editor?.disableDrawingMode();
    onChangeActiveTool("select");
  };

  const onColorChange = (value: string) => {
    editor?.setStrokeColor2Active(value);
    setColorValue(value);
  };

  const onWidthChange = (value: number) => {
    editor?.setStrokeWidth2Active(value);
    setWidthValue(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "draw" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Drawing mode"
        description="Modify brush settings"
      />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Label className="text-sm">Brush width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onWidthChange(values[0])}
          />
        </div>
        <div className="p-4 space-y-6">
          <ColorPicker value={colorValue} onChange={onColorChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
