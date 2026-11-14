"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

const inputCls =
  "block w-full min-h-[3.25rem] rounded-xl bg-paper px-4 text-base text-ink ring-1 ring-ink/10 outline-none transition-[box-shadow,background-color] placeholder:text-ink/40 focus:bg-white focus:ring-2 focus:ring-brand aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500";

export function FieldShell({
  id,
  label,
  optional,
  optionalText = "opcional",
  hint,
  error,
  children,
  as = "div",
}: {
  id: string;
  label: string;
  optional?: boolean;
  optionalText?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  as?: "div" | "fieldset";
}) {
  const Label = as === "fieldset" ? "legend" : "label";
  const Wrapper = as;
  return (
    <Wrapper className="min-w-0">
      <Label
        {...(as === "div" ? { htmlFor: id } : { id: `${id}-legend` })}
        className="mb-2 block font-display text-[0.9rem] font-bold text-ink"
      >
        {label}
        {optional && <span className="ml-1.5 font-sans text-xs font-normal text-mute-dark">({optionalText})</span>}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-mute-dark">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </Wrapper>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = "", ...p }, ref) {
    return <input ref={ref} className={`${inputCls} ${className}`} {...p} />;
  },
);

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectInput({ className = "", children, ...p }, ref) {
    return (
      <div className="relative">
        <select ref={ref} className={`${inputCls} appearance-none pr-11 ${className}`} {...p}>
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    );
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className = "", ...p }, ref) {
    return <textarea ref={ref} className={`${inputCls} min-h-28 py-3 ${className}`} {...p} />;
  },
);

/** Opción tipo "tarjeta" para radios (área táctil grande, teclado nativo). */
export const ChoiceCard = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string; detalle?: string; compact?: boolean }
>(function ChoiceCard({ label, detalle, compact, className = "", ...p }, ref) {
  return (
    <label className={`relative block cursor-pointer ${className}`}>
      <input ref={ref} type="radio" className="peer sr-only" {...p} />
      <span
        className={`flex h-full flex-col justify-center rounded-xl bg-paper ring-1 ring-ink/10 transition-[background-color,box-shadow,color] peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-aria-[invalid=true]:ring-red-500 hover:ring-ink/30 ${
          compact ? "min-h-12 items-center px-2 text-center" : "min-h-14 px-4 py-3"
        }`}
      >
        <span className="font-display text-[0.92rem] font-bold">{label}</span>
        {detalle && <span className="mt-0.5 text-xs opacity-70">{detalle}</span>}
      </span>
    </label>
  );
});
