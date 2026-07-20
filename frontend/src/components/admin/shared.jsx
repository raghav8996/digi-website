"use client";

import { Plus, Save, X, Trash2, Edit3, Eye, EyeOff } from "lucide-react";

export function PanelHead({ label, onAdd, addTestId, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <p className="text-sm text-[#4a4a55]">{label}</p>
      <button
        data-testid={addTestId}
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-[#7a1b2e] text-white hover:bg-[#5f1524]"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export function FormPanel({ children, onCancel, onSave, testIdPrefix }) {
  return (
    <div data-testid={testIdPrefix} className="dc-tile p-6 md:p-8 space-y-4">
      {children}
      <div className="flex gap-2 pt-2">
        <button
          data-testid={`${testIdPrefix}-save`}
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#7a1b2e] text-white hover:bg-[#5f1524]"
        >
          <Save size={14} /> Save
        </button>
        <button
          data-testid={`${testIdPrefix}-cancel`}
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-black/[0.05] border border-black/8 text-[#0f0f11] hover:bg-black/[0.08]"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}

export function FormRow({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-[#83838f] font-bold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function IconBtn({ children, onClick, danger, testId }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
        danger
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : "border-black/8 text-[#0f0f11]/70 hover:text-[#0f0f11] hover:bg-black/[0.05]"
      }`}
    >
      {children}
    </button>
  );
}

export function StatusPill({ active }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
        active ? "bg-[#7a1b2e]/20 text-[#7a1b2e]" : "bg-black/10 text-[#4a4a55]"
      }`}
    >
      {active ? "LIVE" : "HIDDEN"}
    </span>
  );
}

export function EmptyState({ label }) {
  return <div className="col-span-full text-center text-[#83838f]/80 py-14 text-sm">{label}</div>;
}

export const ActiveToggle = ({ value, onChange, testId }) => (
  <button
    data-testid={testId}
    type="button"
    onClick={() => onChange(!value)}
    className={`px-4 py-2 rounded-full text-sm font-bold ${
      value ? "bg-[#7a1b2e] text-white" : "bg-black/[0.05] text-[#0f0f11]/70"
    }`}
  >
    {value ? "Active" : "Hidden"}
  </button>
);

// Re-export icons used across panels for convenience
export { Trash2, Edit3, Eye, EyeOff };
