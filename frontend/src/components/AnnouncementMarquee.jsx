import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AnnouncementMarquee() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/announcements", { params: { active_only: true } })
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  }, []);

  if (!items.length) return null;

  // duplicate for seamless loop
  const track = [...items, ...items];

  return (
    <div
      data-testid="announcement-marquee"
      className="w-full bg-[#ff007f] text-white overflow-hidden border-y border-black/20"
    >
      <div className="dc-marquee-track py-2.5 text-xs md:text-sm font-bold tracking-[0.18em] uppercase">
        {track.map((a, i) => (
          <span key={`${a.id}-${i}`} className="flex items-center px-8 shrink-0">
            <span className="mr-8 inline-block h-1.5 w-1.5 rounded-full bg-white" />
            {a.message}
          </span>
        ))}
      </div>
    </div>
  );
}
