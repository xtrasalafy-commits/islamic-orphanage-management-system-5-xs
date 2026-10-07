import { sql } from "drizzle-orm";
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
import { hashPassword } from "@/lib/auth";

const DAY = 86_400_000;

/** tanggal ISO relatif terhadap hari ini */
function d(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10);
}

type AnakSeed = {
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: "L" | "P";
  kategori: string;
  status: string;
  tanggalLahir: string;
  tempatLahir: string;
  tanggalMasuk: string;
  jenjang: string;
  kelas: string;
  sekolah: string;
  namaWali: string | null;
  hubunganWali: string | null;
  teleponWali: string | null;
  alamat: string;
  golonganDarah: string;
  catatanKesehatan: string | null;
  pengasuhIdx: number | null;
  catatan: string | null;
};

const ANAK_SEED: AnakSeed[] = [
  { namaLengkap: "Ahmad Fauzan Ramadhan", namaPanggilan: "Fauzan", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-4380), tempatLahir: "Bandung", tanggalMasuk: d(-2400), jenjang: "SD", kelas: "6B", sekolah: "SDN Cibaduyut 3", namaWali: "Neneng Hasanah", hubunganWali: "Nenek", teleponWali: "0812-3311-2210", alamat: "Jl. Cibaduyut Lama No. 45, Bandung", golonganDarah: "O", catatanKesehatan: "Alergi seafood, kontrol rutin tiap 6 bulan", pengasuhIdx: 2, catatan: "Calon penghafal juz 3, sangat disiplin shalat berjamaah" },
  { namaLengkap: "Muhammad Rizki Alfarizi", namaPanggilan: "Rizki", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-5480), tempatLahir: "Cimahi", tanggalMasuk: d(-2600), jenjang: "SMP", kelas: "3A", sekolah: "MTs Al-Ihsan", namaWali: "Endang Kusumah", hubunganWali: "Bibi", teleponWali: "0857-7788-1020", alamat: "Jl. Sangkuriang No. 8, Cimahi", golonganDarah: "B", catatanKesehatan: "Rhinitis alergi debu", pengasuhIdx: 2, catatan: "Juara 2 MTQ tingkat kota cabang tilawah" },
  { namaLengkap: "Siti Nurhaliza", namaPanggilan: "Liza", jenisKelamin: "P", kategori: "yatim_piatu", status: "aktif", tanggalLahir: d(-4560), tempatLahir: "Garut", tanggalMasuk: d(-1900), jenjang: "SD", kelas: "4A", sekolah: "MI Al-Ihsan", namaWali: null, hubunganWali: null, teleponWali: null, alamat: "Kp. Sukamaju RT 03 RW 05, Garut", golonganDarah: "A", catatanKesehatan: "Rabun jauh, menggunakan kacamata -2.5", pengasuhIdx: 3, catatan: "Perlu pendampingan emosional berkala" },
  { namaLengkap: "Aisyah Putri Ramadhani", namaPanggilan: "Aisyah", jenisKelamin: "P", kategori: "piatu", status: "aktif", tanggalLahir: d(-5110), tempatLahir: "Bandung", tanggalMasuk: d(-2300), jenjang: "SMP", kelas: "2C", sekolah: "MTs Al-Ihsan", namaWali: "Yuyun Yuningsih", hubunganWali: "Kakak", teleponWali: "0813-2200-4455", alamat: "Jl. Soekarno Hatta No. 210, Bandung", golonganDarah: "AB", catatanKesehatan: null, pengasuhIdx: 3, catatan: "Aktif di tim dakwah sekolah" },
  { namaLengkap: "Yusuf Abdul Aziz", namaPanggilan: "Yusuf", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-3285), tempatLahir: "Sumedang", tanggalMasuk: d(-1200), jenjang: "SD", kelas: "3A", sekolah: "SDN Babakan Ciamis", namaWali: "Asep Saepudin", hubunganWali: "Paman", teleponWali: "0895-1111-3344", alamat: "Jl. Raya Sumedang KM 12", golonganDarah: "O", catatanKesehatan: "Asma ringan, punya inhaler di klinik panti", pengasuhIdx: 4, catatan: null },
  { namaLengkap: "Fatimah Az-Zahra", namaPanggilan: "Zahra", jenisKelamin: "P", kategori: "yatim_piatu", status: "aktif", tanggalLahir: d(-6205), tempatLahir: "Bandung", tanggalMasuk: d(-3100), jenjang: "SMA", kelas: "1 IPA", sekolah: "MA Al-Ihsan", namaWali: null, hubunganWali: null, teleponWali: null, alamat: "Kp. Maleer, Bandung", golonganDarah: "B", catatanKesehatan: "Anemia ringan, diberi suplemen zat besi", pengasuhIdx: 3, catatan: "Calon penerima beasiswa prestasi" },
  { namaLengkap: "Imam Syafi'i", namaPanggilan: "Imam", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-5840), tempatLahir: "Cianjur", tanggalMasuk: d(-2050), jenjang: "SMP", kelas: "3B", sekolah: "MTs Al-Ihsan", namaWali: "Iis Aisyah", hubunganWali: "Ibu angkat", teleponWali: "0821-4455-8899", alamat: "Jl. Ir. H. Juanda No. 90, Bandung", golonganDarah: "A", catatanKesehatan: null, pengasuhIdx: 2, catatan: "Pemandu tilawah acara panti" },
  { namaLengkap: "Zahra Salsabila", namaPanggilan: "Salsa", jenisKelamin: "P", kategori: "piatu", status: "aktif", tanggalLahir: d(-3835), tempatLahir: "Bandung", tanggalMasuk: d(-1400), jenjang: "SD", kelas: "5B", sekolah: "MI Al-Ihsan", namaWali: "Dudung Suryana", hubunganWali: "Kakek", teleponWali: "0812-9000-1122", alamat: "Jl. Antapani No. 15, Bandung", golonganDarah: "O", catatanKesehatan: "Karies gigi, dirujuk ke puskesmas", pengasuhIdx: 4, catatan: null },
  { namaLengkap: "Bilal Ramadhan", namaPanggilan: "Bilal", jenisKelamin: "L", kategori: "dhuafa", status: "aktif", tanggalLahir: d(-2555), tempatLahir: "Bandung", tanggalMasuk: d(-600), jenjang: "SD", kelas: "1A", sekolah: "SDN Derwati 2", namaWali: "Lilis Suryani", hubunganWali: "Ibu", teleponWali: "0838-7788-1234", alamat: "Gg. Melati No. 3, Bandung", golonganDarah: "B", catatanKesehatan: "Berat badan di bawah garis merah, program gizi tambahan", pengasuhIdx: 5, catatan: "Anak dari keluarga dhuafa, diasuh penuh waktu" },
  { namaLengkap: "Halimah Sa'diyah", namaPanggilan: "Halimah", jenisKelamin: "P", kategori: "yatim", status: "aktif", tanggalLahir: d(-4930), tempatLahir: "Tasikmalaya", tanggalMasuk: d(-1700), jenjang: "SMP", kelas: "2A", sekolah: "MTs Al-Ihsan", namaWali: "Enung Nurhayati", hubunganWali: "Nenek", teleponWali: "0852-6677-3311", alamat: "Kp. Cikoneng, Tasikmalaya", golonganDarah: "AB", catatanKesehatan: null, pengasuhIdx: 3, catatan: "Mahir menjahit, dibina program keterampilan" },
  { namaLengkap: "Umar Sayyid Alfaruqi", namaPanggilan: "Umar", jenisKelamin: "L", kategori: "yatim_piatu", status: "aktif", tanggalLahir: d(-6570), tempatLahir: "Bandung", tanggalMasuk: d(-3300), jenjang: "SMA", kelas: "3 IPS", sekolah: "MA Al-Ihsan", namaWali: null, hubunganWali: null, teleponWali: null, alamat: "Jl. Sukabumi No. 22, Bandung", golonganDarah: "O", catatanKesehatan: "Mata minus, diganti kacamata baru", pengasuhIdx: 2, catatan: "Persiapan ujian akhir & kas kelulusan" },
  { namaLengkap: "Maryam Fitriani", namaPanggilan: "Maryam", jenisKelamin: "P", kategori: "yatim", status: "aktif", tanggalLahir: d(-4380), tempatLahir: "Subang", tanggalMasuk: d(-1500), jenjang: "SD", kelas: "6A", sekolah: "SDN Sudirman 1", namaWali: "Ai Komariah", hubunganWali: "Bibi", teleponWali: "0877-2211-9090", alamat: "Jl. Buya Hamka No. 7, Subang", golonganDarah: "A", catatanKesehatan: null, pengasuhIdx: 4, catatan: "Hafal 2 juz, target 5 juz tahun ini" },
  { namaLengkap: "Ali Mustofa", namaPanggilan: "Ali", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-2920), tempatLahir: "Bandung", tanggalMasuk: d(-800), jenjang: "SD", kelas: "2B", sekolah: "SDN Kebon Kopi 1", namaWali: "Rahmat Hidayat", hubunganWali: "Paman", teleponWali: "0812-5566-7788", alamat: "Jl. Kebon Kopi No. 30, Bandung", golonganDarah: "B", catatanKesehatan: "Sering batuk pilek musim hujan", pengasuhIdx: 5, catatan: null },
  { namaLengkap: "Khadijah Ayu Lestari", namaPanggilan: "Dedeh", jenisKelamin: "P", kategori: "piatu", status: "aktif", tanggalLahir: d(-5295), tempatLahir: "Cimahi", tanggalMasuk: d(-2200), jenjang: "SMK", kelas: "2 Tata Boga", sekolah: "SMK Negeri 4 Bandung", namaWali: "Cucu Suryani", hubunganWali: "Nenek", teleponWali: "0813-9988-4433", alamat: "Jl. Melong Asih, Cimahi", golonganDarah: "O", catatanKesehatan: null, pengasuhIdx: 3, catatan: "Magang dapur panti, calon asisten katering" },
  { namaLengkap: "Hamzah Aditya Pratama", namaPanggilan: "Hamzah", jenisKelamin: "L", kategori: "dhuafa", status: "aktif", tanggalLahir: d(-5475), tempatLahir: "Bandung", tanggalMasuk: d(-1100), jenjang: "SMP", kelas: "3C", sekolah: "SMPN 24 Bandung", namaWali: "Wawan Setiawan", hubunganWali: "Ayah", teleponWali: "0851-4433-2200", alamat: "Gg. Cikutra No. 19, Bandung", golonganDarah: "A", catatanKesehatan: "Skoliosis ringan, dianjurkan senam rutin", pengasuhIdx: 2, catatan: "Ayah sakit jangka panjang, ibu bekerja sebagai buruh cuci" },
  { namaLengkap: "Sumayyah Anggraini", namaPanggilan: "Mayya", jenisKelamin: "P", kategori: "yatim", status: "aktif", tanggalLahir: d(-3650), tempatLahir: "Garut", tanggalMasuk: d(-950), jenjang: "SD", kelas: "4B", sekolah: "MI Al-Ihsan", namaWali: "Enung Enung", hubunganWali: "Nenek", teleponWali: "0896-1122-5566", alamat: "Kp. Pasir Wangi, Garut", golonganDarah: "B", catatanKesehatan: "Kulit sensitif, gunakan sabun khusus", pengasuhIdx: 4, catatan: null },
  { namaLengkap: "Zaid Abdullah", namaPanggilan: "Zaid", jenisKelamin: "L", kategori: "yatim_piatu", status: "aktif", tanggalLahir: d(-6020), tempatLahir: "Bandung", tanggalMasuk: d(-2800), jenjang: "SMA", kelas: "2 IPS", sekolah: "MA Al-Ihsan", namaWali: null, hubunganWali: null, teleponWali: null, alamat: "Jl. Buah Batu No. 130, Bandung", golonganDarah: "AB", catatanKesehatan: null, pengasuhIdx: 2, catatan: "Dibina program life skill desain grafis" },
  { namaLengkap: "Amina Rahmawati", namaPanggilan: "Amina", jenisKelamin: "P", kategori: "yatim", status: "aktif", tanggalLahir: d(-4750), tempatLahir: "Bandung", tanggalMasuk: d(-1300), jenjang: "SMP", kelas: "1A", sekolah: "MTs Al-Ihsan", namaWali: "Nunung Nurjanah", hubunganWali: "Ibu", teleponWali: "0822-3344-9911", alamat: "Jl. Padalarang No. 55, Bandung", golonganDarah: "O", catatanKesehatan: "Riwayat demam tifoid, jaga kebersihan makanan", pengasuhIdx: 3, catatan: "Ibu bekerja sebagai PRT di luar kota" },
  { namaLengkap: "Ibrahim Nashiruddin", namaPanggilan: "Ibrahim", jenisKelamin: "L", kategori: "yatim", status: "aktif", tanggalLahir: d(-2190), tempatLahir: "Bandung", tanggalMasuk: d(-400), jenjang: "TK", kelas: "B2", sekolah: "RA Al-Ihsan", namaWali: "Deti Amelia", hubunganWali: "Tante", teleponWali: "0813-6655-1122", alamat: "Jl. Rancaekek No. 4, Bandung", golonganDarah: "O", catatanKesehatan: "Masih perlu pendampingan makan (picky eater)", pengasuhIdx: 5, catatan: "Anak asuh termuda" },
  { namaLengkap: "Nur Annisa Zahira", namaPanggilan: "Annisa", jenisKelamin: "P", kategori: "yatim", status: "lulus", tanggalLahir: d(-7300), tempatLahir: "Bandung", tanggalMasuk: d(-4000), jenjang: "Pesantren", kelas: "Alumni", sekolah: "Pesantren Darul Ulum", namaWali: "Yeyet Rohaeti", hubunganWali: "Nenek", teleponWali: "0812-8877-6655", alamat: "Jl. Cicalengka No. 12, Bandung", golonganDarah: "A", catatanKesehatan: null, pengasuhIdx: null, catatan: "Lulus 2025, melanjutkan ke pesantren dan sudah mandiri" },
];

type KebutuhanSeed = {
  anakIdx: number;
  kategori: string;
  judul: string;
  deskripsi: string;
  prioritas: string;
  status: string;
  tanggal: string;
  estimasiBiaya: number;
  catatan: string | null;
};

const KEBUTUHAN_SEED: KebutuhanSeed[] = [
  { anakIdx: 8, kategori: "pangan", judul: "Program gizi tambahan 3 bulan", deskripsi: "Berat badan Bilal di bawah garis merah. Dibutuhkan susu pertumbuhan, telur, dan buah tambahan setiap hari selama 3 bulan.", prioritas: "darurat", status: "sebagian", tanggal: d(-24), estimasiBiaya: 2_700_000, catatan: "Sudah ada donatur tetap menanggung 40%, sisanya dicari melalui program Infaq Gizi." },
  { anakIdx: 4, kategori: "kesehatan", judul: "Kacamata baru Yusuf", deskripsi: "Kacamata lama rusak akibat bermain bola. Diperlukan pemeriksaan mata dan pembuatan kacamata baru.", prioritas: "tinggi", status: "belum_terpenuhi", tanggal: d(-12), estimasiBiaya: 850_000, catatan: "Direncanakan ke Optik Sehat bersama 2 anak lain." },
  { anakIdx: 13, kategori: "kesehatan", judul: "Kontrol skoliosis & senam terapi", deskripsi: "Konsultasi ortopedi lanjutan serta biaya senam terapi 8x pertemuan.", prioritas: "sedang", status: "sebagian", tanggal: d(-40), estimasiBiaya: 1_400_000, catatan: "Sudah 4x senam terapi, perkembangan postur membaik." },
  { anakIdx: 0, kategori: "ibadah", judul: "Buku tahfidz & mushaf tajwid", deskripsi: "Penggantian mushaf juz 1-5 dan buku tartil untuk 6 santri kelas 6 TPQ.", prioritas: "sedang", status: "terpenuhi", tanggal: d(-60), estimasiBiaya: 900_000, catatan: "Terpenuhi dari infaq jamaah tarawih." },
  { anakIdx: 2, kategori: "pendidikan", judul: "Bimbingan belajar & les privat", deskripsi: "Liza membutuhkan bimbingan belajar matematika dan membaca agar tidak tertinggal di kelas 4.", prioritas: "tinggi", status: "sebagian", tanggal: d(-18), estimasiBiaya: 600_000, catatan: "Sudah ada kakak asuh relawan untuk 2 sesi/minggu." },
  { anakIdx: 10, kategori: "pendidikan", judul: "Biaya ujian akhir & kas kelulusan", deskripsi: "Biaya ujian sekolah, seragam praktek, dan perlengkapan kelulusan Umar.", prioritas: "tinggi", status: "sebagian", tanggal: d(-9), estimasiBiaya: 1_850_000, catatan: "Pengurusan dokumen dilakukan pengurus pada minggu ini." },
  { anakIdx: 18, kategori: "pangan", judul: "Pendampingan pola makan anak TK", deskripsi: "Ibrahim termasuk pemilih makanan. Perlu pendampingan pola makan dan vitamin penambah nafsu makan.", prioritas: "sedang", status: "terpenuhi", tanggal: d(-30), estimasiBiaya: 350_000, catatan: "Berat badan naik 0,8 kg dalam sebulan." },
  { anakIdx: 7, kategori: "kesehatan", judul: "Perawatan gigi (tambal & scaling)", deskripsi: "Salsa memiliki 3 gigi berlubang. Perlu penanganan puskesmas gigi.", prioritas: "sedang", status: "belum_terpenuhi", tanggal: d(-6), estimasiBiaya: 500_000, catatan: null },
  { anakIdx: 5, kategori: "kesehatan", judul: "Suplemen zat besi & cek darah", deskripsi: "Fatimah terdiagnosa anemia ringan, perlu cek darah ulang dan suplemen 2 bulan.", prioritas: "tinggi", status: "sebagian", tanggal: d(-15), estimasiBiaya: 420_000, catatan: "Suplemen sudah dibeli, cek darah lanjutan minggu depan." },
  { anakIdx: 12, kategori: "sandang", judul: "Jaket & mukena musim hujan", deskripsi: "Diperlukan jaket sekolah untuk 5 anak dan mukena baru untuk 4 anak perempuan.", prioritas: "sedang", status: "sebagian", tanggal: d(-21), estimasiBiaya: 1_600_000, catatan: "3 jaket sudah didapat dari donasi barang." },
  { anakIdx: 1, kategori: "psikososial", judul: "Konseling trauma & pendampingan psikolog", deskripsi: "Rizki menunjukkan penarikan diri setelah kehilangan ayah. Dibutuhkan sesi konseling bersama psikolog relawan.", prioritas: "tinggi", status: "sebagian", tanggal: d(-33), estimasiBiaya: 1_200_000, catatan: "Sudah 3 sesi, respons mulai terbuka. Lanjut 5 sesi lagi." },
  { anakIdx: 3, kategori: "psikososial", judul: "Kelas mengenal emosi & syukur", deskripsi: "Program mingguan pembinaan akhlak dan literasi emosi untuk anak perempuan SMP.", prioritas: "sedang", status: "terpenuhi", tanggal: d(-50), estimasiBiaya: 400_000, catatan: "Diikuti 9 anak, akan diulang tiap bulan." },
  { anakIdx: 16, kategori: "keterampilan", judul: "Kursus desain grafis dasar", deskripsi: "Zaid mengikuti kelas desain grafis dasar (12 pertemuan) untuk bekal usaha mandiri.", prioritas: "rendah", status: "sebagian", tanggal: d(-45), estimasiBiaya: 1_000_000, catatan: "Sudah 8 pertemuan, mulai menerima pesanan kaos sederhana." },
  { anakIdx: 9, kategori: "keterampilan", judul: "Mesin jahit & bahan praktik menjahit", deskripsi: "Halimah dibina keterampilan menjahit, dibutuhkan 1 mesin jahit dan bahan kain praktik.", prioritas: "sedang", status: "belum_terpenuhi", tanggal: d(-8), estimasiBiaya: 2_200_000, catatan: null },
  { anakIdx: 11, kategori: "ibadah", judul: "Program tahfidz 5 juz", deskripsi: "Maryam bertarget menyelesaikan 3 juz tambahan tahun ini, diperlukan mushaf besar dan ustadz pendamping tambahan.", prioritas: "sedang", status: "sebagian", tanggal: d(-27), estimasiBiaya: 1_500_000, catatan: "Sudah hafal juz 27 dan 28 lancar." },
  { anakIdx: 14, kategori: "papan", judul: "Renovasi kamar asrama putra", deskripsi: "Kamar asrama putra membutuhkan pengecatan, perbaikan plafon bocor, dan penambahan 3 kasur.", prioritas: "tinggi", status: "belum_terpenuhi", tanggal: d(-5), estimasiBiaya: 8_500_000, catatan: "Menunggu konfirmasi donatur korporat." },
];

type PerlindunganSeed = {
  anakIdx: number;
  jenis: string;
  tingkat: string;
  tanggalLaporan: string;
  pelapor: string;
  deskripsi: string;
  status: string;
  tindakLanjut: string | null;
  penangan: string;
};

const PERLINDUNGAN_SEED: PerlindunganSeed[] = [
  { anakIdx: 8, jenis: "penelantaran", tingkat: "tinggi", tanggalLaporan: d(-70), pelapor: "Ust. Muhammad Fauzi", deskripsi: "Bilal sering ditinggal orang tua bekerja hingga larut malam tanpa pengawasan dan makan. Rumah tidak layak huni.", status: "penanganan", tindakLanjut: "Anak dititipkan ke panti secara resmi, pendampingan oleh pengasuh pendamping, koordinasi dengan Dinas Sosial untuk bantuan rumah.", penangan: "Siti Aminah (Pengurus)" },
  { anakIdx: 1, jenis: "psikis", tingkat: "sedang", tanggalLaporan: d(-45), pelapor: "Ustzh. Nur Hidayah", deskripsi: "Rizki menjadi pendiam, mudah menangis, dan menutup diri setelah ditinggal wafat ayahnya. Indikasi kesedihan yang belum tertangani.", status: "penanganan", tindakLanjut: "Rujuk konseling psikolog relawan 8 sesi, pendampingan teman sebaya, dan penguatan kegiatan halaqah.", penangan: "Khadijah Salma, S.Kep" },
  { anakIdx: 13, jenis: "eksploitasi", tingkat: "tinggi", tanggalLaporan: d(-120), pelapor: "Siti Aminah", deskripsi: "Hamzah sebelumnya dipekerjakan membantu jualan hingga larut malam dan tidak bersekolah selama 2 bulan.", status: "selesai", tindakLanjut: "Pendampingan orang tua oleh Dinas Sosial, Hamzah kembali bersekolah penuh dan dipantau bulanan.", penangan: "Ust. H. Abdullah Rahman" },
  { anakIdx: 12, jenis: "perundungan", tingkat: "sedang", tanggalLaporan: d(-14), pelapor: "Ali Mustofa (laporan pengasuh)", deskripsi: "Ali melaporkan diejek teman sekolah karena baju yang lusuh. Terjadi berulang di lingkungan sekolah.", status: "investigasi", tindakLanjut: "Komunikasi dengan wali kelas, pemberian seragam baru, dan penguatan kelas anti perundungan.", penangan: "Ustzh. Nur Hidayah" },
  { anakIdx: 4, jenis: "fisik", tingkat: "tinggi", tanggalLaporan: d(-200), pelapor: "Khadijah Salma, S.Kep", deskripsi: "Ditemukan lebam pada lengan saat pemeriksaan kesehatan rutin. Diduga kekerasan oleh kerabat dekat sebelum masuk panti.", status: "selesai", tindakLanjut: "Laporan ke Dinas Pemberdayaan Perempuan & Perlindungan Anak (DP3A), pemisahan sementara dari kerabat, pendampingan trauma selesai.", penangan: "Ust. H. Abdullah Rahman" },
  { anakIdx: 2, jenis: "psikis", tingkat: "sedang", tanggalLaporan: d(-3), pelapor: "Ustzh. Nur Hidayah", deskripsi: "Liza menunjukkan kecemasan berlebih saat dibicarakan tentang keluarga, sulit tidur dan sering terbangun malam.", status: "baru", tindakLanjut: null, penangan: "Khadijah Salma, S.Kep" },
  { anakIdx: 7, jenis: "seksual", tingkat: "tinggi", tanggalLaporan: d(-8), pelapor: "Ustzh. Aisyah Rahma", deskripsi: "Laporan dugaan pesan tidak pantas yang diterima Salsa melalui media sosial dari akun tidak dikenal.", status: "investigasi", tindakLanjut: "Pengawasan gawai panti, pelaporan ke layanan pengaduan, edukasi literasi digital untuk seluruh anak usia SMP.", penangan: "Siti Aminah (Pengurus)" },
  { anakIdx: 17, jenis: "perundungan", tingkat: "rendah", tanggalLaporan: d(-35), pelapor: "Ust. Farhan Maulana", deskripsi: "Zaid menegur adik kelasnya dengan kata-kata kasar saat kegiatan TPQ.", status: "selesai", tindakLanjut: "Pembinaan akhlak, meminta maaf, dan diberi amanah sebagai kakak pendamping TPQ.", penangan: "Ust. Farhan Maulana" },
  { anakIdx: 14, jenis: "penelantaran", tingkat: "sedang", tanggalLaporan: d(-2), pelapor: "Ustzh. Nur Hidayah", deskripsi: "Kondisi rumah Hamzah semakin tidak layak setelah ayah sakit panjang, biaya pengobatan menumpuk.", status: "baru", tindakLanjut: null, penangan: "Siti Aminah (Pengurus)" },
];

type KegiatanSeed = {
  judul: string;
  kategori: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  penanggungJawab: string;
  status: string;
  kapasitas: number;
  deskripsi: string;
};

const KEGIATAN_SEED: KegiatanSeed[] = [
  { judul: "Bimbingan TPQ Al-Qur'an", kategori: "tpq", tanggal: d(1), waktu: "16:30 - 18:00", lokasi: "Ruang TPQ Lantai 1", penanggungJawab: "Ust. Farhan Maulana", status: "terjadwal", kapasitas: 30, deskripsi: "Kelas mengaji harian dengan pembagian kelompok iqra, juz 1, dan juz 2." },
  { judul: "Halaqah Tahfidz Ba'da Subuh", kategori: "tahfidz", tanggal: d(1), waktu: "05:45 - 06:45", lokasi: "Mushola Utama", penanggungJawab: "Ust. H. Abdullah Rahman", status: "terjadwal", kapasitas: 25, deskripsi: "Setoran hafalan juz 28-30 untuk santri kelas tahfidz." },
  { judul: "Kajian Ahad Pagi: Adab Menuntut Ilmu", kategori: "kajian", tanggal: d(4), waktu: "07:00 - 09:00", lokasi: "Aula Panti", penanggungJawab: "Ustzh. Aisyah Rahma", status: "terjadwal", kapasitas: 80, deskripsi: "Kajian terbuka untuk anak asuh dan masyarakat sekitar, dilanjutkan sarapan bersama." },
  { judul: "Kelas Keterampilan Menjahit", kategori: "keterampilan", tanggal: d(3), waktu: "14:00 - 16:00", lokasi: "Ruang Keterampilan", penanggungJawab: "Ustzh. Nur Hidayah", status: "terjadwal", kapasitas: 12, deskripsi: "Pelatihan menjahit dasar untuk anak perempuan SMP/SMA, target produk mukena." },
  { judul: "Senam & Olahraga Bersama", kategori: "olahraga", tanggal: d(2), waktu: "06:00 - 07:00", lokasi: "Lapangan Panti", penanggungJawab: "Ust. Muhammad Fauzi", status: "terjadwal", kapasitas: 40, deskripsi: "Senam pagi dan permainan bola untuk menjaga kebugaran anak." },
  { judul: "Pemeriksaan Kesehatan Bulanan", kategori: "kesehatan", tanggal: d(6), waktu: "09:00 - 12:00", lokasi: "Klinik Panti", penanggungJawab: "Khadijah Salma, S.Kep", status: "terjadwal", kapasitas: 25, deskripsi: "Cek berat badan, tekanan darah, dan konsultasi kesehatan bersama Puskesmas babak." },
  { judul: "Kelas Literasi Digital Aman", kategori: "keterampilan", tanggal: d(8), waktu: "15:30 - 17:00", lokasi: "Ruang Komputer", penanggungJawab: "Siti Aminah", status: "terjadwal", kapasitas: 15, deskripsi: "Edukasi penggunaan media sosial yang aman sebagai tindak lanjut kasus perlindungan anak." },
  { judul: "Santunan & Silaturahmi Warga", kategori: "sosial", tanggal: d(-6), waktu: "10:00 - 13:00", lokasi: "Aula Panti", penanggungJawab: "Ust. H. Abdullah Rahman", status: "selesai", kapasitas: 100, deskripsi: "Silaturahmi dengan donatur dan penyerahan santunan pendidikan bagi 12 anak." },
  { judul: "Malam Bina Iman & Taqwa (MABIT)", kategori: "kajian", tanggal: d(-13), waktu: "19:00 - 04:00", lokasi: "Mushola Utama", penanggungJawab: "Ust. Farhan Maulana", status: "selesai", kapasitas: 30, deskripsi: "Kegiatan malam penuh: tilawah, ceramah, dan muhasabah bersama anak asuh." },
  { judul: "Gotong Royong Bersih Panti", kategori: "sosial", tanggal: d(-2), waktu: "07:30 - 10:00", lokasi: "Seluruh Area Panti", penanggungJawab: "Ust. Muhammad Fauzi", status: "selesai", kapasitas: 45, deskripsi: "Kerja bakti menjaga kebersihan asrama dan lingkungan panti." },
  { judul: "Kelas Desain Grafis Dasar", kategori: "keterampilan", tanggal: d(0), waktu: "13:00 - 15:00", lokasi: "Ruang Komputer", penanggungJawab: "Relawan: Bang Ilham", status: "berlangsung", kapasitas: 10, deskripsi: "Pelatihan desain kaos dan materi dakwah digital." },
  { judul: "Lomba Tahfidz Antar Kamar", kategori: "tahfidz", tanggal: d(11), waktu: "08:00 - 12:00", lokasi: "Aula Panti", penanggungJawab: "Ust. H. Abdullah Rahman", status: "terjadwal", kapasitas: 24, deskripsi: "Kompetisi hafalan antar kamar asrama, pemenang mendapatkan beasiswa kitab." },
];

type DonasiSeed = {
  namaDonatur: string;
  jenis: string;
  jumlah: number;
  metode: string;
  tanggal: string;
  status: string;
  program: string;
  catatan: string | null;
};

const DONASI_SEED: DonasiSeed[] = [
  { namaDonatur: "H. Ridwan Hakim", jenis: "infaq", jumlah: 5_000_000, metode: "transfer", tanggal: d(-3), status: "diterima", program: "Program Gizi Anak", catatan: "Semoga anak-anak sehat dan hafal Al-Qur'an." },
  { namaDonatur: "Hamba Allah", jenis: "sedekah", jumlah: 1_250_000, metode: "transfer", tanggal: d(-5), status: "diterima", program: "Operasional Panti", catatan: "Bismillah, mohon doakan keluarga kami." },
  { namaDonatur: "PT Amanah Kreasi Sejahtera", jenis: "hibah", jumlah: 25_000_000, metode: "transfer", tanggal: d(-20), status: "diterima", program: "Renovasi Asrama", catatan: "CSR perusahaan, pencairan bertahap 2 tahap." },
  { namaDonatur: "Alumni Panti 2015", jenis: "infaq", jumlah: 7_500_000, metode: "transfer", tanggal: d(-15), status: "diterima", program: "Beasiswa Pendidikan", catatan: "Hasil iuran bulanan alumni." },
  { namaDonatur: "Ibu Nunung Suryani", jenis: "zakat", jumlah: 3_400_000, metode: "tunai", tanggal: d(-30), status: "diterima", program: "Zakat Maal", catatan: "Dibayarkan langsung di kantor panti." },
  { namaDonatur: "Keluarga Bapak Asep", jenis: "barang", jumlah: 1_800_000, metode: "barang", tanggal: d(-9), status: "diterima", program: "Donasi Perlengkapan Sekolah", catatan: "20 pasang sepatu dan tas sekolah anak." },
  { namaDonatur: "Muslimah Peduli Bandung", jenis: "sedekah", jumlah: 2_100_000, metode: "transfer", tanggal: d(-11), status: "diterima", program: "Kesehatan Anak", catatan: "Untuk biaya kontrol kesehatan anak." },
  { namaDonatur: "Toko Roti Barokah", jenis: "infaq", jumlah: 900_000, metode: "tunai", tanggal: d(-7), status: "diterima", program: "Dapur Panti", catatan: "Plus hibangan roti tiap Jumat." },
  { namaDonatur: "Bapak Dedi Mulyana", jenis: "wakaf", jumlah: 12_000_000, metode: "transfer", tanggal: d(-45), status: "diterima", program: "Wakaf Pembangunan Mushola", catatan: "Untuk pembelian keramik mushola." },
  { namaDonatur: "Anonim (QRIS)", jenis: "sedekah", jumlah: 450_000, metode: "qris", tanggal: d(-1), status: "diterima", program: "Operasional Panti", catatan: null },
  { namaDonatur: "Dkm Masjid Al-Ikhlas", jenis: "infaq", jumlah: 4_600_000, metode: "transfer", tanggal: d(-18), status: "diterima", program: "TPQ & Tahfidz", catatan: "Hasil kotak infaq Jumat." },
  { namaDonatur: "Ibu Ratna Dewi", jenis: "sedekah", jumlah: 1_000_000, metode: "transfer", tanggal: d(-2), status: "menunggu", program: "Program Gizi Anak", catatan: "Menunggu konfirmasi bukti transfer." },
  { namaDonatur: "Komplek Perum Griya Asri", jenis: "infaq", jumlah: 6_300_000, metode: "transfer", tanggal: d(-26), status: "diterima", program: "Santunan Pendidikan", catatan: "Hasil gerakan satu rumah satu anak." },
  { namaDonatur: "Bapak Hasanudin", jenis: "zakat", jumlah: 8_750_000, metode: "transfer", tanggal: d(-60), status: "diterima", program: "Zakat Fitrah", catatan: "Dibagikan saat Ramadhan lalu." },
  { namaDonatur: "Yayasan Peduli Sesama", jenis: "hibah", jumlah: 15_000_000, metode: "transfer", tanggal: d(-52), status: "diterima", program: "Beasiswa Unggulan", catatan: "Untuk 3 anak SMA berprestasi." },
  { namaDonatur: "Hamba Allah 2", jenis: "sedekah", jumlah: 300_000, metode: "qris", tanggal: d(-4), status: "ditolak", program: "Operasional Panti", catatan: "Transfer tidak valid / gagal masuk." },
];

type PengeluaranSeed = {
  judul: string;
  kategori: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  dicatatOleh: string;
};

const PENGELUARAN_SEED: PengeluaranSeed[] = [
  { judul: "Belanja semboko & lauk 2 minggu", kategori: "pangan", jumlah: 6_400_000, tanggal: d(-4), keterangan: "Beras 300 kg, telur, ayam, sayur, dan buah untuk 20 anak.", dicatatOleh: "Siti Aminah" },
  { judul: "SPP & uang buku 12 anak", kategori: "pendidikan", jumlah: 5_200_000, tanggal: d(-12), keterangan: "Pembayaran SPP bulan ini untuk jenjang SD, SMP, dan SMA.", dicatatOleh: "Siti Aminah" },
  { judul: "Obat & alat kesehatan klinik panti", kategori: "kesehatan", jumlah: 1_350_000, tanggal: d(-10), keterangan: "Obat rutin, vitamin, alkoholt, dan perban.", dicatatOleh: "Khadijah Salma, S.Kep" },
  { judul: "Konseling psikolog relawan (4 sesi)", kategori: "perlindungan", jumlah: 1_200_000, tanggal: d(-16), keterangan: "Sesi konseling untuk 2 anak yang mengalami kehilangan.", dicatatOleh: "Khadijah Salma, S.Kep" },
  { judul: "Listrik, air, dan internet", kategori: "operasional", jumlah: 2_150_000, tanggal: d(-8), keterangan: "Tagihan bulanan panti.", dicatatOleh: "Siti Aminah" },
  { judul: "Honor ustadz/ustadzah TPQ", kategori: "ibadah", jumlah: 3_000_000, tanggal: d(-14), keterangan: "Honor 3 pengajar TPQ bulan ini.", dicatatOleh: "Ust. H. Abdullah Rahman" },
  { judul: "Seragam & sepatu sekolah 5 anak", kategori: "pendidikan", jumlah: 2_750_000, tanggal: d(-22), keterangan: "Penggantian seragam yang sudah kecil dan lusuh.", dicatatOleh: "Siti Aminah" },
  { judul: "Perbaikan pompa air & tandon", kategori: "operasional", jumlah: 1_800_000, tanggal: d(-19), keterangan: "Penggantian pompa air rusak di asrama putri.", dicatatOleh: "Ust. Muhammad Fauzi" },
  { judul: "Susu & makanan tambahan anak gizi kurang", kategori: "pangan", jumlah: 1_100_000, tanggal: d(-6), keterangan: "Program gizi tambahan untuk 3 anak.", dicatatOleh: "Khadijah Salma, S.Kep" },
  { judul: "Bahan praktik keterampilan menjahit", kategori: "pendidikan", jumlah: 850_000, tanggal: d(-25), keterangan: "Kain, benang, dan jarum untuk kelas keterampilan.", dicatatOleh: "Ustzh. Nur Hidayah" },
  { judul: "Konsumsi kegiatan MABIT", kategori: "ibadah", jumlah: 700_000, tanggal: d(-13), keterangan: "Konsumsi malam bina iman dan takwa.", dicatatOleh: "Ust. Farhan Maulana" },
  { judul: "Cek kesehatan & kacamata anak", kategori: "kesehatan", jumlah: 1_250_000, tanggal: d(-28), keterangan: "Pemeriksaan mata 3 anak dan pembuatan kacamata.", dicatatOleh: "Khadijah Salma, S.Kep" },
];

async function isEmpty(): Promise<boolean> {
  const result = await db.execute<{ count: string }>(
    sql`select count(*)::text as count from users`,
  );
  const rows = (result as unknown as { rows?: { count: string }[] }).rows ?? [];
  const count = Number(rows[0]?.count ?? "0");
  return count === 0;
}

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  const lock = await db.execute<{ locked: boolean }>(
    sql`select pg_try_advisory_lock(918273645) as locked`,
  );
  const lockRows =
    (lock as unknown as { rows?: { locked: boolean }[] }).rows ?? [];
  if (!lockRows[0]?.locked) return;

  try {
    if (await isEmpty()) {
      const password = hashPassword("panti123");
      const insertedUsers = await db
        .insert(users)
        .values([
          { nama: "Ust. H. Abdullah Rahman, M.Pd", email: "admin@panti.id", passwordHash: password, peran: "kepala", jenisKelamin: "L", telepon: "0812-1000-2000", alamat: "Jl. Cibaduyut No. 100, Bandung", keahlian: "Manajemen panti, tahsin, fiqih", tanggalBergabung: d(-3650), status: "aktif" },
          { nama: "Siti Aminah, S.E", email: "aminah@panti.id", passwordHash: password, peran: "pengurus", jenisKelamin: "P", telepon: "0812-1000-2001", alamat: "Jl. Mengger No. 12, Bandung", keahlian: "Administrasi, keuangan, pelaporan donatur", tanggalBergabung: d(-1825), status: "aktif" },
          { nama: "Ust. Muhammad Fauzi", email: "fauzi@panti.id", passwordHash: password, peran: "pengasuh", jenisKelamin: "L", telepon: "0812-1000-2002", alamat: "Asrama Putra Panti", keahlian: "Pendampingan anak, olahraga, pramuka", tanggalBergabung: d(-1095), status: "aktif" },
          { nama: "Ustzh. Nur Hidayah", email: "hidayah@panti.id", passwordHash: password, peran: "pengasuh", jenisKelamin: "P", telepon: "0812-1000-2003", alamat: "Asrama Putri Panti", keahlian: "Keterampilan menjahit, pendampingan anak perempuan", tanggalBergabung: d(-900), status: "aktif" },
          { nama: "Ust. Farhan Maulana", email: "farhan@panti.id", passwordHash: password, peran: "pengajar", jenisKelamin: "L", telepon: "0812-1000-2004", alamat: "Jl. Buah Batu No. 8, Bandung", keahlian: "TPQ, tahfidz, kajian", tanggalBergabung: d(-730), status: "aktif" },
          { nama: "Khadijah Salma, S.Kep", email: "khadijah@panti.id", passwordHash: password, peran: "kesehatan", jenisKelamin: "P", telepon: "0812-1000-2005", alamat: "Jl. Laswi No. 55, Bandung", keahlian: "Perawat anak, konseling dasar, pertolongan pertama", tanggalBergabung: d(-600), status: "aktif" },
          { nama: "Ustzh. Aisyah Rahma", email: "aisyah@panti.id", passwordHash: password, peran: "pengajar", jenisKelamin: "P", telepon: "0812-1000-2006", alamat: "Jl. Antapani No. 21, Bandung", keahlian: "Bahasa Arab, adab & akhlak", tanggalBergabung: d(-420), status: "aktif" },
          { nama: "Rahmat Hidayat", email: "rahmat@panti.id", passwordHash: password, peran: "pengasuh", jenisKelamin: "L", telepon: null, alamat: "Jl. Kebon Kopi No. 30, Bandung", keahlian: "Satpam & perawatan lingkungan", tanggalBergabung: d(-200), status: "nonaktif" },
        ])
        .returning({ id: users.id });

      const userIds = insertedUsers.map((row) => row.id);

      const insertedAnak = await db
        .insert(anak)
        .values(
          ANAK_SEED.map((row) => ({
            namaLengkap: row.namaLengkap,
            namaPanggilan: row.namaPanggilan,
            jenisKelamin: row.jenisKelamin,
            kategori: row.kategori,
            status: row.status,
            tanggalLahir: row.tanggalLahir,
            tempatLahir: row.tempatLahir,
            tanggalMasuk: row.tanggalMasuk,
            jenjang: row.jenjang,
            kelas: row.kelas,
            sekolah: row.sekolah,
            namaWali: row.namaWali,
            hubunganWali: row.hubunganWali,
            teleponWali: row.teleponWali,
            alamat: row.alamat,
            golonganDarah: row.golonganDarah,
            catatanKesehatan: row.catatanKesehatan,
            pengasuhId: row.pengasuhIdx === null ? null : userIds[row.pengasuhIdx] ?? null,
            catatan: row.catatan,
          })),
        )
        .returning({ id: anak.id });

      const anakIds = insertedAnak.map((row) => row.id);

      await db.insert(kebutuhan).values(
        KEBUTUHAN_SEED.map((row) => ({
          anakId: anakIds[row.anakIdx]!,
          kategori: row.kategori,
          judul: row.judul,
          deskripsi: row.deskripsi,
          prioritas: row.prioritas,
          status: row.status,
          tanggal: row.tanggal,
          estimasiBiaya: row.estimasiBiaya,
          catatan: row.catatan,
        })),
      );

      await db.insert(perlindungan).values(
        PERLINDUNGAN_SEED.map((row) => ({
          anakId: anakIds[row.anakIdx]!,
          jenis: row.jenis,
          tingkat: row.tingkat,
          tanggalLaporan: row.tanggalLaporan,
          pelapor: row.pelapor,
          deskripsi: row.deskripsi,
          status: row.status,
          tindakLanjut: row.tindakLanjut,
          penangan: row.penangan,
        })),
      );

      await db.insert(kegiatan).values(KEGIATAN_SEED);
      await db.insert(donasi).values(DONASI_SEED);
      await db.insert(pengeluaran).values(PENGELUARAN_SEED);
    }
  } finally {
    await db.execute(sql`select pg_advisory_unlock(918273645)`);
  }
}

/** Idempotent: hanya mengisi data demo bila database masih kosong. */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error("[seed] gagal:", error);
    });
  }
  await seedPromise;
}
