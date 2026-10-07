import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  anak,
  donasi,
  kebutuhan,
  kegiatan,
  pengeluaran,
  perlindungan,
  users,
} from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";

export type Row = Record<string, string | number | null>;

function serialize<T extends Record<string, unknown>>(row: T): Row {
  const out: Row = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) continue;
    if (value === undefined) {
      out[key] = null;
      continue;
    }
    out[key] = value as string | number | null;
  }
  return out;
}

async function ready() {
  await ensureSeeded();
}

export async function getAnakRows(): Promise<Row[]> {
  await ready();
  const rows = await db.select().from(anak).orderBy(asc(anak.namaLengkap));
  return rows.map(serialize);
}

export async function getKebutuhanRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select()
    .from(kebutuhan)
    .orderBy(desc(kebutuhan.tanggal), desc(kebutuhan.id));
  return rows.map(serialize);
}

export async function getPerlindunganRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select()
    .from(perlindungan)
    .orderBy(desc(perlindungan.tanggalLaporan), desc(perlindungan.id));
  return rows.map(serialize);
}

export async function getKegiatanRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select()
    .from(kegiatan)
    .orderBy(desc(kegiatan.tanggal), desc(kegiatan.id));
  return rows.map(serialize);
}

export async function getDonasiRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select()
    .from(donasi)
    .orderBy(desc(donasi.tanggal), desc(donasi.id));
  return rows.map(serialize);
}

export async function getPengeluaranRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select()
    .from(pengeluaran)
    .orderBy(desc(pengeluaran.tanggal), desc(pengeluaran.id));
  return rows.map(serialize);
}

export async function getPengasuhRows(): Promise<Row[]> {
  await ready();
  const rows = await db
    .select({
      id: users.id,
      nama: users.nama,
      email: users.email,
      peran: users.peran,
      jenisKelamin: users.jenisKelamin,
      telepon: users.telepon,
      alamat: users.alamat,
      keahlian: users.keahlian,
      tanggalBergabung: users.tanggalBergabung,
      status: users.status,
    })
    .from(users)
    .orderBy(asc(users.nama));
  return rows.map(serialize);
}

export type OptionItem = { value: string; label: string };

export async function getRefOptions(): Promise<{
  anakOptions: OptionItem[];
  pengasuhOptions: OptionItem[];
}> {
  await ready();
  const [anakList, pengasuhList] = await Promise.all([
    db
      .select({ id: anak.id, nama: anak.namaLengkap })
      .from(anak)
      .orderBy(asc(anak.namaLengkap)),
    db
      .select({ id: users.id, nama: users.nama })
      .from(users)
      .orderBy(asc(users.nama)),
  ]);
  return {
    anakOptions: anakList.map((row) => ({ value: String(row.id), label: row.nama })),
    pengasuhOptions: pengasuhList.map((row) => ({
      value: String(row.id),
      label: row.nama,
    })),
  };
}

export async function getNavCounts() {
  await ready();
  const [anakRows, kebutuhanRows, perlindunganRows] = await Promise.all([
    db.select({ status: anak.status }).from(anak),
    db.select({ status: kebutuhan.status }).from(kebutuhan),
    db.select({ status: perlindungan.status }).from(perlindungan),
  ]);
  return {
    anakAktif: anakRows.filter((row) => row.status === "aktif").length,
    kebutuhanBelum: kebutuhanRows.filter((row) => row.status !== "terpenuhi").length,
    kasusAktif: perlindunganRows.filter((row) => row.status !== "selesai").length,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export async function getDashboard() {
  await ready();
  const [anakRows, kebutuhanRows, perlindunganRows, kegiatanRows, donasiRows, pengeluaranRows] =
    await Promise.all([
      db.select().from(anak).orderBy(asc(anak.namaLengkap)),
      db.select().from(kebutuhan).orderBy(desc(kebutuhan.tanggal), desc(kebutuhan.id)),
      db.select().from(perlindungan).orderBy(desc(perlindungan.tanggalLaporan), desc(perlindungan.id)),
      db.select().from(kegiatan).orderBy(desc(kegiatan.tanggal), desc(kegiatan.id)),
      db.select().from(donasi).orderBy(desc(donasi.tanggal), desc(donasi.id)),
      db.select().from(pengeluaran).orderBy(desc(pengeluaran.tanggal), desc(pengeluaran.id)),
    ]);

  const aktif = anakRows.filter((row) => row.status === "aktif");
  const kategoriCount = {
    yatim: anakRows.filter((row) => row.kategori === "yatim").length,
    piatu: anakRows.filter((row) => row.kategori === "piatu").length,
    yatim_piatu: anakRows.filter((row) => row.kategori === "yatim_piatu").length,
    dhuafa: anakRows.filter((row) => row.kategori === "dhuafa").length,
  };

  const umurBuckets = [0, 0, 0, 0, 0];
  for (const row of anakRows) {
    const lahir = new Date(row.tanggalLahir + "T00:00:00");
    const age = (Date.now() - lahir.getTime()) / (365.25 * 86_400_000);
    if (age < 7) umurBuckets[0]! += 1;
    else if (age < 10) umurBuckets[1]! += 1;
    else if (age < 13) umurBuckets[2]! += 1;
    else if (age < 16) umurBuckets[3]! += 1;
    else umurBuckets[4]! += 1;
  }

  const totalMasuk = donasiRows
    .filter((row) => row.status === "diterima")
    .reduce((total, row) => total + row.jumlah, 0);
  const totalKeluar = pengeluaranRows.reduce((total, row) => total + row.jumlah, 0);
  const donasiMenunggu = donasiRows
    .filter((row) => row.status === "menunggu")
    .reduce((total, row) => total + row.jumlah, 0);

  const kebutuhanPerKategori = new Map<string, { total: number; terpenuhi: number }>();
  for (const row of kebutuhanRows) {
    const entry = kebutuhanPerKategori.get(row.kategori) ?? { total: 0, terpenuhi: 0 };
    entry.total += 1;
    if (row.status === "terpenuhi") entry.terpenuhi += 1;
    kebutuhanPerKategori.set(row.kategori, entry);
  }

  const hariIni = new Date().toISOString().slice(0, 10);
  const kegiatanMendatang = [...kegiatanRows]
    .filter((row) => row.tanggal >= hariIni && row.status !== "dibatalkan")
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 5);

  return {
    totalAnak: anakRows.length,
    anakAktif: aktif.length,
    anakLaki: aktif.filter((row) => row.jenisKelamin === "L").length,
    anakPerempuan: aktif.filter((row) => row.jenisKelamin === "P").length,
    kategoriCount,
    umurBuckets,
    kebutuhanTotal: kebutuhanRows.length,
    kebutuhanBelum: kebutuhanRows.filter(
      (row) => row.status === "belum_terpenuhi" || row.status === "sebagian",
    ).length,
    kebutuhanDarurat: kebutuhanRows.filter(
      (row) => row.prioritas === "darurat" && row.status !== "terpenuhi",
    ).length,
    kebutuhanPerKategori: [...kebutuhanPerKategori.entries()].map(([kategori, value]) => ({
      kategori,
      total: value.total,
      terpenuhi: value.terpenuhi,
    })),
    kasusAktif: perlindunganRows.filter((row) => row.status !== "selesai").length,
    kasusTinggi: perlindunganRows.filter(
      (row) => row.tingkat === "tinggi" && row.status !== "selesai",
    ).length,
    kasusSelesai: perlindunganRows.filter((row) => row.status === "selesai").length,
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
    donasiMenunggu,
    kegiatanMendatang: kegiatanMendatang.map(serialize),
    kebutuhanPrioritas: kebutuhanRows
      .filter((row) => row.status !== "terpenuhi")
      .slice(0, 6)
      .map(serialize),
    kasusTerbaru: perlindunganRows.filter((row) => row.status !== "selesai").slice(0, 5).map(serialize),
    donasiTerbaru: donasiRows.slice(0, 5).map(serialize),
    anakList: anakRows.map(serialize),
  };
}

export async function loadResource(
  key: "anak" | "kebutuhan" | "perlindungan" | "kegiatan" | "donasi" | "pengeluaran" | "pengasuh",
): Promise<Row[]> {
  switch (key) {
    case "anak":
      return getAnakRows();
    case "kebutuhan":
      return getKebutuhanRows();
    case "perlindungan":
      return getPerlindunganRows();
    case "kegiatan":
      return getKegiatanRows();
    case "donasi":
      return getDonasiRows();
    case "pengeluaran":
      return getPengeluaranRows();
    case "pengasuh":
      return getPengasuhRows();
    default:
      return [];
  }
}

export async function getAnakDetail(id: number) {
  await ready();
  const rows = await db.select().from(anak).where(eq(anak.id, id)).limit(1);
  const found = rows[0];
  if (!found) return null;
  const [kebutuhanRows, perlindunganRows, kegiatanRows, pengasuhRows, allAnak] =
    await Promise.all([
      db.select().from(kebutuhan).where(eq(kebutuhan.anakId, id)).orderBy(desc(kebutuhan.tanggal)),
      db
        .select()
        .from(perlindungan)
        .where(eq(perlindungan.anakId, id))
        .orderBy(desc(perlindungan.tanggalLaporan)),
      db.select().from(kegiatan).orderBy(desc(kegiatan.tanggal)).limit(12),
      db.select({ id: users.id, nama: users.nama }).from(users).orderBy(asc(users.nama)),
      db.select({ id: anak.id, nama: anak.namaLengkap }).from(anak).orderBy(asc(anak.namaLengkap)),
    ]);
  return {
    anak: serialize(found),
    kebutuhan: kebutuhanRows.map(serialize),
    perlindungan: perlindunganRows.map(serialize),
    kegiatan: kegiatanRows.map(serialize),
    pengasuhOptions: pengasuhRows.map((row) => ({ value: String(row.id), label: row.nama })),
    anakOptions: allAnak.map((row) => ({ value: String(row.id), label: row.nama })),
  };
}
