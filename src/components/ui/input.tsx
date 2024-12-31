import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideEye, LucideEyeOff } from "lucide-react";

const inputVariants = cva("flex h-9 w-full px-3 py-1 pt-1.5 text-base", {
  variants: {
    variant: {
      default:
        "border border-input bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      rtPrimary: cn(
        "bg-transparent border border-brown font-normal text-dark duration-500 shadow-custom   text-white text-sm",
        "focus:outline-1",
        "placeholder:text-creme/30",
        "disabled:cursor-not-allowed disabled:opacity-50"
      ),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, type, ...props }, ref) => {
    const [inputType, setInputType] = React.useState(type);

    const togglePasswordVisibility = () => {
      setInputType((prevType) =>
        prevType === "password" ? "text" : "password"
      );
    };

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 py-1 text-sm">
            {inputType === "password" ? (
              <LucideEye
                size={14}
                className={
                  variant === "rtPrimary" ? "text-brown" : "text-foreground"
                }
              />
            ) : (
              <LucideEyeOff
                size={14}
                className={
                  variant === "rtPrimary" ? "text-brown" : "text-foreground"
                }
              />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
