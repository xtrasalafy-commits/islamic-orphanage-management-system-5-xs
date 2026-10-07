import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Peran pengurus / pengasuh panti */
export type Peran =
  | "kepala"
  | "pengurus"
  | "pengasuh"
  | "pengajar"
  | "kesehatan";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    nama: text("nama").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    peran: text("peran").notNull().default("pengasuh").$type<Peran>(),
    jenisKelamin: text("jenis_kelamin").notNull().default("L"),
    telepon: text("telepon"),
    alamat: text("alamat"),
    keahlian: text("keahlian"),
    tanggalBergabung: date("tanggal_bergabung").notNull(),
    status: text("status").notNull().default("aktif"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Data anak asuh */
export const anak = pgTable(
  "anak",
  {
    id: serial("id").primaryKey(),
    namaLengkap: text("nama_lengkap").notNull(),
    namaPanggilan: text("nama_panggilan"),
    jenisKelamin: text("jenis_kelamin").notNull().default("L"),
    kategori: text("kategori").notNull().default("yatim"),
    status: text("status").notNull().default("aktif"),
    tanggalLahir: date("tanggal_lahir").notNull(),
    tempatLahir: text("tempat_lahir"),
    tanggalMasuk: date("tanggal_masuk").notNull(),
    jenjang: text("jenjang"),
    kelas: text("kelas"),
    sekolah: text("sekolah"),
    namaWali: text("nama_wali"),
    hubunganWali: text("hubungan_wali"),
    teleponWali: text("telepon_wali"),
    alamat: text("alamat"),
    golonganDarah: text("golongan_darah"),
    catatanKesehatan: text("catatan_kesehatan"),
    pengasuhId: integer("pengasuh_id").references(() => users.id, {
      onDelete: "set null",
    }),
    catatan: text("catatan"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("anak_status_idx").on(table.status),
    index("anak_nama_idx").on(table.namaLengkap),
  ],
);

/** Kebutuhan dasar anak: pangan, sandang, papan, kesehatan, pendidikan, ibadah, psikososial */
export const kebutuhan = pgTable(
  "kebutuhan",
  {
    id: serial("id").primaryKey(),
    anakId: integer("anak_id")
      .notNull()
      .references(() => anak.id, { onDelete: "cascade" }),
    kategori: text("kategori").notNull(),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi"),
    prioritas: text("prioritas").notNull().default("sedang"),
    status: text("status").notNull().default("belum_terpenuhi"),
    tanggal: date("tanggal").notNull(),
    estimasiBiaya: integer("estimasi_biaya").notNull().default(0),
    catatan: text("catatan"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("kebutuhan_anak_idx").on(table.anakId),
    index("kebutuhan_status_idx").on(table.status),
  ],
);

/** Kasus perlindungan anak */
export const perlindungan = pgTable(
  "perlindungan",
  {
    id: serial("id").primaryKey(),
    anakId: integer("anak_id")
      .notNull()
      .references(() => anak.id, { onDelete: "cascade" }),
    jenis: text("jenis").notNull(),
    tingkat: text("tingkat").notNull().default("sedang"),
    tanggalLaporan: date("tanggal_laporan").notNull(),
    pelapor: text("pelapor"),
    deskripsi: text("deskripsi").notNull(),
    status: text("status").notNull().default("baru"),
    tindakLanjut: text("tindak_lanjut"),
    penangan: text("penangan"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("perlindungan_anak_idx").on(table.anakId),
    index("perlindungan_status_idx").on(table.status),
  ],
);

/** Kegiatan panti: TPQ, tahfidz, kajian, olahraga, keterampilan */
export const kegiatan = pgTable("kegiatan", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  kategori: text("kategori").notNull(),
  tanggal: date("tanggal").notNull(),
  waktu: text("waktu"),
  lokasi: text("lokasi"),
  penanggungJawab: text("penanggung_jawab"),
  status: text("status").notNull().default("terjadwal"),
  kapasitas: integer("kapasitas"),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Donasi / infaq masuk */
export const donasi = pgTable("donasi", {
  id: serial("id").primaryKey(),
  namaDonatur: text("nama_donatur").notNull(),
  jenis: text("jenis").notNull(),
  jumlah: integer("jumlah").notNull().default(0),
  metode: text("metode").notNull().default("transfer"),
  tanggal: date("tanggal").notNull(),
  status: text("status").notNull().default("diterima"),
  program: text("program"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Pengeluaran operasional panti */
export const pengeluaran = pgTable("pengeluaran", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  kategori: text("kategori").notNull(),
  jumlah: integer("jumlah").notNull().default(0),
  tanggal: date("tanggal").notNull(),
  keterangan: text("keterangan"),
  dicatatOleh: text("dicatat_oleh"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AnakRow = typeof anak.$inferSelect;
export type KebutuhanRow = typeof kebutuhan.$inferSelect;
export type PerlindunganRow = typeof perlindungan.$inferSelect;
export type KegiatanRow = typeof kegiatan.$inferSelect;
export type DonasiRow = typeof donasi.$inferSelect;
export type PengeluaranRow = typeof pengeluaran.$inferSelect;
export type UserRow = typeof users.$inferSelect;
