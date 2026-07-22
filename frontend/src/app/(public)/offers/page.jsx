import { fetchServer } from "@/lib/api";
import OffersSection from "@/components/OffersSection";
import Fold8Banner from "@/components/Fold8Banner";

export const revalidate = 60;

export const metadata = {
  title: "In-Store Offers — Samsung deals at DigiConnect Greater Noida",
  description:
    "Limited-time bundles, trade-in bonuses and launch offers on Samsung Galaxy phones, tablets and wearables. Available only at DigiConnect Gaur City Mall and Grand Venice Mall.",
  alternates: { canonical: "https://digiconnect.net.in/offers" },
};

export default async function OffersPage() {
  const [offers, siteContent] = await Promise.all([
    fetchServer("/offers?active_only=true", { tags: ["offers"] }),
    fetchServer("/site-content", { tags: ["site-content"] }),
  ]);

  return (
    <>
      <section
        data-testid="offers-hero"
        className="pt-20 md:pt-28 pb-16 px-5 md:px-10 border-b border-white/5 relative overflow-hidden"
      >
        <div className="dc-aurora" />
        <div className="relative max-w-6xl mx-auto">
          <p className="overline">Limited time · In-store</p>
          <h1 className="font-display font-black text-white tracking-tight leading-none text-5xl md:text-7xl mt-3 max-w-4xl">
            Offers you can only <span className="dc-gradient-text italic">walk into.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[#a1a1a6] text-lg">
            Trade-in bonuses, bundle deals, launch pre-reserves — all reserved for customers who
            visit DigiConnect Greater Noida.
          </p>
        </div>
      </section>

      <Fold8Banner content={siteContent || {}} />

      <OffersSection offers={offers} variant="page" />
    </>
  );
}
