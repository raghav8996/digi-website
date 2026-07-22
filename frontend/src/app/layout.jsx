import { Manrope, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { fetchServer } from "@/lib/api";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://digiconnect.net.in";
const LOGO_URL =
  "https://customer-assets-0z36b82j.emergentagent.net/job_modern-digiconnect/artifacts/5a35ubtx_Group27.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DigiConnect — Samsung Experience Store & SmartCafé, Greater Noida",
    template: "%s | DigiConnect",
  },
  description:
    "DigiConnect is an authorized Samsung Experience Store & SmartCafé partner in Greater Noida. Live demos of the Galaxy S, Z, A series, tablets, wearables and audio at Gaur City Mall and Grand Venice Mall.",
  keywords: [
    "Samsung Experience Store Greater Noida",
    "Samsung Store Noida",
    "Buy Galaxy S25 Ultra Greater Noida",
    "Galaxy Z Fold8 pre-reserve India",
    "Samsung SmartCafé Gaur City",
    "Samsung SmartCafé Grand Venice Mall",
    "Galaxy A55 demo",
    "DigiConnect Samsung",
  ],
  authors: [{ name: "DigiConnect" }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DigiConnect",
    locale: "en_IN",
    title: "DigiConnect — Samsung Experience Store & SmartCafé, Greater Noida",
    description:
      "Authorized Samsung Experience Store & SmartCafé partner. Two flagship locations in Greater Noida.",
    images: [{ url: LOGO_URL, width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigiConnect — Samsung Experience Store, Greater Noida",
    description:
      "Authorized Samsung Experience Store & SmartCafé partner. Live Galaxy S, Z & A-series demos.",
    images: [LOGO_URL],
  },
  icons: { icon: LOGO_URL },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const jsonLdBase = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ElectronicsStore",
      "@id": SITE_URL + "/#gaur-city",
      name: "DigiConnect — Samsung Experience Store (Gaur City Mall)",
      image: LOGO_URL,
      url: SITE_URL + "/",
      telephone: "+91-7302441893",
      email: "digiconnect.gm@gmail.com",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "GF 29, Ground Floor, Samsung Store, Gaur City Mall",
        addressLocality: "Greater Noida West",
        addressRegion: "Uttar Pradesh",
        postalCode: "201306",
        addressCountry: "IN",
      },
      sameAs: ["https://www.instagram.com/digi.connect_/"],
    },
    {
      "@type": "ElectronicsStore",
      "@id": SITE_URL + "/#grand-venice",
      name: "DigiConnect — Samsung Experience Store (Grand Venice Mall)",
      image: LOGO_URL,
      url: SITE_URL + "/",
      telephone: "+91-9205497881",
      email: "digiconnect.gv@gmail.com",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "LGF 57, Lower Ground Floor, Samsung Store, Grand Venice Mall",
        addressLocality: "Greater Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201310",
        addressCountry: "IN",
      },
      sameAs: ["https://www.instagram.com/digi.connect_/"],
    },
  ],
};

function aggregate(ratings) {
  if (!ratings.length) return null;
  const sum = ratings.reduce((a, b) => a + b, 0);
  const avg = Math.round((sum / ratings.length) * 10) / 10; // 1 decimal
  return {
    "@type": "AggregateRating",
    ratingValue: avg,
    bestRating: 5,
    worstRating: 1,
    reviewCount: ratings.length,
  };
}

function buildJsonLd(testimonials) {
  const active = testimonials.filter((t) => t.is_active);
  const gaur = active
    .filter((t) => t.store === "gaur-city" || t.store === "both")
    .map((t) => Number(t.rating) || 5);
  const venice = active
    .filter((t) => t.store === "grand-venice" || t.store === "both")
    .map((t) => Number(t.rating) || 5);

  const graph = jsonLdBase["@graph"].map((node) => {
    const isGaur = node["@id"].endsWith("#gaur-city");
    const rating = aggregate(isGaur ? gaur : venice);
    return rating ? { ...node, aggregateRating: rating } : node;
  });

  return { ...jsonLdBase, "@graph": graph };
}

export default async function RootLayout({ children }) {
  const testimonials = await fetchServer("/testimonials?active_only=true");
  const jsonLd = buildJsonLd(testimonials);
  const jsonLdHtml = { __html: JSON.stringify(jsonLd) };
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdHtml}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
