"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input ref={ref}
        className={clsx(
          "w-full border border-gray-300 rounded px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
          className
        )}
        {...rest}
      />
    );
  }
);