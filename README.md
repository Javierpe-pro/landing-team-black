# Landing de captación de propietarios · Team Black by Amaya

Landing de una sola página para que propietarios de **CABA** pidan la tasación de su propiedad
(alquiler tradicional o temporario) con **Javier Peñalver**, broker de Team Black en Amaya Real Estate.

> Estado: **Fase 1 — local**. El deploy (Fase 2) y la guía para Javier (Fase 3) vienen después.

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS v4
- `react-hook-form` + `zod` (el mismo esquema valida en el navegador y en el servidor)
- Fuentes Montserrat (títulos) + Inter (texto) vía `next/font`
- Leads: `POST /api/leads` → `lib/leads-store.ts` → archivo local o Supabase

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # y completá lo que necesites
npm run dev                  # http://localhost:3000
```

- Leads de prueba: se guardan en `./.data/leads.jsonl` y se ven en **http://localhost:3000/admin/leads**
  (esa ruta solo existe en desarrollo; en producción devuelve 404).
- Chequeos: `npm run lint` · `npx tsc --noEmit` · `npm run build`

## Estructura

```
app/
  page.tsx               ← arma la landing (orden de secciones)
  layout.tsx             ← fuentes, SEO/OG, robots, Pixel
  api/leads/route.ts     ← recibe el formulario (validación, antispam, rate limit)
  admin/leads/page.tsx   ← visor de leads de prueba (solo dev)
  privacidad/page.tsx    ← política de privacidad (BORRADOR con [COMPLETAR])
  opengraph-image.tsx    ← imagen al compartir el link por WhatsApp
content/
  copy.ts                        ← TODOS los textos de la página
  propiedades-alquiladas.ts      ← propiedades ya alquiladas (hoy vacío)
  propiedades-alquiladas.example.ts ← formato de ejemplo (NO se publica)
components/  (ui/, layout/, sections/, form/, tracking/)
lib/
  barrios-caba.ts   ← los 48 barrios oficiales (única lista válida)
  lead-schema.ts    ← esquema zod del formulario
  leads-store.ts    ← adaptadores "file" y "supabase"
  pixel.ts          ← helper del Meta Pixel (track con event_id)
  attribution.ts    ← UTM / fbclid / referrer en sessionStorage
supabase/migrations/
  0001_leads.sql                    ← tabla de leads (RLS, sin acceso público)
  0002_propiedades_alquiladas.sql   ← OPCIONAL, para cargar propiedades desde Supabase
```

## Variables de entorno

Ver `.env.example` (cada variable está comentada). Resumen:

| Variable | Para qué |
|---|---|
| `LEADS_STORAGE` | `file` (local), `supabase` (producción) o `log` (preview visual: no guarda, solo deja registro en los logs) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor. La service role key **nunca** va en una variable `NEXT_PUBLIC_` ni se commitea |
| `IP_HASH_SALT` | Sal para guardar la IP como hash (no se guarda la IP real) |
| `NEXT_PUBLIC_SITE_URL` | URL pública (para la vista previa al compartir) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp de Javier en formato `549…` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` = noindex (pruebas). `true` solo en producción final |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID del Pixel de Javier |
| `NEXT_PUBLIC_PIXEL_ENABLED` | `true` **solo** en el despliegue productivo de Javier |
| `NEXT_PUBLIC_PIXEL_DEBUG` | `true` = cada evento se imprime en la consola del navegador |

## Meta Pixel

- Se inicializa **solo** si hay `NEXT_PUBLIC_META_PIXEL_ID` **y** `NEXT_PUBLIC_PIXEL_ENABLED=true`.
  En local y en el Vercel de pruebas queda en `false` para no ensuciar la cuenta publicitaria de Javier.
- **Javier: activá `NEXT_PUBLIC_PIXEL_ENABLED=true` recién en tu despliegue productivo** y verificalo con
  *Administrador de eventos → Probar eventos*.
- Eventos: `PageView` (cada carga) · `ViewContent` (el formulario entra en pantalla, 1 vez) ·
  `FormStart` (custom, primer foco en el formulario) · `Contact` (clic en WhatsApp, `content_name` = origen del botón) ·
  `Lead` (solo tras respuesta 200 del servidor; `content_category` = modalidad, `content_name` = barrio).
- Nunca se envían nombre, teléfono ni email. Cada evento lleva `event_id`; el del `Lead` se guarda en la
  tabla `leads` para deduplicar a futuro con la Conversions API.
- Con `NEXT_PUBLIC_PIXEL_DEBUG=true` los eventos se ven en la consola aunque el Pixel esté apagado.
- Hay un aviso de cookies mínimo (Aceptar / Rechazar) que aparece solo si el Pixel está activo (o en debug).

## Contenido

- Textos: `content/copy.ts`. Lo pendiente está marcado `[COMPLETAR: …]` y se ve **resaltado en amarillo** en la página.
- Foto de Javier: buscar `TODO-FOTO-JAVIER` en `components/sections/PorQue.tsx`.
- Testimonios: bloque comentado en `PorQue.tsx`; se activa solo con testimonios reales y autorizados.

## Propiedades que ya alquilamos

- Se cargan en `content/propiedades-alquiladas.ts` (formato en `propiedades-alquiladas.example.ts`).
- Fotos en `public/img/alquiladas/` (JPG/WebP, 1600 px de ancho, horizontales 4:3, < 400 KB).
- **La sección aparece sola al llegar a 3 propiedades.** Con menos, en producción no se muestra (ni su link en el menú);
  en desarrollo se ve un aviso amarillo con una vista previa de ejemplo.
- **Privacidad:** solo barrio. Nunca dirección exacta, altura ni datos del inquilino.
  **El valor del alquiler y el testimonio requieren autorización del propietario** antes de publicarse.

## Seguridad del formulario

- Validación zod en cliente **y** servidor · solo los 48 barrios de CABA (también con `CHECK` en la base).
- Honeypot oculto + tiempo mínimo de completado (4 s) → los bots reciben "ok" pero no se guarda nada.
- Rate limit por IP (5 envíos / 10 min, en memoria por instancia).
- Strings sanitizados y con límites de longitud. WhatsApp normalizado a E.164 (`+549…`).
- RLS activado en Supabase sin políticas públicas: el navegador nunca habla con Supabase.
