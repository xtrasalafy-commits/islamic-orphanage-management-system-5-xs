export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "time"
  | "select"
  | "email"
  | "tel"
  | "ref-anak"
  | "ref-pengasuh";

export type Option = { value: string; label: string };

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Option[];
  placeholder?: string;
  full?: boolean;
  help?: string;
  initial?: string;
};

export type ResourceKey =
  | "anak"
  | "kebutuhan"
  | "perlindungan"
  | "kegiatan"
  | "donasi"
  | "pengeluaran"
  | "pengasuh";

export const JENIS_KELAMIN: Option[] = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

export const KATEGORI_ANAK: Option[] = [
  { value: "yatim", label: "Yatim" },
  { value: "piatu", label: "Piatu" },
  { value: "yatim_piatu", label: "Yatim Piatu" },
  { value: "dhuafa", label: "Dhuafa" },
];

export const STATUS_ANAK: Option[] = [
  { value: "aktif", label: "Aktif" },
  { value: "lulus", label: "Alumni / Lulus" },
  { value: "kembali_keluarga", label: "Kembali ke Keluarga" },
  { value: "mutasi", label: "Mutasi Panti" },
];

export const JENJANG: Option[] = [
  { value: "TK", label: "TK / RA" },
  { value: "SD", label: "SD / MI" },
  { value: "SMP", label: "SMP / MTs" },
  { value: "SMA", label: "SMA / MA" },
  { value: "SMK", label: "SMK" },
  { value: "Pesantren", label: "Pesantren" },
];

export const GOL_DARAH: Option[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
  { value: "-", label: "Belum diketahui" },
];

export const KATEGORI_KEBUTUHAN: Option[] = [
  { value: "pangan", label: "Pangan & Gizi" },
  { value: "sandang", label: "Sandang" },
  { value: "papan", label: "Papan / Tempat Tinggal" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "ibadah", label: "Ibadah & Qur'an" },
  { value: "psikososial", label: "Psikososial & Kasih Sayang" },
  { value: "keterampilan", label: "Keterampilan & Life Skill" },
];

export const PRIORITAS: Option[] = [
  { value: "darurat", label: "Darurat" },
  { value: "tinggi", label: "Tinggi" },
  { value: "sedang", label: "Sedang" },
  { value: "rendah", label: "Rendah" },
];

export const STATUS_KEBUTUHAN: Option[] = [
  { value: "belum_terpenuhi", label: "Belum Terpenuhi" },
  { value: "sebagian", label: "Terpenuhi Sebagian" },
  { value: "terpenuhi", label: "Terpenuhi" },
];

export const JENIS_PERLINDUNGAN: Option[] = [
  { value: "fisik", label: "Kekerasan Fisik" },
  { value: "psikis", label: "Kekerasan Psikis / Verbal" },
  { value: "eksploitasi", label: "Eksploitasi Ekonomi" },
  { value: "penelantaran", label: "Penelantaran" },
  { value: "perundungan", label: "Perundungan (Bullying)" },
  { value: "seksual", label: "Pelecehan Seksual" },
  { value: "lainnya", label: "Lainnya" },
];

export const TINGKAT: Option[] = [
  { value: "tinggi", label: "Tinggi" },
  { value: "sedang", label: "Sedang" },
  { value: "rendah", label: "Rendah" },
];

export const STATUS_KASUS: Option[] = [
  { value: "baru", label: "Laporan Baru" },
  { value: "investigasi", label: "Investigasi" },
  { value: "penanganan", label: "Penanganan" },
  { value: "selesai", label: "Selesai" },
];

export const KATEGORI_KEGIATAN: Option[] = [
  { value: "tpq", label: "TPQ / Mengaji" },
  { value: "tahfidz", label: "Tahfidz & Tahsin" },
  { value: "kajian", label: "Kajian / Majelis Ilmu" },
  { value: "olahraga", label: "Olahraga" },
  { value: "keterampilan", label: "Keterampilan" },
  { value: "sosial", label: "Sosial & Kebersamaan" },
  { value: "kesehatan", label: "Kesehatan" },
];

export const STATUS_KEGIATAN: Option[] = [
  { value: "terjadwal", label: "Terjadwal" },
  { value: "berlangsung", label: "Berlangsung" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export const JENIS_DONASI: Option[] = [
  { value: "infaq", label: "Infaq" },
  { value: "sedekah", label: "Sedekah" },
  { value: "zakat", label: "Zakat" },
  { value: "wakaf", label: "Wakaf" },
  { value: "hibah", label: "Hibah" },
  { value: "barang", label: "Donasi Barang" },
];

export const METODE_DONASI: Option[] = [
  { value: "transfer", label: "Transfer Bank" },
  { value: "tunai", label: "Tunai" },
  { value: "qris", label: "QRIS" },
  { value: "barang", label: "Barang" },
];

export const STATUS_DONASI: Option[] = [
  { value: "menunggu", label: "Menunggu Konfirmasi" },
  { value: "diterima", label: "Diterima" },
  { value: "ditolak", label: "Ditolak" },
];

export const KATEGORI_PENGELUARAN: Option[] = [
  { value: "pangan", label: "Pangan & Dapur" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "operasional", label: "Operasional" },
  { value: "ibadah", label: "Ibadah" },
  { value: "perlindungan", label: "Perlindungan Anak" },
  { value: "lainnya", label: "Lainnya" },
];

export const PERAN: Option[] = [
  { value: "kepala", label: "Kepala Panti" },
  { value: "pengurus", label: "Pengurus / Admin" },
  { value: "pengasuh", label: "Pengasuh" },
  { value: "pengajar", label: "Pengajar / Ustadz" },
  { value: "kesehatan", label: "Petugas Kesehatan" },
];

export const STATUS_PENGGUNA: Option[] = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export const RESOURCE_FIELDS: Record<ResourceKey, FieldSpec[]> = {
  anak: [
    { name: "namaLengkap", label: "Nama Lengkap", type: "text", required: true, placeholder: "Ahmad Fauzan Ramadhan" },
    { name: "namaPanggilan", label: "Nama Panggilan", type: "text", placeholder: "Fauzan" },
    { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", required: true, options: JENIS_KELAMIN },
    { name: "kategori", label: "Kategori Anak", type: "select", required: true, options: KATEGORI_ANAK },
    { name: "tanggalLahir", label: "Tanggal Lahir", type: "date", required: true },
    { name: "tempatLahir", label: "Tempat Lahir", type: "text", placeholder: "Bandung" },
    { name: "tanggalMasuk", label: "Tanggal Masuk Panti", type: "date", required: true },
    { name: "status", label: "Status Anak", type: "select", required: true, options: STATUS_ANAK },
    { name: "jenjang", label: "Jenjang Pendidikan", type: "select", options: JENJANG },
    { name: "kelas", label: "Kelas", type: "text", placeholder: "6B" },
    { name: "sekolah", label: "Nama Sekolah / Madrasah", type: "text", placeholder: "MI Al-Ihsan" },
    { name: "pengasuhId", label: "Pengasuh Pendamping", type: "ref-pengasuh" },
    { name: "namaWali", label: "Nama Wali", type: "text", placeholder: "Nurhayati" },
    { name: "hubunganWali", label: "Hubungan Wali", type: "text", placeholder: "Nenek" },
    { name: "teleponWali", label: "Telepon Wali", type: "tel", placeholder: "0812-3456-7890" },
    { name: "golonganDarah", label: "Golongan Darah", type: "select", options: GOL_DARAH },
    { name: "alamat", label: "Alamat Asal", type: "textarea", full: true, placeholder: "Jl. Kebon Kelapa No. 12, Bandung" },
    { name: "catatanKesehatan", label: "Catatan Kesehatan", type: "textarea", full: true, placeholder: "Alergi seafood, rutin kontrol tiap 3 bulan" },
    { name: "catatan", label: "Catatan Pendampingan", type: "textarea", full: true },
  ],
  kebutuhan: [
    { name: "anakId", label: "Anak Asuh", type: "ref-anak", required: true },
    { name: "kategori", label: "Kategori Kebutuhan Dasar", type: "select", required: true, options: KATEGORI_KEBUTUHAN },
    { name: "judul", label: "Ringkasan Kebutuhan", type: "text", required: true, placeholder: "Seragam sekolah & sepatu ukuran 38" },
    { name: "prioritas", label: "Prioritas", type: "select", required: true, options: PRIORITAS },
    { name: "status", label: "Status Pemenuhan", type: "select", required: true, options: STATUS_KEBUTUHAN },
    { name: "tanggal", label: "Tanggal Pencatatan", type: "date", required: true },
    { name: "estimasiBiaya", label: "Estimasi Biaya (Rp)", type: "currency", placeholder: "750000" },
    { name: "deskripsi", label: "Deskripsi", type: "textarea", full: true },
    { name: "catatan", label: "Catatan Tindak Lanjut", type: "textarea", full: true },
  ],
  perlindungan: [
    { name: "anakId", label: "Anak Asuh", type: "ref-anak", required: true },
    { name: "jenis", label: "Jenis Kasus", type: "select", required: true, options: JENIS_PERLINDUNGAN },
    { name: "tingkat", label: "Tingkat Risiko", type: "select", required: true, options: TINGKAT },
    { name: "status", label: "Status Penanganan", type: "select", required: true, options: STATUS_KASUS },
    { name: "tanggalLaporan", label: "Tanggal Laporan", type: "date", required: true },
    { name: "pelapor", label: "Pelapor", type: "text", placeholder: "Ust. Fauzi (Pengasuh)" },
    { name: "penangan", label: "Petugas Penangan", type: "text", placeholder: "Khadijah, S.Kep" },
    { name: "deskripsi", label: "Kronologi / Deskripsi", type: "textarea", required: true, full: true },
    { name: "tindakLanjut", label: "Rencana Tindak Lanjut", type: "textarea", full: true },
  ],
  kegiatan: [
    { name: "judul", label: "Nama Kegiatan", type: "text", required: true, placeholder: "Halaqah Tahfidz Juz 3" },
    { name: "kategori", label: "Kategori", type: "select", required: true, options: KATEGORI_KEGIATAN },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "waktu", label: "Waktu", type: "time", placeholder: "16:30 - 18:00" },
    { name: "lokasi", label: "Lokasi", type: "text", placeholder: "Aula Utama" },
    { name: "penanggungJawab", label: "Penanggung Jawab", type: "text", placeholder: "Ust. Farhan" },
    { name: "status", label: "Status", type: "select", required: true, options: STATUS_KEGIATAN },
    { name: "kapasitas", label: "Kuota Peserta", type: "number", placeholder: "40" },
    { name: "deskripsi", label: "Deskripsi", type: "textarea", full: true },
  ],
  donasi: [
    { name: "namaDonatur", label: "Nama Donatur", type: "text", required: true, placeholder: "H. Ridwan Hakim" },
    { name: "jenis", label: "Jenis Donasi", type: "select", required: true, options: JENIS_DONASI },
    { name: "jumlah", label: "Nilai Donasi (Rp)", type: "currency", required: true, placeholder: "2500000" },
    { name: "metode", label: "Metode", type: "select", required: true, options: METODE_DONASI },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: STATUS_DONASI },
    { name: "program", label: "Program / Peruntukan", type: "text", placeholder: "Beasiswa Pendidikan" },
    { name: "catatan", label: "Catatan / Doa", type: "textarea", full: true },
  ],
  pengeluaran: [
    { name: "judul", label: "Uraian Pengeluaran", type: "text", required: true, placeholder: "Belanja semboko bulan Rajab" },
    { name: "kategori", label: "Kategori", type: "select", required: true, options: KATEGORI_PENGELUARAN },
    { name: "jumlah", label: "Jumlah (Rp)", type: "currency", required: true, placeholder: "4500000" },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "dicatatOleh", label: "Dicatat Oleh", type: "text", placeholder: "Siti Aminah" },
    { name: "keterangan", label: "Keterangan", type: "textarea", full: true },
  ],
  pengasuh: [
    { name: "nama", label: "Nama Lengkap", type: "text", required: true, placeholder: "Ust. Muhammad Fauzi" },
    { name: "email", label: "Email (untuk login)", type: "email", required: true, placeholder: "fauzi@panti.id" },
    { name: "peran", label: "Peran", type: "select", required: true, options: PERAN },
    { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: JENIS_KELAMIN },
    { name: "telepon", label: "Telepon", type: "tel", placeholder: "0812-2233-4455" },
    { name: "tanggalBergabung", label: "Tanggal Bergabung", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: STATUS_PENGGUNA },
    { name: "keahlian", label: "Keahlian", type: "text", placeholder: "Tahsin, Matematika, Peer Counselor" },
    { name: "alamat", label: "Alamat", type: "textarea", full: true },
  ],
};

export const RESOURCE_TITLE: Record<ResourceKey, { title: string; subtitle: string }> = {
  anak: { title: "Data Anak Asuh", subtitle: "Kependudukan & profil anak yatim, piatu, dan dhuafa yang diasuh" },
  kebutuhan: { title: "Kebutuhan Dasar", subtitle: "Pemenuhan pangan, sandang, papan, kesehatan, pendidikan, ibadah & psikososial" },
  perlindungan: { title: "Perlindungan Anak", subtitle: "Pencatatan, penanganan, dan pemantauan kasus perlindungan anak" },
  kegiatan: { title: "Kegiatan Panti", subtitle: "Jadwal TPQ, tahfidz, kajian, keterampilan, dan kegiatan pembinaan" },
  donasi: { title: "Donasi & Infaq", subtitle: "Riwayat infaq, sedekah, zakat, dan wakaf dari para muhsinin" },
  pengeluaran: { title: "Pengeluaran", subtitle: "Belanja dan operasional panti beserta peruntukannya" },
  pengasuh: { title: "Pengasuh & Pengurus", subtitle: "Data pengasuh, ustadz/ustadzah, dan pengurus panti" },
};

export function labelOf(options: Option[] | undefined, value: unknown): string {
  if (!options) return String(value ?? "-");
  const found = options.find((option) => option.value === String(value ?? ""));
  return found ? found.label : String(value ?? "-");
}
