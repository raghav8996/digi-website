import { MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";

export default function LocationCard({ store, testIdPrefix = "location" }) {
  return (
    <article
      data-testid={`${testIdPrefix}-${store.id}`}
      className="dc-tile p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#7a1b2e]/10 blur-3xl" />
      <p className="overline">{store.city}</p>
      <h3 className="font-display text-2xl md:text-3xl font-black text-[#0f0f11] mt-2">
        {store.name}
      </h3>
      <div className="mt-6 space-y-3 text-sm text-[#0f0f11]/70">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="mt-0.5 text-[#7a1b2e] shrink-0" />
          <span>{store.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-[#7a1b2e]" />
          <a
            data-testid={`${testIdPrefix}-${store.id}-phone`}
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="hover:text-[#0f0f11]"
          >
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-[#7a1b2e]" />
          <a
            data-testid={`${testIdPrefix}-${store.id}-email`}
            href={`mailto:${store.email}`}
            className="hover:text-[#0f0f11] break-all"
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
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold bg-[#7a1b2e] text-white hover:bg-[#5f1524] transition-colors"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a
          data-testid={`${testIdPrefix}-${store.id}-maps`}
          href={store.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-black/[0.04] border border-black/8 text-[#0f0f11] hover:bg-black/[0.06] transition-colors"
        >
          <ExternalLink size={16} /> Get Directions
        </a>
      </div>
    </article>
  );
}
