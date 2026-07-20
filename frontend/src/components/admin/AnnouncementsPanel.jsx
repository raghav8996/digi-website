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

const empty = { message: "", is_active: true, order: 0 };

export default function AnnouncementsPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState(empty);
  const { confirm, dialog } = useConfirm();

  const startNew = () => {
    setDraft("new");
    setForm({ ...empty, order: items.length });
  };
  const startEdit = (a) => {
    setDraft(a.id);
    setForm({ ...a });
  };
  const cancel = () => {
    setDraft(null);
    setForm(empty);
  };
  const save = async () => {
    if (!form.message) {
      showToast("Message is required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/announcements", form);
        showToast("Announcement created");
      } else {
        await api.patch(`/announcements/${draft}`, form);
        showToast("Announcement updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };
  const remove = async (a) => {
    const ok = await confirm({
      title: "Delete announcement?",
      description: `“${a.message}” will no longer appear on the site.`,
      confirmLabel: "Delete announcement",
    });
    if (!ok) return;
    try {
      await api.delete(`/announcements/${a.id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };
  const toggleActive = async (a) => {
    try {
      await api.patch(`/announcements/${a.id}`, { is_active: !a.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <PanelHead
        label={`${items.length} announcement${items.length === 1 ? "" : "s"}`}
        onAdd={startNew}
        addTestId="add-announcement-btn"
        addLabel="Add announcement"
      />
      {draft && (
        <FormPanel testIdPrefix="ann-form" onCancel={cancel} onSave={save}>
          <FormRow label="Message">
            <input
              data-testid="ann-form-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Order">
              <input
                data-testid="ann-form-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="dc-input"
              />
            </FormRow>
            <FormRow label="Active">
              <ActiveToggle
                testId="ann-form-active"
                value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </FormRow>
          </div>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 gap-3 mt-6">
        {items.map((a) => (
          <div
            key={a.id}
            data-testid={`admin-ann-${a.id}`}
            className="dc-tile p-5 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{a.message}</p>
              <p className="text-xs text-[#6e6e73] mt-1">Order: {a.order}</p>
            </div>
            <StatusPill active={a.is_active} />
            <div className="flex gap-2">
              <IconBtn testId={`edit-ann-${a.id}`} onClick={() => startEdit(a)}>
                <Edit3 size={12} />
              </IconBtn>
              <IconBtn testId={`toggle-ann-${a.id}`} onClick={() => toggleActive(a)}>
                {a.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
              </IconBtn>
              <IconBtn testId={`delete-ann-${a.id}`} onClick={() => remove(a)} danger>
                <Trash2 size={12} />
              </IconBtn>
            </div>
          </div>
        ))}
        {!items.length && <EmptyState label="No announcements yet." />}
      </div>
      {dialog}
    </div>
  );
}
