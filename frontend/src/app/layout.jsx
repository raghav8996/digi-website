import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "@/components/Analytics";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "https://digiconnect.net.in";
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

const jsonLd = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
