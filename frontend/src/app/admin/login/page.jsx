"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LOGO_URL } from "@/lib/stores";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await login(email.trim(), password);
    setBusy(false);
    if (res.ok) router.push("/admin");
    else setError(res.error || "Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-[#050505] dc-grain relative overflow-hidden">
      <div className="dc-aurora" />
      <form
        data-testid="admin-login-form"
        onSubmit={submit}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <Image src={LOGO_URL} alt="DigiConnect" width={44} height={44} className="rounded-xl" />
          <div>
            <p className="overline">Admin</p>
            <p className="font-display text-xl font-black text-white">DigiConnect CMS</p>
          </div>
        </div>

        <label className="block text-xs uppercase tracking-[0.22em] text-white/60 mb-2">Email</label>
        <input
          data-testid="admin-login-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dc-input"
          placeholder="admin@digiconnect.net.in"
        />

        <label className="block text-xs uppercase tracking-[0.22em] text-white/60 mb-2 mt-5">
          Password
        </label>
        <input
          data-testid="admin-login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dc-input"
          placeholder="••••••••"
        />

        {error && (
          <div
            data-testid="admin-login-error"
            className="mt-4 text-sm text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/30 rounded-lg px-3 py-2"
          >
            {error}
          </div>
        )}

        <button
          data-testid="admin-login-submit"
          type="submit"
          disabled={busy}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] transition-colors disabled:opacity-60"
        >
          {busy ? "Signing in…" : (<> <LogIn size={16} /> Sign in </>)}
        </button>

        <p className="mt-6 text-xs text-white/40 flex items-center gap-1.5">
          <Lock size={12} /> Restricted area. Admins only.
        </p>
        <Link href="/" className="mt-4 block text-center text-xs text-white/40 hover:text-white transition-colors">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}
