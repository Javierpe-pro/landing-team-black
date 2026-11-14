import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "outline-dark" | "whatsapp" | "ghost";
export type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary bg-brand text-white hover:bg-brand-hover shadow-[0_8px_30px_-8px_rgb(8_102_255/0.6)]",
  outline: "border border-white/20 text-white hover:border-white/50 hover:bg-white/5",
  "outline-dark": "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
  whatsapp: "bg-whatsapp text-ink hover:brightness-110",
  ghost: "text-white/80 hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-[0.95rem]",
  lg: "min-h-14 px-7 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2.5 rounded-full font-display font-bold tracking-tight transition-[background-color,border-color,filter,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; children: ReactNode };

export function ButtonLink({
  variant,
  size,
  className = "",
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant,
  size,
  className = "",
  children,
  type = "button",
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
