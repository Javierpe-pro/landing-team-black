import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { seo } from "@/content/copy";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/site";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { PageBootstrap } from "@/components/tracking/PageBootstrap";
import { CookieNotice } from "@/components/tracking/CookieNotice";
import { RevealObserver } from "@/components/motion/RevealObserver";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  applicationName: "Team Black by Amaya",
  // noindex mientras estemos en pruebas (NEXT_PUBLIC_ALLOW_INDEXING=true para indexar)
  robots: ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Team Black by Amaya",
    title: seo.title,
    description: seo.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-dvh bg-ink">
        {children}
        <RevealObserver />
        <PageBootstrap />
        <CookieNotice />
        <MetaPixel />
      </body>
    </html>
  );
}
