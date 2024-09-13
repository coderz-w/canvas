import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActiveTool, Editor } from "@/app/features/editor/type";
import { ToolSidebarClose } from "@/app/features/editor/components/toolSidebarClose";
import { ToolSidebarHeader } from "@/app/features/editor/components/toolSidebarHeader";
// import { useGetImages } from "@/app/features/editor/hooks/useGetImages";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  //   const { data, isLoading, isError } = useGetImages();
  const data: any[] = [];
  const isLoading = false;
  const isError = false;
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add Images to your canvas"
      />
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch Images
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              (data as Array<any>).map((image) => {
                return (
                  <button
                    onClick={() => editor?.addImage(image.urls.regular)}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 \
                    transition bg-muted-foreground rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={image.urls.small}
                      alt={image.alt_description || "Image"}
                      sizes="100%"
                      className="object-cover"
                    />
                    <Link
                      href={image.links.html}
                      target="_blank"
                      className="opacity-0 group-hover:opacity-100 absolute \
                    left-0 bottom-0 w-full text-[10px] truncate text-white \
                    hover:underline p-1 bg-black/50 text-left"
                    >
                      {image.user.name}
                    </Link>
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
