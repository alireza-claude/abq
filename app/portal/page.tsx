"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const AUTH_KEY  = "abq_portal_auth";
const PASS_KEY  = "abq_portal_pass";
const ROLE_KEY  = "abq_portal_role";
const USER_KEY  = "abq_portal_user";
const VALID_USER = "Alireza";
const VALID_PASS = "6272140";
const USERS_FILE = "portal-users.json";
const TASKS_FILE = "tasks-state.json";

type UserRole = "admin" | "viewer";
interface PortalUser { username: string; password: string; }

type TaskStatus   = "plan" | "in_progress" | "done";
type TaskPriority = "high" | "medium" | "low";
interface Task {
  id: string;
  title: string;
  notes: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

function getStoredPass() {
  if (typeof window === "undefined") return VALID_PASS;
  return localStorage.getItem(PASS_KEY) || VALID_PASS;
}

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

// ─── Shared Portal Header ────────────────────────────────
function PortalHeader({ title, onLogout, role, currentUser }: {
  title: string; onLogout: () => void; role: UserRole; currentUser: string;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  // Change Password modal
  const [showPassModal, setShowPassModal] = useState(false);
  const [cur, setCur]       = useState("");
  const [next, setNext]     = useState("");
  const [confirm, setConfirm] = useState("");
  const [passErr, setPassErr] = useState("");
  const [passOk, setPassOk]  = useState(false);
  // Add User modal (admin only)
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addErr, setAddErr]   = useState("");
  const [addOk, setAddOk]     = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closePassModal() {
    setShowPassModal(false);
    setCur(""); setNext(""); setConfirm("");
    setPassErr(""); setPassOk(false);
  }

  async function handleChangePass(e: React.FormEvent) {
    e.preventDefault();
    setPassErr("");
    if (role === "admin") {
      if (cur !== getStoredPass()) { setPassErr("Current password is incorrect."); return; }
      if (next.length < 4)         { setPassErr("New password must be at least 4 characters."); return; }
      if (next !== confirm)        { setPassErr("Passwords do not match."); return; }
      localStorage.setItem(PASS_KEY, next);
      setPassOk(true);
    } else {
      // Viewer: update in Supabase users file
      try {
        const { data } = await supabase.storage.from(BUCKET).download(USERS_FILE);
        if (!data) { setPassErr("Could not load user data."); return; }
        const users: PortalUser[] = JSON.parse(await data.text());
        const idx = users.findIndex(u => u.username === currentUser);
        if (idx === -1) { setPassErr("User not found."); return; }
        if (users[idx].password !== cur) { setPassErr("Current password is incorrect."); return; }
        if (next.length < 4) { setPassErr("New password must be at least 4 characters."); return; }
        if (next !== confirm) { setPassErr("Passwords do not match."); return; }
        users[idx].password = next;
        const blob = new Blob([JSON.stringify(users)], { type: "application/json" });
        await supabase.storage.from(BUCKET).upload(USERS_FILE, blob, { upsert: true });
        setPassOk(true);
      } catch { setPassErr("An error occurred. Please try again."); }
    }
  }

  function closeAddUser() {
    setShowAddUser(false);
    setNewUsername(""); setNewPassword("");
    setAddErr(""); setAddOk(false);
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddErr("");
    if (!newUsername.trim()) { setAddErr("Username is required."); return; }
    if (newUsername.trim().toLowerCase() === VALID_USER.toLowerCase()) {
      setAddErr("That username is reserved."); return;
    }
    if (newPassword.length < 4) { setAddErr("Password must be at least 4 characters."); return; }
    setAddLoading(true);
    try {
      let users: PortalUser[] = [];
      const { data } = await supabase.storage.from(BUCKET).download(USERS_FILE);
      if (data) { try { users = JSON.parse(await data.text()); } catch { users = []; } }
      if (users.find(u => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
        setAddErr("A user with that username already exists."); setAddLoading(false); return;
      }
      users.push({ username: newUsername.trim(), password: newPassword });
      const blob = new Blob([JSON.stringify(users)], { type: "application/json" });
      await supabase.storage.from(BUCKET).upload(USERS_FILE, blob, { upsert: true });
      setAddOk(true);
    } catch { setAddErr("Failed to save user. Please try again."); }
    setAddLoading(false);
  }

  return (
    <>
      <header
        className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        {/* Left: logo + title */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Image
            src="/images/logo.png" alt="ABQ ALSYF Logo" width={48} height={48}
            className="flex-shrink-0"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div className="hidden sm:flex items-center">
            <span className="text-white font-bold text-sm">ABQ ALSYF</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-sm font-medium" style={{ color: "#E8500A" }}>{title}</span>
          </div>
          <div className="flex items-center sm:hidden">
            <span className="text-sm font-semibold" style={{ color: "#E8500A" }}>{title}</span>
          </div>
        </div>

        {/* Right: username dropdown + sign out */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Username dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-1 text-xs sm:text-sm transition-colors group"
              style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span>👤</span>
            <span className="group-hover:text-white transition-colors">{currentUser}</span>
            <span className="text-[9px] ml-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>▾</span>
          </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 py-1 z-40"
                  style={{ backgroundColor: "#0d1f38", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                >
                  <button
                    onClick={() => { setShowDropdown(false); setShowPassModal(true); }}
                    className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                  >
                    🔑 Change Password
                  </button>
                  {role === "admin" && (
                    <>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 0" }} />
                      <button
                        onClick={() => { setShowDropdown(false); setShowAddUser(true); }}
                        className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                      >
                        👤 Add User
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onLogout}
            className="px-2.5 sm:px-4 py-1.5 text-xs font-semibold border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(239,68,68,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPassModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(6,14,28,0.85)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closePassModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.2 }}
              className="w-full max-w-sm p-8"
              style={{ backgroundColor: "#0d1f38", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              {passOk ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-white font-bold text-lg mb-2">Password Updated</h2>
                  <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Your new password is saved.</p>
                  <button onClick={closePassModal} className="w-full py-2.5 text-sm font-bold text-white" style={{ backgroundColor: "#E8500A" }}>Done</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-lg">Change Password</h2>
                    <button onClick={closePassModal} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
                  </div>
                  <form onSubmit={handleChangePass} className="space-y-4">
                    {[
                      { label: "Current Password", val: cur, set: setCur },
                      { label: "New Password",     val: next, set: setNext },
                      { label: "Confirm Password", val: confirm, set: setConfirm },
                    ].map(({ label, val, set }) => (
                      <div key={label}>
                        <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
                        <input type="password" value={val} onChange={(e) => set(e.target.value)} required autoComplete="off"
                          className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.1)" }}
                          onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                      </div>
                    ))}
                    <AnimatePresence>
                      {passErr && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-xs text-center" style={{ color: "#f87171" }}>{passErr}</motion.p>
                      )}
                    </AnimatePresence>
                    <button type="submit" className="w-full py-3 text-sm font-bold text-white mt-2 transition-all active:scale-[0.98]"
                      style={{ backgroundColor: "#E8500A" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C0391A"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8500A"}>
                      Update Password →
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal (admin only) */}
      <AnimatePresence>
        {showAddUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(6,14,28,0.85)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeAddUser(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.2 }}
              className="w-full max-w-sm p-8"
              style={{ backgroundColor: "#0d1f38", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              {addOk ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-white font-bold text-lg mb-2">User Created</h2>
                  <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="text-white font-semibold">{newUsername}</span> can now log in with read-only access.
                  </p>
                  <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>They can view all sections but cannot make changes.</p>
                  <button onClick={closeAddUser} className="w-full py-2.5 text-sm font-bold text-white" style={{ backgroundColor: "#E8500A" }}>Done</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white font-bold text-lg">Add User</h2>
                    <button onClick={closeAddUser} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
                  </div>
                  <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                    The new user will have <span style={{ color: "#60a5fa" }}>read-only</span> access to all portal sections.
                  </p>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    {[
                      { label: "Username", val: newUsername, set: setNewUsername, type: "text" },
                      { label: "Password", val: newPassword, set: setNewPassword, type: "password" },
                    ].map(({ label, val, set, type }) => (
                      <div key={label}>
                        <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
                        <input type={type} value={val} onChange={(e) => set(e.target.value)} required autoComplete="off"
                          className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.1)" }}
                          onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                      </div>
                    ))}
                    <AnimatePresence>
                      {addErr && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-xs text-center" style={{ color: "#f87171" }}>{addErr}</motion.p>
                      )}
                    </AnimatePresence>
                    <button type="submit" disabled={addLoading}
                      className="w-full py-3 text-sm font-bold text-white mt-2 transition-all active:scale-[0.98] disabled:opacity-50"
                      style={{ backgroundColor: "#E8500A" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C0391A"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8500A"}>
                      {addLoading ? "Saving…" : "Create User →"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Login ────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (role: UserRole, username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (username === VALID_USER && password === getStoredPass()) {
      localStorage.setItem(AUTH_KEY, "1");
      localStorage.setItem(ROLE_KEY, "admin");
      localStorage.setItem(USER_KEY, username);
      onLogin("admin", username);
    } else {
      // Check viewer users from Supabase
      try {
        const { data, error: dlErr } = await supabase.storage.from(BUCKET).download(USERS_FILE);
        if (!dlErr && data) {
          const users: PortalUser[] = JSON.parse(await data.text());
          const found = users.find(u => u.username === username && u.password === password);
          if (found) {
            localStorage.setItem(AUTH_KEY, "1");
            localStorage.setItem(ROLE_KEY, "viewer");
            localStorage.setItem(USER_KEY, username);
            onLogin("viewer", username);
            setLoading(false);
            return;
          }
        }
      } catch { /* no viewer users file yet */ }
      setError("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, rgba(232,80,10,0.08) 0%, transparent 60%), #060e1c",
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
          <div className="inline-flex items-center justify-center">
            <Image src="/images/logo.png" alt="ABQ ALSYF Logo" width={204} height={204} />
          </div>
          <h1 className="text-white font-extrabold text-2xl tracking-tight mt-2">Portal Login</h1>
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
                onFocus={(e) => e.target.style.borderColor = "#E8500A"}
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
                onFocus={(e) => e.target.style.borderColor = "#E8500A"}
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
              style={{ backgroundColor: "#E8500A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C0391A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E8500A")}
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
function Dashboard({ onLogout, onBack, role }: { onLogout: () => void; onBack?: () => void; role: UserRole }) {
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
    else setFiles(((data as FileItem[]) || []).filter(f => f.name !== LEADS_STATE_FILE && f.name !== USERS_FILE && f.name !== TASKS_FILE));
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
    window.open(data.publicUrl, "_blank", "noopener,noreferrer");
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
        background: "radial-gradient(ellipse at 80% 10%, rgba(232,80,10,0.06) 0%, transparent 55%), #060e1c",
      }}
    >
      <PortalHeader title="Files" onLogout={onLogout} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Page title */}
          <div className="mb-8">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-2 text-sm mb-4 transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#E8500A"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
                ← Back to Dashboard
              </button>
            )}
            <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Files</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {role === "admin" ? "Upload and manage your documents, images, and PDFs." : "View and open your documents, images, and PDFs."}
            </p>
          </div>

          {/* Upload zone — admin only */}
          {role === "admin" && (<>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInput.current?.click()}
            className="mb-8 p-8 border-2 border-dashed rounded-none cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3"
            style={{
              borderColor: dragOver ? "#E8500A" : "rgba(232,80,10,0.25)",
              backgroundColor: dragOver ? "rgba(232,80,10,0.08)" : "rgba(232,80,10,0.03)",
              minHeight: "140px",
            }}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E8500A", borderTopColor: "transparent" }} />
                <p className="text-sm font-medium" style={{ color: "#E8500A" }}>Uploading: {uploadProgress}</p>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(232,80,10,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          </>)}

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
            {/* Table header — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
              <span className="col-span-1" />
              <span className="col-span-6">File Name</span>
              <span className="col-span-2">Size</span>
              <span className="col-span-1">Type</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E8500A", borderTopColor: "transparent" }} />
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
                    className="border-b transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {/* Mobile layout */}
                    <div className="flex sm:hidden items-center gap-3 px-4 py-3">
                      <span className="text-xl flex-shrink-0">{fileIcon(file.metadata?.mimetype)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{file.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {formatSize(file.metadata?.size)} · {fileType(file.name, file.metadata?.mimetype)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleDownload(file.name)}
                          className="px-3 py-1.5 text-xs font-semibold"
                          style={{ backgroundColor: "rgba(232,80,10,0.15)", color: "#E8500A" }}>
                          Open
                        </button>
                        {role === "admin" && (
                          <button onClick={() => handleDelete(file.name)} disabled={deleting === file.name}
                            className="px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "rgba(239,68,68,0.7)" }}>
                            {deleting === file.name ? "…" : "Del"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-12 items-center px-5 py-3.5">
                    <span className="col-span-1 text-xl">{fileIcon(file.metadata?.mimetype)}</span>
                    <span className="col-span-6 text-sm text-white font-medium truncate pr-4">{file.name}</span>
                    <span className="col-span-2 text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {formatSize(file.metadata?.size)}
                    </span>
                    <span className="col-span-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 text-center"
                      style={{ backgroundColor: "rgba(232,80,10,0.1)", color: "rgba(232,80,10,0.7)" }}>
                      {fileType(file.name, file.metadata?.mimetype)}
                    </span>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => handleDownload(file.name)}
                        className="px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{ backgroundColor: "rgba(232,80,10,0.12)", color: "#E8500A", border: "1px solid rgba(232,80,10,0.25)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(232,80,10,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(232,80,10,0.12)"; }}
                      >
                        Open
                      </button>
                      {role === "admin" && (
                        <button onClick={() => handleDelete(file.name)} disabled={deleting === file.name}
                          className="px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
                          style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.2)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.18)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                        >
                          {deleting === file.name ? "…" : "Delete"}
                        </button>
                      )}
                    </div>
                    </div>{/* end desktop */}
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

function InquiriesSection({ onBack, onLogout, role }: { onBack: () => void; onLogout: () => void; role: UserRole }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function deleteInquiry(id: string) {
    setDeletingId(id);
    await supabase.from("inquiries").delete().eq("id", id);
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    setSelected(null);
    setDeletingId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(232,80,10,0.06) 0%, transparent 55%), #060e1c" }}>
      <PortalHeader title="Inquiries" onLogout={onLogout} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#E8500A"}
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
                style={{ borderColor: "rgba(232,80,10,0.3)", color: "#E8500A" }}>
                ↻ Refresh
              </button>
              <span className="text-sm px-3 py-1.5 font-semibold" style={{ backgroundColor: "rgba(232,80,10,0.12)", color: "#E8500A" }}>
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
            {/* Header — desktop only */}
            <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
              <span className="col-span-3">Name</span>
              <span className="col-span-3">Email</span>
              <span className="col-span-2">Service</span>
              <span className="col-span-3">Date</span>
              <span className="col-span-1" />
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E8500A", borderTopColor: "transparent" }} />
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
                  className="border-b transition-colors cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  onClick={() => setSelected(inq)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>

                  {/* Mobile layout */}
                  <div className="flex sm:hidden items-center justify-between px-4 py-3.5 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium">{inq.name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{inq.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5" style={{ backgroundColor: "rgba(232,80,10,0.1)", color: "#E8500A" }}>
                          {serviceLabels[inq.service] || inq.service}
                        </span>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{formatDate(inq.created_at)}</span>
                      </div>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "rgba(232,80,10,0.6)" }}>View →</span>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-12 items-center px-5 py-4">
                    <div className="col-span-3">
                      <p className="text-sm text-white font-medium">{inq.name}</p>
                      {inq.company && <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{inq.company}</p>}
                    </div>
                    <span className="col-span-3 text-sm truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{inq.email}</span>
                    <span className="col-span-2">
                      <span className="text-[10px] font-semibold px-2 py-1" style={{ backgroundColor: "rgba(232,80,10,0.1)", color: "#E8500A" }}>
                        {serviceLabels[inq.service] || inq.service}
                      </span>
                    </span>
                    <span className="col-span-3 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{formatDate(inq.created_at)}</span>
                    <span className="col-span-1 text-right text-xs" style={{ color: "rgba(232,80,10,0.6)" }}>View →</span>
                  </div>
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
              style={{ backgroundColor: "#0d1e36", border: "1px solid rgba(232,80,10,0.2)" }}
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
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${selected.email}`}
                  className="px-4 py-2 text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: "#E8500A" }}>
                  Reply by Email
                </a>
                <button onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm font-semibold border transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  Close
                </button>
                {role === "admin" && (
                  <button
                    onClick={() => deleteInquiry(selected.id)}
                    disabled={deletingId === selected.id}
                    className="px-4 py-2 text-sm font-semibold border transition-all disabled:opacity-40 ml-auto"
                    style={{ borderColor: "rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.7)" }}>
                    {deletingId === selected.id ? "Deleting…" : "🗑 Delete"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Leads / Projects ─────────────────────────────────────

type LeadStatus = "pending" | "contacted" | "followup" | "won" | "lost";

interface LeadItem {
  id: number;
  day: 1 | 2 | 3;
  area: string;
  company: string;
  type: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  projects: string;
  tips: string[];
}

interface LeadState {
  status: LeadStatus;
  notes: string;
  checkedTips: boolean[];
}

type AllLeadStates = Record<number, LeadState>;

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "rgba(255,255,255,0.5)",  bg: "rgba(255,255,255,0.06)" },
  contacted: { label: "Contacted", color: "#60a5fa",               bg: "rgba(96,165,250,0.1)"  },
  followup:  { label: "Follow-up", color: "#E8500A",               bg: "rgba(232,80,10,0.12)"  },
  won:       { label: "Won ✓",     color: "#4ade80",               bg: "rgba(74,222,128,0.1)"  },
  lost:      { label: "Lost",      color: "rgba(239,68,68,0.7)",   bg: "rgba(239,68,68,0.08)"  },
};

const LEADS: LeadItem[] = [
  // ── Day 1 ──────────────────────────────────────────────
  {
    id: 1, day: 1, area: "Umm Ramool + Muhaisnah",
    company: "Al Sahel Contracting Co. (ASCC) LLC",
    type: "General Contractor",
    phone: "+971 4 285 7324", email: "info@alsahelcon.com",
    website: "alsahelcon.com",
    address: "25th St, Umm Ramool, Dubai, UAE",
    projects: "Luxury villas, residential buildings, high-rise towers",
    tips: [
      "Ask for the Procurement or Projects Manager — they control subcontractor approvals.",
      "Lead with villa site mobilisation speed: ASCC runs many concurrent sites.",
      "Offer a competitive per-m³ rate card for foundation excavation and spoil haulage.",
      "Reference ISO certification and equipment availability (2 excavators + trailers) upfront.",
    ],
  },
  {
    id: 2, day: 1, area: "Umm Ramool + Muhaisnah",
    company: "Al Habtoor Engineering Enterprises",
    type: "General Contractor",
    phone: "+971 4 285 7551", email: "habtoorengg@emirates.net.ae",
    website: "habtoorengg.co.ae",
    address: "P.O. Box 320, Umm Ramool, Dubai, UAE",
    projects: "Luxury villas, high-rise towers, large-scale commercial buildings",
    tips: [
      "Email habtoorengg@emirates.net.ae with a concise company profile — actively monitored.",
      "Emphasise clean excavation, careful spoil management, and zero damage to boundary structures.",
      "Umm Ramool office is same corridor as Al Sahel (#1) — a single visit covers both companies.",
      "Bring a short portfolio showing any previous villa foundation or basement excavation jobs.",
    ],
  },
  {
    id: 3, day: 1, area: "Umm Ramool + Muhaisnah",
    company: "GCC General Construction Company LLC",
    type: "General Contractor",
    phone: "+971 4 280 6889", email: "info@gccuae.com",
    website: "gccuae.com",
    address: "Al Mezan Building, Muhaisnah 4, P.O. Box 30639, Dubai, UAE",
    projects: "Industrial buildings, residential complexes, commercial buildings",
    tips: [
      "Email info@gccuae.com with a one-page subcontractor profile and rate schedule.",
      "Highlight industrial site experience — GCC's work involves heavy site prep and bulk excavation.",
      "Propose a site visit to any active project to demonstrate ABQ Alsyf's equipment capability.",
      "Follow up by phone within 3 business days of emailing — mid-size firms respond well.",
    ],
  },
  // ── Day 2 ──────────────────────────────────────────────
  {
    id: 4, day: 2, area: "Al Quoz + Business Bay + Silicon Oasis",
    company: "Condor Building Contracting LLC (Condor Group)",
    type: "General Contractor / Developer",
    phone: "+971 4 239 9500", email: "marketing@thecondorgroup.com",
    website: "thecondorgroup.com",
    address: "Plot No. 365-0743, Al Quoz Industrial Area 2, P.O. Box 5690, Dubai, UAE",
    projects: "Residential towers (JVC, Dubai Sports City), healthcare buildings, hotels",
    tips: [
      "Email marketing@thecondorgroup.com with a short introductory note and company profile PDF.",
      "Reference their active JVC and Dubai Sports City tower projects specifically.",
      "Offer aggregate supply alongside excavation — they value a single sub for both.",
      "Ask to be included in their approved subcontractor register ahead of next mobilisation.",
    ],
  },
  {
    id: 5, day: 2, area: "Al Quoz + Business Bay + Silicon Oasis",
    company: "Sierra Turnkey Contracting LLC",
    type: "General Contractor / Civil",
    phone: "+971 4 324 7733", email: "info@sierra.ae",
    website: "sierra.ae",
    address: "Office 08, 1st Floor, Leaders Building, Al Quoz 1, Sheikh Zayed Road, Dubai, UAE",
    projects: "Civil works, residential buildings, landscaping, MEP projects",
    tips: [
      "Email info@sierra.ae — they are digitally responsive with an active enquiry form.",
      "Position ABQ Alsyf as complement to their landscaping work: earthworks and fill delivery.",
      "Multi-emirate operations mean consistent service across Dubai, Abu Dhabi and Sharjah.",
      "Mention ISO alignment — Sierra holds ISO 9001, 14001 and 45001 and expects safety awareness.",
    ],
  },
  {
    id: 6, day: 2, area: "Al Quoz + Business Bay + Silicon Oasis",
    company: "Metac General Contracting Co. (WLL)",
    type: "General Contractor",
    phone: "+971 4 277 5992", email: "Via metacuae.com",
    website: "metacuae.com",
    address: "Office 606, 6th Floor, Tower A, Empire Heights, Business Bay, Dubai, UAE",
    projects: "Infrastructure, bridges & roads, residential & mixed-use developments",
    tips: [
      "Call +971 4 277 5992 and ask to speak with the Procurement or Subcontracts Manager.",
      "Lead with infrastructure credentials — Metac's bridge and road projects need serious earthmoving.",
      "Mention ability to operate in both Dubai and Ajman, matching their multi-emirate footprint.",
      "Prepare QHSE documents, equipment certificates, and trade licence — rigorous pre-qualification.",
    ],
  },
  {
    id: 7, day: 2, area: "Al Quoz + Business Bay + Silicon Oasis",
    company: "Al Shirawi Infrastructure Construction (ASICO)",
    type: "Infrastructure / Civil",
    phone: "+971 4 323 2695", email: "info.infrastructure@alshirawi.ae",
    website: "infrastructure.alshirawi.com",
    address: "Office 1005 & 1006, Park Avenue Building, Dubai Silicon Oasis, Dubai, UAE",
    projects: "Underground utility networks, DEWA power distribution, RTA road-side utilities",
    tips: [
      "Email info.infrastructure@alshirawi.ae with a focused one-pager on trench excavation capability.",
      "ASICO works on live DEWA and RTA sites — stress urban trench excavation and safe spoil removal.",
      "Propose a standing rate agreement rather than one-off pricing — continuous repeat work potential.",
      "Mention DEWA or RTA site safety compliance experience — ASICO expects sub-contractors to match.",
    ],
  },
  // ── Day 3 ──────────────────────────────────────────────
  {
    id: 8, day: 3, area: "Dubai Investment Park + Ras Al Khor + Sharjah",
    company: "RMB Contracting LLC",
    type: "Civil / Infrastructure",
    phone: "+971 4 881 9955", email: "info@rmbcontracting.ae",
    website: "rmbcontracting.ae",
    address: "Office 348, 3rd Floor, European Business Centre, Dubai Investment Park 1, Dubai, UAE",
    projects: "Roads, infrastructure utility networks, coastal structures (Dubai & North Emirates)",
    tips: [
      "Email info@rmbcontracting.ae — they have an active procurement culture.",
      "Highlight North Emirates coverage: RMB operates in Ras Al Khaimah and Fujairah.",
      "Road and coastal projects generate large spoil volumes; pitch a fixed haul-rate per trip.",
      "Ask specifically about current active road contracts in Dubai and North Emirates.",
    ],
  },
  {
    id: 9, day: 3, area: "Dubai Investment Park + Ras Al Khor + Sharjah",
    company: "Dubai Contracting Company (DCC) LLC",
    type: "General Contractor",
    phone: "+971 4 333 7100", email: "dcc@dcc-group.com",
    website: "dcc-group.com",
    address: "Building No. 29, St 13, Industrial Area 1, Ras Al Khor, P.O. Box 232, Dubai, UAE",
    projects: "Infrastructure, industrial, commercial buildings, residential projects",
    tips: [
      "Email dcc@dcc-group.com with a formal subcontractor registration request — DCC expects structured outreach.",
      "Mention local proximity: DCC's Ras Al Khor head office is close to ABQ Alsyf's operational area.",
      "Focus pitch on bulk excavation and aggregate supply — consistent earthworks demand.",
      "Ask to be added to their approved subcontractor list — DCC works with a preferred panel.",
    ],
  },
  {
    id: 10, day: 3, area: "Dubai Investment Park + Ras Al Khor + Sharjah",
    company: "Diplomat General Contracting",
    type: "General Contractor",
    phone: "+971 6 533 1266", email: "diplomat@emirates.net.ae",
    website: "—",
    address: "P.O. Box 40469, Al Wahda Building, Al Wahda Street, Sharjah, UAE",
    projects: "Residential buildings, villas, commercial construction in Sharjah/Ajman",
    tips: [
      "Call +971 6 533 1266 directly — no public website, phone and email are the only routes.",
      "Email diplomat@emirates.net.ae with a brief introduction and rate card; keep it short.",
      "Proximity pitch: ABQ Alsyf can mobilise quickly to Sharjah and Ajman, reducing downtime.",
      "Visit the Al Wahda Street office in person — Sharjah contractors prefer face-to-face introductions.",
    ],
  },
];

const LEADS_STATE_FILE = "leads-state.json";

function defaultLeadState(lead: LeadItem): LeadState {
  return { status: "pending", notes: "", checkedTips: lead.tips.map(() => false) };
}

function LeadsSection({ onBack, onLogout, role }: { onBack: () => void; onLogout: () => void; role: UserRole }) {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [states, setStates] = useState<AllLeadStates>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET).download(LEADS_STATE_FILE);
      if (!error && data) {
        try {
          const text = await data.text();
          setStates(JSON.parse(text) as AllLeadStates);
        } catch { /* start fresh */ }
      }
      setLoading(false);
    }
    load();
  }, []);

  function saveStates(newStates: AllLeadStates) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      const blob = new Blob([JSON.stringify(newStates)], { type: "application/json" });
      await supabase.storage.from(BUCKET).upload(LEADS_STATE_FILE, blob, { upsert: true });
      setSaving(false);
    }, 1500);
  }

  function getState(id: number): LeadState {
    const lead = LEADS.find((l) => l.id === id)!;
    return states[id] ?? defaultLeadState(lead);
  }

  function updateStatus(id: number, status: LeadStatus) {
    const next = { ...states, [id]: { ...getState(id), status } };
    setStates(next); saveStates(next);
  }

  function updateNotes(id: number, notes: string) {
    const next = { ...states, [id]: { ...getState(id), notes } };
    setStates(next); saveStates(next);
  }

  function toggleTip(id: number, idx: number) {
    const cur = getState(id);
    const checkedTips = [...cur.checkedTips];
    checkedTips[idx] = !checkedTips[idx];
    const next = { ...states, [id]: { ...cur, checkedTips } };
    setStates(next); saveStates(next);
  }

  const dayLeads = LEADS.filter((l) => l.day === activeDay);
  const dayAreas: Record<number, string> = {
    1: "Umm Ramool + Muhaisnah",
    2: "Al Quoz + Business Bay + Silicon Oasis",
    3: "DIP + Ras Al Khor + Sharjah",
  };

  const counts = {
    won:       LEADS.filter((l) => (states[l.id]?.status ?? "pending") === "won").length,
    contacted: LEADS.filter((l) => (states[l.id]?.status ?? "pending") === "contacted").length,
    followup:  LEADS.filter((l) => (states[l.id]?.status ?? "pending") === "followup").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(232,80,10,0.06) 0%, transparent 55%), #060e1c" }}>
      <PortalHeader title="Leads" onLogout={onLogout} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />
      {saving && (
        <div className="text-center py-1 text-[11px] animate-pulse" style={{ backgroundColor: "rgba(232,80,10,0.07)", color: "rgba(255,255,255,0.3)" }}>
          Saving…
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#E8500A"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
            ← Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Lead Tracker</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              May 2026 · 10 target companies · Dubai &amp; Sharjah
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Won",       count: counts.won,       color: "#4ade80", bg: "rgba(74,222,128,0.07)"  },
              { label: "Contacted", count: counts.contacted, color: "#60a5fa", bg: "rgba(96,165,250,0.07)"  },
              { label: "Follow-up", count: counts.followup,  color: "#E8500A", bg: "rgba(232,80,10,0.07)"   },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3 border" style={{ backgroundColor: s.bg, borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.count}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Day tabs */}
          <div className="flex gap-0 mb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {([1, 2, 3] as const).map((day) => (
              <button key={day} onClick={() => setActiveDay(day)}
                className="px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px"
                style={{
                  color: activeDay === day ? "#E8500A" : "rgba(255,255,255,0.4)",
                  borderBottomColor: activeDay === day ? "#E8500A" : "transparent",
                }}>
                Day {day}
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                  {LEADS.filter((l) => l.day === day).length}
                </span>
              </button>
            ))}
          </div>

          {/* Area label */}
          <div className="flex items-center gap-2 mb-5">
            <span>📍</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {dayAreas[activeDay]}
            </span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E8500A", borderTopColor: "transparent" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading leads…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayLeads.map((lead, i) => {
                const st = getState(lead.id);
                const sc = STATUS_CONFIG[st.status];
                const isExpanded = expandedId === lead.id;
                const doneCount = st.checkedTips.filter(Boolean).length;

                return (
                  <motion.div key={lead.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.018)" }}>

                    {/* Card header — always visible */}
                    <div className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}>
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-xs font-bold shrink-0" style={{ color: "rgba(232,80,10,0.55)" }}>#{lead.id}</span>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm leading-snug">{lead.company}</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>{lead.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-[11px] hidden sm:block" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {doneCount}/{lead.tips.length} tips
                        </span>
                        <span className="px-2.5 py-1 text-[11px] font-bold" style={{ color: sc.color, backgroundColor: sc.bg }}>
                          {sc.label}
                        </span>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                          style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <div className="px-5 py-5 space-y-6">

                            {/* Contact info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {[
                                { icon: "📞", text: lead.phone, href: `tel:${lead.phone}` },
                                { icon: "✉️", text: lead.email, href: `mailto:${lead.email}` },
                                { icon: "🌐", text: lead.website, href: lead.website !== "—" ? `https://${lead.website}` : undefined },
                                { icon: "📍", text: lead.address, href: undefined },
                              ].map(({ icon, text, href }) => (
                                href ? (
                                  <a key={icon} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 text-sm transition-colors hover:opacity-80"
                                    style={{ color: "rgba(255,255,255,0.5)" }}>
                                    <span className="shrink-0">{icon}</span>
                                    <span className="truncate">{text}</span>
                                  </a>
                                ) : (
                                  <p key={icon} className="flex items-start gap-2 text-xs leading-relaxed"
                                    style={{ color: "rgba(255,255,255,0.38)" }}>
                                    <span className="shrink-0">{icon}</span>
                                    <span>{text}</span>
                                  </p>
                                )
                              ))}
                            </div>

                            {/* Status selector */}
                            <div>
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.22)" }}>Status</p>
                              <div className="flex flex-wrap gap-2">
                                {(Object.entries(STATUS_CONFIG) as [LeadStatus, typeof STATUS_CONFIG[LeadStatus]][]).map(([key, cfg]) => (
                                  <button key={key}
                                    onClick={() => role === "admin" && updateStatus(lead.id, key)}
                                    className="px-3 py-1 text-xs font-semibold transition-all"
                                    style={{
                                      color: cfg.color,
                                      backgroundColor: st.status === key ? cfg.bg : "transparent",
                                      border: `1px solid ${st.status === key ? cfg.color : "rgba(255,255,255,0.08)"}`,
                                      opacity: st.status === key ? 1 : 0.5,
                                      cursor: role === "viewer" ? "default" : "pointer",
                                    }}>
                                    {cfg.label}
                                  </button>
                                ))}
                              </div>
                              {role === "viewer" && <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>Read-only access</p>}
                            </div>

                            {/* Action tips */}
                            <div>
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Action Tips</p>
                              <div className="space-y-2.5">
                                {lead.tips.map((tip, idx) => (
                                  <label key={idx} className={`flex items-start gap-3 ${role === "admin" ? "cursor-pointer" : "cursor-default"}`}>
                                    <input type="checkbox" checked={st.checkedTips[idx] ?? false}
                                      onChange={() => role === "admin" && toggleTip(lead.id, idx)}
                                      disabled={role === "viewer"}
                                      className="mt-0.5 shrink-0 accent-orange-500" />
                                    <span className="text-sm leading-relaxed transition-all" style={{
                                      color: st.checkedTips[idx] ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.6)",
                                      textDecoration: st.checkedTips[idx] ? "line-through" : "none",
                                    }}>
                                      {tip}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.22)" }}>Notes</p>
                              <textarea
                                value={st.notes}
                                onChange={(e) => role === "admin" && updateNotes(lead.id, e.target.value)}
                                readOnly={role === "viewer"}
                                placeholder={role === "admin" ? "Write your notes here… e.g. spoke with Mr. Ahmed, call back Thursday." : "No notes."}
                                rows={3}
                                className="w-full bg-transparent border text-sm px-3 py-2 resize-none focus:outline-none transition-colors"
                                style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", cursor: role === "viewer" ? "default" : "text" }}
                                onFocus={(e) => { if (role === "admin") e.target.style.borderColor = "#E8500A"; }}
                                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// ─── Tasks Config ─────────────────────────────────────────
const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  plan:        { label: "Plan",        color: "rgba(255,255,255,0.5)",  bg: "rgba(255,255,255,0.06)" },
  in_progress: { label: "In Progress", color: "#E8500A",               bg: "rgba(232,80,10,0.12)"   },
  done:        { label: "Done ✓",      color: "#4ade80",               bg: "rgba(74,222,128,0.1)"   },
};
const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  high:   { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  medium: { label: "Med",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  low:    { label: "Low",  color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};
const TASK_STATUS_CYCLE: TaskStatus[] = ["plan", "in_progress", "done"];

// ─── Tasks Section ─────────────────────────────────────────
function TasksSection({ onBack, onLogout, role, currentUser }: {
  onBack: () => void; onLogout: () => void; role: UserRole; currentUser: string;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [addErr, setAddErr] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET).download(TASKS_FILE);
      if (!error && data) {
        try { setTasks(JSON.parse(await data.text()) as Task[]); } catch { /* start fresh */ }
      }
      setLoading(false);
    }
    load();
  }, []);

  function scheduleSave(updated: Task[]) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      setSaveError("");
      const blob = new Blob([JSON.stringify(updated)], { type: "application/json" });
      const { error } = await supabase.storage.from(BUCKET).upload(TASKS_FILE, blob, { upsert: true });
      if (error) setSaveError(error.message);
      setSaving(false);
    }, 1500);
  }

  function isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === "done") return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  }

  function formatDue(d: string): string {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function cycleStatus(id: string) {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      const idx = TASK_STATUS_CYCLE.indexOf(t.status);
      return { ...t, status: TASK_STATUS_CYCLE[(idx + 1) % 3] };
    });
    setTasks(updated); scheduleSave(updated);
  }

  function deleteTask(id: string) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); scheduleSave(updated);
    if (expandedId === id) setExpandedId(null);
  }

  function updateTaskNotes(id: string, notes: string) {
    const updated = tasks.map(t => t.id === id ? { ...t, notes } : t);
    setTasks(updated); scheduleSave(updated);
  }

  function closeAddModal() {
    setShowAddModal(false);
    setNewTitle(""); setNewNotes(""); setNewPriority("medium"); setNewDueDate(""); setAddErr("");
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) { setAddErr("Title is required."); return; }
    const task: Task = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
      title: newTitle.trim(), notes: newNotes.trim(),
      priority: newPriority, dueDate: newDueDate,
      status: "plan", createdAt: new Date().toISOString(),
    };
    const updated = [task, ...tasks];
    setTasks(updated); scheduleSave(updated); closeAddModal();
  }

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const counts = {
    plan:        tasks.filter(t => t.status === "plan").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done:        tasks.filter(t => t.status === "done").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(232,80,10,0.06) 0%, transparent 55%), #060e1c" }}>
      <PortalHeader title="My Tasks" onLogout={onLogout} role={role} currentUser={currentUser} />
      {saving && (
        <div className="text-center py-1 text-[11px] animate-pulse" style={{ backgroundColor: "rgba(232,80,10,0.07)", color: "rgba(255,255,255,0.3)" }}>
          Saving…
        </div>
      )}
      {saveError && (
        <div className="text-center py-1.5 text-[11px] flex items-center justify-center gap-2" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171" }}>
          ⚠ Save failed: {saveError}
          <button onClick={() => setSaveError("")} className="opacity-60 hover:opacity-100 ml-2">✕</button>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Back + header */}
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#E8500A"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
            ← Back to Dashboard
          </button>

          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">My Tasks</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {counts.done} done · {counts.in_progress} in progress
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#E8500A" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C0391A"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8500A"}>
              + New Task
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-0 mb-6 border-b overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {([
              { key: "all" as const,         label: "All",         count: tasks.length       },
              { key: "plan" as const,         label: "Plan",        count: counts.plan        },
              { key: "in_progress" as const,  label: "In Progress", count: counts.in_progress },
              { key: "done" as const,         label: "Done",        count: counts.done        },
            ]).map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0"
                style={{
                  color: filter === tab.key ? "#E8500A" : "rgba(255,255,255,0.4)",
                  borderBottomColor: filter === tab.key ? "#E8500A" : "transparent",
                }}>
                {tab.label}
                <span className="ml-1.5 text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Task list */}
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E8500A", borderTopColor: "transparent" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading tasks…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-sm font-medium text-white mb-1">
                {filter === "all" ? "No tasks yet" : `No ${filter === "in_progress" ? "in-progress" : filter} tasks`}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {filter === "all" ? "Hit \"+ New Task\" to add your first one." : "Switch to All to see other tasks."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((task, i) => {
                  const sc = TASK_STATUS_CONFIG[task.status];
                  const pc = TASK_PRIORITY_CONFIG[task.priority];
                  const overdue = isOverdue(task);
                  const isExpanded = expandedId === task.id;
                  const isDone = task.status === "done";

                  return (
                    <motion.div key={task.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22, delay: i * 0.04 }}
                      style={{
                        border: "1px solid rgba(255,255,255,0.07)",
                        backgroundColor: "rgba(255,255,255,0.018)",
                        opacity: isDone ? 0.6 : 1,
                      }}>

                      {/* Task row */}
                      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
                        onClick={() => setExpandedId(isExpanded ? null : task.id)}>

                        {/* Status badge — click to cycle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); cycleStatus(task.id); }}
                          className="flex-shrink-0 px-2.5 py-1 text-[10px] font-bold transition-all"
                          style={{ color: sc.color, backgroundColor: sc.bg, minWidth: 76, textAlign: "center" }}
                          title="Click to advance status">
                          {sc.label}
                        </button>

                        {/* Title */}
                        <span dir="auto" className="flex-1 text-sm font-medium" style={{
                          color: isDone ? "rgba(255,255,255,0.4)" : "white",
                          textDecoration: isDone ? "line-through" : "none",
                          wordBreak: "break-word",
                        }}>
                          {task.title}
                        </span>

                        {/* Right: priority + due + chevron */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5"
                            style={{ color: pc.color, backgroundColor: pc.bg }}>
                            {pc.label}
                          </span>
                          {task.dueDate && (
                            <span className={`hidden sm:inline text-[10px] font-semibold px-2 py-0.5${overdue ? " animate-pulse" : ""}`}
                              style={{
                                color: overdue ? "#ef4444" : "rgba(255,255,255,0.3)",
                                backgroundColor: overdue ? "rgba(239,68,68,0.1)" : "transparent",
                              }}>
                              {overdue ? "⚠ Overdue" : formatDue(task.dueDate)}
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{isExpanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                            style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="px-4 py-4 space-y-4">

                              {/* Mobile: priority + due */}
                              <div className="flex sm:hidden items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold px-2 py-0.5"
                                  style={{ color: pc.color, backgroundColor: pc.bg }}>{pc.label}</span>
                                {task.dueDate && (
                                  <span className={`text-[10px] font-semibold px-2 py-0.5${overdue ? " animate-pulse" : ""}`}
                                    style={{
                                      color: overdue ? "#ef4444" : "rgba(255,255,255,0.3)",
                                      backgroundColor: overdue ? "rgba(239,68,68,0.1)" : "transparent",
                                    }}>
                                    {overdue ? "⚠ Overdue" : "Due " + formatDue(task.dueDate)}
                                  </span>
                                )}
                              </div>

                              {/* Notes */}
                              <div>
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.22)" }}>Notes</p>
                                <textarea
                                  value={task.notes}
                                  onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                                  placeholder="Add notes…" rows={6} dir="auto"
                                  className="w-full bg-transparent border text-sm px-3 py-2 resize-none focus:outline-none transition-colors"
                                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                                  onClick={(e) => e.stopPropagation()}
                                  onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between">
                                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                                  Added {new Date(task.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                                <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                  className="px-3 py-1 text-xs font-semibold border transition-all"
                                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.7)" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                                  🗑 Delete
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </motion.div>
      </main>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(6,14,28,0.85)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeAddModal(); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.2 }}
              className="w-full max-w-sm p-8"
              style={{ backgroundColor: "#0d1f38", border: "1px solid rgba(255,255,255,0.09)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">New Task</h2>
                <button onClick={closeAddModal} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Title *</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    required autoFocus dir="auto" placeholder="What needs to be done?"
                    className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Notes</label>
                  <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                    rows={2} dir="auto" placeholder="Optional details…"
                    className="w-full px-4 py-2 text-sm text-white bg-transparent border focus:outline-none transition-colors resize-none"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Priority</label>
                  <div className="flex gap-2">
                    {(["high", "medium", "low"] as TaskPriority[]).map(p => {
                      const pc = TASK_PRIORITY_CONFIG[p];
                      return (
                        <button key={p} type="button" onClick={() => setNewPriority(p)}
                          className="flex-1 py-2 text-xs font-bold transition-all border"
                          style={{
                            color: newPriority === p ? pc.color : "rgba(255,255,255,0.3)",
                            backgroundColor: newPriority === p ? pc.bg : "transparent",
                            borderColor: newPriority === p ? pc.color : "rgba(255,255,255,0.1)",
                          }}>
                          {pc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Due Date (optional)</label>
                  <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-white bg-transparent border focus:outline-none transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)", colorScheme: "dark" }}
                    onFocus={(e) => e.target.style.borderColor = "#E8500A"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                <AnimatePresence>
                  {addErr && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-center" style={{ color: "#f87171" }}>{addErr}</motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeAddModal}
                    className="flex-1 py-3 text-sm font-semibold border transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#E8500A" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C0391A"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8500A"}>
                    Add Task →
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
function MainDashboard({ onNavigate, onLogout, role, currentUser }: { onNavigate: (section: string) => void; onLogout: () => void; role: UserRole; currentUser: string }) {
  const cards = [
    ...(role === "admin" ? [{ id: "tasks", title: "My Tasks", desc: "Personal task manager — plan, track, and complete your work.", icon: "✅", ready: true }] : []),
    { id: "projects", title: "Leads", desc: "Track your May 2026 target companies and outreach progress.", icon: "🎯", ready: true },
    { id: "inquiries", title: "Inquiries", desc: "Review quote requests from the website.", icon: "📬", ready: true },
    { id: "files", title: "Files", desc: "Upload and manage your documents, images, and PDFs.", icon: "📁", ready: true },
    { id: "settings", title: "Settings", desc: "Site settings and configuration.", icon: "⚙️", ready: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(232,80,10,0.06) 0%, transparent 55%), #060e1c" }}>
      <PortalHeader title="Portal" onLogout={onLogout} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-8 mb-12">
            {/* Photo — admin only */}
            {role === "admin" && (
            <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden"
              style={{ border: "2px solid rgba(232,80,10,0.3)" }}>
              <Image
                src="/images/alireza.jpeg"
                alt="Alireza"
                fill
                className="object-cover object-top"
                style={{ filter: "brightness(0.88) contrast(1.05) saturate(0.85)" }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(160deg, rgba(232,80,10,0.12) 0%, rgba(6,14,28,0.25) 100%)"
              }} />
            </div>
            )}
            {/* Welcome text */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "#E8500A" }}>
                ABQ ALSYF Portal
              </p>
              <h1 className="text-white font-extrabold text-4xl tracking-tight mb-1">Welcome, {currentUser}.</h1>
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
                  onMouseEnter={(e) => { if (card.ready) e.currentTarget.style.borderColor = "rgba(232,80,10,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = card.ready ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"; }}
                >
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h2 className="text-white font-bold text-lg mb-1">{card.title}</h2>
                  <p className="text-sm mb-3" style={{ color: "rgba(245,240,234,0.45)" }}>{card.desc}</p>
                  {card.ready ? (
                    <span className="text-xs font-semibold" style={{ color: "#E8500A" }}>Open →</span>
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
  const [role, setRole] = useState<UserRole>("viewer");
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    const isAuthed = localStorage.getItem(AUTH_KEY) === "1";
    setAuthed(isAuthed);
    // If authenticated but no role stored (old session), default to admin
    const storedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
    const resolvedRole: UserRole = storedRole ?? (isAuthed ? "admin" : "viewer");
    if (isAuthed && !storedRole) localStorage.setItem(ROLE_KEY, "admin");
    setRole(resolvedRole);
    // Read section from URL hash
    const hash = window.location.hash.replace("#", "");
    if (hash === "files" || hash === "inquiries" || hash === "projects" || hash === "tasks") setSection(hash);

    // Listen for browser back/forward
    const onPop = () => {
      const h = window.location.hash.replace("#", "");
      setSection(h === "files" || h === "inquiries" || h === "projects" || h === "tasks" ? h : null);
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
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthed(false);
    setRole("viewer");
    navigate(null);
  }

  if (authed === null) return (
    <div className="min-h-screen" style={{ backgroundColor: "#060e1c" }} />
  );

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <LoginPage onLogin={(r, u) => { localStorage.setItem(AUTH_KEY, "1"); localStorage.setItem(ROLE_KEY, r); localStorage.setItem(USER_KEY, u); setRole(r); setAuthed(true); }} />
        </motion.div>
      ) : section === "files" ? (
        <motion.div key="files" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Dashboard onLogout={handleLogout} onBack={() => navigate(null)} role={role} />
        </motion.div>
      ) : section === "inquiries" ? (
        <motion.div key="inquiries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <InquiriesSection onLogout={handleLogout} onBack={() => navigate(null)} role={role} />
        </motion.div>
      ) : section === "projects" ? (
        <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <LeadsSection onLogout={handleLogout} onBack={() => navigate(null)} role={role} />
        </motion.div>
      ) : section === "tasks" && role === "admin" ? (
        <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <TasksSection onLogout={handleLogout} onBack={() => navigate(null)} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <MainDashboard onNavigate={(s) => navigate(s)} onLogout={handleLogout} role={role} currentUser={localStorage.getItem(USER_KEY) || VALID_USER} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
