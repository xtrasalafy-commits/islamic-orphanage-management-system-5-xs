"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  ListSkeleton,
  Modal,
  SelectInput,
  TextArea,
  TextInput,
  cx,
  useToast,
  type Tone,
} from "@/components/ui";
import {
  JENIS_DONASI,
  JENIS_PERLINDUNGAN,
  KATEGORI_ANAK,
  KATEGORI_KEBUTUHAN,
  KATEGORI_KEGIATAN,
  KATEGORI_PENGELUARAN,
  METODE_DONASI,
  PERAN,
  PRIORITAS,
  RESOURCE_FIELDS,
  STATUS_ANAK,
  STATUS_DONASI,
  STATUS_KASUS,
  STATUS_KEGIATAN,
  STATUS_KEBUTUHAN,
  STATUS_PENGGUNA,
  TINGKAT,
  RESOURCE_TITLE,
  labelOf,
  type FieldSpec,
  type Option,
  type ResourceKey,
} from "@/lib/fields";
import { rupiah, rupiahCompact, tanggal, tanggalPendek, umur } from "@/lib/format";
import type { Row } from "@/lib/queries";

type RefOptions = { anakOptions: Option[]; pengasuhOptions: Option[] };

type Ctx = RefOptions & {
  anakName: (id: unknown) => string;
  pengasuhName: (id: unknown) => string;
};

type Column = {
  key: string;
  label: string;
  render: (row: Row, ctx: Ctx) => ReactNode;
  className?: string;
  cardHide?: boolean;
};

type FilterDef = { key: string; label: string; options: Option[] };

type QuickAction = {
  field: string;
  next: (row: Row) => string | null;
  label: (next: string) => string;
  variant?: "primary" | "gold" | "secondary";
};

type ResourceConfig = {
  icon: string;
  columns: Column[];
  filters: FilterDef[];
  searchKeys: string[];
  quick?: QuickAction;
  detail?: (row: Row) => string;
  stat?: (rows: Row[], ctx: Ctx) => { label: string; value: string; hint?: string; icon: string; tone: Tone }[];
};

function text(value: unknown): string {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

function nilai(row: Row, key: string): number {
  return Number(row[key] ?? 0);
}

const STATUS_TONE: Record<string, Tone> = {
  aktif: "brand",
  lulus: "sky",
  kembali_keluarga: "violet",
  mutasi: "slate",
  belum_terpenuhi: "rose",
  sebagian: "amber",
  terpenuhi: "emerald",
  darurat: "rose",
  tinggi: "rose",
  sedang: "amber",
  rendah: "slate",
  baru: "sky",
  investigasi: "amber",
  penanganan: "violet",
  selesai: "emerald",
  menunggu: "amber",
  diterima: "emerald",
  ditolak: "rose",
  terjadwal: "sky",
  berlangsung: "brand",
  dibatalkan: "rose",
  nonaktif: "slate",
};

function StatusBadge({ value, options }: { value: unknown; options: Option[] }) {
  return (
    <Badge tone={STATUS_TONE[String(value ?? "")] ?? "slate"}>{labelOf(options, value)}</Badge>
  );
}

const KATEGORI_KEBUTUHAN_ICON: Record<string, string> = {
  pangan: "🍚",
  sandang: "👕",
  papan: "🏠",
  kesehatan: "🩺",
  pendidikan: "🎓",
  ibadah: "📖",
  psikososial: "💛",
  keterampilan: "🧵",
};

const CONFIG: Record<ResourceKey, ResourceConfig> = {
  anak: {
    icon: "🧒",
    detail: (row) => `/anak/${row.id}`,
    searchKeys: ["namaLengkap", "namaPanggilan", "sekolah", "tempatLahir", "namaWali", "alamat"],
    filters: [
      { key: "kategori", label: "Kategori", options: [] },
      { key: "status", label: "Status", options: [] },
      { key: "jenjang", label: "Jenjang", options: [] },
    ],
    columns: [
      {
        key: "namaLengkap",
        label: "Anak Asuh",
        render: (row, ctx) => (
          <div className="flex items-center gap-3">
            <span
              className={cx(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold",
                row.jenisKelamin === "P" ? "bg-violet-100 text-violet-700" : "bg-brand-100 text-brand-700",
              )}
            >
              {text(row.namaPanggilan) === "-" ? text(row.namaLengkap).slice(0, 2).toUpperCase() : String(row.namaPanggilan).slice(0, 2)}
            </span>
            <div className="min-w-0">
              <Link
                href={`/anak/${row.id}`}
                className="block truncate text-sm font-bold text-slate-800 hover:text-brand-700 hover:underline"
              >
                {text(row.namaLengkap)}
              </Link>
              <p className="truncate text-xs text-slate-500">
                {row.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"} · {umur(String(row.tanggalLahir))} tahun · {text(row.kelas)}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "kategori",
        label: "Kategori",
        render: (row) => (
          <Badge tone={row.kategori === "dhuafa" ? "violet" : row.kategori === "yatim_piatu" ? "rose" : "brand"}>
            {labelOf(KATEGORI_ANAK, row.kategori)}
          </Badge>
        ),
      },
      {
        key: "sekolah",
        label: "Pendidikan",
        render: (row) => (
          <div>
            <p className="text-sm font-semibold text-slate-700">{text(row.sekolah)}</p>
            <p className="text-xs text-slate-400">{text(row.jenjang)}</p>
          </div>
        ),
      },
      {
        key: "pengasuhId",
        label: "Pengasuh",
        render: (row, ctx) => (
          <span className="text-sm text-slate-600">{ctx.pengasuhName(row.pengasuhId)}</span>
        ),
      },
      {
        key: "tanggalMasuk",
        label: "Masuk",
        render: (row) => (
          <div>
            <p className="text-sm text-slate-600">{tanggalPendek(String(row.tanggalMasuk ?? ""))}</p>
            <p className="text-xs text-slate-400">{text(row.tempatLahir)}</p>
          </div>
        ),
        cardHide: true,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <StatusBadge value={row.status} options={STATUS_ANAK} />
        ),
      },
    ],
    stat: (rows) => [
      { label: "Total anak", value: String(rows.length), icon: "🧒", tone: "brand" },
      {
        label: "Anak aktif",
        value: String(rows.filter((row) => row.status === "aktif").length),
        icon: "✅",
        tone: "emerald",
      },
      {
        label: "Yatim / piatu",
        value: `${rows.filter((row) => row.kategori === "yatim").length} / ${rows.filter((row) => row.kategori === "piatu").length}`,
        hint: "yatim / piatu",
        icon: "🕊️",
        tone: "sky",
      },
      {
        label: "Usia rata-rata",
        value: `${Math.round(
          rows.reduce((total, row) => total + (umur(String(row.tanggalLahir)) ?? 0), 0) / Math.max(rows.length, 1),
        )} th`,
        icon: "📅",
        tone: "gold",
      },
    ],
  },
  kebutuhan: {
    icon: "🥣",
    searchKeys: ["judul", "deskripsi", "catatan"],
    filters: [
      { key: "kategori", label: "Kategori", options: [] },
      { key: "prioritas", label: "Prioritas", options: [] },
      { key: "status", label: "Status", options: [] },
    ],
    quick: {
      field: "status",
      next: (row) => (row.status === "belum_terpenuhi" ? "sebagian" : row.status === "sebagian" ? "terpenuhi" : null),
      label: (next) => (next === "terpenuhi" ? "Tandai Terpenuhi" : "Perbarui ke Sebagian"),
    },
    columns: [
      {
        key: "judul",
        label: "Kebutuhan",
        render: (row, ctx) => (
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-base">
              {KATEGORI_KEBUTUHAN_ICON[String(row.kategori)] ?? "•"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{text(row.judul)}</p>
              <p className="truncate text-xs font-medium text-brand-700">{ctx.anakName(row.anakId)}</p>
            </div>
          </div>
        ),
      },
      {
        key: "kategori",
        label: "Kategori Dasar",
        render: (row) => (
          <span className="text-sm font-semibold text-slate-700">
            {labelOf(KATEGORI_KEBUTUHAN, row.kategori)}
          </span>
        ),
      },
      {
        key: "prioritas",
        label: "Prioritas",
        render: (row) => <StatusBadge value={row.prioritas} options={PRIORITAS} />,
      },
      {
        key: "estimasiBiaya",
        label: "Estimasi",
        render: (row) => (
          <span className="text-sm font-bold text-slate-800">{rupiah(nilai(row, "estimasiBiaya"))}</span>
        ),
      },
      {
        key: "tanggal",
        label: "Dicatat",
        render: (row) => <span className="text-sm text-slate-500">{tanggalPendek(String(row.tanggal ?? ""))}</span>,
        cardHide: true,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={row.status} options={STATUS_KEBUTUHAN} />,
      },
    ],
    stat: (rows) => [
      { label: "Total kebutuhan", value: String(rows.length), icon: "📋", tone: "brand" },
      {
        label: "Belum terpenuhi",
        value: String(rows.filter((row) => row.status !== "terpenuhi").length),
        icon: "⏳",
        tone: "rose",
      },
      {
        label: "Darurat",
        value: String(rows.filter((row) => row.prioritas === "darurat" && row.status !== "terpenuhi").length),
        icon: "🚨",
        tone: "amber",
      },
      {
        label: "Estimasi kebutuhan",
        value: rupiahCompact(rows.filter((row) => row.status !== "terpenuhi").reduce((total, row) => total + nilai(row, "estimasiBiaya"), 0)),
        icon: "💰",
        tone: "gold",
      },
    ],
  },
  perlindungan: {
    icon: "🛡️",
    searchKeys: ["deskripsi", "pelapor", "penangan", "tindakLanjut"],
    filters: [
      { key: "jenis", label: "Jenis Kasus", options: [] },
      { key: "tingkat", label: "Risiko", options: [] },
      { key: "status", label: "Status", options: [] },
    ],
    quick: {
      field: "status",
      next: (row) =>
        row.status === "baru" ? "investigasi" : row.status === "investigasi" ? "penanganan" : row.status === "penanganan" ? "selesai" : null,
      label: (next) => (next === "selesai" ? "Tutup Kasus" : `Naikkan ke ${next}`),
      variant: "gold",
    },
    columns: [
      {
        key: "deskripsi",
        label: "Kasus",
        render: (row, ctx) => (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800">{ctx.anakName(row.anakId)}</p>
            <p className="line-clamp-2 max-w-md text-xs leading-relaxed text-slate-500">{text(row.deskripsi)}</p>
          </div>
        ),
      },
      {
        key: "jenis",
        label: "Jenis",
        render: (row) => (
          <Badge tone={String(row.jenis) === "seksual" || String(row.jenis) === "fisik" ? "rose" : "amber"}>
            {labelOf(JENIS_PERLINDUNGAN, row.jenis)}
          </Badge>
        ),
      },
      {
        key: "tingkat",
        label: "Risiko",
        render: (row) => <StatusBadge value={row.tingkat} options={TINGKAT} />,
      },
      {
        key: "penangan",
        label: "Penangan",
        render: (row) => (
          <div>
            <p className="text-sm text-slate-700">{text(row.penangan)}</p>
            <p className="text-xs text-slate-400">{text(row.pelapor)}</p>
          </div>
        ),
        cardHide: true,
      },
      {
        key: "tanggalLaporan",
        label: "Laporan",
        render: (row) => <span className="text-sm text-slate-500">{tanggalPendek(String(row.tanggalLaporan ?? ""))}</span>,
        cardHide: true,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={row.status} options={STATUS_KASUS} />,
      },
    ],
    stat: (rows) => [
      { label: "Total kasus", value: String(rows.length), icon: "🗂️", tone: "brand" },
      {
        label: "Kasus aktif",
        value: String(rows.filter((row) => row.status !== "selesai").length),
        icon: "🛡️",
        tone: "amber",
      },
      {
        label: "Risiko tinggi",
        value: String(rows.filter((row) => row.tingkat === "tinggi" && row.status !== "selesai").length),
        icon: "🚨",
        tone: "rose",
      },
      {
        label: "Kasus selesai",
        value: String(rows.filter((row) => row.status === "selesai").length),
        icon: "✅",
        tone: "emerald",
      },
    ],
  },
  kegiatan: {
    icon: "📗",
    searchKeys: ["judul", "lokasi", "penanggungJawab", "deskripsi"],
    filters: [
      { key: "kategori", label: "Kategori", options: [] },
      { key: "status", label: "Status", options: [] },
    ],
    quick: {
      field: "status",
      next: (row) =>
        row.status === "terjadwal" ? "berlangsung" : row.status === "berlangsung" ? "selesai" : null,
      label: (next) => (next === "selesai" ? "Selesaikan" : "Mulai Kegiatan"),
    },
    columns: [
      {
        key: "judul",
        label: "Kegiatan",
        render: (row) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">{text(row.judul)}</p>
            <p className="truncate text-xs text-slate-500">
              {text(row.lokasi)} · {text(row.waktu)}
            </p>
          </div>
        ),
      },
      {
        key: "tanggal",
        label: "Jadwal",
        render: (row) => (
          <div>
            <p className="text-sm font-semibold text-slate-700">{tanggal(String(row.tanggal ?? ""))}</p>
            <p className="text-xs text-slate-400">{text(row.kapasitas)} peserta</p>
          </div>
        ),
      },
      {
        key: "penanggungJawab",
        label: "Penanggung Jawab",
        render: (row) => <span className="text-sm text-slate-600">{text(row.penanggungJawab)}</span>,
      },
      {
        key: "kategori",
        label: "Kategori",
        render: (row) => <Badge tone="sky">{labelOf(undefined, row.kategori)}</Badge>,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={row.status} options={STATUS_KEGIATAN} />,
      },
    ],
    stat: (rows) => [
      { label: "Total kegiatan", value: String(rows.length), icon: "📗", tone: "brand" },
      {
        label: "Terjadwal",
        value: String(rows.filter((row) => row.status === "terjadwal").length),
        icon: "🗓️",
        tone: "sky",
      },
      {
        label: "Berlangsung",
        value: String(rows.filter((row) => row.status === "berlangsung").length),
        icon: "▶️",
        tone: "gold",
      },
      {
        label: "Selesai",
        value: String(rows.filter((row) => row.status === "selesai").length),
        icon: "🏁",
        tone: "emerald",
      },
    ],
  },
  donasi: {
    icon: "🤲",
    searchKeys: ["namaDonatur", "program", "catatan"],
    filters: [
      { key: "jenis", label: "Jenis", options: [] },
      { key: "status", label: "Status", options: [] },
      { key: "metode", label: "Metode", options: [] },
    ],
    quick: {
      field: "status",
      next: (row) => (row.status === "menunggu" ? "diterima" : null),
      label: () => "Konfirmasi Diterima",
      variant: "gold",
    },
    columns: [
      {
        key: "namaDonatur",
        label: "Donatur",
        render: (row) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">{text(row.namaDonatur)}</p>
            <p className="truncate text-xs text-slate-500">{text(row.program)}</p>
          </div>
        ),
      },
      {
        key: "jenis",
        label: "Jenis",
        render: (row) => <Badge tone="brand">{labelOf(undefined, row.jenis)}</Badge>,
      },
      {
        key: "jumlah",
        label: "Nilai",
        render: (row) => <span className="text-sm font-extrabold text-slate-800">{rupiah(nilai(row, "jumlah"))}</span>,
      },
      {
        key: "metode",
        label: "Metode",
        render: (row) => <span className="text-sm text-slate-600">{labelOf(METODE_DONASI, row.metode)}</span>,
        cardHide: true,
      },
      {
        key: "tanggal",
        label: "Tanggal",
        render: (row) => <span className="text-sm text-slate-500">{tanggalPendek(String(row.tanggal ?? ""))}</span>,
        cardHide: true,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={row.status} options={STATUS_DONASI} />,
      },
    ],
    stat: (rows) => [
      {
        label: "Total diterima",
        value: rupiahCompact(rows.filter((row) => row.status === "diterima").reduce((total, row) => total + nilai(row, "jumlah"), 0)),
        icon: "💰",
        tone: "emerald",
      },
      { label: "Jumlah donatur", value: String(rows.length), icon: "🤝", tone: "brand" },
      {
        label: "Menunggu konfirmasi",
        value: rupiahCompact(rows.filter((row) => row.status === "menunggu").reduce((total, row) => total + nilai(row, "jumlah"), 0)),
        icon: "⏳",
        tone: "amber",
      },
      {
        label: "Rata-rata donasi",
        value: rupiahCompact(rows.reduce((total, row) => total + nilai(row, "jumlah"), 0) / Math.max(rows.length, 1)),
        icon: "📊",
        tone: "sky",
      },
    ],
  },
  pengeluaran: {
    icon: "💸",
    searchKeys: ["judul", "keterangan", "dicatatOleh"],
    filters: [{ key: "kategori", label: "Kategori", options: [] }],
    columns: [
      {
        key: "judul",
        label: "Uraian",
        render: (row) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">{text(row.judul)}</p>
            <p className="line-clamp-1 max-w-sm text-xs text-slate-500">{text(row.keterangan)}</p>
          </div>
        ),
      },
      {
        key: "kategori",
        label: "Kategori",
        render: (row) => <Badge tone="violet">{labelOf(KATEGORI_PENGELUARAN, row.kategori)}</Badge>,
      },
      {
        key: "jumlah",
        label: "Jumlah",
        render: (row) => <span className="text-sm font-extrabold text-rose-600">- {rupiah(nilai(row, "jumlah"))}</span>,
      },
      {
        key: "tanggal",
        label: "Tanggal",
        render: (row) => <span className="text-sm text-slate-500">{tanggalPendek(String(row.tanggal ?? ""))}</span>,
      },
      {
        key: "dicatatOleh",
        label: "Pencatat",
        render: (row) => <span className="text-sm text-slate-600">{text(row.dicatatOleh)}</span>,
        cardHide: true,
      },
    ],
    stat: (rows) => [
      {
        label: "Total pengeluaran",
        value: rupiahCompact(rows.reduce((total, row) => total + nilai(row, "jumlah"), 0)),
        icon: "💸",
        tone: "rose",
      },
      { label: "Jumlah transaksi", value: String(rows.length), icon: "🧾", tone: "brand" },
      {
        label: "Pangan & pendidikan",
        value: rupiahCompact(
          rows
            .filter((row) => row.kategori === "pangan" || row.kategori === "pendidikan")
            .reduce((total, row) => total + nilai(row, "jumlah"), 0),
        ),
        icon: "🍚",
        tone: "gold",
      },
      {
        label: "Perlindungan anak",
        value: rupiahCompact(rows.filter((row) => row.kategori === "perlindungan").reduce((total, row) => total + nilai(row, "jumlah"), 0)),
        icon: "🛡️",
        tone: "violet",
      },
    ],
  },
  pengasuh: {
    icon: "👥",
    searchKeys: ["nama", "email", "keahlian", "alamat"],
    filters: [
      { key: "peran", label: "Peran", options: [] },
      { key: "status", label: "Status", options: [] },
    ],
    columns: [
      {
        key: "nama",
        label: "Nama",
        render: (row) => (
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-extrabold text-brand-700">
              {String(row.nama ?? "?").replace(/^(Ust\.|Ustzh\.)\s*/i, "").slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{text(row.nama)}</p>
              <p className="truncate text-xs text-slate-500">{text(row.email)}</p>
            </div>
          </div>
        ),
      },
      {
        key: "peran",
        label: "Peran",
        render: (row) => <Badge tone={row.peran === "kepala" ? "gold" : "brand"}>{labelOf(PERAN, row.peran)}</Badge>,
      },
      {
        key: "keahlian",
        label: "Keahlian",
        render: (row) => <span className="text-sm text-slate-600">{text(row.keahlian)}</span>,
      },
      {
        key: "telepon",
        label: "Kontak",
        render: (row) => <span className="text-sm text-slate-600">{text(row.telepon)}</span>,
        cardHide: true,
      },
      {
        key: "tanggalBergabung",
        label: "Bergabung",
        render: (row) => <span className="text-sm text-slate-500">{tanggalPendek(String(row.tanggalBergabung ?? ""))}</span>,
        cardHide: true,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={row.status} options={STATUS_PENGGUNA} />,
      },
    ],
    stat: (rows) => [
      { label: "Total tim", value: String(rows.length), icon: "👥", tone: "brand" },
      {
        label: "Pengasuh aktif",
        value: String(rows.filter((row) => row.peran === "pengasuh" && row.status === "aktif").length),
        icon: "🤲",
        tone: "emerald",
      },
      {
        label: "Pengajar / ustadz",
        value: String(rows.filter((row) => row.peran === "pengajar").length),
        icon: "📖",
        tone: "sky",
      },
      {
        label: "Tenaga kesehatan",
        value: String(rows.filter((row) => row.peran === "kesehatan").length),
        icon: "🩺",
        tone: "violet",
      },
    ],
  },
};

/* ------------------------------- API helper ------------------------------- */

async function api(url: string, method: string, body?: unknown): Promise<{ id?: number }> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: number };
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? "Terjadi kesalahan saat menyimpan data");
  }
  return data;
}

/* -------------------------------- Form modal ------------------------------ */

function defaultsFor(resource: ResourceKey): Record<string, string> {
  const values: Record<string, string> = {};
  const today = new Date().toISOString().slice(0, 10);
  for (const field of RESOURCE_FIELDS[resource]) {
    if (field.type === "date") {
      values[field.name] = field.name === "tanggalLahir" ? "" : today;
      continue;
    }
    if (field.type === "select" || field.type === "ref-anak" || field.type === "ref-pengasuh") {
      values[field.name] = "";
      continue;
    }
    if (field.type === "currency" || field.type === "number") {
      values[field.name] = "";
      continue;
    }
    values[field.name] = "";
  }
  const preferred: Record<ResourceKey, Record<string, string>> = {
    anak: { status: "aktif", kategori: "yatim", jenisKelamin: "L", golonganDarah: "-" },
    kebutuhan: { status: "belum_terpenuhi", prioritas: "sedang" },
    perlindungan: { status: "baru", tingkat: "sedang" },
    kegiatan: { status: "terjadwal" },
    donasi: { status: "diterima", metode: "transfer" },
    pengeluaran: {},
    pengasuh: { status: "aktif", peran: "pengasuh", jenisKelamin: "L" },
  };
  return { ...values, ...preferred[resource] };
}

function buildInitialValues(
  resource: ResourceKey,
  editing: Row | null,
): Record<string, string> {
  if (!editing) return defaultsFor(resource);
  const next: Record<string, string> = {};
  for (const field of RESOURCE_FIELDS[resource]) {
    next[field.name] =
      editing[field.name] === null || editing[field.name] === undefined
        ? ""
        : String(editing[field.name]);
  }
  return next;
}

function FormModal({
  resource,
  open,
  editing,
  refs,
  onClose,
  onSaved,
}: {
  resource: ResourceKey;
  open: boolean;
  editing: Row | null;
  refs: RefOptions;
  onClose: () => void;
  onSaved: (values: Record<string, string>, created: boolean) => Promise<void>;
}) {
  const fields = RESOURCE_FIELDS[resource];
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(resource, editing),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function optionsFor(field: FieldSpec): Option[] {
    if (field.type === "ref-anak") return refs.anakOptions;
    if (field.type === "ref-pengasuh") return refs.pengasuhOptions;
    return field.options ?? [];
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = (values[field.name] ?? "").trim();
      if (field.required && !value) {
        next[field.name] = "Wajib diisi";
        continue;
      }
      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        next[field.name] = "Format email tidak valid";
      }
      if ((field.type === "currency" || field.type === "number") && value && Number.isNaN(Number(value))) {
        next[field.name] = "Harus berupa angka";
      }
      if (field.type === "date" && value && Number.isNaN(new Date(value + "T00:00:00").getTime())) {
        next[field.name] = "Tanggal tidak valid";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError(null);
    const payload: Record<string, string> = {};
    for (const field of fields) payload[field.name] = values[field.name] ?? "";
    try {
      await onSaved(payload, editing === null);
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Ubah data ${RESOURCE_TITLE[resource].title.toLowerCase()}` : `Tambah ${RESOURCE_TITLE[resource].title.toLowerCase()}`}
      description={
        editing
          ? "Perubahan langsung tersimpan setelah kamu menekan Simpan."
          : "Lengkapi kolom bertanda * lalu tekan Simpan."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving} type="button">
            Batal
          </Button>
          <Button type="submit" form="resource-form" loading={saving}>
            {editing ? "Simpan Perubahan" : "Simpan Data"}
          </Button>
        </>
      }
    >
      <form id="resource-form" onSubmit={submit} className="space-y-4">
        {serverError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {serverError}
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const options = optionsFor(field);
            const value = values[field.name] ?? "";
            const hint = field.name === "email" && resource === "pengasuh" ? "Kata sandi awal: panti123" : field.help;
            return (
              <div key={field.name} className={field.full ? "sm:col-span-2" : undefined}>
                <Field label={field.label} required={field.required} error={errors[field.name]} hint={hint}>
                  {field.type === "textarea" ? (
                    <TextArea
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    />
                  ) : field.type === "select" || field.type === "ref-anak" || field.type === "ref-pengasuh" ? (
                    <SelectInput
                      value={value}
                      options={options}
                      placeholder={field.required ? "— Pilih —" : "— Tidak ada —"}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    />
                  ) : (
                    <TextInput
                      type={
                        field.type === "date"
                          ? "date"
                          : field.type === "email"
                            ? "email"
                            : field.type === "number" || field.type === "currency"
                              ? "number"
                              : "text"
                      }
                      inputMode={field.type === "currency" ? "numeric" : undefined}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    />
                  )}
                </Field>
              </div>
            );
          })}
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------ Resource view ----------------------------- */

export default function ResourceView({
  resource,
  rows: initialRows,
  anakOptions,
  pengasuhOptions,
}: {
  resource: ResourceKey;
  rows: Row[];
  anakOptions: Option[];
  pengasuhOptions: Option[];
}) {
  const config = CONFIG[resource];
  const meta = RESOURCE_TITLE[resource];
  const router = useRouter();
  const toast = useToast();

  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowsSource, setRowsSource] = useState<Row[]>(initialRows);
  if (rowsSource !== initialRows) {
    setRowsSource(initialRows);
    setRows(initialRows);
  }
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const ctx: Ctx = useMemo(
    () => ({
      anakOptions,
      pengasuhOptions,
      anakName: (id) => anakOptions.find((option) => option.value === String(id))?.label ?? "Anak tidak ditemukan",
      pengasuhName: (id) =>
        id === null || id === undefined || id === ""
          ? "Belum ada pendamping"
          : pengasuhOptions.find((option) => option.value === String(id))?.label ?? "-",
    }),
    [anakOptions, pengasuhOptions],
  );

  const filterDefs = useMemo<FilterDef[]>(() => {
    const fieldMap = new Map(RESOURCE_FIELDS[resource].map((field) => [field.name, field]));
    return config.filters
      .map((filter) => ({
        ...filter,
        options: fieldMap.get(filter.key)?.options ?? [],
      }))
      .filter((filter) => filter.options.length > 0);
  }, [config.filters, resource]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return rows.filter((row) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (String(row[key] ?? "") !== value) return false;
      }
      if (!keyword) return true;
      const haystack = config.searchKeys
        .map((key) => String(row[key] ?? ""))
        .concat(ctx.anakName(row.anakId), ctx.pengasuhName(row.pengasuhId))
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [rows, filters, query, config.searchKeys, ctx]);

  const stats = config.stat ? config.stat(filtered, ctx) : [];

  function applyOptimistic(id: number | string, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) => {
        if (String(row.id) !== String(id)) return row;
        const merged: Row = { ...row };
        for (const [key, value] of Object.entries(patch)) {
          merged[key] = value ?? null;
        }
        return merged;
      }),
    );
  }

  async function handleQuick(row: Row) {
    const action = config.quick;
    if (!action) return;
    const next = action.next(row);
    if (!next) return;
    const previous = String(row[action.field]);
    applyOptimistic(row.id as number, { [action.field]: next });
    toast.push({
      tone: "info",
      title: "Memperbarui status…",
      description: "Perubahan diterapkan sementara di layar.",
    });
    try {
      await api(`/api/${resource}/${row.id}`, "PATCH", { [action.field]: next });
      toast.push({ tone: "success", title: "Berhasil diperbarui", description: `Status kini: ${next.replace("_", " ")}` });
    } catch (error) {
      applyOptimistic(row.id as number, { [action.field]: previous });
      toast.push({
        tone: "error",
        title: "Gagal memperbarui",
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    const snapshot = rows;
    setRows((current) => current.filter((row) => String(row.id) !== String(target.id)));
    try {
      await api(`/api/${resource}/${target.id}`, "DELETE");
      toast.push({
        tone: "success",
        title: "Data dihapus",
        description: resource === "anak" ? String(target.namaLengkap) : String(target.judul ?? target.nama ?? ""),
      });
      setPendingDelete(null);
    } catch (error) {
      setRows(snapshot);
      toast.push({
        tone: "error",
        title: "Gagal menghapus",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaved(payload: Record<string, string>, created: boolean) {
    if (!created && editing) {
      const patch = normalizePayload(resource, payload);
      setRows((current) =>
        current.map((row) => {
          if (String(row.id) !== String(editing.id)) return row;
          const merged: Row = { ...row };
          for (const [key, value] of Object.entries(patch)) merged[key] = value;
          return merged;
        }),
      );
      try {
        await api(`/api/${resource}/${editing.id}`, "PATCH", payload);
        toast.push({ tone: "success", title: "Perubahan tersimpan" });
      } catch (error) {
        refresh();
        throw error;
      }
      return;
    }

    const optimisticId = -Date.now();
    const newRow: Row = { ...normalizePayload(resource, payload), id: optimisticId };
    setRows((current) => [newRow, ...current]);
    try {
      const result = await api(`/api/${resource}`, "POST", payload);
      const realId = Number(result.id ?? optimisticId);
      setRows((current) =>
        current.map((row) => (String(row.id) === String(optimisticId) ? { ...row, id: realId } : row)),
      );
      toast.push({ tone: "success", title: "Data berhasil ditambahkan" });
      setTimeout(() => {
        if (mounted.current) router.refresh();
      }, 400);
    } catch (error) {
      setRows((current) => current.filter((row) => String(row.id) !== String(optimisticId)));
      toast.push({
        tone: "error",
        title: "Gagal menambah data",
        description: error instanceof Error ? error.message : undefined,
      });
      throw error;
    }
  }

  function refresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => {
      if (mounted.current) setRefreshing(false);
    }, 1100);
  }

  const deleteLabel = resource === "anak" ? String(pendingDelete?.namaLengkap ?? "") : String(pendingDelete?.judul ?? pendingDelete?.nama ?? "");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-lg ring-1 ring-brand-100">
              {config.icon}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{meta.title}</h1>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{meta.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={refresh} loading={refreshing}>
            ⟳ Muat ulang
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Tambah {meta.title.split(" ")[0]}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold tracking-wide text-slate-500 uppercase">{stat.label}</p>
                  <p className="mt-1.5 truncate text-xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                  {stat.hint ? <p className="text-[11px] text-slate-400">{stat.hint}</p> : null}
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-base">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Toolbar */}
      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">🔍</span>
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Cari ${meta.title.toLowerCase()}…`}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filterDefs.map((filter) => (
              <SelectInput
                key={filter.key}
                value={filters[filter.key] ?? ""}
                options={filter.options}
                placeholder={filter.label}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, [filter.key]: event.target.value }))
                }
                className="min-w-[9.5rem] py-2 text-xs font-semibold"
              />
            ))}
            {query || Object.values(filters).some(Boolean) ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setFilters({});
                }}
              >
                Reset
              </Button>
            ) : null}
          </div>
        </div>

        {refreshing ? (
          <ListSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={rows.length === 0 ? config.icon : "🔍"}
            title={rows.length === 0 ? `Belum ada ${meta.title.toLowerCase()}` : "Tidak ada hasil"}
            description={
              rows.length === 0
                ? "Mulai dengan menambahkan data pertama. Data yang kamu simpan akan langsung tersimpan di basis data panti."
                : "Coba ubah kata kunci atau filter yang kamu gunakan."
            }
            action={
              rows.length === 0 ? (
                <Button
                  onClick={() => {
                    setEditing(null);
                    setFormOpen(true);
                  }}
                >
                  + Tambah sekarang
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setFilters({});
                  }}
                >
                  Bersihkan filter
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Tabel (desktop) */}
            <div className="hidden overflow-x-auto md:block scrollbar-thin">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {config.columns.map((column) => (
                      <th
                        key={column.key}
                        className={cx(
                          "px-4 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase",
                          column.className,
                        )}
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={String(row.id)} className="border-b border-slate-50 transition hover:bg-brand-50/40">
                      {config.columns.map((column) => (
                        <td key={column.key} className="px-4 py-3.5 align-middle">
                          {column.render(row, ctx)}
                        </td>
                      ))}
                      <td className="px-4 py-3.5">
                        <RowActions
                          row={row}
                          config={config}
                          onQuick={handleQuick}
                          onEdit={() => {
                            setEditing(row);
                            setFormOpen(true);
                          }}
                          onDelete={() => setPendingDelete(row)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Kartu (mobile) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((row) => (
                <div key={String(row.id)} className="p-4">
                  <div className="mb-3">{config.columns[0]!.render(row, ctx)}</div>
                  <dl className="space-y-2">
                    {config.columns
                      .slice(1)
                      .filter((column) => !column.cardHide)
                      .map((column) => (
                        <div key={column.key} className="flex items-start justify-between gap-3">
                          <dt className="shrink-0 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                            {column.label}
                          </dt>
                          <dd className="min-w-0 text-right">{column.render(row, ctx)}</dd>
                        </div>
                      ))}
                  </dl>
                  <div className="mt-3.5">
                    <RowActions
                      row={row}
                      config={config}
                      full
                      onQuick={handleQuick}
                      onEdit={() => {
                        setEditing(row);
                        setFormOpen(true);
                      }}
                      onDelete={() => setPendingDelete(row)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              <span>
                Menampilkan <strong className="text-slate-700">{filtered.length}</strong> dari {rows.length} data
              </span>
              {config.detail ? (
                <span className="hidden sm:inline">Klik nama anak untuk melihat profil lengkap</span>
              ) : null}
            </div>
          </>
        )}
      </Card>

      <FormModal
        key={formOpen ? (editing ? `edit-${editing.id}` : "new") : "closed"}
        resource={resource}
        open={formOpen}
        editing={editing}
        refs={{ anakOptions, pengasuhOptions }}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Hapus data ini?"
        message={`Data ${deleteLabel || "ini"} akan dihapus permanen dari basis data panti. Tindakan ini tidak dapat dibatalkan.`}
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function RowActions({
  row,
  config,
  full,
  onQuick,
  onEdit,
  onDelete,
}: {
  row: Row;
  config: ResourceConfig;
  full?: boolean;
  onQuick: (row: Row) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const action = config.quick;
  const next = action ? action.next(row) : null;
  return (
    <div className={cx("flex items-center gap-1.5", full ? "flex-wrap" : "justify-end")}>
      {next && action ? (
        <Button variant={action.variant ?? "primary"} size="sm" onClick={() => onQuick(row)}>
          {action.label(next)}
        </Button>
      ) : null}
      {config.detail ? (
        <Link href={config.detail(row)}>
          <Button variant="secondary" size="sm">
            Detail
          </Button>
        </Link>
      ) : null}
      <Button variant="ghost" size="sm" onClick={onEdit}>
        ✏️ <span className="hidden sm:inline">Ubah</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
      >
        🗑️ <span className="hidden sm:inline">Hapus</span>
      </Button>
    </div>
  );
}

function normalizePayload(resource: ResourceKey, payload: Record<string, string>): Row {
  const row: Row = {};
  for (const field of RESOURCE_FIELDS[resource]) {
    const value = payload[field.name];
    if (field.type === "number" || field.type === "currency") {
      row[field.name] = Number(value ?? 0) || 0;
    } else if (field.type === "ref-anak" || field.type === "ref-pengasuh") {
      row[field.name] = value ? Number(value) : null;
    } else {
      row[field.name] = value === "" ? null : (value ?? null);
    }
  }
  return row;
}
