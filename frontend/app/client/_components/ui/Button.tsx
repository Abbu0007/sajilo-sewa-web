"use client";

import * as React from "react";
import { cn } from "./cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:brightness-110",
    secondary:
      "bg-white/70 text-slate-900 border border-white/40 shadow-sm hover:bg-white",
    ghost:
      "bg-transparent text-slate-700 hover:bg-white/60 border border-transparent hover:border-white/40",
    danger:
      "bg-gradient-to-b from-rose-500 to-rose-700 text-white shadow-[0_10px_30px_rgba(244,63,94,0.22)] hover:brightness-110",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
