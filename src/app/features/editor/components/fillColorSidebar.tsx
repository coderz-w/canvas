import { ActiveTool, Editor } from "@/app/features/editor/type";
import { FILL_COLOR } from "@/app/features/editor/const";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/app/features/editor/components/colorPicker";

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSidebarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR;
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.setFillColor2Active(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "fill" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Fill color"
        description="Add fill color to your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
