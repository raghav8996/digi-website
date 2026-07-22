"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { FormRow } from "@/components/admin/shared";
import ImageInput, { resolveImageUrl } from "@/components/admin/ImageInput";

const empty = {
  hero_image_url: "",
  hero_image_alt: "",
  hero_live_demo_label: "",
  hero_live_demo_title: "",
  hero_live_demo_cta: "",
  hero_live_demo_href: "",
  story_image_url: "",
  story_image_alt: "",
  about_hero_image_url: "",
  about_hero_image_alt: "",
  banner_active: true,
  banner_badge: "",
  banner_title_line1: "",
  banner_title_line2: "",
  banner_description: "",
  banner_button_text: "",
  banner_image_url: "",
  banner_image_alt: "",
  banner_image_caption: "",
  banner_whatsapp_message: "",
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
        hero_image_url: data?.hero_image_url || "",
        hero_image_alt: data?.hero_image_alt || "",
        hero_live_demo_label: data?.hero_live_demo_label || "",
        hero_live_demo_title: data?.hero_live_demo_title || "",
        hero_live_demo_cta: data?.hero_live_demo_cta || "",
        hero_live_demo_href: data?.hero_live_demo_href || "",
        story_image_url: data?.story_image_url || "",
        story_image_alt: data?.story_image_alt || "",
        about_hero_image_url: data?.about_hero_image_url || "",
        about_hero_image_alt: data?.about_hero_image_alt || "",
        banner_active: data?.banner_active ?? true,
        banner_badge: data?.banner_badge || "",
        banner_title_line1: data?.banner_title_line1 || "",
        banner_title_line2: data?.banner_title_line2 || "",
        banner_description: data?.banner_description || "",
        banner_button_text: data?.banner_button_text || "",
        banner_image_url: data?.banner_image_url || "",
        banner_image_alt: data?.banner_image_alt || "",
        banner_image_caption: data?.banner_image_caption || "",
        banner_whatsapp_message: data?.banner_whatsapp_message || "",
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
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="text-sm text-[#a1a1a6]">
          Manages editable images and text on the home page — the hero product tile and the &ldquo;Our story&rdquo; section. Update anytime, changes go live within a minute.
        </p>
      </div>

      {/* HERO card */}
      <div className="dc-tile p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">Hero tile</p>
            <p className="text-sm text-white font-semibold mt-1">Right-side product image + &ldquo;Live demo&rdquo; chip</p>
          </div>
        </div>

        <FormRow label="Hero image">
          <ImageInput
            testIdPrefix="site-hero-image"
            value={form.hero_image_url}
            onChange={(v) => setForm({ ...form, hero_image_url: v })}
            placeholder="https://…/hero.jpg"
            showToast={showToast}
            aspect="aspect-[4/5]"
          />
          <p className="text-[11px] text-[#6e6e73] mt-1.5">Rendered at 4:5 aspect on the home hero. Paste a URL or upload directly.</p>
        </FormRow>

        <FormRow label="Hero image alt text (SEO / accessibility)">
          <input
            data-testid="site-hero-image-alt"
            value={form.hero_image_alt}
            onChange={(e) => setForm({ ...form, hero_image_alt: e.target.value })}
            placeholder="e.g., Galaxy S25 Ultra on display at DigiConnect"
            className="dc-input"
          />
        </FormRow>

        <div className="h-px bg-white/10" />

        <FormRow label="Chip overline (small caps text)">
          <input
            data-testid="site-hero-label"
            value={form.hero_live_demo_label}
            onChange={(e) => setForm({ ...form, hero_live_demo_label: e.target.value })}
            placeholder="e.g., Live demo"
            className="dc-input"
          />
        </FormRow>

        <FormRow label="Chip main line">
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
      </div>

      {/* STORY card */}
      <div className="dc-tile p-6 md:p-8 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">Our story</p>
          <p className="text-sm text-white font-semibold mt-1">Store photo on the home &ldquo;Our story&rdquo; section</p>
        </div>

        <FormRow label="Story image">
          <ImageInput
            testIdPrefix="site-story-image"
            value={form.story_image_url}
            onChange={(v) => setForm({ ...form, story_image_url: v })}
            placeholder="https://…/store-photo.jpg"
            showToast={showToast}
            aspect="aspect-[4/5]"
          />
          <p className="text-[11px] text-[#6e6e73] mt-1.5">Portrait 4:5 works best — a real photo of your storefront or interior lands stronger than stock.</p>
        </FormRow>

        <FormRow label="Story image alt text (SEO / accessibility)">
          <input
            data-testid="site-story-image-alt"
            value={form.story_image_alt}
            onChange={(e) => setForm({ ...form, story_image_alt: e.target.value })}
            placeholder="e.g., DigiConnect Samsung Experience Store at Gaur City Mall"
            className="dc-input"
          />
        </FormRow>
      </div>

      {/* ABOUT HERO card */}
      <div className="dc-tile p-6 md:p-8 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">About page hero</p>
          <p className="text-sm text-white font-semibold mt-1">Optional photo shown next to the &ldquo;Where technology, meets people.&rdquo; heading</p>
        </div>

        <FormRow label="About hero image (optional)">
          <ImageInput
            testIdPrefix="site-about-hero-image"
            value={form.about_hero_image_url}
            onChange={(v) => setForm({ ...form, about_hero_image_url: v })}
            placeholder="https://…/team-photo.jpg"
            showToast={showToast}
            aspect="aspect-[4/5]"
          />
          <p className="text-[11px] text-[#6e6e73] mt-1.5">Portrait 4:5 works best. Leave empty to hide the image column and center the heading.</p>
        </FormRow>

        <FormRow label="About hero image alt text (SEO / accessibility)">
          <input
            data-testid="site-about-hero-image-alt"
            value={form.about_hero_image_alt}
            onChange={(e) => setForm({ ...form, about_hero_image_alt: e.target.value })}
            placeholder="e.g., DigiConnect team at the Samsung Experience Store"
            className="dc-input"
          />
        </FormRow>
      </div>

      {/* BANNER card (Pre-reserve / Coming soon) */}
      <div className="dc-tile p-6 md:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">Pre-reserve banner</p>
            <p className="text-sm text-white font-semibold mt-1">The big &ldquo;Coming soon · Pre-reserve&rdquo; banner below the hero</p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              data-testid="site-banner-active"
              checked={!!form.banner_active}
              onChange={(e) => setForm({ ...form, banner_active: e.target.checked })}
              className="h-4 w-4 accent-[#ff2d7a]"
            />
            <span className="text-xs text-white font-semibold">{form.banner_active ? "Visible" : "Hidden"}</span>
          </label>
        </div>

        <FormRow label="Small badge (pink pill)">
          <input
            data-testid="site-banner-badge"
            value={form.banner_badge}
            onChange={(e) => setForm({ ...form, banner_badge: e.target.value })}
            placeholder="e.g., Coming soon · Pre-reserve"
            className="dc-input"
          />
        </FormRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="Title — line 1">
            <input
              data-testid="site-banner-title1"
              value={form.banner_title_line1}
              onChange={(e) => setForm({ ...form, banner_title_line1: e.target.value })}
              placeholder="e.g., Galaxy Z Fold8."
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Title — line 2">
            <input
              data-testid="site-banner-title2"
              value={form.banner_title_line2}
              onChange={(e) => setForm({ ...form, banner_title_line2: e.target.value })}
              placeholder="e.g., Be first in line."
              className="dc-input"
            />
          </FormRow>
        </div>

        <FormRow label="Description paragraph">
          <textarea
            data-testid="site-banner-description"
            value={form.banner_description}
            onChange={(e) => setForm({ ...form, banner_description: e.target.value })}
            rows={3}
            placeholder="e.g., India's most anticipated foldable is landing at DigiConnect…"
            className="dc-input resize-none"
          />
        </FormRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="Button text (prefix)">
            <input
              data-testid="site-banner-button"
              value={form.banner_button_text}
              onChange={(e) => setForm({ ...form, banner_button_text: e.target.value })}
              placeholder="e.g., Reserve"
              className="dc-input"
            />
            <p className="text-[11px] text-[#6e6e73] mt-1.5">Shown as &ldquo;{form.banner_button_text || "Reserve"} · Gaur City&rdquo; on each store button.</p>
          </FormRow>
          <FormRow label="WhatsApp pre-filled message">
            <input
              data-testid="site-banner-wa-message"
              value={form.banner_whatsapp_message}
              onChange={(e) => setForm({ ...form, banner_whatsapp_message: e.target.value })}
              placeholder="e.g., Hi DigiConnect, I'd like to pre-reserve…"
              className="dc-input"
            />
          </FormRow>
        </div>

        <div className="h-px bg-white/10" />

        <FormRow label="Banner image">
          <ImageInput
            testIdPrefix="site-banner-image"
            value={form.banner_image_url}
            onChange={(v) => setForm({ ...form, banner_image_url: v })}
            placeholder="https://…/product.jpg"
            showToast={showToast}
            aspect="aspect-[3/4]"
          />
        </FormRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="Banner image alt text">
            <input
              data-testid="site-banner-image-alt"
              value={form.banner_image_alt}
              onChange={(e) => setForm({ ...form, banner_image_alt: e.target.value })}
              placeholder="e.g., Galaxy Z Fold concept"
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Image caption (small text over image)">
            <input
              data-testid="site-banner-image-caption"
              value={form.banner_image_caption}
              onChange={(e) => setForm({ ...form, banner_image_caption: e.target.value })}
              placeholder="e.g., Concept · Actual product may vary"
              className="dc-input"
            />
          </FormRow>
        </div>
      </div>

      {/* SAVE */}
      <div>
        <button
          data-testid="site-hero-save"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#ff2d7a] text-white hover:bg-[#e91764] disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* PREVIEWS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#6e6e73] font-bold mb-3">Hero preview</p>
          <div className="relative aspect-[4/5] w-full max-w-[240px] rounded-2xl overflow-hidden bg-[#0d0d0f] border border-white/10">
            {form.hero_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(form.hero_image_url)}
                alt={form.hero_image_alt || "Hero preview"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] text-[#6e6e73]">No image URL yet</div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#050505]/95 backdrop-blur rounded-xl px-3 py-2">
              <div className="min-w-0 pr-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#6e6e73] font-semibold truncate">{form.hero_live_demo_label || "Live demo"}</p>
                <p className="text-[11px] font-semibold text-white truncate">{form.hero_live_demo_title || "Galaxy Z Fold — feel the fold in person."}</p>
              </div>
              <span className="text-[10px] font-semibold text-white whitespace-nowrap">
                {form.hero_live_demo_cta || "Visit"} →
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#6e6e73] font-bold mb-3">Story preview</p>
          <div className="relative aspect-[4/5] w-full max-w-[240px] rounded-2xl overflow-hidden bg-[#0d0d0f] border border-white/10">
            {form.story_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(form.story_image_url)}
                alt={form.story_image_alt || "Story preview"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] text-[#6e6e73]">No image URL yet</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#ff2d7a] font-bold">Est. 2021</p>
              <p className="text-[11px] font-bold text-white mt-0.5">Greater Noida flagship</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
