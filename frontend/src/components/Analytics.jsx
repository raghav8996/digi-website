"use client";

import Script from "next/script";

/**
 * GA4 + Search Console integration.
 *
 * Renders nothing when NEXT_PUBLIC_GA_ID is missing so local/preview envs stay clean.
 * When set (e.g., G-XXXXXXXXXX), it injects gtag.js and configures the measurement ID.
 *
 * Google Site Verification is exposed separately via metadata.verification in layout.jsx.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
