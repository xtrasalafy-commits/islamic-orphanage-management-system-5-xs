# SIMPANTI — Sistem Manajemen Panti Asuhan

Sistem informasi manajemen panti asuhan anak yatim, piatu, dan dhuafa:
kebutuhan dasar anak, perlindungan anak, kegiatan panti, donasi, dan pengeluaran —
semuanya dalam satu web app yang bersih, gratis, dan bebas iklan.

**Open Source oleh MZF - 2026**

---

## ✨ Fitur

- **Dashboard** — ringkasan jumlah anak asuh, pemenuhan kebutuhan dasar per kategori,
  sebaran usia, kasus perlindungan aktif, serta kas masuk/keluar panti.
- **Data Anak Asuh** — profil lengkap (kependudukan, pendidikan, wali, kesehatan)
  lengkap dengan halaman detail per anak.
- **Kebutuhan Dasar** — pencatatan 8 kategori kebutuhan (pangan, sandang, papan,
  kesehatan, pendidikan, ibadah, psikososial, keterampilan) dengan prioritas,
  status pemenuhan, dan estimasi biaya.
- **Perlindungan Anak** — pencatatan kasus, tingkat risiko, status penanganan, dan
  tindak lanjut.
- **Kegiatan Panti** — jadwal TPQ, tahfidz, kajian, olahraga, dan keterampilan.
- **Donasi & Infaq** — riwayat infaq, sedekah, zakat, wakaf, dan hibah beserta
  status konfirmasinya.
- **Pengeluaran** — pencatatan belanja dan operasional panti per kategori.
- **Pengasuh & Pengurus** — manajemen akun pengguna dengan 5 peran
  (kepala, pengurus, pengasuh, pengajar, kesehatan).
- **Autentikasi** — login berbasis session (cookie httpOnly), proteksi route otomatis.
- **Widget Trakteer** — floating button di pojok kanan bawah untuk traktiran
  (QR code + pilihan nominal) tanpa berpindah halaman.
- **Download source code** — bisa diunduh langsung dari web app (link di footer
  maupun di widget Trakteer).

## 🧱 Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM + drizzle-kit |
| Styling | Tailwind CSS v4 |
| Font | next/font/google (Plus Jakarta Sans) |
| QR Code | qrcode.react |
| Deployment | Vercel |

## 📁 Struktur Proyek

```
├── src/
│   ├── app/
│   │   ├── (app)/            # Halaman terproteksi (dashboard, anak, kebutuhan, ...)
│   │   ├── api/              # API routes (auth, resource CRUD, health)
│   │   ├── login/            # Halaman login
│   │   ├── layout.tsx        # Root layout (font + widget Trakteer)
│   │   └── page.tsx          # Redirect ke /dashboard atau /login
│   ├── components/           # UI, shell/sidebar, resource-view, trakteer-widget
│   ├── db/                   # Skema Drizzle & koneksi database
│   ├── lib/                  # auth, queries, fields, format, seed, resource-server
│   └── proxy.ts              # Middleware proteksi route
├── scripts/
│   ├── seed.ts               # Seed data contoh ke Neon
│   └── package-source.mjs    # Pemaket source code -> public/source-code.zip
├── drizzle.config.ts         # Konfigurasi Drizzle (baca DATABASE_URL dari env)
└── next.config.ts            # Generate source-code.zip saat production build
```

## 🚀 Menjalankan Secara Lokal

Prasyarat: Node.js 18+ dan sebuah database PostgreSQL (lokal atau Neon).

1. **Clone & install**

   ```bash
   npm install
   ```

2. **Siapkan environment variables**

   Salin `.env.example` menjadi `.env.local`, lalu isi dengan connection string
   database kamu:

   ```bash
   cp .env.example .env.local
   ```

   Untuk Neon, connection string berbentuk seperti ini (sslmode wajib):

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
   ```

3. **Buat skema database**

   ```bash
   npm run db:push
   ```

4. **Isi data contoh (seed)**

   ```bash
   npm run db:seed
   ```

   Seeding bersifat **idempotent** — hanya mengisi data bila database masih kosong.
   Aplikasi juga auto-seed saat request pertama, jadi langkah ini opsional.

5. **Jalankan dev server**

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000.

### Akun demo

Semua akun menggunakan kata sandi yang sama: **`panti123`**

| Email | Peran |
| --- | --- |
| `admin@panti.id` | Kepala Panti |
| `aminah@panti.id` | Pengurus |
| `fauzi@panti.id` | Pengasuh |
| `hidayah@panti.id` | Pengasuh |
| `farhan@panti.id` | Pengajar |
| `khadijah@panti.id` | Kesehatan |
| `aisyah@panti.id` | Pengajar |
| `rahmat@panti.id` | Pengasuh (nonaktif) |

## 📦 Script yang Tersedia

| Script | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan dev server |
| `npm run build` | Production build (juga generate `public/source-code.zip`) |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Mengecek tipe TypeScript |
| `npm run package` | Memaket source code menjadi `public/source-code.zip` |
| `npm run db:push` | Mendorong skema Drizzle ke database |
| `npm run db:generate` | Membuat file migration |
| `npm run db:migrate` | Menjalankan migration |
| `npm run db:seed` | Mengisi data contoh |
| `npm run db:studio` | Membuka Drizzle Studio |

## ☁️ Deploy ke Vercel + Neon

1. **Buat database di Neon** (https://neon.tech) lalu salin connection string-nya
   (pastikan ada `sslmode=require`).

2. **Push repo ini ke GitHub.**

3. **Import project di Vercel** (https://vercel.com/new).

4. **Tambahkan Environment Variable** di
   **Settings → Environment Variables**:

   ```
   DATABASE_URL = <connection-string-neon-kamu>
   ```

5. **Deploy.** Vercel akan menjalankan `next build`, yang juga:
   - Memaket source code menjadi `public/source-code.zip` (hasilnya tersedia di
     tombol "Download source code").
   - Mengisi data contoh secara otomatis saat request pertama, **tetapi hanya jika
     skema/table sudah ada**.

   > **Penting — buat skema dulu:** seeding TIDAK membuat tabel. Sebelum deploy
   > pertama, jalankan `npm run db:push` dari komputer kamu dengan `DATABASE_URL`
   > Neon yang sama (lihat langkah 1), atau buat tabel manual di Neon Console.
   > Setelah itu aplikasi akan auto-seed saat request pertama.

## 💰 Widget Trakteer

Web app ini gratis & bebas iklan. Di pojok kanan bawah ada floating button dengan
tulisan **"Kopi kecil, server tetap jalan"**. Klik untuk:

- Memilih nominal traktiran (mulai dari Rp6.000 dan kelipatannya).
- Scan QR code yang langsung mengarah ke
  [https://trakteer.id/perpus_opera/](https://trakteer.id/perpus_opera/).
- Mengunduh source code lengkap web app ini.

## ⬇️ Download Source Code

Source code lengkap web app ini dapat diunduh dalam bentuk `.zip` melalui:

- link **"Download source code"** di footer aplikasi, atau
- tombol di dalam widget Trakteer.

File `public/source-code.zip` di-generate otomatis setiap production build oleh
`scripts/package-source.mjs`. Isinya sudah memuat seluruh kode proyek **kecuali**
`node_modules`, build output, dan berkas `.env*` (kredensial tidak ikut terpakai).

Untuk membangun ulang secara manual:

```bash
npm run package
```

## 🔒 Catatan Keamanan

- Kata sandi di-hash menggunakan `scrypt` (Node.js crypto).
- Session disimpan di database dengan cookie `httpOnly`, `sameSite=lax`.
- `.env.local` berisi kredensial database — **jangan pernah di-commit**.
  File `.gitignore` sudah mengecualikannya, dan `public/source-code.zip` juga
  tidak memasukkannya.

## 🤝 Lisensi & Kredit

**Open Source oleh MZF - 2026**

Dibuat untuk memudahkan pengelolaan panti asuhan yang amanah. Semoga menjadi
amal jariyah. Barakallahu fiikum.

> "Aku dan orang yang menanggung anak yatim (kedudukannya) di surga seperti ini"
> — (HR. Bukhari)
