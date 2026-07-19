"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function AlertDialog({
  open,
  title = "Are you sure?",
  description = "",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
  testId = "alert-dialog",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") onConfirm?.();
    };
    window.addEventListener("keydown", onKey);
    // Lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      data-testid={testId}
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${testId}-title`}
    >
      <div
        data-testid={`${testId}-backdrop`}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7 dc-reveal">
        <button
          data-testid={`${testId}-close`}
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/40 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
              danger
                ? "bg-red-500/12 border border-red-500/30 text-red-400"
                : "bg-[#ff007f]/15 border border-[#ff007f]/30 text-[#ff007f]"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0">
            <h3
              id={`${testId}-title`}
              className="font-display text-xl font-black text-white leading-tight"
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-white/60 mt-2 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            data-testid={`${testId}-cancel`}
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            data-testid={`${testId}-confirm`}
            onClick={onConfirm}
            autoFocus
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-[#ff007f] hover:bg-[#e60073]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Convenience hook for AlertDialog:
 *   const { confirm, dialog } = useConfirm();
 *   render { dialog } once; then: if (await confirm({ title, description })) { ... }
 */
export function useConfirm() {
  const [state, setState] = useState({ open: false, options: {}, resolver: null });

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolver: resolve });
    });
  }, []);

  const handle = (result) => {
    state.resolver?.(result);
    setState({ open: false, options: {}, resolver: null });
  };

  const dialog = (
    <AlertDialog
      open={state.open}
      {...state.options}
      onConfirm={() => handle(true)}
      onCancel={() => handle(false)}
    />
  );

  return { confirm, dialog };
}
