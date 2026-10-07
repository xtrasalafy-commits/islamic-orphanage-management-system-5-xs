import Link from "next/link";
import { Badge, Card, ProgressBar, StatCard } from "@/components/ui";
import {
  KATEGORI_KEBUTUHAN,
  JENIS_PERLINDUNGAN,
  STATUS_KASUS,
  labelOf,
} from "@/lib/fields";
import { greet, hijriToday, rupiah, rupiahCompact, tanggal, tanggalPendek, umur } from "@/lib/format";
import { getDashboard } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard · SIMPANTI" };

const USIA_LABEL = ["< 7 th", "7-9 th", "10-12 th", "13-15 th", "16+ th"];

export default async function DashboardPage() {
  const [user, data] = await Promise.all([requireUser(), getDashboard()]);
  const maxUmur = Math.max(...data.umurBuckets, 1);
  const pemenuhanPersen = Math.round(
    ((data.kebutuhanTotal - data.kebutuhanBelum) / Math.max(data.kebutuhanTotal, 1)) * 100,
  );

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-900 px-6 py-7 text-white shadow-lg shadow-brand-900/20">
        <div className="pattern-islamic absolute inset-0" />
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-gold-400/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-gold-300 uppercase">
              {hijriToday()}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {greet()}, {user.nama.split(" ").slice(0, 2).join(" ")} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-100/85">
              Barakallahu fiik. Ada <strong className="text-white">{data.kebutuhanBelum} kebutuhan dasar</strong>{" "}
              yang belum sepenuhnya terpenuhi dan{" "}
              <strong className="text-white">{data.kasusAktif} kasus perlindungan</strong> yang masih
              ditangani. Semoga amanah ini dimudahkan.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/kebutuhan"
                className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-800 shadow transition hover:bg-brand-50"
              >
                Tinjau Kebutuhan Dasar
              </Link>
              <Link
                href="/perlindungan"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                Kasus Perlindungan
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:w-80">
            {[
              { label: "Anak aktif", value: data.anakAktif },
              { label: "L / P", value: `${data.anakLaki} / ${data.anakPerempuan}` },
              { label: "Saldo kas", value: rupiahCompact(data.saldo) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-[10px] font-bold tracking-wide text-brand-100/70 uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold-300">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Anak Asuh Aktif"
          value={String(data.anakAktif)}
          hint={`${data.totalAnak} total terdata`}
          icon="🧒"
          tone="brand"
        />
        <StatCard
          label="Kebutuhan Belum Terpenuhi"
          value={String(data.kebutuhanBelum)}
          hint={`${data.kebutuhanDarurat} berlabel darurat`}
          icon="🥣"
          tone="amber"
        />
        <StatCard
          label="Kasus Perlindungan Aktif"
          value={String(data.kasusAktif)}
          hint={`${data.kasusTinggi} risiko tinggi`}
          icon="🛡️"
          tone="rose"
        />
        <StatCard
          label="Saldo Kas Panti"
          value={rupiahCompact(data.saldo)}
          hint={`${rupiahCompact(data.totalMasuk)} masuk · ${rupiahCompact(data.totalKeluar)} keluar`}
          icon="🤲"
          tone="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Pemenuhan Kebutuhan Dasar
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Sebaran 8 kategori kebutuhan dasar anak beserta tingkat pemenuhannya.
              </p>
            </div>
            <Badge tone={pemenuhanPersen >= 60 ? "emerald" : "amber"}>
              {pemenuhanPersen}% terpenuhi
            </Badge>
          </div>
          <div className="mt-5 space-y-3.5">
            {data.kebutuhanPerKategori.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Belum ada data kebutuhan dasar yang dicatat.
              </p>
            ) : (
              data.kebutuhanPerKategori
                .slice()
                .sort((a, b) => b.total - a.total)
                .map((item) => {
                  const persen = Math.round((item.terpenuhi / Math.max(item.total, 1)) * 100);
                  return (
                    <div key={item.kategori}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-xs font-bold text-slate-600">
                          {labelOf(KATEGORI_KEBUTUHAN, item.kategori)}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                          {item.terpenuhi}/{item.total} terpenuhi
                        </span>
                      </div>
                      <ProgressBar value={persen} tone={persen >= 60 ? "brand" : persen >= 30 ? "gold" : "rose"} />
                    </div>
                  );
                })
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            Sebaran Usia &amp; Kategori
          </h2>
          <p className="mt-1 text-xs text-slate-500">Distribusi anak asuh berdasarkan usia.</p>
          <div className="mt-5 flex h-36 items-end gap-2">
            {data.umurBuckets.map((value, index) => (
              <div key={USIA_LABEL[index]} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500">{value}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all"
                  style={{ height: `${Math.max((value / maxUmur) * 100, 6)}%` }}
                  title={`${value} anak`}
                />
                <span className="text-[10px] font-semibold text-slate-400">{USIA_LABEL[index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
            {[
              { label: "Yatim", value: data.kategoriCount.yatim, tone: "bg-brand-500" },
              { label: "Piatu", value: data.kategoriCount.piatu, tone: "bg-sky-500" },
              { label: "Yatim Piatu", value: data.kategoriCount.yatim_piatu, tone: "bg-rose-500" },
              { label: "Dhuafa", value: data.kategoriCount.dhuafa, tone: "bg-violet-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                <span className="flex-1 text-xs font-semibold text-slate-600">{item.label}</span>
                <span className="text-xs font-extrabold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card padded={false} className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Kebutuhan Prioritas
              </h2>
              <p className="text-xs text-slate-500">Belum terpenuhi &amp; membutuhkan perhatian cepat</p>
            </div>
            <Link href="/kebutuhan" className="text-xs font-bold text-brand-700 hover:underline">
              Lihat semua →
            </Link>
          </div>
          {data.kebutuhanPrioritas.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Alhamdulillah, semua kebutuhan dasar telah terpenuhi.
            </p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {data.kebutuhanPrioritas.map((row) => {
                const nama =
                  data.anakList.find((anakRow) => String(anakRow.id) === String(row.anakId))
                    ?.namaLengkap ?? "-";
                return (
                  <li key={String(row.id)} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-sm">
                      {labelOf(KATEGORI_KEBUTUHAN, row.kategori).slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{String(row.judul)}</p>
                      <p className="truncate text-xs text-slate-500">
                        {nama} · {labelOf(KATEGORI_KEBUTUHAN, row.kategori)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-slate-800">
                        {rupiahCompact(Number(row.estimasiBiaya ?? 0))}
                      </p>
                      <Badge
                        tone={
                          row.prioritas === "darurat"
                            ? "rose"
                            : row.prioritas === "tinggi"
                              ? "amber"
                              : "slate"
                        }
                      >
                        {String(row.prioritas)}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Kasus Perlindungan
              </h2>
              <p className="text-xs text-slate-500">Penanganan yang masih berjalan</p>
            </div>
            <Link href="/perlindungan" className="text-xs font-bold text-brand-700 hover:underline">
              Semua →
            </Link>
          </div>
          {data.kasusTerbaru.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Tidak ada kasus aktif. Anak-anak dalam kondisi aman.
            </p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {data.kasusTerbaru.map((row) => {
                const nama =
                  data.anakList.find((anakRow) => String(anakRow.id) === String(row.anakId))
                    ?.namaLengkap ?? "-";
                return (
                  <li key={String(row.id)} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-800">{nama}</p>
                      <Badge tone={row.tingkat === "tinggi" ? "rose" : "amber"}>
                        {String(row.tingkat)}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {labelOf(JENIS_PERLINDUNGAN, row.jenis)} — {String(row.deskripsi)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        {tanggalPendek(String(row.tanggalLaporan ?? ""))}
                      </span>
                      <Badge tone="violet">{labelOf(STATUS_KASUS, row.status)}</Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card padded={false} className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Kegiatan Mendatang
              </h2>
              <p className="text-xs text-slate-500">Agenda TPQ, tahfidz, dan pembinaan</p>
            </div>
            <Link href="/kegiatan" className="text-xs font-bold text-brand-700 hover:underline">
              Semua →
            </Link>
          </div>
          {data.kegiatanMendatang.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Belum ada agenda kegiatan terjadwal.
            </p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {data.kegiatanMendatang.map((row) => (
                <li key={String(row.id)} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-center leading-none">
                    <span className="text-[10px] font-bold text-brand-700 uppercase">
                      {new Date(String(row.tanggal) + "T00:00:00").toLocaleDateString("id-ID", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-sm font-extrabold text-brand-800">
                      {new Date(String(row.tanggal) + "T00:00:00").getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{String(row.judul)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {String(row.waktu ?? "-")} · {String(row.lokasi ?? "-")}
                    </p>
                  </div>
                  <Badge tone="sky">{String(row.kapasitas ?? 0)} peserta</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Donasi Terbaru
              </h2>
              <p className="text-xs text-slate-500">{rupiah(data.donasiMenunggu)} menunggu konfirmasi</p>
            </div>
            <Link href="/donasi" className="text-xs font-bold text-brand-700 hover:underline">
              Semua →
            </Link>
          </div>
          <ul className="divide-y divide-slate-50">
            {data.donasiTerbaru.map((row) => (
              <li key={String(row.id)} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{String(row.namaDonatur)}</p>
                  <p className="truncate text-xs text-slate-500">
                    {String(row.program ?? "-")} · {tanggalPendek(String(row.tanggal ?? ""))}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-emerald-600">
                  +{rupiahCompact(Number(row.jumlah ?? 0))}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 px-5 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Kas masuk</span>
              <span className="font-extrabold text-emerald-600">{rupiah(data.totalMasuk)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Kas keluar</span>
              <span className="font-extrabold text-rose-500">-{rupiah(data.totalKeluar)}</span>
            </div>
          </div>
        </Card>
      </div>

      <p className="pb-2 text-center text-xs text-slate-400">
        Data per {tanggal(new Date())} · {data.anakList.filter((row) => umur(String(row.tanggalLahir)) !== null && (umur(String(row.tanggalLahir)) ?? 0) < 12).length} anak berusia di bawah 12 tahun
      </p>
    </div>
  );
}
