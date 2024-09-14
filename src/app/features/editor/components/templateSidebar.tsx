import Image from "next/image";

import { templateJson } from "@/app/features/editor/const";
import { ActiveTool, Editor } from "@/app/features/editor/type";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: any) => {
    editor?.canvas.loadFromJSON(template, () => {
      editor?.canvas.renderAll();
    });
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {templateJson &&
              templateJson.map((template: any, index: any) => {
                return (
                  <button
                    style={{
                      aspectRatio: `${template.objects[0].width}/${template.objects[0].height}`,
                    }}
                    onClick={() => onClick(template)}
                    key={index}
                    className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={template.source || ""}
                      alt={template.name || "Template"}
                      className="object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                      {`template${index}`}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
