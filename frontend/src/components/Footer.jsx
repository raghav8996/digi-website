import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Mail, Phone } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, LOGO_URL, STORE_LOCATIONS } from "@/lib/stores";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative border-t border-white/10 bg-[#101014] text-[#f5f0e6]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image src={LOGO_URL} alt="DigiConnect" width={44} height={44} className="rounded-xl" />
            <span className="font-display text-2xl font-black text-white">DigiConnect</span>
          </div>
          <p className="text-white/60 max-w-md text-sm leading-relaxed">
            Samsung-exclusive Experience Stores in Greater Noida. Two flagship locations built to help
            you discover the entire Galaxy ecosystem — hands-on, unhurried, in a SmartCafé setting.
          </p>
          <a
            data-testid="footer-instagram"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white/80 hover:text-[#7a1b2e] transition-colors"
          >
            <Instagram size={18} /> {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div>
          <p className="overline mb-4 text-white/60">Explore</p>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/stores", "Stores"],
              ["/offers", "In-Store Offers"],
              ["/about", "About"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  href={to}
                  data-testid={`footer-link-${label.toLowerCase().replace(/\s|-/g, "")}`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="overline mb-4 text-white/60">Locations</p>
          <ul className="space-y-4 text-sm">
            {STORE_LOCATIONS.map((s) => (
              <li key={s.id} className="text-white/70">
                <div className="text-white font-semibold">{s.name}</div>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-white/50" />
                  <span className="text-xs leading-relaxed">{s.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={14} className="text-white/50" />
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-xs hover:text-white">
                    {s.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={14} className="text-white/50" />
                  <a href={`mailto:${s.email}`} className="text-xs hover:text-white break-all">
                    {s.email}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/45">
          <span>© {new Date().getFullYear()} DigiConnect · Samsung Experience Store & SmartCafé partner</span>
          <span>Designed for Greater Noida.</span>
        </div>
      </div>
    </footer>
  );
}
