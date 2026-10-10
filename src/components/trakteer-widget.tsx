"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Modal, cx } from "@/components/ui";
import { rupiah } from "@/lib/format";

const TRAKTEER_URL = "https://trakteer.id/perpus_opera/";
const SOURCE_URL = "/source-code.zip";

/** Nominal traktiran: mulai dari Rp6.000 dan kelipatannya */
const NOMINALS = [6_000, 12_000, 18_000, 24_000, 36_000, 60_000];

export default function TrakteerWidget() {
  const [open, setOpen] = useState(false);
  const [nominal, setNominal] = useState<number>(6_000);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Trakteer: dukung web app ini"
        title="Web app ini gratis & bebas iklan. Kopi kecil, server tetap jalan"
        className="animate-fade-up fixed right-4 bottom-4 z-40 flex max-w-[15rem] items-center gap-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 text-left text-white shadow-lg shadow-orange-600/30 ring-1 ring-white/25 transition hover:scale-[1.02] hover:from-orange-600 hover:to-orange-700"
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20 text-xl"
          aria-hidden="true"
        >
          ☕
        </span>
        <span className="min-w-0">
          <span className="block text-[10.5px] font-medium text-orange-50/90">
            Web app ini gratis &amp; bebas iklan.
          </span>
          <span className="block text-sm leading-tight font-extrabold">
            Kopi kecil, server tetap jalan
          </span>
        </span>
      </button>

      {/* Modal traktiran */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Traktir kopi ☕"
        description="Web app ini gratis & bebas iklan. Dukungan kecilmu membuat server tetap jalan."
        size="sm"
        footer={
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Tutup
          </button>
        }
      >
        <div className="space-y-5">
          {/* Pilihan nominal */}
          <div>
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-600 uppercase">
              Pilih nominal traktiran
            </p>
            <div className="grid grid-cols-3 gap-2">
              {NOMINALS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNominal(value)}
                  className={cx(
                    "rounded-xl border px-2 py-2.5 text-sm font-bold transition",
                    nominal === value
                      ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50",
                  )}
                >
                  {rupiah(value)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Mulai dari Rp6.000 dan kelipatannya.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <QRCodeSVG
                value={TRAKTEER_URL}
                size={172}
                level="M"
                fgColor="#0b4f3b"
                bgColor="#ffffff"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">
                Scan QR untuk traktiran {rupiah(nominal)}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Arahkan kamera ke QR, lalu lanjutkan pembayaran di Trakteer. Nominal
                finalnya tetap bisa kamu atur di sana.
              </p>
            </div>
          </div>

          {/* Tombol Trakteer */}
          <a
            href={TRAKTEER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition hover:from-orange-600 hover:to-orange-700"
          >
            🥤 Buka Trakteer: trakteer.id/perpus_opera
          </a>

          {/* Download source code */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-dashed border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700">
                Download source code lengkap web app ini
              </p>
              <p className="text-[11px] text-slate-400">Open Source oleh MZF - 2026</p>
            </div>
            <a
              href={SOURCE_URL}
              download
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              ⬇ Download .zip
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
