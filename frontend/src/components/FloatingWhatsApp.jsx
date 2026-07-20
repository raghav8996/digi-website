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
          className="w-[300px] bg-white border border-black/8 rounded-2xl p-4 backdrop-blur-xl dc-glow-soft dc-reveal"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold text-[#0f0f11] text-sm">Chat with a store</p>
            <button
              data-testid="whatsapp-close"
              onClick={() => setOpen(false)}
              className="text-[#83838f] hover:text-[#0f0f11]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-[#4a4a55] mb-4 leading-relaxed">
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
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 bg-black/[0.03] border border-black/8 hover:border-[#7a1b2e] hover:bg-black/[0.05] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#7a1b2e]" />
                  <span className="text-sm font-semibold text-[#0f0f11]">{s.name}</span>
                </span>
                <span className="text-[10px] text-[#83838f]">{s.phone}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <button
        data-testid="whatsapp-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="h-14 w-14 rounded-full bg-[#7a1b2e] text-white shadow-[0_10px_40px_rgba(122,27,46,0.45)] hover:scale-110 transition-transform flex items-center justify-center dc-pulse"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
