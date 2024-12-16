import { cn } from "@/lib/utils";
import React from "react";

function TextSeparator({
    label
} : {
    label: string
}) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className={cn(
        'block w-full h-[1px] bg-brown',
      )}></div>
      <span className="text-brown text-xs whitespace-nowrap">{label}</span>
      <div className={cn(
        'block w-full h-[1px] bg-brown',
      )}></div>
    </div>
  );
}

export default TextSeparator;
