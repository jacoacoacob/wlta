import type { HtmlHTMLAttributes } from "react";
import type React from "react";
import { cn } from "~/utils/cn";

export const Toolbar: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  <div
    className={cn(
      `flex outline outline-slate-200 py-2 px-4 rounded
      bg-slate-100
      dark:bg-slate-800`,
      className,
    )}
  >
    {children}
  </div>
)