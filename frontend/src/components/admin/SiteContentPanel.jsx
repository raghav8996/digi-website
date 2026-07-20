"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { FormRow } from "@/components/admin/shared";

const empty = {
  hero_live_demo_label: "",
  hero_live_demo_title: "",
  hero_live_demo_cta: "",
  hero_live_demo_href: "",
};

export default function SiteContentPanel({ showToast }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/site-content");
      setForm({
        hero_live_demo_label: data?.hero_live_demo_label || "",
        hero_live_demo_title: data?.hero_live_demo_title || "",
        hero_live_demo_cta: data?.hero_live_demo_cta || "",
        hero_live_demo_href: data?.hero_live_demo_href || "",
      });
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch("/site-content", form);
      showToast("Hero content updated");
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6e6e73]">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <p className="text-sm text-[#a1a1a6]">
          Controls the &ldquo;Live demo&rdquo; chip on the home page hero image. Update anytime — changes go live within a minute.
        </p>
      </div>

      <div className="dc-tile p-6 md:p-8 space-y-5">
        <FormRow label="Overline (small caps text)">
          <input
            data-testid="site-hero-label"
            value={form.hero_live_demo_label}
            onChange={(e) => setForm({ ...form, hero_live_demo_label: e.target.value })}
            placeholder="e.g., Live demo"
            className="dc-input"
          />
        </FormRow>

        <FormRow label="Main line (bold headline)">
          <input
            data-testid="site-hero-title"
            value={form.hero_live_demo_title}
            onChange={(e) => setForm({ ...form, hero_live_demo_title: e.target.value })}
            placeholder="e.g., Galaxy Z Fold — feel the fold in person."
            className="dc-input"
          />
        </FormRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="CTA label">
            <input
              data-testid="site-hero-cta"
              value={form.hero_live_demo_cta}
              onChange={(e) => setForm({ ...form, hero_live_demo_cta: e.target.value })}
              placeholder="e.g., Visit"
              className="dc-input"
            />
          </FormRow>
          <FormRow label="CTA link (path)">
            <input
              data-testid="site-hero-href"
              value={form.hero_live_demo_href}
              onChange={(e) => setForm({ ...form, hero_live_demo_href: e.target.value })}
              placeholder="/stores"
              className="dc-input"
            />
          </FormRow>
        </div>

        <div className="pt-3">
          <button
            data-testid="site-hero-save"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#ff2d7a] text-white hover:bg-[#e91764] disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#6e6e73] font-bold mb-3">Preview</p>
        <div className="max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 backdrop-blur px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6e6e73] font-semibold">{form.hero_live_demo_label || "Live demo"}</p>
            <p className="text-sm font-semibold text-white">{form.hero_live_demo_title || "Galaxy Z Fold — feel the fold in person."}</p>
          </div>
          <span className="text-xs font-semibold text-white ml-3 whitespace-nowrap">
            {form.hero_live_demo_cta || "Visit"} →
          </span>
        </div>
      </div>
    </div>
  );
}
