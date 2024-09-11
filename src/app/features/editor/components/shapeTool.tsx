import type { IconType } from "react-icons/lib";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ShapeToolProps {
  Icon: IconType | LucideIcon;
  iconClassName?: string;
  onClick: () => void;
}

export const ShapeTool = ({ Icon, onClick, iconClassName }: ShapeToolProps) => {
  return (
    <button className=" aspect-square border rounded-md p-5" onClick={onClick}>
      <Icon className={cn(" h-full w-full", iconClassName)}></Icon>
    </button>
  );
};
