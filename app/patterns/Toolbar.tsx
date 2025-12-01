import type { HtmlHTMLAttributes } from "react";
import type React from "react";
import { cn } from "~/utils/cn";


const baseStyles = cn("flex py-2 px-4 justify-between");

const variantStyles = {
  flat: cn("bg-transparent outline-none px-0!"),
  outline: cn("bg-transparent border border-slate-400 rounded")
}

interface ToolbarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles;
  heading?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className,
  heading,
  variant = "flat",
  ...props
}) => (
  <div {...props} className={cn(baseStyles, variantStyles[variant], className)}>
    {!!heading && (
      <h2 className="font-bold text-3xl">{heading}</h2>
    )}
    {children}
  </div>
);
