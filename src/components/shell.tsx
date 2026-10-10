"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Avatar, Badge, Button, cx } from "@/components/ui";
import { hijriToday } from "@/lib/format";

export type NavCount = {
  anakAktif: number;
  kebutuhanBelum: number;
  kasusAktif: number;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  description: string;
};

type NavGroup = { title: string; items: NavItem[] };

export default function Shell({
  user,
  counts,
  children,
}: {
  user: { nama: string; email: string; peranLabel: string };
  counts: NavCount;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const groups: NavGroup[] = [
    {
      title: "Utama",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: "🏠", description: "Ringkasan panti" },
      ],
    },
    {
      title: "Kebutuhan Dasar & Perlindungan",
      items: [
        { href: "/anak", label: "Data Anak Asuh", icon: "🧒", badge: counts.anakAktif, description: "Profil anak" },
        { href: "/kebutuhan", label: "Kebutuhan Dasar", icon: "🥣", badge: counts.kebutuhanBelum, description: "Pangan hingga ibadah" },
        { href: "/perlindungan", label: "Perlindungan Anak", icon: "🛡️", badge: counts.kasusAktif, description: "Kasus & penanganan" },
      ],
    },
    {
      title: "Pembinaan & Keuangan",
      items: [
        { href: "/kegiatan", label: "Kegiatan Panti", icon: "📗", description: "TPQ & tahfidz" },
        { href: "/donasi", label: "Donasi & Infaq", icon: "🤲", description: "Dana masuk" },
        { href: "/pengeluaran", label: "Pengeluaran", icon: "💸", description: "Dana keluar" },
      ],
    },
    {
      title: "Pengelolaan",
      items: [
        { href: "/pengasuh", label: "Pengasuh & Pengurus", icon: "👥", description: "Tim panti" },
      ],
    },
  ];

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-900 text-white">
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        <div className="pattern-islamic absolute inset-0 opacity-70" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-base font-black text-brand-900 shadow-lg">
            ﷽
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-tight font-extrabold tracking-tight">SIMPANTI</p>
            <p className="truncate text-[11px] text-brand-100/75">Darul Qur&apos;an Al-Ihsan</p>
          </div>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-2.5 pb-1.5 text-[10px] font-bold tracking-widest text-brand-200/60 uppercase">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.description}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-white text-brand-800 shadow-lg shadow-brand-950/30"
                        : "text-brand-100/85 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span
                      className={cx(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base",
                        active ? "bg-brand-50" : "bg-white/10 group-hover:bg-white/15",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cx(
                          "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                          active ? "bg-brand-600 text-white" : "bg-white/15 text-brand-50",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-[10px] font-bold tracking-widest text-brand-200/70 uppercase">
            Kalender
          </p>
          <p className="mt-1 text-xs font-semibold text-gold-300">{hijriToday()}</p>
        </div>
        <div className="mt-3 flex items-center gap-3 px-1">
          <Avatar nama={user.nama} tone="gold" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{user.nama}</p>
            <p className="truncate text-[11px] text-brand-100/70">{user.peranLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-500/80 disabled:opacity-60"
        >
          {loggingOut ? "Keluar…" : "⏻ Keluar"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">{sidebar}</aside>

      {/* Drawer mobile */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className="animate-fade-up relative z-10 h-full w-72 max-w-[85%]">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="Buka menu"
            >
              ☰
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold tracking-tight text-slate-900">
                Panti Asuhan Darul Qur&apos;an Al-Ihsan
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                Jl. Cibaduyut No. 100, Bandung · Terakreditasi Dinas Sosial Jawa Barat
              </p>
            </div>
            <Badge tone="brand" className="hidden sm:inline-flex">
              ● Sistem aktif
            </Badge>
            <Link
              href="/anak"
              className="hidden sm:block"
              aria-label="Cari anak asuh"
            >
              <Button variant="secondary" size="sm">
                🧒 Data Anak
              </Button>
            </Link>
            <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 md:flex">
              <Avatar nama={user.nama} tone="brand" size="sm" />
              <div className="leading-tight">
                <p className="max-w-[9rem] truncate text-xs font-bold text-slate-800">{user.nama}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>

        <footer className="border-t border-slate-200/80 bg-white px-4 py-4 text-center text-xs text-slate-400 sm:px-6">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-2.5">
            <span>
              SIMPANTI · Amanah mengelola kebutuhan dasar &amp; perlindungan anak ·{" "}
              {new Date().getFullYear()}
            </span>
            <span className="hidden sm:inline">·</span>
            <a
              href="/source-code.zip"
              download
              className="font-semibold text-brand-600 transition hover:text-brand-700 hover:underline"
            >
              ⬇ Download source code
            </a>
            <span className="hidden sm:inline">·</span>
            <span>Open Source oleh MZF - 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
