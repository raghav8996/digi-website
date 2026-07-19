import LocationCard from "@/components/LocationCard";
import Testimonials from "@/components/Testimonials";
import { fetchServer } from "@/lib/api";
import { STORE_LOCATIONS } from "@/lib/stores";

export const revalidate = 60;

export const metadata = {
  title: "Store Locations — Samsung Experience Stores in Greater Noida",
  description:
    "DigiConnect Samsung Experience Stores at Gaur City Mall and Grand Venice Mall, Greater Noida. Addresses, phone numbers, WhatsApp and directions.",
  alternates: { canonical: "https://digiconnect.net.in/stores" },
};

export default async function StoresPage() {
  const testimonials = await fetchServer("/testimonials?active_only=true");

  return (
    <>
      <section
        data-testid="stores-hero"
        className="pt-20 md:pt-28 pb-16 px-5 md:px-10 border-b border-white/5 relative overflow-hidden"
      >
        <div className="dc-aurora" />
        <div className="relative max-w-7xl mx-auto">
          <p className="overline">Visit Us</p>
          <h1 className="font-display font-black text-white tracking-tighter leading-none text-5xl md:text-7xl mt-3 max-w-4xl">
            Two flagships. <span className="dc-gradient-text">One city.</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-2xl text-lg">
            Both stores are Samsung-designated Experience Stores & SmartCafé partners. Walk in for a
            demo or a device upgrade — expert staff on hand every day.
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

      <Testimonials items={testimonials} variant="stores" />
    </>
  );
}
