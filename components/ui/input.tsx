import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[6px] border border-[#2a241c] bg-[#0E0B08] px-3 py-2 text-sm text-[#F5EFE6] placeholder:text-[#6b5f56] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B14B]/30",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
