import SEO from "@/components/SEO";
import LocationCard from "@/components/LocationCard";
import { STORE_LOCATIONS } from "@/lib/stores";

export default function Stores() {
  return (
    <>
      <SEO
        title="Store Locations — Samsung Experience Stores in Greater Noida"
        description="DigiConnect Samsung Experience Stores at Gaur City Mall and Grand Venice Mall, Greater Noida. Addresses, phone numbers, WhatsApp and directions."
        path="/stores"
      />
      <section
        data-testid="stores-hero"
        className="pt-20 md:pt-28 pb-16 px-5 md:px-10 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <p className="overline">Stores</p>
          <h1 className="font-display font-black text-white tracking-tighter leading-none text-5xl md:text-7xl mt-3 max-w-4xl">
            Two flagships. <span className="dc-gradient-text">One city.</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-2xl text-lg">
            Both stores are Samsung-designated retail outlets & SmartCafé partners. Walk in for a
            demo, service enquiry, or just to say hi.
          </p>
        </div>
      </section>

      <section data-testid="stores-list" className="px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORE_LOCATIONS.map((s) => (
            <LocationCard key={s.id} store={s} testIdPrefix="stores-page" />
          ))}
        </div>
      </section>
    </>
  );
}
