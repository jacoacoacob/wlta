import { Button as HButton, type ButtonProps as HButtonProps } from "@headlessui/react";
import type React from "react";
import { cn } from "~/utils/cn";

const variantStyles = {
  solid: {
    className: cn(`
      bg-slate-800 text-slate-50
      dark:bg-slate-50 dark:text-slate-800
    `)
  },
  outline: {
    className: "",
  },
  text: {
    className: ""
  }
} satisfies Record<string, { className: string }>;

type ButtonVariant = keyof typeof variantStyles;

interface ButtonProps extends HButtonProps {
  variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps> = ({ variant = "solid", ...props }) => (
  <HButton
    className={`button button--${variant}`}
    // className={cn(
    //   'button',
    //   `inline-flex items-center gap-2 rounded-md px-3 py-1.5
    //   dark:data-focus:outline-white/25 data-focus:outline-slate-900`,
    //   variantStyles[variant].className
    // )}
    {...props}
  />
)