import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, path = "/", image }) {
  const fullTitle = title
    ? `${title} | DigiConnect`
    : "DigiConnect | Samsung Experience Store & SmartCafé — Greater Noida";
  const desc =
    description ||
    "DigiConnect is an authorized Samsung Experience Store and SmartCafé partner in Greater Noida. Discover Galaxy smartphones, tablets, wearables and accessories with live in-store demos.";
  const url = `https://digiconnect.net.in${path}`;
  const ogImage =
    image ||
    "https://customer-assets-0z36b82j.emergentagent.net/job_modern-digiconnect/artifacts/5a35ubtx_Group27.png";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
