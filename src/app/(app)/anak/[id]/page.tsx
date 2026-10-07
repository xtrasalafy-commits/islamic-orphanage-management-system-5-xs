import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, ProgressBar } from "@/components/ui";
import {
  JENIS_PERLINDUNGAN,
  KATEGORI_ANAK,
  KATEGORI_KEBUTUHAN,
  STATUS_ANAK,
  STATUS_KASUS,
  STATUS_KEBUTUHAN,
  labelOf,
} from "@/lib/fields";
import { rupiah, tanggal, tanggalPendek, umur } from "@/lib/format";
import { getAnakDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}

export default async function AnakDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) notFound();

  const detail = await getAnakDetail(numericId);
  if (!detail) notFound();

  const { anak, kebutuhan, perlindungan, pengasuhOptions } = detail;
  const pengasuh =
    pengasuhOptions.find((option) => option.value === String(anak.pengasuhId))?.label ??
    "Belum ada pendamping";
  const terpenuhi = kebutuhan.filter((row) => row.status === "terpenuhi").length;
  const persen = Math.round((terpenuhi / Math.max(kebutuhan.length, 1)) * 100);
  const kasusAktif = perlindungan.filter((row) => row.status !== "selesai");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/anak" className="hover:text-brand-700">
          Data Anak Asuh
        </Link>
        <span>/</span>
        <span className="text-slate-800">{String(anak.namaLengkap)}</span>
      </div>

      {/* Profil */}
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-black ${
              anak.jenisKelamin === "P" ? "bg-violet-100 text-violet-700" : "bg-brand-100 text-brand-700"
            }`}
          >
            {String(anak.namaPanggilan ?? String(anak.namaLengkap).slice(0, 2)).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {String(anak.namaLengkap)}
              </h1>
              <Badge tone={anak.status === "aktif" ? "brand" : "sky"}>
                {labelOf(STATUS_ANAK, anak.status)}
              </Badge>
              <Badge tone={anak.kategori === "yatim_piatu" ? "rose" : "slate"}>
                {labelOf(KATEGORI_ANAK, anak.kategori)}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              {anak.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"} ·{" "}
              {umur(String(anak.tanggalLahir))} tahun · {String(anak.tempatLahir ?? "-")},{" "}
              {tanggal(String(anak.tanggalLahir))}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Info label="Jenjang" value={String(anak.jenjang ?? "")} />
              <Info label="Kelas" value={String(anak.kelas ?? "")} />
              <Info label="Sekolah" value={String(anak.sekolah ?? "")} />
              <Info label="Gol. Darah" value={String(anak.golonganDarah ?? "")} />
              <Info label="Masuk Panti" value={tanggal(String(anak.tanggalMasuk))} />
              <Info label="Pengasuh" value={pengasuh} />
              <Info label="Wali" value={String(anak.namaWali ?? "")} />
              <Info label="Kontak Wali" value={String(anak.teleponWali ?? "")} />
            </div>
          </div>
        </div>
        {String(anak.catatan ?? "").trim() ? (
          <div className="mt-5 rounded-xl bg-brand-50/70 p-4 text-sm leading-relaxed text-brand-900 ring-1 ring-brand-100">
            <span className="font-bold">Catatan pendampingan: </span>
            {String(anak.catatan)}
          </div>
        ) : null}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Kebutuhan dasar */}
        <div className="space-y-4 lg:col-span-2">
          <Card padded={false}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                  Kebutuhan Dasar
                </h2>
                <p className="text-xs text-slate-500">
                  {terpenuhi} dari {kebutuhan.length} kebutuhan telah terpenuhi
                </p>
              </div>
              <div className="w-full sm:w-40">
                <ProgressBar value={persen} tone={persen >= 60 ? "brand" : "gold"} />
                <p className="mt-1 text-right text-[11px] font-bold text-slate-500">{persen}%</p>
              </div>
            </div>
            {kebutuhan.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-semibold text-slate-600">Belum ada kebutuhan tercatat</p>
                <p className="mt-1 text-xs text-slate-400">
                  Tambahkan melalui menu Kebutuhan Dasar untuk memantau pemenuhan hak anak.
                </p>
                <Link
                  href="/kebutuhan"
                  className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
                >
                  + Catat Kebutuhan
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {kebutuhan.map((row) => (
                  <li key={String(row.id)} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{String(row.judul)}</p>
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
                        <p className="mt-1 text-xs text-slate-500">
                          {labelOf(KATEGORI_KEBUTUHAN, row.kategori)} ·{" "}
                          {tanggalPendek(String(row.tanggal))}
                        </p>
                        {String(row.deskripsi ?? "") ? (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {String(row.deskripsi)}
                          </p>
                        ) : null}
                        {String(row.catatan ?? "") ? (
                          <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-500">
                            <span className="font-bold text-slate-600">Tindak lanjut: </span>
                            {String(row.catatan)}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-800">
                          {rupiah(Number(row.estimasiBiaya ?? 0))}
                        </p>
                        <Badge
                          tone={
                            row.status === "terpenuhi"
                              ? "emerald"
                              : row.status === "sebagian"
                                ? "amber"
                                : "rose"
                          }
                        >
                          {labelOf(STATUS_KEBUTUHAN, row.status)}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card padded={false}>
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                Riwayat Perlindungan
              </h2>
              <p className="text-xs text-slate-500">
                {kasusAktif.length} kasus aktif dari {perlindungan.length} total laporan
              </p>
            </div>
            {perlindungan.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-semibold text-slate-600">Tidak ada riwayat kasus</p>
                <p className="mt-1 text-xs text-slate-400">
                  Alhamdulillah, anak ini dalam kondisi aman dan terlindungi.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {perlindungan.map((row) => (
                  <li key={String(row.id)} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={String(row.jenis) === "fisik" || String(row.jenis) === "seksual" ? "rose" : "amber"}>
                        {labelOf(JENIS_PERLINDUNGAN, row.jenis)}
                      </Badge>
                      <Badge tone={row.tingkat === "tinggi" ? "rose" : "slate"}>
                        Risiko {String(row.tingkat)}
                      </Badge>
                      <Badge tone="violet">{labelOf(STATUS_KASUS, row.status)}</Badge>
                      <span className="ml-auto text-[11px] text-slate-400">
                        {tanggalPendek(String(row.tanggalLaporan))}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {String(row.deskripsi)}
                    </p>
                    {String(row.tindakLanjut ?? "") ? (
                      <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-500">
                        <span className="font-bold text-slate-600">Tindak lanjut: </span>
                        {String(row.tindakLanjut)}
                      </p>
                    ) : null}
                    <p className="mt-2 text-[11px] text-slate-400">
                      Pelapor: {String(row.pelapor ?? "-")} · Penangan: {String(row.penangan ?? "-")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900">Kesehatan</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {String(anak.catatanKesehatan ?? "Tidak ada catatan kesehatan khusus.")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Info label="Gol. darah" value={String(anak.golonganDarah ?? "")} />
              <Info label="Usia" value={`${umur(String(anak.tanggalLahir))} tahun`} />
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900">Wali &amp; Asal</h2>
            <div className="mt-3 space-y-4">
              <Info label="Nama wali" value={String(anak.namaWali ?? "")} />
              <Info label="Hubungan wali" value={String(anak.hubunganWali ?? "")} />
              <Info label="Telepon wali" value={String(anak.teleponWali ?? "")} />
              <Info label="Alamat asal" value={String(anak.alamat ?? "")} />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-brand-50 to-white">
            <h2 className="text-base font-extrabold tracking-tight text-brand-900">
              Butuh tindakan cepat?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-brand-800/80">
              Catat kebutuhan dasar baru atau laporkan kasus perlindungan untuk anak ini.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/kebutuhan"
                className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
              >
                + Kebutuhan
              </Link>
              <Link
                href="/perlindungan"
                className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50"
              >
                + Laporan Kasus
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
