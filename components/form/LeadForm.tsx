"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type Path } from "react-hook-form";
import { formulario as c } from "@/content/copy";
import { BARRIOS_CABA } from "@/lib/barrios-caba";
import {
  LEAD_FORM_DEFAULTS,
  PASOS_SCHEMAS,
  erroresEquipamiento,
  leadFormSchema,
  type LeadFormValues,
  type LeadRequest,
} from "@/lib/lead-schema";
import { getAttribution } from "@/lib/attribution";
import { newEventId, track, trackOnce } from "@/lib/pixel";
import { Button } from "@/components/ui/Button";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { IconArrowLeft, IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import { ChoiceCard, FieldShell, SelectInput, TextArea, TextInput, describedBy } from "./Fields";
import { LeadSuccess, type LeadSuccessData } from "./LeadSuccess";

const STORAGE_KEY = "tb_lead_form";
const TOTAL = 3;

const STEP_FIELDS: (keyof LeadFormValues)[][] = [
  ["nombre", "whatsapp", "email"],
  ["modalidad", "tipo_propiedad", "barrio", "direccion_aprox", "ambientes", "m2", "piso_unidad", "amoblada", "internet"],
  ["valor_esperado", "disponibilidad", "comentarios", "consentimiento"],
];
const stepOf = (field: string) => STEP_FIELDS.findIndex((f) => (f as string[]).includes(field));

type Saved = { values: LeadFormValues; step: number; startedAt: number };

export function LeadForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [step, setStep] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [exito, setExito] = useState<LeadSuccessData | null>(null);
  const startedAt = useRef<number>(0);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const formTop = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    setFocus,
    reset,
    subscribe,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({ defaultValues: LEAD_FORM_DEFAULTS, shouldFocusError: false });

  const modalidad = useWatch({ control, name: "modalidad" });
  const pideEquipamiento = modalidad === "temporario" || modalidad === "no_se";

  // Restaurar avance (sessionStorage) al montar — una sola vez
  const restaurado = useRef(false);
  useEffect(() => {
    if (restaurado.current) return;
    restaurado.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        reset({ ...LEAD_FORM_DEFAULTS, ...saved.values, website: "" });
        // sessionStorage solo existe en el cliente: restaurar tras hidratar es intencional
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(Math.min(Math.max(saved.step || 0, 0), TOTAL - 1));
        startedAt.current = saved.startedAt || Date.now();
        return;
      }
    } catch {
      // ignorar
    }
    startedAt.current = Date.now();
  }, [reset]);

  // Guardar avance en cada cambio (después de restaurar)
  useEffect(() => {
    if (!restaurado.current) return;
    const save = (values: Partial<LeadFormValues>) => {
      try {
        const data: Saved = {
          values: { ...LEAD_FORM_DEFAULTS, ...values, website: "" } as LeadFormValues,
          step,
          startedAt: startedAt.current || Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // ignorar
      }
    };
    save(getValues());
    return subscribe({
      formState: { values: true },
      callback: ({ values, name }) => {
        save(values as Partial<LeadFormValues>);
        // Al corregir un campo, se limpia su error
        if (name) clearErrors(name as keyof LeadFormValues);
      },
    });
  }, [subscribe, getValues, clearErrors, step]);

  // Si deja de pedir equipamiento, limpiar esos campos
  useEffect(() => {
    if (modalidad === "tradicional") {
      setValue("amoblada", "");
      setValue("internet", "");
      clearErrors(["amoblada", "internet"]);
    }
  }, [modalidad, setValue, clearErrors]);

  // Al cambiar de paso: foco en el título del paso y scroll al inicio del form
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = formTop.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) {
      formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    stepHeading.current?.focus({ preventScroll: true });
  }, [step]);

  /** Valida con zod solo los campos del paso y marca errores. */
  function validarPaso(n: number): boolean {
    clearErrors(STEP_FIELDS[n]);
    const values = getValues();
    const res = PASOS_SCHEMAS[n].safeParse(values);
    const issues = [
      ...(res.success ? [] : res.error.issues),
      ...(n === 1 ? erroresEquipamiento(values).map((e) => ({ path: [e.path], message: e.message })) : []),
    ];
    if (!issues.length) return true;
    let primero: Path<LeadFormValues> | null = null;
    const vistos = new Set<string>();
    for (const issue of issues) {
      const field = issue.path[0] as Path<LeadFormValues>;
      if (vistos.has(field)) continue;
      vistos.add(field);
      if (!primero) primero = field;
      setError(field, { type: "zod", message: issue.message });
    }
    if (primero) setTimeout(() => setFocus(primero!), 0);
    return false;
  }

  const siguiente = () => {
    setErrorGeneral(null);
    if (validarPaso(step)) setStep((s) => Math.min(s + 1, TOTAL - 1));
  };
  const anterior = () => {
    setErrorGeneral(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (values: LeadFormValues) => {
    setErrorGeneral(null);
    if (!validarPaso(2)) return;

    // Validación completa (por si quedó algo inválido en un paso anterior)
    const full = leadFormSchema.safeParse(values);
    if (!full.success) {
      const first = full.error.issues[0];
      const field = first.path[0] as Path<LeadFormValues>;
      setStep(Math.max(stepOf(String(field)), 0));
      setError(field, { type: "zod", message: first.message });
      return;
    }

    const eventId = newEventId("lead");
    const body: LeadRequest = {
      data: full.data,
      website: values.website,
      started_at: startedAt.current || Date.now(),
      event_id: eventId,
      attribution: getAttribution(),
    };

    setEnviando(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (res.ok && json.ok) {
        track("Lead", { content_category: full.data.modalidad, content_name: full.data.barrio }, eventId);
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignorar
        }
        setExito({
          nombre: full.data.nombre.split(" ")[0],
          barrio: full.data.barrio,
          modalidad: full.data.modalidad,
        });
        return;
      }

      if (json.fieldErrors && Object.keys(json.fieldErrors).length) {
        const entries = Object.entries(json.fieldErrors).filter(([k]) => stepOf(k) >= 0);
        entries.forEach(([k, msg]) => setError(k as Path<LeadFormValues>, { type: "server", message: msg }));
        if (entries[0]) setStep(stepOf(entries[0][0]));
      }
      setErrorGeneral(json.error || c.errorRed);
    } catch {
      setErrorGeneral(c.errorRed);
    } finally {
      setEnviando(false);
    }
  };

  const nuevoEnvio = () => {
    reset(LEAD_FORM_DEFAULTS);
    startedAt.current = Date.now();
    setStep(0);
    setExito(null);
  };

  if (exito) return <LeadSuccess data={exito} onNuevo={nuevoEnvio} />;

  const e = (k: keyof LeadFormValues) => errors[k]?.message as string | undefined;

  return (
    <div ref={formTop} className="scroll-mt-24">
      {/* Progreso */}
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs">
          <p className="font-display font-bold text-ink" aria-live="polite">
            {c.pasoDe.replace("{a}", String(step + 1)).replace("{b}", String(TOTAL))}
          </p>
          <p className="text-mute-dark">{c.pasos[step]}</p>
        </div>
        <ol className="mt-3 grid grid-cols-3 gap-1.5" aria-label="Progreso del formulario">
          {c.pasos.map((p, i) => (
            <li key={p} aria-current={i === step ? "step" : undefined}>
              <span className="sr-only">
                {p}
                {i < step ? " (completo)" : ""}
              </span>
              <span
                aria-hidden
                className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-brand" : "bg-ink/10"}`}
              />
            </li>
          ))}
        </ol>
      </div>

      <form
        noValidate
        onSubmit={(ev) => {
          // Enter en pasos 1 y 2 = "Siguiente" (no enviar)
          if (step < TOTAL - 1) {
            ev.preventDefault();
            siguiente();
            return;
          }
          void handleSubmit(onSubmit)(ev);
        }}
        onFocusCapture={() => trackOnce("formstart", "FormStart", { content_name: "formulario_tasacion" })}
        aria-describedby={errorGeneral ? id("error-general") : undefined}
      >
        {/* Honeypot: invisible para personas */}
        <div aria-hidden className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={id("website")}>Sitio web</label>
          <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {/* PASO 1 — Contacto */}
        {step === 0 && (
          <fieldset className="space-y-5">
            <legend className="sr-only">{c.pasos[0]}</legend>
            <h3 ref={stepHeading} tabIndex={-1} className="display text-2xl text-ink outline-none">
              {c.pasos[0]}
            </h3>
            <FieldShell id={id("nombre")} label={c.campos.nombre.label} error={e("nombre")}>
              <TextInput
                id={id("nombre")}
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                maxLength={80}
                placeholder={c.campos.nombre.placeholder}
                aria-invalid={!!e("nombre")}
                aria-describedby={describedBy(id("nombre"), e("nombre"))}
                {...register("nombre")}
              />
            </FieldShell>
            <FieldShell
              id={id("whatsapp")}
              label={c.campos.whatsapp.label}
              hint={c.campos.whatsapp.ayuda}
              error={e("whatsapp")}
            >
              <div className="flex gap-2">
                <span className="grid min-h-[3.25rem] shrink-0 place-items-center rounded-xl bg-paper px-3 text-sm font-semibold text-mute-dark ring-1 ring-ink/10">
                  +54 9
                </span>
                <TextInput
                  id={id("whatsapp")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  enterKeyHint="next"
                  maxLength={30}
                  placeholder={c.campos.whatsapp.placeholder}
                  aria-invalid={!!e("whatsapp")}
                  aria-describedby={describedBy(id("whatsapp"), e("whatsapp"), c.campos.whatsapp.ayuda)}
                  {...register("whatsapp")}
                />
              </div>
            </FieldShell>
            <FieldShell
              id={id("email")}
              label={c.campos.email.label}
              optional
              optionalText={c.opcional}
              hint={c.campos.email.ayuda}
              error={e("email")}
            >
              <TextInput
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="next"
                maxLength={120}
                placeholder={c.campos.email.placeholder}
                aria-invalid={!!e("email")}
                aria-describedby={describedBy(id("email"), e("email"), c.campos.email.ayuda)}
                {...register("email")}
              />
            </FieldShell>
          </fieldset>
        )}

        {/* PASO 2 — La propiedad */}
        {step === 1 && (
          <fieldset className="space-y-6">
            <legend className="sr-only">{c.pasos[1]}</legend>
            <div>
              <h3 ref={stepHeading} tabIndex={-1} className="display text-2xl text-ink outline-none">
                {c.pasos[1]}
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-mute-dark">
                <IconMapPin width={16} height={16} className="mt-0.5 shrink-0 text-brand-ink" />
                {c.zona}
              </p>
            </div>

            <FieldShell as="fieldset" id={id("modalidad")} label={c.campos.modalidad.label} error={e("modalidad")}>
              <div className="grid gap-2">
                {c.campos.modalidad.opciones.map((o) => (
                  <ChoiceCard
                    key={o.value}
                    value={o.value}
                    label={o.label}
                    detalle={o.detalle}
                    aria-invalid={!!e("modalidad")}
                    aria-describedby={describedBy(id("modalidad"), e("modalidad"))}
                    {...register("modalidad")}
                  />
                ))}
              </div>
            </FieldShell>

            <FieldShell as="fieldset" id={id("tipo")} label={c.campos.tipo_propiedad.label} error={e("tipo_propiedad")}>
              <div className="grid grid-cols-2 gap-2">
                {c.campos.tipo_propiedad.opciones.map((o) => (
                  <ChoiceCard
                    key={o.value}
                    value={o.value}
                    label={o.label}
                    compact
                    aria-invalid={!!e("tipo_propiedad")}
                    aria-describedby={describedBy(id("tipo"), e("tipo_propiedad"))}
                    {...register("tipo_propiedad")}
                  />
                ))}
              </div>
            </FieldShell>

            <FieldShell id={id("barrio")} label={c.campos.barrio.label} error={e("barrio")}>
              <SelectInput
                id={id("barrio")}
                aria-invalid={!!e("barrio")}
                aria-describedby={describedBy(id("barrio"), e("barrio"))}
                {...register("barrio")}
              >
                <option value="" disabled>
                  {c.campos.barrio.placeholder}
                </option>
                {BARRIOS_CABA.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </SelectInput>
            </FieldShell>

            <FieldShell
              id={id("direccion")}
              label={c.campos.direccion_aprox.label}
              optional
              optionalText={c.opcional}
              error={e("direccion_aprox")}
            >
              <TextInput
                id={id("direccion")}
                autoComplete="off"
                maxLength={120}
                placeholder={c.campos.direccion_aprox.placeholder}
                aria-invalid={!!e("direccion_aprox")}
                aria-describedby={describedBy(id("direccion"), e("direccion_aprox"))}
                {...register("direccion_aprox")}
              />
            </FieldShell>

            <FieldShell as="fieldset" id={id("ambientes")} label={c.campos.ambientes.label} error={e("ambientes")}>
              <div className="grid grid-cols-4 gap-2">
                {c.campos.ambientes.opciones.map((o) => (
                  <ChoiceCard
                    key={o.value}
                    value={o.value}
                    label={o.label}
                    compact
                    aria-invalid={!!e("ambientes")}
                    aria-describedby={describedBy(id("ambientes"), e("ambientes"))}
                    {...register("ambientes")}
                  />
                ))}
              </div>
            </FieldShell>

            <div className="grid grid-cols-2 gap-3">
              <FieldShell id={id("m2")} label={c.campos.m2.label} optional optionalText={c.opcional} error={e("m2")}>
                <TextInput
                  id={id("m2")}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={5}
                  placeholder={c.campos.m2.placeholder}
                  aria-invalid={!!e("m2")}
                  aria-describedby={describedBy(id("m2"), e("m2"))}
                  {...register("m2")}
                />
              </FieldShell>
              <FieldShell
                id={id("piso")}
                label={c.campos.piso_unidad.label}
                optional
                optionalText={c.opcional}
                error={e("piso_unidad")}
              >
                <TextInput
                  id={id("piso")}
                  autoComplete="off"
                  maxLength={30}
                  placeholder={c.campos.piso_unidad.placeholder}
                  aria-invalid={!!e("piso_unidad")}
                  aria-describedby={describedBy(id("piso"), e("piso_unidad"))}
                  {...register("piso_unidad")}
                />
              </FieldShell>
            </div>

            {pideEquipamiento && (
              <div className="space-y-5 rounded-2xl bg-brand/[0.06] p-4 ring-1 ring-brand/20 sm:p-5">
                <p className="text-sm font-medium text-ink">{c.campos.equipamientoNota}</p>
                <FieldShell as="fieldset" id={id("amoblada")} label={c.campos.amoblada.label} error={e("amoblada")}>
                  <div className="grid grid-cols-3 gap-2">
                    {c.campos.amoblada.opciones.map((o) => (
                      <ChoiceCard
                        key={o.value}
                        value={o.value}
                        label={o.label}
                        compact
                        aria-invalid={!!e("amoblada")}
                        aria-describedby={describedBy(id("amoblada"), e("amoblada"))}
                        {...register("amoblada")}
                      />
                    ))}
                  </div>
                </FieldShell>
                <FieldShell as="fieldset" id={id("internet")} label={c.campos.internet.label} error={e("internet")}>
                  <div className="grid grid-cols-2 gap-2">
                    {c.campos.internet.opciones.map((o) => (
                      <ChoiceCard
                        key={o.value}
                        value={o.value}
                        label={o.label}
                        compact
                        aria-invalid={!!e("internet")}
                        aria-describedby={describedBy(id("internet"), e("internet"))}
                        {...register("internet")}
                      />
                    ))}
                  </div>
                </FieldShell>
              </div>
            )}
          </fieldset>
        )}

        {/* PASO 3 — Detalles */}
        {step === 2 && (
          <fieldset className="space-y-6">
            <legend className="sr-only">{c.pasos[2]}</legend>
            <h3 ref={stepHeading} tabIndex={-1} className="display text-2xl text-ink outline-none">
              {c.pasos[2]}
            </h3>
            <FieldShell
              id={id("valor")}
              label={c.campos.valor_esperado.label}
              optional
              optionalText={c.opcional}
              error={e("valor_esperado")}
            >
              <TextInput
                id={id("valor")}
                autoComplete="off"
                maxLength={60}
                placeholder={c.campos.valor_esperado.placeholder}
                aria-invalid={!!e("valor_esperado")}
                aria-describedby={describedBy(id("valor"), e("valor_esperado"))}
                {...register("valor_esperado")}
              />
            </FieldShell>

            <FieldShell
              as="fieldset"
              id={id("disponibilidad")}
              label={c.campos.disponibilidad.label}
              error={e("disponibilidad")}
            >
              <div className="grid grid-cols-2 gap-2">
                {c.campos.disponibilidad.opciones.map((o) => (
                  <ChoiceCard
                    key={o.value}
                    value={o.value}
                    label={o.label}
                    compact
                    aria-invalid={!!e("disponibilidad")}
                    aria-describedby={describedBy(id("disponibilidad"), e("disponibilidad"))}
                    {...register("disponibilidad")}
                  />
                ))}
              </div>
            </FieldShell>

            <FieldShell
              id={id("comentarios")}
              label={c.campos.comentarios.label}
              optional
              optionalText={c.opcional}
              error={e("comentarios")}
            >
              <TextArea
                id={id("comentarios")}
                rows={3}
                maxLength={1000}
                placeholder={c.campos.comentarios.placeholder}
                aria-invalid={!!e("comentarios")}
                aria-describedby={describedBy(id("comentarios"), e("comentarios"))}
                {...register("comentarios")}
              />
            </FieldShell>

            <div>
              <label htmlFor={id("consentimiento")} className="flex cursor-pointer items-start gap-3">
                <input
                  id={id("consentimiento")}
                  type="checkbox"
                  className="mt-0.5 size-6 shrink-0 cursor-pointer rounded accent-brand"
                  aria-invalid={!!e("consentimiento")}
                  aria-describedby={describedBy(id("consentimiento"), e("consentimiento"))}
                  {...register("consentimiento")}
                />
                <span className="text-sm leading-relaxed text-mute-dark">
                  {c.campos.consentimiento.antes}
                  <Link
                    href="/privacidad"
                    target="_blank"
                    className="font-semibold text-brand-ink underline underline-offset-2"
                  >
                    {c.campos.consentimiento.link}
                  </Link>
                  {c.campos.consentimiento.despues}
                </span>
              </label>
              {e("consentimiento") && (
                <p id={`${id("consentimiento")}-error`} className="mt-1.5 text-sm font-medium text-red-600">
                  {e("consentimiento")}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {/* Navegación */}
        {errorGeneral && (
          <p
            id={id("error-general")}
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-200"
          >
            {errorGeneral}{" "}
            <WhatsAppLink origen="form_error" unstyled className="underline">
              WhatsApp
            </WhatsAppLink>
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button
              variant="outline-dark"
              onClick={anterior}
              className="min-h-14 shrink-0 px-5"
              aria-label={`${c.anterior} al paso ${step}`}
            >
              <IconArrowLeft width={18} height={18} />
              <span className="hidden sm:inline">{c.anterior}</span>
            </Button>
          )}
          {step < TOTAL - 1 ? (
            <Button type="submit" size="lg" className="flex-1">
              {c.siguiente}
              <IconArrowRight width={18} height={18} />
            </Button>
          ) : (
            <Button type="submit" size="lg" className="flex-1" disabled={enviando} aria-busy={enviando}>
              {enviando ? c.enviando : c.enviar}
              {!enviando && <IconArrowRight width={18} height={18} />}
            </Button>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-mute-dark">{c.microcopy}</p>
      </form>
    </div>
  );
}

