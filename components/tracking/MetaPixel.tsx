import Script from "next/script";
import { PIXEL_DEBUG, PIXEL_ENABLED, PIXEL_ID } from "@/lib/pixel";

/**
 * Meta Pixel de Javier. Solo se inyecta si NEXT_PUBLIC_META_PIXEL_ID existe
 * Y NEXT_PUBLIC_PIXEL_ENABLED=true. Dispara PageView (con event_id) en cada carga.
 * Respeta la elección del banner de cookies (localStorage "tb_cookies").
 */
export function MetaPixel() {
  if (!PIXEL_ENABLED) return null;
  const id = PIXEL_ID.replace(/\D/g, ""); // solo dígitos: evita inyección en el script

  const code = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
try{if(localStorage.getItem('tb_cookies')==='rechazado'){fbq('consent','revoke');}}catch(e){}
fbq('init','${id}');
var __tbpv='pageview_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
fbq('track','PageView',{},{eventID:__tbpv});
${PIXEL_DEBUG ? "console.log('%c[Pixel] PageView','color:#4D8DFF;font-weight:bold',{event_id:__tbpv});" : ""}
`;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {code}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
