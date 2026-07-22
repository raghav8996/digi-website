"use client";

import { useRef, useState } from "react";
import { Link2, Upload, X, Loader2, ImageIcon } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { resolveImageUrl } from "@/lib/images";

export { resolveImageUrl };

/**
 * ImageInput — dual-mode picker: paste a URL OR upload a file.
 * Emits the final URL string via onChange.
 * The URL is either an external https link (paste mode) or a backend-served /api/files/... path (upload mode).
 */
export default function ImageInput({
  value,
  onChange,
  placeholder = "https://…/image.jpg",
  testIdPrefix = "image-input",
  showToast,
  aspect = "aspect-video", // TW aspect for preview
}) {
  const [mode, setMode] = useState("url"); // 'url' | 'upload'
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const doUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast?.("Please choose an image file (JPG, PNG, WEBP or GIF)", false);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast?.("Image is too large. Max 8 MB.", false);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, {
        // Multipart uploads over slow mobile networks can take > 30s for larger images
        timeout: 120000,
        // Let axios detect the multipart boundary itself — don't override
      });
      onChange(data.url); // e.g., "/api/files/digiconnect/uploads/<id>.png"
      showToast?.("Image uploaded");
    } catch (e) {
      // Surface the real reason so the user can diagnose (network vs auth vs server)
      // eslint-disable-next-line no-console
      console.error("Upload failed:", e);
      let msg;
      if (e?.response) {
        const status = e.response.status;
        const detail = formatApiErrorDetail(e.response.data?.detail);
        if (status === 401) msg = "Session expired. Please log in again.";
        else if (status === 413) msg = "File too large. Max 8 MB.";
        else if (status === 503) msg = "Object storage isn't configured on the backend. Set EMERGENT_LLM_KEY in the backend .env and restart.";
        else msg = `Upload failed (HTTP ${status}) — ${detail}`;
      } else if (e?.code === "ECONNABORTED") {
        msg = "Upload timed out. Try a smaller image or a stronger connection.";
      } else if (e?.message) {
        msg = `Network error: ${e.message}. Check that the backend URL is reachable and CORS is open.`;
      } else {
        msg = "Upload failed for an unknown reason. Open the browser console for details.";
      }
      showToast?.(msg, false);
    } finally {
      setUploading(false);
    }
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) doUpload(f);
    e.target.value = ""; // allow re-picking same file
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) doUpload(f);
  };

  const preview = resolveImageUrl(value);

  return (
    <div className="space-y-2">
      {/* Mode switcher */}
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10">
        <button
          type="button"
          data-testid={`${testIdPrefix}-mode-url`}
          onClick={() => setMode("url")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
            mode === "url" ? "bg-[#ff2d7a] text-white" : "text-[#a1a1a6] hover:text-white"
          }`}
        >
          <Link2 size={12} /> URL
        </button>
        <button
          type="button"
          data-testid={`${testIdPrefix}-mode-upload`}
          onClick={() => setMode("upload")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
            mode === "upload" ? "bg-[#ff2d7a] text-white" : "text-[#a1a1a6] hover:text-white"
          }`}
        >
          <Upload size={12} /> Upload
        </button>
      </div>

      {/* Input area */}
      {mode === "url" ? (
        <input
          type="text"
          data-testid={`${testIdPrefix}-url`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="dc-input"
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`relative rounded-xl border-2 border-dashed transition-colors p-6 text-center ${
            dragOver ? "border-[#ff2d7a] bg-[#ff2d7a]/5" : "border-white/15 bg-white/[0.02]"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            data-testid={`${testIdPrefix}-file`}
            onChange={onPick}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 size={22} className="animate-spin text-[#ff2d7a]" />
              <p className="text-xs font-semibold">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#ff2d7a]/15 border border-[#ff2d7a]/30 flex items-center justify-center text-[#ff2d7a]">
                <ImageIcon size={18} />
              </div>
              <p className="text-xs text-white font-semibold">Drag &amp; drop or</p>
              <button
                type="button"
                data-testid={`${testIdPrefix}-choose`}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold bg-[#ff2d7a] text-white hover:bg-[#e91764]"
              >
                <Upload size={12} /> Choose file
              </button>
              <p className="text-[10px] text-[#6e6e73] mt-1">JPG, PNG, WEBP or GIF · Max 8 MB</p>
            </div>
          )}
        </div>
      )}

      {/* Preview + clear */}
      {value ? (
        <div className="flex items-center gap-3 pt-1">
          <div className={`relative w-24 shrink-0 ${aspect} rounded-lg overflow-hidden bg-black border border-white/10`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              data-testid={`${testIdPrefix}-preview`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#6e6e73] uppercase tracking-widest font-bold">Current image</p>
            <p className="text-[11px] text-white/80 truncate mt-0.5" title={value}>{value}</p>
          </div>
          <button
            type="button"
            data-testid={`${testIdPrefix}-clear`}
            onClick={() => onChange("")}
            className="text-[10px] font-bold text-[#a1a1a6] hover:text-white inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10"
            title="Clear image"
          >
            <X size={12} /> Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}
