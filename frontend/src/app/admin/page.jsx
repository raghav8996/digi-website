"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Megaphone, ShoppingBag, Tag, Star, Instagram } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LOGO_URL } from "@/lib/stores";
import ProductsPanel from "@/components/admin/ProductsPanel";
import OffersPanel from "@/components/admin/OffersPanel";
import AnnouncementsPanel from "@/components/admin/AnnouncementsPanel";
import TestimonialsPanel from "@/components/admin/TestimonialsPanel";
import InstagramPanel from "@/components/admin/InstagramPanel";

export default function AdminDashboardPage() {
  const { admin, checked, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [anns, setAnns] = useState([]);
  const [offers, setOffers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [igPosts, setIgPosts] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (checked && !admin) router.replace("/admin/login");
  }, [checked, admin, router]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const load = async (endpoint, setter) => {
    try {
      const { data } = await api.get(endpoint);
      setter(data || []);
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  useEffect(() => {
    if (admin) {
      load("/products", setProducts);
      load("/announcements", setAnns);
      load("/offers", setOffers);
      load("/testimonials", setTestimonials);
      load("/instagram-posts", setIgPosts);
    }
  }, [admin]);

  if (!checked || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#a1a1a6] text-sm">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f5f5f7] pb-24">
      <div className="border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src={LOGO_URL} alt="DigiConnect" width={36} height={36} className="rounded-lg" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6e6e73]">Admin</p>
              <p className="font-display font-black text-sm">DigiConnect CMS</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-[#6e6e73]">{admin?.email}</span>
            <Link
              href="/"
              data-testid="admin-view-site"
              className="text-xs font-semibold text-[#a1a1a6] hover:text-[#f5f5f7] px-3 py-2 rounded-lg border border-white/10"
            >
              View site
            </Link>
            <button
              data-testid="admin-logout"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/[0.08]"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-10">
        <p className="overline">Dashboard</p>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight mt-2">
          Manage what shoppers see.
        </h1>
        <p className="text-[#a1a1a6] mt-3 max-w-xl">
          Update featured products, in-store offers and site announcements. Changes go live within a
          minute.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={ShoppingBag} label="Products" testId="tab-products" />
          <TabBtn active={tab === "offers"} onClick={() => setTab("offers")} icon={Tag} label="Offers" testId="tab-offers" />
          <TabBtn active={tab === "testimonials"} onClick={() => setTab("testimonials")} icon={Star} label="Reviews" testId="tab-testimonials" />
          <TabBtn active={tab === "instagram"} onClick={() => setTab("instagram")} icon={Instagram} label="Instagram" testId="tab-instagram" />
          <TabBtn active={tab === "announcements"} onClick={() => setTab("announcements")} icon={Megaphone} label="Announcements" testId="tab-announcements" />
        </div>

        <div className="mt-8">
          {tab === "products" && (
            <ProductsPanel items={products} reload={() => load("/products", setProducts)} showToast={showToast} />
          )}
          {tab === "offers" && (
            <OffersPanel items={offers} reload={() => load("/offers", setOffers)} showToast={showToast} />
          )}
          {tab === "testimonials" && (
            <TestimonialsPanel items={testimonials} reload={() => load("/testimonials", setTestimonials)} showToast={showToast} />
          )}
          {tab === "instagram" && (
            <InstagramPanel items={igPosts} reload={() => load("/instagram-posts", setIgPosts)} showToast={showToast} />
          )}
          {tab === "announcements" && (
            <AnnouncementsPanel items={anns} reload={() => load("/announcements", setAnns)} showToast={showToast} />
          )}
        </div>
      </div>

      {toast && (
        <div
          data-testid="admin-toast"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold z-50 ${
            toast.ok ? "bg-[#d4405e] text-white" : "bg-red-500 text-[#f5f5f7]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label, testId }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-colors ${
        active
          ? "bg-[#d4405e] text-white border-[#d4405e]"
          : "bg-white/[0.04] text-[#a1a1a6] border-white/10 hover:text-[#f5f5f7]"
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}
