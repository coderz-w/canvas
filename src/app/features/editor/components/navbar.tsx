"use client";

import { fabric } from "fabric";
import { CiFileOn } from "react-icons/ci";
import {
  ChevronDown,
  Download,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";

import { Logo } from "@/app/features/editor/components/logo";
import { ActiveTool, Editor } from "@/app/features/editor/type";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

async function readJsonFile2canvas(canvas: fabric.Canvas | undefined) {
  if (!canvas) return;

  try {
    // Step 1: 使用 showOpenFilePicker API 选择一个文件
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
    });

    const file = await fileHandle.getFile();

    const fileContent = await readFileAsJson(file);
    canvas.loadFromJSON(fileContent, () => {
      canvas.renderAll();
    });
  } catch (error) {
    console.error("Error selecting or reading file:", error);
  }
}

async function readFileAsJson(file: any) {
  const content = await file.text();

  return JSON.parse(content);
}

export const Navbar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: NavbarProps) => {
  return (
    <nav className="flex items-center w-full p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={() => readJsonFile2canvas(editor?.canvas)}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />

        {/* Select Button */}
        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChangeActiveTool("select");
            }} // TODO: Add functionality
            className={cn(activeTool === "select" && "bg-gray-100")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>

        {/* Undo Button */}
        <Hint label="Undo" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor?.undo();
            }}
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>

        {/* Redo Button */}
        <Hint label="Redo" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor?.redo();
            }}
          >
            <Redo2 className="size-4" />
          </Button>
        </Hint>

        <Separator orientation="vertical" className="mx-2" />
        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                导出
                <Download className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => editor?.saveJson()}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem>
              {/* Save PNG */}
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => {
                  editor?.savePng();
                }}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>PNG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* TODO: Add user-button */}
        </div>
      </div>
    </nav>
  );
};
