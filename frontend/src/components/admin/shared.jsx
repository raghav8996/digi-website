"use client";

import { Plus, Save, X, Trash2, Edit3, Eye, EyeOff } from "lucide-react";

export function PanelHead({ label, onAdd, addTestId, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <p className="text-sm text-white/60">{label}</p>
      <button
        data-testid={addTestId}
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073]"
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
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073]"
        >
          <Save size={14} /> Save
        </button>
        <button
          data-testid={`${testIdPrefix}-cancel`}
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1]"
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
      <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-1.5">
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
          : "border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
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
        active ? "bg-[#ff007f]/20 text-[#ff007f]" : "bg-white/10 text-white/60"
      }`}
    >
      {active ? "LIVE" : "HIDDEN"}
    </span>
  );
}

export function EmptyState({ label }) {
  return <div className="col-span-full text-center text-white/40 py-14 text-sm">{label}</div>;
}

export const ActiveToggle = ({ value, onChange, testId }) => (
  <button
    data-testid={testId}
    type="button"
    onClick={() => onChange(!value)}
    className={`px-4 py-2 rounded-full text-sm font-bold ${
      value ? "bg-[#ff007f] text-white" : "bg-white/[0.06] text-white/70"
    }`}
  >
    {value ? "Active" : "Hidden"}
  </button>
);

// Re-export icons used across panels for convenience
export { Trash2, Edit3, Eye, EyeOff };
