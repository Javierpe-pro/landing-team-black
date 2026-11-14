"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = { id: string; label: string; content: ReactNode };

/**
 * Tabs accesibles (patrón WAI-ARIA): flechas izquierda/derecha, Home/End.
 */
export function Tabs({
  items,
  tone = "dark",
  label,
  defaultId,
}: {
  items: TabItem[];
  tone?: "dark" | "light";
  label: string;
  defaultId?: string;
}) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const onKey = (e: KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(items[next].id);
      refs.current[next]?.focus();
    }
  };

  const dark = tone === "dark";
  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className={`inline-flex rounded-full p-1 ${dark ? "bg-white/[0.06] ring-1 ring-line" : "bg-white ring-1 ring-ink/10"}`}
      >
        {items.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`min-h-11 rounded-full px-5 font-display text-sm font-bold transition-colors sm:px-7 ${
                selected
                  ? "bg-brand text-white"
                  : dark
                    ? "text-mute hover:text-white"
                    : "text-mute-dark hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-panel-${t.id}`}
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="mt-8 focus-visible:outline-offset-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
