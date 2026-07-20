"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LOGO_URL } from "@/lib/stores";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "Stores" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-shadow duration-200 bg-[#0a0a0b] ${
        scrolled ? "shadow-[0_1px_0_rgba(15,15,17,0.08)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
        <Link href="/" data-testid="header-logo-link" className="flex items-center gap-3">
          <Image src={LOGO_URL} alt="DigiConnect logo" width={40} height={40} className="rounded-xl" />
          <span className="font-display font-black text-lg tracking-tight text-[#f5f5f7] hidden sm:block">
            DigiConnect
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? "text-[#f5f5f7] bg-white/[0.07] border border-white/10"
                  : "text-[#a1a1a6] hover:text-[#f5f5f7]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            data-testid="header-visit-cta"
            href="/stores"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#f5f5f7] text-[#0a0a0b] hover:bg-white transition-colors"
          >
            Visit a Store
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[#f5f5f7] p-2 rounded-lg border border-white/10"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="md:hidden border-t border-white/10 bg-[#0a0a0b] px-5 py-4 space-y-2"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${
                isActive(item.to) ? "bg-white/10 text-[#f5f5f7]" : "text-[#a1a1a6]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            data-testid="mobile-visit-cta"
            href="/stores"
            className="block text-center rounded-full px-5 py-3 text-sm font-bold bg-[#d4405e] text-white"
          >
            Visit a Store
          </Link>
        </div>
      )}
    </header>
  );
}
