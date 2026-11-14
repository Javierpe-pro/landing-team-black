# HANDOFF · Landing Team Black by Amaya

> Versión inicial (Fase 1). Se completa en la Fase 3 con arquitectura, decisiones y checklist de producción.

## Pendientes técnicos documentados

- **TODO · Conversions API (Meta):** cada `Lead` guarda su `event_id` en la tabla `leads` y el Pixel lo envía
  como `eventID`. Para deduplicar, enviar el mismo `event_id` desde el servidor (Route Handler o webhook de
  Supabase) a la Conversions API con `event_name=Lead`, `action_source=website` y datos hasheados (SHA-256)
  del lead. No implementado todavía.
- **Mejora sugerida · mini panel `/admin`:** para que Javier suba fotos (Supabase Storage) y cargue
  "Propiedades que ya alquilamos" sin tocar código. Los componentes ya leen de `getPropiedadesAlquiladas()`
  (`content/propiedades-alquiladas.ts`); alcanza con que esa función lea la tabla `propiedades_alquiladas`
  (migración `0002`, filas con `publicada = true`) en lugar del array local.
- **Rate limit:** hoy es en memoria por instancia serverless (freno básico). Para algo estricto: Upstash Redis / Vercel KV.
- **Notificación de nuevo lead** (WhatsApp/email a Javier) y **integración con el CRM Kanban** usando la columna `status`
  (`nuevo → contactado → tasacion → publicado → cerrado`, más `descartado`).
