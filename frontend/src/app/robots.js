export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/*"] }],
    sitemap: "https://digiconnect.net.in/sitemap.xml",
  };
}
