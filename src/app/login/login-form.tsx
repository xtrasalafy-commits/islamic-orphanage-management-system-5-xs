"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO = [
  { label: "Kepala Panti", email: "admin@panti.id" },
  { label: "Pengurus", email: "aminah@panti.id" },
  { label: "Pengasuh", email: "fauzi@panti.id" },
];

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@panti.id");
  const [password, setPassword] = useState("panti123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Gagal masuk");
        setLoading(false);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          placeholder="nama@panti.id"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            {showPassword ? "Sembunyi" : "Lihat"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="animate-fade-up rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Memproses…
          </>
        ) : (
          "Masuk ke Dashboard"
        )}
      </button>

      <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
        <p className="text-xs font-bold tracking-wide text-brand-800 uppercase">
          Akun demo — sandi: panti123
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {DEMO.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword("panti123");
                setError(null);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                email === account.email
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-brand-200 bg-white text-brand-700 hover:border-brand-400"
              }`}
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
