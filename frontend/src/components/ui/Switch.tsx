"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  busy?: boolean;
  "aria-label": string;
}

/** role="switch" toggle: keyboard-operable, 44px-wide touch target, focus ring. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, busy, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled || busy}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-7 w-11 shrink-0 rounded-pill transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-60",
        checked ? "bg-brand-red" : "bg-border-default"
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4"
        )}
      />
    </button>
  )
);
Switch.displayName = "Switch";
