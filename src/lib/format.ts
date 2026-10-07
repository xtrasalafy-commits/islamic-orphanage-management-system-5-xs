export function rupiah(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "Rp 0";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export function rupiahCompact(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n === 0) return "Rp 0";
  if (Math.abs(n) >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
  if (Math.abs(n) >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(".0", "")} jt`;
  if (Math.abs(n) >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
  return rupiah(n);
}

/** Format tanggal Indonesia: 12 Ramadhan 1447 -> 12 Maret 2026 */
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function tanggal(value: string | Date | null | undefined): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value + (value.length === 10 ? "T00:00:00" : "")) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function tanggalPendek(value: string | Date | null | undefined): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value + (value.length === 10 ? "T00:00:00" : "")) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function isoDate(value: Date = new Date()): string {
  return value.toISOString().slice(0, 10);
}

export function umur(tanggalLahir: string | null | undefined): number | null {
  if (!tanggalLahir) return null;
  const lahir = new Date(tanggalLahir + "T00:00:00");
  if (Number.isNaN(lahir.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - lahir.getFullYear();
  const m = now.getMonth() - lahir.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < lahir.getDate())) age -= 1;
  return age < 0 ? 0 : age;
}

export function initials(nama: string | null | undefined): string {
  if (!nama) return "?";
  const parts = nama.trim().replace(/\b(gusti|ust|ustz|h|hj|dr)\b/gi, "").split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

export function selisihHari(target: string | null | undefined): number {
  if (!target) return 0;
  const d = new Date(target + "T00:00:00");
  if (Number.isNaN(d.getTime())) return 0;
  return Math.round((d.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
}

export function greet(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Perkiraan tanggal Hijriah sederhana (display saja). */
export function hijriToday(): string {
  const fmt = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  try {
    return fmt.format(new Date()).replace(" AH", " H").replace("H", "H");
  } catch {
    return "";
  }
}
