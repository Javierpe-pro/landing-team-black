import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Imagen para compartir el link (WhatsApp, Instagram, Facebook).
export const alt = "Team Black by Amaya · Alquilá tu propiedad en CABA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-team-black-blanco.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0F",
          padding: "64px 72px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#4D8DFF", fontSize: 22, letterSpacing: 4 }}>
          <div style={{ width: 48, height: 2, background: "#0866FF" }} />
          PROPIETARIOS · ALQUILER EN CABA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Alquilá tu propiedad en CABA
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#0866FF" }}>
            con un broker a cargo de todo.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#A1A3B3" }}>Pedí tu tasación sin costo · Tradicional y temporario</div>
          <img src={logoSrc} width={222} height={110} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
