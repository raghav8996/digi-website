import { MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";

export default function LocationCard({ store, testIdPrefix = "location" }) {
  return (
    <article
      data-testid={`${testIdPrefix}-${store.id}`}
      className="dc-tile p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#d4405e]/10 blur-3xl" />
      <p className="overline">{store.city}</p>
      <h3 className="font-display text-2xl md:text-3xl font-black text-[#f5f5f7] mt-2">
        {store.name}
      </h3>
      <div className="mt-6 space-y-3 text-sm text-[#a1a1a6]">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="mt-0.5 text-[#d4405e] shrink-0" />
          <span>{store.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-[#d4405e]" />
          <a
            data-testid={`${testIdPrefix}-${store.id}-phone`}
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="hover:text-[#f5f5f7]"
          >
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-[#d4405e]" />
          <a
            data-testid={`${testIdPrefix}-${store.id}-email`}
            href={`mailto:${store.email}`}
            className="hover:text-[#f5f5f7] break-all"
          >
            {store.email}
          </a>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          data-testid={`${testIdPrefix}-${store.id}-whatsapp`}
          href={store.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold bg-[#f5f5f7] text-[#0a0a0b] hover:bg-white transition-colors"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a
          data-testid={`${testIdPrefix}-${store.id}-maps`}
          href={store.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-white/[0.05] border border-white/10 text-[#f5f5f7] hover:bg-white/[0.07] transition-colors"
        >
          <ExternalLink size={16} /> Get Directions
        </a>
      </div>
    </article>
  );
}
