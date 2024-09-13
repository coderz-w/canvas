import { useState } from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActiveTool, Editor } from "@/app/features/editor/type";
import { filters } from "@/app/features/editor/const";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };
  const initialFilter = editor?.imageFilter;
  const [filterState, setFilterState] = useState(initialFilter);
  const handleChangeFilter = (filter: string) => {
    editor?.setImageFilter2Active(filter);
    setFilterState(filter);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "filter" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Filters"
        description="Apply a filter to selected image"
      />

      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="lg"
              className={cn(
                "w-full h-16 justify-start text-left hover:opacity-70",
                filterState === filter && "border-2 border-blue-500",
              )}
              onClick={() => handleChangeFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
