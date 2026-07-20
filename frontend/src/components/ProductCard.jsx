import { Layers } from "lucide-react";
import ReserveButton from "@/components/ReserveButton";

export default function ProductCard({ product, index = 0 }) {
  const p = product;
  return (
    <article
      data-testid={`product-card-${index}`}
      className="dc-tile overflow-hidden flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-black relative">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6e6e73]/70">
            <Layers size={28} />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col grow">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">
          {p.category}
        </p>
        <h3 className="font-display font-bold text-white text-lg mt-1.5">{p.name}</h3>
        <p className="text-[#a1a1a6] text-xs mt-2 leading-relaxed grow">{p.highlight}</p>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          {p.price ? (
            <div className="text-white/85 text-sm font-semibold">{p.price}</div>
          ) : (
            <div className="text-[#6e6e73] text-xs">In store</div>
          )}
          <ReserveButton
            productName={p.name}
            testId={`reserve-product-${index}`}
          />
        </div>
      </div>
    </article>
  );
}
