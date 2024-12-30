import { cn } from "@/lib/utils";
import React from "react";

function TextSeparator({
  label,
  className,
}: {
  label: string;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn("flex items-center justify-center space-x-4", className)}>
      <div className={cn("block w-full h-[1px] bg-brown")}></div>
      <span className="text-brown text-xs whitespace-nowrap">{label}</span>
      <div className={cn("block w-full h-[1px] bg-brown")}></div>
    </div>
  );
}

export default TextSeparator;
