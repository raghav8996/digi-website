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

const empty = { image_url: "", caption: "", post_url: "", is_active: true, order: 0 };

export default function InstagramPanel({ items, reload, showToast }) {
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
    if (!form.image_url) {
      showToast("Image URL is required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/instagram-posts", form);
        showToast("Post added");
      } else {
        await api.patch(`/instagram-posts/${draft}`, form);
        showToast("Post updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const remove = async (p) => {
    const ok = await confirm({
      title: "Delete Instagram post?",
      description: "This tile will no longer appear in the Instagram grid.",
      confirmLabel: "Delete post",
    });
    if (!ok) return;
    try {
      await api.delete(`/instagram-posts/${p.id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const toggleActive = async (p) => {
    try {
      await api.patch(`/instagram-posts/${p.id}`, { is_active: !p.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <div className="mb-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-xs text-white/60">
        Tip: to switch to a live auto-updating feed, create a LightWidget at{" "}
        <a
          href="https://lightwidget.com"
          target="_blank"
          rel="noreferrer"
          className="text-[#ff007f] hover:underline"
        >
          lightwidget.com
        </a>{" "}
        and paste the widget ID into <code className="text-white/80">NEXT_PUBLIC_LIGHTWIDGET_ID</code>{" "}
        in <code className="text-white/80">/app/frontend/.env</code>. When set, it overrides these
        posts.
      </div>
      <PanelHead
        label={`${items.length} post${items.length === 1 ? "" : "s"}`}
        onAdd={startNew}
        addTestId="add-ig-post-btn"
        addLabel="Add post"
      />
      {draft && (
        <FormPanel testIdPrefix="ig-form" onCancel={cancel} onSave={save}>
          <FormRow label="Image URL">
            <input
              data-testid="ig-form-image"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="dc-input"
              placeholder="https://…"
            />
          </FormRow>
          <FormRow label="Caption">
            <textarea
              data-testid="ig-form-caption"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="dc-input min-h-[80px]"
            />
          </FormRow>
          <FormRow label="Post URL (link to the actual IG post)">
            <input
              data-testid="ig-form-post-url"
              value={form.post_url}
              onChange={(e) => setForm({ ...form, post_url: e.target.value })}
              className="dc-input"
              placeholder="https://www.instagram.com/p/…"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Order">
              <input
                data-testid="ig-form-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
            <FormRow label="Active">
              <ActiveToggle
                testId="ig-form-active"
                value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </FormRow>
          </div>
        </FormPanel>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {items.map((p) => (
          <div key={p.id} data-testid={`admin-ig-${p.id}`} className="dc-tile overflow-hidden">
            <div className="aspect-square bg-black">
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.caption} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-white/80 line-clamp-2 leading-snug">
                  {p.caption || <span className="text-white/40">No caption</span>}
                </p>
                <StatusPill active={p.is_active} />
              </div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                <IconBtn testId={`edit-ig-${p.id}`} onClick={() => startEdit(p)}>
                  <Edit3 size={11} />
                </IconBtn>
                <IconBtn testId={`toggle-ig-${p.id}`} onClick={() => toggleActive(p)}>
                  {p.is_active ? <EyeOff size={11} /> : <Eye size={11} />}
                </IconBtn>
                <IconBtn testId={`delete-ig-${p.id}`} onClick={() => remove(p)} danger>
                  <Trash2 size={11} />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <EmptyState label="No Instagram posts yet." />}
      </div>
      {dialog}
    </div>
  );
}
