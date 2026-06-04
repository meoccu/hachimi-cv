"use client";
import { TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea ref={ref}
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