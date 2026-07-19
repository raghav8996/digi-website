import SEO from "@/components/SEO";
import LocationCard from "@/components/LocationCard";
import { Instagram, MessageCircle } from "lucide-react";
import { STORE_LOCATIONS, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/stores";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Contact DigiConnect Samsung Experience Store. Chat with us on Instagram (@digi.connect_) or WhatsApp at our Gaur City Mall or Grand Venice Mall stores in Greater Noida."
        path="/contact"
      />

      <section data-testid="contact-hero" className="pt-20 md:pt-28 pb-14 px-5 md:px-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="overline">Contact</p>
          <h1 className="font-display font-black text-white tracking-tighter leading-none text-5xl md:text-7xl mt-3 max-w-4xl">
            No forms. <span className="dc-gradient-text">Just a chat.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/60 text-lg">
            Reach us on WhatsApp at either store, or slide into our Instagram DMs. We reply during
            store hours.
          </p>
        </div>
      </section>

      <section data-testid="contact-channels" className="px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORE_LOCATIONS.map((s) => (
            <LocationCard key={s.id} store={s} testIdPrefix="contact-page" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-6 dc-tile p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="overline">Follow us</p>
            <h3 className="font-display text-2xl md:text-3xl font-black text-white mt-2 tracking-tight">
              Instagram is where the drop lands first.
            </h3>
            <p className="text-white/60 text-sm mt-2">
              Product launches, offers, and everyday store moments — {INSTAGRAM_HANDLE}
            </p>
          </div>
          <a
            data-testid="contact-instagram-btn"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] transition-colors self-start md:self-auto"
          >
            <Instagram size={16} /> Open Instagram
          </a>
        </div>
      </section>
    </>
  );
}
