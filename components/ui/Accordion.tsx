"use client";

import { useId, useState, type ReactNode } from "react";
import { IconChevronDown } from "./Icons";

export type AccordionItem = { q: string; a: ReactNode };

/** Acordeón accesible: botones con aria-expanded que controlan regiones. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q-${i}`;
        const panelId = `${uid}-a-${i}`;
        return (
          <li key={i}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-base font-bold text-ink sm:text-lg"
              >
                {it.q}
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-[transform,background-color,color] duration-300 ${
                    isOpen ? "rotate-180 bg-brand text-white ring-brand" : "text-ink ring-ink/15"
                  }`}
                >
                  <IconChevronDown width={18} height={18} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="max-w-3xl pb-6 pr-12 text-[0.98rem] leading-relaxed text-mute-dark">{it.a}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
