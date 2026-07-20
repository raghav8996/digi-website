import { CheckCircle2 } from "lucide-react";

export default function AnnouncementStrip({ announcements = [] }) {
  const active = announcements.filter((a) => a.is_active).slice(0, 4);
  if (!active.length) return null;
  return (
    <div data-testid="announcement-strip" className="max-w-7xl mx-auto px-5 md:px-10 mt-10 md:mt-14">
      <div className="flex flex-wrap items-center gap-3">
        {active.map((a) => (
          <span
            key={a.id}
            data-testid={`announcement-chip-${a.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.03] px-4 py-2 text-xs md:text-sm font-medium text-[#0f0f11]/80"
          >
            <CheckCircle2 size={13} className="text-[#7a1b2e]" />
            {a.message}
          </span>
        ))}
      </div>
    </div>
  );
}
