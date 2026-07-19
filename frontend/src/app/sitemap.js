export default function sitemap() {
  const base = "https://digiconnect.net.in";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/stores`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/offers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
