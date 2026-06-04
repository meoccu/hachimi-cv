"use client";
import { SelectHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref}
        className={clsx(
          "w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/40",
          className
        )}
        {...rest}
      >{children}</select>
    );
  }
);