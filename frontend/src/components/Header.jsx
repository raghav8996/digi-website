import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LOGO_URL } from "@/lib/stores";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "Stores" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/80 border-b border-white/10"
          : "backdrop-blur bg-black/40 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
        <Link to="/" data-testid="header-logo-link" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="DigiConnect logo"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <span className="font-display font-black text-lg tracking-tight text-white hidden sm:block">
            DigiConnect
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-white/5 border border-white/10"
                    : "text-white/60 hover:text-white"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            data-testid="header-visit-cta"
            href="/stores"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] transition-colors"
          >
            Visit a Store
          </a>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white p-2 rounded-lg border border-white/10"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-5 py-4 space-y-2"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium ${
                  isActive ? "bg-white/10 text-white" : "text-white/70"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
          <a
            data-testid="mobile-visit-cta"
            href="/stores"
            className="block text-center rounded-full px-5 py-3 text-sm font-bold bg-[#ff007f] text-white"
          >
            Visit a Store
          </a>
        </div>
      )}
    </header>
  );
}
