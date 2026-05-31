"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const AUTH_KEY = "abq_portal_auth";
const VALID_USER = "Alireza";
const VALID_PASS = "6272140";

const supabase = createClient(
  "https://dobakloaicmugeifdhpp.supabase.co",
  "sb_publishable_rm3aseepmsO7xtzdMaIWKA_A9tow5KM"
);
const BUCKET = "my files";

interface FileItem {
  name: string;
  id: string;
  updated_at: string;
  metadata: { size: number; mimetype: string };
}

function formatSize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileIcon(mime: string) {
  if (mime?.startsWith("image/")) return "🖼️";
  if (mime === "application/pdf") return "📄";
  if (mime?.startsWith("text/")) return "📝";
  if (mime?.includes("word")) return "📝";
  if (mime?.includes("excel") || mime?.includes("sheet")) return "📊";
  return "📎";
}

function fileType(name: string, mime: string): string {
  // Get extension from filename first (most reliable)
  const ext = name?.split(".").pop()?.toUpperCase();
  if (ext && ext.length <= 5) return ext;
  // Fallback to mime
  if (mime?.startsWith("image/")) return mime.split("/")[1]?.toUpperCase() || "IMG";
  if (mime === "application/pdf") return "PDF";
  if (mime?.startsWith("text/")) return "TXT";
  return "FILE";
}

// ─── Login ────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (username === VALID_USER && password === VALID_PASS) {
      localStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, rgba(74,144,217,0.08) 0%, transparent 60%), #060e1c",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[380px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 mb-5"
            style={{ backgroundColor: "rgba(74,144,217,0.12)", border: "1px solid rgba(74,144,217,0.2)" }}
          >
            <span className="text-[10px] font-black tracking-widest" style={{ color: "#4a90d9" }}>ABQ</span>
          </div>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">Portal Login</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(245,240,234,0.38)" }}>
            ABQ ALSYF · Private Access
          </p>
        </div>

        {/* Form */}
        <div
          className="p-8"
          style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Username
              </label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username" autoComplete="username" required
                className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                style={{ borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "#4a90d9"}
                onBlur={(e) => e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" required
                className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                style={{ borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "#4a90d9"}
                onBlur={(e) => e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-[12px] text-center" style={{ color: "#f87171" }}>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 font-bold text-sm text-white tracking-wide transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: "#4a90d9" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3a7fc9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a90d9")}
            >
              {loading ? "Checking..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
          ABQ ALSYF Project Management Services
        </p>
      </motion.div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────
function Dashboard({ onLogout, onBack }: { onLogout: () => void; onBack?: () => void }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("", {
      sortBy: { column: "updated_at", order: "desc" },
    });
    if (error) setError(error.message);
    else setFiles((data as FileItem[]) || []);
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadProgress(file.name);
    setError("");
    const { error } = await supabase.storage.from(BUCKET).upload(file.name, file, { upsert: true });
    if (error) setError(error.message);
    else await loadFiles();
    setUploading(false);
    setUploadProgress("");
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleDelete(name: string) {
    setDeleting(name);
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) setError(error.message);
    else setFiles((f) => f.filter((x) => x.name !== name));
    setDeleting(null);
  }

  function handleDownload(name: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
    window.open(data.publicUrl, "_blank");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 80% 10%, rgba(74,144,217,0.06) 0%, transparent 55%), #060e1c",
      }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center text-[9px] font-black"
            style={{ backgroundColor: "rgba(74,144,217,0.15)", color: "#4a90d9" }}
          >
            ABQ
          </div>
          <div>
            <span className="text-white font-bold text-sm">ABQ ALSYF</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-sm font-medium" style={{ color: "#4a90d9" }}>Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            👤 Alireza
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-1.5 text-xs font-semibold border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(239,68,68,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Page title */}
          <div className="mb-8">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-2 text-sm mb-4 transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#4a90d9"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
                ← Back to Dashboard
              </button>
            )}
            <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Projects & Files</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Upload and manage your documents, images, and PDFs.
            </p>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInput.current?.click()}
            className="mb-8 p-8 border-2 border-dashed rounded-none cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3"
            style={{
              borderColor: dragOver ? "#4a90d9" : "rgba(74,144,217,0.25)",
              backgroundColor: dragOver ? "rgba(74,144,217,0.08)" : "rgba(74,144,217,0.03)",
              minHeight: "140px",
            }}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4a90d9", borderTopColor: "transparent" }} />
                <p className="text-sm font-medium" style={{ color: "#4a90d9" }}>Uploading: {uploadProgress}</p>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(74,144,217,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Drop file here or click to browse</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>PDF, images, text, Word, Excel — up to 50 MB</p>
                </div>
              </>
            )}
          </div>
          <input ref={fileInput} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
            accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx" />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 px-4 py-3 text-sm flex items-center justify-between"
                style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                <span>{error}</span>
                <button onClick={() => setError("")} className="ml-4 opacity-60 hover:opacity-100">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File list */}
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}>
            {/* Table header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
              <span className="col-span-1" />
              <span className="col-span-6">File Name</span>
              <span className="col-span-2">Size</span>
              <span className="col-span-1">Type</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4a90d9", borderTopColor: "transparent" }} />
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading files…</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-4">📂</p>
                <p className="text-sm font-medium text-white mb-1">No files yet</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Upload your first file using the area above.</p>
              </div>
            ) : (
              <AnimatePresence>
                {files.map((file, i) => (
                  <motion.div
                    key={file.id ?? file.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="grid grid-cols-12 items-center px-5 py-3.5 border-b group transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.04)", cursor: "default" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span className="col-span-1 text-xl">{fileIcon(file.metadata?.mimetype)}</span>
                    <span className="col-span-6 text-sm text-white font-medium truncate pr-4">{file.name}</span>
                    <span className="col-span-2 text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {formatSize(file.metadata?.size)}
                    </span>
                    <span className="col-span-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 text-center"
                      style={{ backgroundColor: "rgba(74,144,217,0.1)", color: "rgba(74,144,217,0.7)" }}>
                      {fileType(file.name, file.metadata?.mimetype)}
                    </span>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => handleDownload(file.name)}
                        className="px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{ backgroundColor: "rgba(74,144,217,0.12)", color: "#4a90d9", border: "1px solid rgba(74,144,217,0.25)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(74,144,217,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(74,144,217,0.12)"; }}
                      >
                        Open
                      </button>
                      <button onClick={() => handleDelete(file.name)} disabled={deleting === file.name}
                        className="px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.2)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.18)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                      >
                        {deleting === file.name ? "…" : "Delete"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} stored
            </span>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              Supabase Storage · Free tier
            </span>
          </div>

        </motion.div>
      </main>
    </div>
  );
}

// ─── Inquiries ────────────────────────────────────────────
interface Inquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  excavation: "Excavation",
  earthwork: "Earthwork & Grading",
  transport: "Material Transport",
  multiple: "Multiple Services",
  other: "Other",
};

function InquiriesSection({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [fetchError, setFetchError] = useState("");

  async function load() {
    setLoading(true);
    setFetchError("");
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setFetchError(error.message);
    }
    setInquiries((data as Inquiry[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(74,144,217,0.06) 0%, transparent 55%), #060e1c" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-[9px] font-black" style={{ backgroundColor: "rgba(74,144,217,0.15)", color: "#4a90d9" }}>ABQ</div>
          <div>
            <span className="text-white font-bold text-sm">ABQ ALSYF</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-sm font-medium" style={{ color: "#4a90d9" }}>Inquiries</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>👤 Alireza</span>
          <button onClick={onLogout} className="px-4 py-1.5 text-xs font-semibold border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(239,68,68,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#4a90d9"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
            ← Back to Dashboard
          </button>

          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Inquiries</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Quote requests submitted via the website.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={load} className="px-3 py-1.5 text-xs font-semibold border transition-colors"
                style={{ borderColor: "rgba(74,144,217,0.3)", color: "#4a90d9" }}>
                ↻ Refresh
              </button>
              <span className="text-sm px-3 py-1.5 font-semibold" style={{ backgroundColor: "rgba(74,144,217,0.12)", color: "#4a90d9" }}>
                {inquiries.length} total
              </span>
            </div>
          </div>

          {fetchError && (
            <div className="mb-4 px-4 py-3 text-sm" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              Error: {fetchError}
            </div>
          )}

          <div style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}>
            {/* Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
              <span className="col-span-3">Name</span>
              <span className="col-span-3">Email</span>
              <span className="col-span-2">Service</span>
              <span className="col-span-3">Date</span>
              <span className="col-span-1" />
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4a90d9", borderTopColor: "transparent" }} />
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading inquiries…</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-4">📬</p>
                <p className="text-sm font-medium text-white mb-1">No inquiries yet</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Submissions from the contact form will appear here.</p>
              </div>
            ) : (
              inquiries.map((inq, i) => (
                <motion.div key={inq.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 items-center px-5 py-4 border-b transition-colors cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  onClick={() => setSelected(inq)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div className="col-span-3">
                    <p className="text-sm text-white font-medium">{inq.name}</p>
                    {inq.company && <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{inq.company}</p>}
                  </div>
                  <span className="col-span-3 text-sm truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{inq.email}</span>
                  <span className="col-span-2">
                    <span className="text-[10px] font-semibold px-2 py-1" style={{ backgroundColor: "rgba(74,144,217,0.1)", color: "#4a90d9" }}>
                      {serviceLabels[inq.service] || inq.service}
                    </span>
                  </span>
                  <span className="col-span-3 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{formatDate(inq.created_at)}</span>
                  <span className="col-span-1 text-right text-xs" style={{ color: "rgba(74,144,217,0.6)" }}>View →</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="w-full max-w-lg p-8"
              style={{ backgroundColor: "#0d1e36", border: "1px solid rgba(74,144,217,0.2)" }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-xl">{selected.name}</h2>
                  {selected.company && <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{selected.company}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-xl leading-none">✕</button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Email", value: selected.email },
                  { label: "Phone", value: selected.phone || "—" },
                  { label: "Service", value: serviceLabels[selected.service] || selected.service },
                  { label: "Date", value: formatDate(selected.created_at) },
                ].map(row => (
                  <div key={row.label} className="flex gap-4">
                    <span className="w-16 flex-shrink-0 text-[10px] font-bold tracking-wider uppercase pt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{row.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.75)" }}>{row.value}</span>
                  </div>
                ))}
                <div className="flex gap-4 pt-2">
                  <span className="w-16 flex-shrink-0 text-[10px] font-bold tracking-wider uppercase pt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Message</span>
                  <span className="leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{selected.message}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href={`mailto:${selected.email}`}
                  className="px-4 py-2 text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: "#4a90d9" }}>
                  Reply by Email
                </a>
                <button onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm font-semibold border transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
function MainDashboard({ onNavigate, onLogout }: { onNavigate: (section: string) => void; onLogout: () => void }) {
  const cards = [
    { id: "files", title: "Projects & Files", desc: "Upload and manage your documents, images, and PDFs.", icon: "📁", ready: true },
    { id: "team", title: "Team", desc: "View and update team members.", icon: "👥", ready: false },
    { id: "inquiries", title: "Inquiries", desc: "Review quote requests from the website.", icon: "📬", ready: true },
    { id: "settings", title: "Settings", desc: "Site settings and configuration.", icon: "⚙️", ready: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(74,144,217,0.06) 0%, transparent 55%), #060e1c" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-[9px] font-black" style={{ backgroundColor: "rgba(74,144,217,0.15)", color: "#4a90d9" }}>ABQ</div>
          <div>
            <span className="text-white font-bold text-sm">ABQ ALSYF</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-sm font-medium" style={{ color: "#4a90d9" }}>Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>👤 Alireza</span>
          <button onClick={onLogout} className="px-4 py-1.5 text-xs font-semibold border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(239,68,68,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-8 mb-12">
            {/* Photo */}
            <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden"
              style={{ border: "2px solid rgba(74,144,217,0.3)" }}>
              <Image
                src="/images/alireza.jpeg"
                alt="Alireza"
                fill
                className="object-cover object-top"
                style={{ filter: "brightness(0.88) contrast(1.05) saturate(0.85)" }}
              />
              {/* Blue overlay to match site palette */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(160deg, rgba(74,144,217,0.12) 0%, rgba(6,14,28,0.25) 100%)"
              }} />
            </div>
            {/* Welcome text */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "#4a90d9" }}>
                ABQ ALSYF Portal
              </p>
              <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Welcome, Alireza.</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>ABQ ALSYF Management Portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <button
                  onClick={() => card.ready && onNavigate(card.id)}
                  className="w-full text-left p-6 border transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    borderColor: card.ready ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                    cursor: card.ready ? "pointer" : "default",
                    opacity: card.ready ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => { if (card.ready) e.currentTarget.style.borderColor = "rgba(74,144,217,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = card.ready ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"; }}
                >
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h2 className="text-white font-bold text-lg mb-1">{card.title}</h2>
                  <p className="text-sm mb-3" style={{ color: "rgba(245,240,234,0.45)" }}>{card.desc}</p>
                  {card.ready ? (
                    <span className="text-xs font-semibold" style={{ color: "#4a90d9" }}>Open →</span>
                  ) : (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Coming soon</span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function PortalPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    // Read section from URL hash
    const hash = window.location.hash.replace("#", "");
    if (hash === "files" || hash === "inquiries") setSection(hash);

    // Listen for browser back/forward
    const onPop = () => {
      const h = window.location.hash.replace("#", "");
      setSection(h === "files" || h === "inquiries" ? h : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(s: string | null) {
    if (s) {
      window.history.pushState(null, "", `/portal#${s}`);
    } else {
      window.history.pushState(null, "", "/portal");
    }
    setSection(s);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    navigate(null);
  }

  if (authed === null) return (
    <div className="min-h-screen" style={{ backgroundColor: "#060e1c" }} />
  );

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <LoginPage onLogin={() => setAuthed(true)} />
        </motion.div>
      ) : section === "files" ? (
        <motion.div key="files" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Dashboard onLogout={handleLogout} onBack={() => navigate(null)} />
        </motion.div>
      ) : section === "inquiries" ? (
        <motion.div key="inquiries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <InquiriesSection onLogout={handleLogout} onBack={() => navigate(null)} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <MainDashboard onNavigate={(s) => navigate(s)} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
