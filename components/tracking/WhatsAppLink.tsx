"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/pixel";
import { waLink } from "@/lib/site";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

/**
 * Link a WhatsApp que dispara el evento `Contact` del Pixel
 * con content_name = origen del botón (hero, header, sticky_mobile, exito, etc.).
 */
export function WhatsAppLink({
  origen,
  mensaje,
  variant,
  size,
  className = "",
  unstyled = false,
  children,
  ...rest
}: {
  origen: string;
  mensaje?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  unstyled?: boolean;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a
      href={waLink(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("Contact", { content_name: origen })}
      className={unstyled ? className : buttonClass(variant ?? "whatsapp", size, className)}
      {...rest}
    >
      {children}
    </a>
  );
}
