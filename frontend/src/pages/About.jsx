import SEO from "@/components/SEO";
import { Target, Compass, Heart, Zap, TrendingUp, Shield } from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Customer Satisfaction", body: "Prioritising the needs of every customer with personalised, unhurried service." },
  { icon: Shield, title: "Integrity", body: "Business conducted honestly and transparently — nothing less." },
  { icon: Zap, title: "Innovation", body: "Ahead of trends, offering the latest Samsung ecosystem the moment it lands." },
  { icon: TrendingUp, title: "Growth", body: "Continuously expanding, deepening the customer experience with every store." },
  { icon: Compass, title: "Reliability", body: "Dependable products and after-sales you can actually rely on." },
  { icon: Target, title: "Mission-first", body: "A multi-brand, multi-location offline retail powerhouse — one city at a time." },
];

export default function About() {
  return (
    <>
      <SEO
        title="About & Vision"
        description="DigiConnect is a Samsung Experience Store established in 2021. Learn about our mission, values, and vision for a multi-brand, multi-location offline retail future in India."
        path="/about"
      />

      <section data-testid="about-hero" className="pt-20 md:pt-28 pb-16 px-5 md:px-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="overline">About DigiConnect</p>
          <h1 className="font-display font-black text-white tracking-tighter leading-none text-5xl md:text-7xl mt-3">
            Retail, <span className="dc-gradient-text">rethought</span> for the way you actually shop.
          </h1>
          <p className="mt-8 max-w-3xl text-white/70 text-lg leading-relaxed">
            Founded in 2021 in Greater Noida, DigiConnect is a Samsung-designated retail outlet and
            SmartCafé partner. What started as a single store has grown into two flagship locations
            — with a bigger vision behind it.
          </p>
        </div>
      </section>

      <section data-testid="about-story" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="overline">The story</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mt-3 tracking-tighter">
              From one store to a retail ecosystem.
            </h2>
          </div>
          <div className="space-y-5 text-white/70 leading-relaxed">
            <p>
              DigiConnect is a dynamic and rapidly growing retail business specialising in Samsung
              electronic products. Established in <span className="text-white font-semibold">2021</span> as
              a sole proprietorship, we&apos;ve quickly built a reputation for high-quality products and
              a genuinely helpful in-store experience.
            </p>
            <p>
              Both stores are Samsung Experience Stores and SmartCafé partners — spaces designed for
              hands-on discovery. Knowledgeable staff, live demos, and a lounge-style environment where
              you can test devices, compare ecosystems, and get advice tailored to your needs.
            </p>
            <p>
              Our long-term vision goes beyond Samsung. We&apos;re building a{" "}
              <span className="text-white font-semibold">multi-brand, multi-location offline retail powerhouse</span>{" "}
              — one that helps brands convert interest into trust, and trust into loyalty.
            </p>
          </div>
        </div>
      </section>

      <section data-testid="about-values" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="overline">Core values</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tighter">
              What we care about.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={v.title} data-testid={`value-card-${i}`} className="dc-tile p-7">
                <div className="h-11 w-11 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f]">
                  <v.icon size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-5">{v.title}</h3>
                <p className="text-white/60 mt-2 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="about-mission" className="px-5 md:px-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ff007f]/20 blur-3xl" />
          <div className="relative">
            <p className="overline">Our mission</p>
            <p className="font-display text-2xl md:text-4xl font-black text-white mt-4 leading-tight tracking-tighter">
              To empower brands to reach customers more effectively — and enable customers to
              experience technology the way it&apos;s meant to be discovered.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
