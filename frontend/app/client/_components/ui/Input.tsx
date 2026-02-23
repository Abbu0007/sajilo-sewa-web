"use client";

import * as React from "react";
import { cn } from "./cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
};

export default function Input({ className, label, hint, rightSlot, ...props }: Props) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-semibold text-slate-800">{label}</div> : null}

      <div className="relative">
        <input
          className={cn(
            "w-full h-11 rounded-xl bg-white/70 border border-white/40 px-4 text-slate-900 placeholder:text-slate-400 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300",
            rightSlot ? "pr-11" : "",
            className
          )}
          {...props}
        />
        {rightSlot ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </div>

      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </label>
  );
}
