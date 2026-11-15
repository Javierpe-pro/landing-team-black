# Instrucciones para Claude · Publicar la landing de Team Black y conectar Supabase

> **Javier:** abrí Claude Code en la carpeta de este proyecto y escribile:
> *"Leé PARA_EL_CLAUDE_DE_JAVIER.md y seguilo paso a paso conmigo."*
> Todo lo que sigue está escrito para Claude.

---

## 0. Contexto (para Claude)

Estás ayudando a **Javier Peñalver** (broker de Team Black by Amaya, CABA) a poner en producción esta landing.
La parte visual ya está **terminada y probada**. Tu trabajo es solamente:

1. Subir el código a **su** GitHub.
2. Crear **su** proyecto de Supabase y la tabla `leads`.
3. Publicarlo en **su** Vercel con las variables de entorno correctas.
4. Comprobar que un formulario enviado desde el sitio publicado llega a Supabase y que el Meta Pixel registra el `Lead`.

Javier no es programador: explicale cada paso en castellano simple (voseo), decile exactamente dónde hacer clic
cuando tenga que hacer algo él, y **frená a pedir su OK** antes de cada parte (A, B, C, D).

### Reglas que no se negocian

- **Las claves nunca pasan por el chat.** Javier las pega él mismo en Vercel (o en `.env.local`). Si las escribe en
  el chat, decile que las rote en Supabase (Project Settings → API Keys) y seguí.
- `SUPABASE_SERVICE_ROLE_KEY` es **solo de servidor**: nunca en una variable `NEXT_PUBLIC_…`, nunca en el código,
  nunca commiteada. `.env.local` ya está en `.gitignore`; no lo saques.
- **No cambies el diseño, los textos ni la lógica del formulario** salvo que Javier lo pida. Si algo falla, el problema
  casi seguro está en la configuración (variables, migración), no en el código.
- Antes de tocar código, leé `AGENTS.md`: es **Next.js 16** y las APIs cambiaron respecto de lo que conocés.
  La documentación está en `node_modules/next/dist/docs/`.
- Reglas del negocio que el código ya respeta y no hay que romper: **solo barrios de CABA** (lista cerrada de 48),
  **no inventar** cifras, testimonios ni fotos (lo que falta está marcado como `[COMPLETAR: …]`).

### Cómo funciona el guardado de leads (para que no tengas que adivinar)

- El formulario hace `POST /api/leads` (`app/api/leads/route.ts`): valida con zod, aplica antispam (honeypot +
  mínimo 4 s de llenado + rate limit de 5 envíos cada 10 min por IP), normaliza el WhatsApp a `+549XXXXXXXXXX`
  y guarda con `lib/leads-store.ts`.
- `lib/leads-store.ts` elige dónde guardar según `LEADS_STORAGE`:
  - `supabase` → inserta en `public.leads` con la service role key **desde el servidor**. ← producción
  - `file` → `./.data/leads.jsonl` (solo para desarrollo local).
  - `log` → no guarda, solo deja registro en los logs (para previews).
- La tabla tiene **RLS activado y sin políticas**: con la anon key nadie puede leer ni escribir. Es intencional.
  Javier ve los leads desde el panel de Supabase (Table Editor). **No agregues políticas públicas.**
- Cada lead guarda un `event_id` que es el mismo `eventID` del evento `Lead` del Pixel (para deduplicar si más
  adelante se suma la Conversions API).

---

## Parte A · Verificar herramientas y preparar el repo

1. Chequeá que estén instalados: `node -v` (≥ 20.9), `npm -v`, `git --version`, `gh --version`.
   - Si falta `gh`: `brew install gh` (Mac) y después `gh auth login` — el login lo hace Javier en el navegador.
2. `npm install` y después `npm run build` para confirmar que compila tal cual llegó.
3. **Historial limpio y propio.** Si la carpeta ya tiene un `.git` con un `origin` que no es de Javier
   (`git remote -v`), proponele empezar un historial nuevo para que el repo quede 100% suyo:
   ```bash
   rm -rf .git
   git init -b main
   git add -A
   git commit -m "Landing Team Black: versión inicial"
   ```
   Pedile confirmación antes de borrar `.git`. Revisá con `git status` que **no** se suban `.env.local`, `.data/`
   ni `node_modules/` (ya están en `.gitignore`).
4. Crear el repo **privado** en su GitHub y subirlo:
   ```bash
   gh repo create landing-team-black --private --source . --push
   ```

**Freno:** mostrale a Javier el link del repo y pedí OK para seguir con Supabase.

---

## Parte B · Supabase (base de datos de los formularios)

1. Javier crea el proyecto en https://supabase.com/dashboard → **New project**.
   - Nombre sugerido: `team-black-landing`.
   - Región: **South America (São Paulo)** — la más cercana a Buenos Aires.
   - Que guarde la contraseña de la base en su gestor de contraseñas (no la necesitás vos).
2. Crear la tabla `leads` corriendo **`supabase/migrations/0001_leads.sql`**. Dos caminos:
   - **Si tenés el conector de Supabase** en esta sesión: aplicá el contenido del archivo como migración en el
     proyecto de Javier (nombre `0001_leads`).
   - **Si no:** pedile a Javier que abra el proyecto → **SQL Editor** → **New query**, pegue el contenido completo
     del archivo (mostráselo) y toque **Run**. Debe decir *Success. No rows returned*.
   - `0002_propiedades_alquiladas.sql` es **opcional**: no la corras ahora. La landing funciona sin esa tabla.
3. Verificá que quedó bien (con el conector o pidiéndole a Javier que lo corra en el SQL Editor):
   ```sql
   select relrowsecurity from pg_class where relname = 'leads';          -- debe dar true
   select count(*) from pg_policies where tablename = 'leads';           -- debe dar 0
   ```
4. Las dos claves que vamos a necesitar (Javier las copia; **no las pegues ni le pidas que las pegue en el chat**):
   - **Project URL** → Project Settings → **Data API** (formato `https://xxxx.supabase.co`). Esta no es secreta.
   - **Clave secreta del servidor** → Project Settings → **API Keys**: la **Secret key** (`sb_secret_…`) o, en la
     pestaña de claves *legacy*, la **service_role**. Cualquiera de las dos sirve. **Nunca** la `anon`/`publishable`.

### Prueba local con Supabase (recomendada, 5 minutos)

1. `cp .env.example .env.local` y pedile a Javier que abra `.env.local` en un editor y complete **él**:
   ```
   LEADS_STORAGE=supabase
   SUPABASE_URL=<Project URL>
   SUPABASE_SERVICE_ROLE_KEY=<clave secreta>
   IP_HASH_SALT=<texto aleatorio largo>
   ```
   Para la sal, que corra en su terminal `openssl rand -hex 32` y pegue el resultado.
2. `npm run dev` → abrir http://localhost:3000 → completar el formulario de tasación entero (esperar unos segundos
   antes de enviar: menos de 4 s se toma como bot y no se guarda).
3. Confirmar que aparece la fila: Supabase → **Table Editor → leads**, o en http://localhost:3000/admin/leads
   (visor que solo existe en desarrollo). Después borrá esa fila de prueba desde el Table Editor.

**Freno:** confirmale a Javier que la base recibe formularios y pedí OK para publicar.

---

## Parte C · Vercel (publicación)

1. Javier entra a https://vercel.com (puede loguearse con GitHub) → **Add New… → Project** → importa el repo
   `landing-team-black`. Framework: Next.js (se detecta solo). No cambies build ni output.
2. **Antes de tocar Deploy**, cargar las variables en **Settings → Environment Variables** (o en la pantalla de
   importación). Las secretas las pega Javier y las marca como **Sensitive**:

   | Variable | Production | Preview | Notas |
   |---|---|---|---|
   | `LEADS_STORAGE` | `supabase` | `log` | Las previews no ensucian la base |
   | `SUPABASE_URL` | Project URL | — | |
   | `SUPABASE_SERVICE_ROLE_KEY` | clave secreta | — | **Sensitive**. Jamás `NEXT_PUBLIC_` |
   | `IP_HASH_SALT` | `openssl rand -hex 32` | — | **Sensitive** |
   | `NEXT_PUBLIC_SITE_URL` | URL final sin `/` al final | — | Ej. la URL `….vercel.app` que asigne Vercel, o su dominio |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5491126509698` | igual | Confirmá con Javier que es su número |
   | `NEXT_PUBLIC_META_PIXEL_ID` | `2656354184804002` | igual | Pixel de Javier |
   | `NEXT_PUBLIC_PIXEL_ENABLED` | `true` | `false` | Solo producción dispara eventos reales |
   | `NEXT_PUBLIC_PIXEL_DEBUG` | `false` | `true` | `true` imprime los eventos en la consola |
   | `NEXT_PUBLIC_ALLOW_INDEXING` | `false` por ahora | `false` | Pasar a `true` cuando no queden `[COMPLETAR]` |

   Las `NEXT_PUBLIC_…` se fijan **al compilar**: si se cambian después, hay que **redeployar**
   (Deployments → ⋯ → Redeploy) para que tomen efecto.
3. Deploy. Si falla, leé los logs del build en Vercel antes de tocar nada.
4. **Dominio propio (opcional):** Settings → Domains → agregar el dominio y seguir las instrucciones de DNS que
   muestra Vercel. Después actualizar `NEXT_PUBLIC_SITE_URL` y redeployar.

**Freno:** pasale el link publicado a Javier y seguí con la verificación.

---

## Parte D · Verificación en producción (hacela entera)

1. En el sitio publicado, completar y enviar el formulario con datos de prueba reales (su propio WhatsApp).
   - Debe aparecer la pantalla de éxito.
   - Debe aparecer la fila en Supabase → Table Editor → `leads`, con `whatsapp` en formato `+549…`,
     `status = nuevo` y un `event_id`.
2. **Pixel:** en Meta → Administrador de eventos → el Pixel `2656354184804002` → **Probar eventos**, abrir el sitio
   desde ahí y repetir el envío. Deben verse `PageView`, `ViewContent`, `FormStart` y `Lead`.
   El `event_id` del `Lead` tiene que coincidir con el de la fila en Supabase.
3. Que `/admin/leads` devuelva **404** en producción (es solo para desarrollo).
4. Mobile: abrir el link desde el celular y recorrer la página completa (es la vista principal: tráfico de Meta Ads).
5. Borrar las filas de prueba en Supabase.

Si el envío muestra *"No pudimos guardar tus datos"* (error 500), revisá los **Runtime Logs** de Vercel, buscando
`[api/leads] Error guardando lead`:

| Mensaje en el log | Causa | Solución |
|---|---|---|
| `Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY` | Variables no cargadas en Production | Cargarlas y **redeployar** |
| `relation "public.leads" does not exist` / `42P01` | No se corrió la migración | Parte B, paso 2 |
| `42501` / `permission denied` / `Invalid API key` | Se usó la anon/publishable key | Usar la Secret key o service_role |
| `23514` (check constraint) | Dato fuera de lo permitido | No debería pasar desde el formulario: avisale a Javier y no relajes la restricción sin entender por qué |

---

## Cómo usa Javier los leads (explicáselo al final)

- **Ver leads:** Supabase → Table Editor → `leads` (los más nuevos arriba ordenando por `created_at`).
- **Seguimiento:** la columna `status` admite `nuevo → contactado → tasacion → publicado → cerrado`, o `descartado`.
  La columna `notas_internas` es para él.
- **Exportar:** en el Table Editor, botón de exportar a CSV.
- Los datos están protegidos: solo los ve quien tenga acceso a su cuenta de Supabase.

---

## Pendientes antes de lanzar anuncios (mostrale esta lista a Javier)

Se ven resaltados en la página hasta completarlos. Pedile los datos reales; **no inventes nada**.

- `content/copy.ts` → bio corta de Javier (`[COMPLETAR: bio corta de Javier]`).
- Foto de Javier: ver el comentario `TODO-FOTO-JAVIER` en `components/sections/PorQue.tsx`.
- `content/copy.ts` → plazo de respuesta en la pantalla de éxito y en la pregunta frecuente sobre tiempos.
- `app/privacidad/page.tsx` → razón social, CUIT, domicilio, plazo de conservación de datos y fecha.
  Conviene que lo revise un abogado (Ley 25.326).
- "Propiedades que ya alquilamos" (`content/propiedades-alquiladas.ts`): la sección **no se muestra con menos de
  3 propiedades reales**. Solo barrio, nunca dirección exacta ni datos de inquilinos. El formato está en
  `content/propiedades-alquiladas.example.ts`.
- Cuando todo esté completo: `NEXT_PUBLIC_ALLOW_INDEXING=true` en Production y redeployar.

Cada cambio de texto: editar → `npm run build` → commit → `git push`. Vercel publica solo al recibir el push.

## Mejoras opcionales a futuro (no hacer ahora salvo que Javier lo pida)

Están detalladas en `HANDOFF.md`: Conversions API de Meta usando el `event_id`, aviso por WhatsApp/email cuando
entra un lead, rate limit estricto con Upstash/Vercel KV y un mini panel para cargar propiedades alquiladas.
