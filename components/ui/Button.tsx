"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "default" | "primary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", size = "md", className, loading, children, disabled, ...rest }, ref
) {
  return (
    <button
      ref={ref} disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded transition disabled:opacity-50",
        size === "sm" && "px-2 py-1 text-xs",
        size === "md" && "px-3 py-2 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        variant === "default" && "bg-gray-100 hover:bg-gray-200",
        variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        variant === "ghost" && "hover:bg-gray-100",
        className
      )}
      {...rest}
    >
      {loading && <span className="mr-2 animate-spin">⏳</span>}
      {children}
    </button>
  );
});