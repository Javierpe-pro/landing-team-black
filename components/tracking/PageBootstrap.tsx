"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { PIXEL_DEBUG, PIXEL_ENABLED, track } from "@/lib/pixel";

/**
 * Se monta una vez por carga:
 * - Captura UTM / fbclid / referrer / landing / user agent en sessionStorage.
 * - En modo debug con el Pixel deshabilitado, registra el PageView en consola
 *   (cuando el Pixel está habilitado, el PageView lo dispara <MetaPixel />).
 */
export function PageBootstrap() {
  useEffect(() => {
    captureAttribution();
    if (PIXEL_DEBUG && !PIXEL_ENABLED) track("PageView");
  }, []);
  return null;
}
