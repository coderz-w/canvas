import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ActiveTool, Editor } from "@/app/features/editor/type";
import { ShapeTool } from "@/app/features/editor/components/shapeTool";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface shapeSidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: shapeSidebarProps) => {
  return (
    <aside
      className={cn(
        " bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="Shapes" description="Select a shape" />
      <ScrollArea>
        <div className=" grid grid-cols-3 gap-4 p-4">
          <ShapeTool onClick={() => editor?.addCircle()} Icon={FaCircle} />
          <ShapeTool
            onClick={() => editor?.addSoftRectangle()}
            Icon={FaSquare}
          />
          <ShapeTool
            onClick={() => editor?.addRectangle()}
            Icon={FaSquareFull}
          />
          <ShapeTool onClick={() => editor?.addTriangle()} Icon={IoTriangle} />
          <ShapeTool
            onClick={() => editor?.addInverseTriangle()}
            Icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => editor?.addDiamond()} Icon={FaDiamond} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("select")} />
    </aside>
  );
};
