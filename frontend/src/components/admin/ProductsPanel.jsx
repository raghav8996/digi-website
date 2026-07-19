"use client";

import { useState } from "react";
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
  name: "",
  category: "",
  price: "",
  image_url: "",
  highlight: "",
  is_active: true,
  order: 0,
};

export default function ProductsPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState(empty);
  const { confirm, dialog } = useConfirm();

  const startNew = () => {
    setDraft("new");
    setForm({ ...empty, order: items.length });
  };
  const startEdit = (p) => {
    setDraft(p.id);
    setForm({ ...p });
  };
  const cancel = () => {
    setDraft(null);
    setForm(empty);
  };

  const save = async () => {
    if (!form.name || !form.category) {
      showToast("Name & category required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/products", form);
        showToast("Product created");
      } else {
        await api.patch(`/products/${draft}`, form);
        showToast("Product updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const remove = async (p) => {
    const ok = await confirm({
      title: "Delete product?",
      description: `“${p.name}” will be permanently removed from the storefront.`,
      confirmLabel: "Delete product",
    });
    if (!ok) return;
    try {
      await api.delete(`/products/${p.id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const toggleActive = async (p) => {
    try {
      await api.patch(`/products/${p.id}`, { is_active: !p.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <PanelHead
        label={`${items.length} product${items.length === 1 ? "" : "s"}`}
        onAdd={startNew}
        addTestId="add-product-btn"
        addLabel="Add product"
      />
      {draft && (
        <FormPanel testIdPrefix="product-form" onCancel={cancel} onSave={save}>
          <FormRow label="Name">
            <input
              data-testid="product-form-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Category">
            <input
              data-testid="product-form-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="dc-input"
              placeholder="Smartphone / Wearable / Audio / Tablet / Foldable"
            />
          </FormRow>
          <FormRow label="Price (display text)">
            <input
              data-testid="product-form-price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="dc-input"
              placeholder="From ₹79,999"
            />
          </FormRow>
          <FormRow label="Image URL">
            <input
              data-testid="product-form-image"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="dc-input"
              placeholder="https://…"
            />
          </FormRow>
          <FormRow label="Highlight / tagline">
            <input
              data-testid="product-form-highlight"
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Order">
              <input
                data-testid="product-form-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
            <FormRow label="Active">
              <ActiveToggle
                testId="product-form-active"
                value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </FormRow>
          </div>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((p) => (
          <div key={p.id} data-testid={`admin-product-${p.id}`} className="dc-tile p-5 flex gap-4">
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-black/60 shrink-0">
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff007f] font-bold">
                    {p.category}
                  </p>
                  <p className="font-display font-bold truncate">{p.name}</p>
                  <p className="text-xs text-white/50 truncate">{p.highlight}</p>
                </div>
                <StatusPill active={p.is_active} />
              </div>
              <div className="mt-3 flex gap-2">
                <IconBtn testId={`edit-product-${p.id}`} onClick={() => startEdit(p)}>
                  <Edit3 size={12} /> Edit
                </IconBtn>
                <IconBtn testId={`toggle-product-${p.id}`} onClick={() => toggleActive(p)}>
                  {p.is_active ? <EyeOff size={12} /> : <Eye size={12} />}{" "}
                  {p.is_active ? "Hide" : "Show"}
                </IconBtn>
                <IconBtn testId={`delete-product-${p.id}`} onClick={() => remove(p)} danger>
                  <Trash2 size={12} /> Delete
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <EmptyState label="No products yet." />}
      </div>
      {dialog}
    </div>
  );
}
