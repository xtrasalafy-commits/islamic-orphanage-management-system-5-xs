import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-6xl">🕌</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Data atau halaman yang kamu cari tidak tersedia di sistem panti.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
