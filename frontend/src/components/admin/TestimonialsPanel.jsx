"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import {
  PanelHead,
  FormPanel,
  FormRow,
  IconBtn,
  StatusPill,
  EmptyState,
  ActiveToggle,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
} from "@/components/admin/shared";
import { useConfirm } from "@/components/AlertDialog";

const empty = {
  author: "",
  rating: 5,
  text: "",
  store: "both",
  source: "Google",
  date: "",
  avatar_url: "",
  is_active: true,
  order: 0,
};

export default function TestimonialsPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState(empty);
  const { confirm, dialog } = useConfirm();

  const startNew = () => {
    setDraft("new");
    setForm({ ...empty, order: items.length });
  };
  const startEdit = (t) => {
    setDraft(t.id);
    setForm({ ...t });
  };
  const cancel = () => {
    setDraft(null);
    setForm(empty);
  };

  const save = async () => {
    if (!form.author || !form.text) {
      showToast("Author & review text are required", false);
      return;
    }
    const payload = { ...form, rating: Math.max(1, Math.min(5, Number(form.rating) || 5)) };
    try {
      if (draft === "new") {
        await api.post("/testimonials", payload);
        showToast("Review added");
      } else {
        await api.patch(`/testimonials/${draft}`, payload);
        showToast("Review updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const remove = async (t) => {
    const ok = await confirm({
      title: "Delete review?",
      description: `${t.author}'s review will be removed from the site.`,
      confirmLabel: "Delete review",
    });
    if (!ok) return;
    try {
      await api.delete(`/testimonials/${t.id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const toggleActive = async (t) => {
    try {
      await api.patch(`/testimonials/${t.id}`, { is_active: !t.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <PanelHead
        label={`${items.length} review${items.length === 1 ? "" : "s"}`}
        onAdd={startNew}
        addTestId="add-testimonial-btn"
        addLabel="Add review"
      />
      {draft && (
        <FormPanel testIdPrefix="testimonial-form" onCancel={cancel} onSave={save}>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Author">
              <input
                data-testid="testimonial-form-author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="dc-input"
                placeholder="e.g., Rohan Sharma"
              />
            </FormRow>
            <FormRow label="Rating (1-5)">
              <input
                data-testid="testimonial-form-rating"
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
          </div>
          <FormRow label="Review text">
            <textarea
              data-testid="testimonial-form-text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="dc-input min-h-[110px]"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Store">
              <select
                data-testid="testimonial-form-store"
                value={form.store}
                onChange={(e) => setForm({ ...form, store: e.target.value })}
                className="dc-input"
              >
                <option value="both">Both stores</option>
                <option value="gaur-city">Gaur City Mall</option>
                <option value="grand-venice">Grand Venice Mall</option>
              </select>
            </FormRow>
            <FormRow label="Source">
              <input
                data-testid="testimonial-form-source"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="dc-input"
                placeholder="Google / Instagram / Walk-in"
              />
            </FormRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Date (display)">
              <input
                data-testid="testimonial-form-date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="dc-input"
                placeholder="Nov 2025"
              />
            </FormRow>
            <FormRow label="Avatar URL (optional)">
              <input
                data-testid="testimonial-form-avatar"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="dc-input"
                placeholder="https://…"
              />
            </FormRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Order">
              <input
                data-testid="testimonial-form-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
            <FormRow label="Active">
              <ActiveToggle
                testId="testimonial-form-active"
                value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </FormRow>
          </div>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((t) => (
          <div
            key={t.id}
            data-testid={`admin-testimonial-${t.id}`}
            className="dc-tile p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display font-bold truncate">{t.author}</p>
                <p className="text-xs text-white/50">
                  {t.store === "both"
                    ? "Both stores"
                    : t.store === "gaur-city"
                      ? "Gaur City"
                      : "Grand Venice"}{" "}
                  · {t.source}
                  {t.date ? ` · ${t.date}` : ""}
                </p>
              </div>
              <StatusPill active={t.is_active} />
            </div>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`${t.id}-star-${i}`}
                  size={11}
                  className={i < t.rating ? "fill-[#ff007f] text-[#ff007f]" : "text-white/20"}
                />
              ))}
            </div>
            <p className="text-xs text-white/70 mt-3 leading-relaxed line-clamp-3">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <IconBtn testId={`edit-testimonial-${t.id}`} onClick={() => startEdit(t)}>
                <Edit3 size={12} /> Edit
              </IconBtn>
              <IconBtn testId={`toggle-testimonial-${t.id}`} onClick={() => toggleActive(t)}>
                {t.is_active ? <EyeOff size={12} /> : <Eye size={12} />}{" "}
                {t.is_active ? "Hide" : "Show"}
              </IconBtn>
              <IconBtn testId={`delete-testimonial-${t.id}`} onClick={() => remove(t)} danger>
                <Trash2 size={12} /> Delete
              </IconBtn>
            </div>
          </div>
        ))}
        {!items.length && <EmptyState label="No reviews yet." />}
      </div>
      {dialog}
    </div>
  );
}
