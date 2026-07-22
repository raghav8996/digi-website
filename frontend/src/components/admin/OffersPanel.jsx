"use client";

import { useState } from "react";
import api, { formatApiErrorDetail } from "@/lib/api";
import ImageInput, { resolveImageUrl } from "@/components/admin/ImageInput";
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
  title: "",
  description: "",
  valid_until: "",
  image_url: "",
  store: "both",
  tag: "",
  is_active: true,
  order: 0,
};

export default function OffersPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState(empty);
  const { confirm, dialog } = useConfirm();

  const startNew = () => {
    setDraft("new");
    setForm({ ...empty, order: items.length });
  };
  const startEdit = (o) => {
    setDraft(o.id);
    setForm({ ...o });
  };
  const cancel = () => {
    setDraft(null);
    setForm(empty);
  };

  const save = async () => {
    if (!form.title) {
      showToast("Title is required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/offers", form);
        showToast("Offer created");
      } else {
        await api.patch(`/offers/${draft}`, form);
        showToast("Offer updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const remove = async (o) => {
    const ok = await confirm({
      title: "Delete offer?",
      description: `“${o.title}” will no longer appear on the site.`,
      confirmLabel: "Delete offer",
    });
    if (!ok) return;
    try {
      await api.delete(`/offers/${o.id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const toggleActive = async (o) => {
    try {
      await api.patch(`/offers/${o.id}`, { is_active: !o.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <PanelHead
        label={`${items.length} offer${items.length === 1 ? "" : "s"}`}
        onAdd={startNew}
        addTestId="add-offer-btn"
        addLabel="Add offer"
      />
      {draft && (
        <FormPanel testIdPrefix="offer-form" onCancel={cancel} onSave={save}>
          <FormRow label="Title">
            <input
              data-testid="offer-form-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Tag (badge)">
            <input
              data-testid="offer-form-tag"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="dc-input"
              placeholder="Limited time · In-store only"
            />
          </FormRow>
          <FormRow label="Description">
            <textarea
              data-testid="offer-form-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="dc-input min-h-[90px]"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Valid until">
              <input
                data-testid="offer-form-valid"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                className="dc-input"
                placeholder="e.g., 31 Mar 2026"
              />
            </FormRow>
            <FormRow label="Store">
              <select
                data-testid="offer-form-store"
                value={form.store}
                onChange={(e) => setForm({ ...form, store: e.target.value })}
                className="dc-input"
              >
                <option value="both">Both stores</option>
                <option value="gaur-city">Gaur City Mall</option>
                <option value="grand-venice">Grand Venice Mall</option>
              </select>
            </FormRow>
          </div>
          <FormRow label="Offer image">
            <ImageInput
              testIdPrefix="offer-form-image"
              value={form.image_url}
              onChange={(v) => setForm({ ...form, image_url: v })}
              placeholder="https://…"
              showToast={showToast}
              aspect="aspect-video"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Order">
              <input
                data-testid="offer-form-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
            <FormRow label="Active">
              <ActiveToggle
                testId="offer-form-active"
                value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </FormRow>
          </div>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((o) => (
          <div key={o.id} data-testid={`admin-offer-${o.id}`} className="dc-tile p-5 flex gap-4">
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-black/60 shrink-0">
              {o.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveImageUrl(o.image_url)} alt={o.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {o.tag && (
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d7a] font-bold">
                      {o.tag}
                    </p>
                  )}
                  <p className="font-display font-bold truncate">{o.title}</p>
                  <p className="text-xs text-[#6e6e73] truncate">{o.description}</p>
                </div>
                <StatusPill active={o.is_active} />
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <IconBtn testId={`edit-offer-${o.id}`} onClick={() => startEdit(o)}>
                  <Edit3 size={12} /> Edit
                </IconBtn>
                <IconBtn testId={`toggle-offer-${o.id}`} onClick={() => toggleActive(o)}>
                  {o.is_active ? <EyeOff size={12} /> : <Eye size={12} />}{" "}
                  {o.is_active ? "Hide" : "Show"}
                </IconBtn>
                <IconBtn testId={`delete-offer-${o.id}`} onClick={() => remove(o)} danger>
                  <Trash2 size={12} /> Delete
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <EmptyState label="No offers yet." />}
      </div>
      {dialog}
    </div>
  );
}
