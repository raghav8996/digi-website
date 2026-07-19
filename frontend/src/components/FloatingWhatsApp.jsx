"use client";

import { useState } from "react";
import { MessageCircle, MapPin, X } from "lucide-react";
import { STORE_LOCATIONS } from "@/lib/stores";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          data-testid="whatsapp-popover"
          className="w-[300px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 backdrop-blur-xl dc-glow-soft dc-reveal"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold text-white text-sm">Chat with a store</p>
            <button
              data-testid="whatsapp-close"
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-white/60 mb-4 leading-relaxed">
            Pick your nearest DigiConnect location. We&apos;ll open WhatsApp with your store.
          </p>
          <div className="space-y-2">
            {STORE_LOCATIONS.map((s) => (
              <a
                key={s.id}
                data-testid={`whatsapp-choose-${s.id}`}
                href={s.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 bg-white/[0.03] border border-white/10 hover:border-[#ff007f] hover:bg-white/[0.06] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#ff007f]" />
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                </span>
                <span className="text-[10px] text-white/50">{s.phone}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <button
        data-testid="whatsapp-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="h-14 w-14 rounded-full bg-[#ff007f] text-white shadow-[0_10px_40px_rgba(255,0,127,0.45)] hover:scale-110 transition-transform flex items-center justify-center dc-pulse"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
