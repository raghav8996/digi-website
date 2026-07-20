"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, MapPin, X, ArrowUpRight } from "lucide-react";
import { STORE_LOCATIONS } from "@/lib/stores";

function buildUrl(store, productName) {
  const text = encodeURIComponent(
    `Hi DigiConnect ${store.name}, I'd like to reserve the ${productName}.`
  );
  return `https://wa.me/${store.whatsapp}?text=${text}`;
}

/**
 * ReserveButton
 * Small "Reserve" CTA on product cards. Clicking opens a popover to pick a store,
 * which then opens WhatsApp with a pre-filled reservation message.
 */
export default function ReserveButton({ productName, size = "sm", testId }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const isSmall = size === "sm";

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        data-testid={testId || "reserve-button"}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-[#7a1b2e] text-white hover:bg-[#5f1524] transition-colors ${
          isSmall ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
        }`}
      >
        <MessageCircle size={isSmall ? 12 : 14} /> Reserve
      </button>

      {open && (
        <div
          data-testid={`${testId || "reserve"}-popover`}
          className="absolute right-0 bottom-full mb-2 w-[260px] bg-white border border-black/8 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] dc-glow-soft z-30 dc-reveal"
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="font-display font-bold text-[#0f0f11] text-xs">Pick a store</p>
            <button
              onClick={() => setOpen(false)}
              className="text-[#83838f] hover:text-[#0f0f11]"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-[11px] text-[#83838f] leading-snug px-1 mb-2">
            We&apos;ll open WhatsApp with your reservation pre-filled.
          </p>
          <div className="space-y-1.5">
            {STORE_LOCATIONS.map((s) => (
              <a
                key={s.id}
                data-testid={`reserve-${s.id}`}
                href={buildUrl(s, productName)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 bg-black/[0.03] border border-black/8 hover:border-[#7a1b2e] hover:bg-black/[0.05] transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <MapPin size={12} className="text-[#7a1b2e] shrink-0" />
                  <span className="text-xs font-semibold text-[#0f0f11] truncate">{s.name}</span>
                </span>
                <ArrowUpRight size={12} className="text-[#83838f]/80" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
