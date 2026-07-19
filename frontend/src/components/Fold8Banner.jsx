import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { STORE_LOCATIONS, FOLD8_WHATSAPP_MSG } from "@/lib/stores";

export default function Fold8Banner() {
  return (
    <section
      data-testid="fold8-banner"
      className="relative mx-auto max-w-7xl px-5 md:px-10 -mt-8 md:-mt-16 z-10"
      aria-label="Galaxy Z Fold8 pre-reserve"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#0f0710] to-[#050505]">
        <div className="absolute -top-28 -right-28 h-72 w-72 rounded-full bg-[#ff007f]/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#6a00ff]/15 blur-3xl" />
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 p-8 md:p-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ff007f]/12 border border-[#ff007f]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-bold text-[#ff007f]">
              <Sparkles size={12} /> Coming soon · Pre-reserve
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.95]">
              Galaxy Z <span className="dc-gradient-text">Fold8</span>.
              <br />
              Be first in line.
            </h2>
            <p className="mt-4 max-w-lg text-white/70 text-sm md:text-base leading-relaxed">
              India&apos;s most anticipated foldable is landing at DigiConnect. Reserve your unit today,
              unlock launch-day priority pickup and an exclusive in-store gift bundle.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {STORE_LOCATIONS.map((s) => (
                <a
                  key={s.id}
                  data-testid={`fold8-reserve-${s.id}`}
                  href={`https://wa.me/${s.whatsapp}?text=${FOLD8_WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs md:text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] transition-colors"
                >
                  Reserve · {s.name} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-56 w-56 rounded-full bg-[#ff007f]/20 blur-3xl" />
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] w-56 rotate-[-6deg] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80"
                alt="Galaxy Z Fold concept"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-[0.22em] text-white/80 font-bold">
                Concept · Actual product may vary
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
