import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-transparent p-3 text-sm transition-colors outline-none",
          "border border-brown focus:border-white",
          "shadow-[0px_0px_53px_8px_rgba(150,_90,_66,_0.35)] focus:shadow-[0px_0px_53px_8px_rgba(150,_90,_66,_0.65)]",
          "placeholder:text-creme/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
