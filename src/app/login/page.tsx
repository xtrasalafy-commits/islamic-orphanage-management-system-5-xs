import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getSessionUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { hijriToday } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await ensureSeeded();
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel narasi */}
      <section className="relative flex flex-1 flex-col justify-between overflow-hidden bg-brand-900 px-8 py-10 text-white lg:px-14 lg:py-14">
        <div className="pattern-islamic absolute inset-0" />
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-brand-900/70 to-brand-800/60" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-400 text-xl font-black text-brand-900 shadow-lg">
              ﷽
            </span>
            <div>
              <p className="text-lg leading-tight font-extrabold tracking-tight">SIMPANTI</p>
              <p className="text-xs font-medium text-brand-100/80">
                Sistem Manajemen Panti Asuhan
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-10 max-w-lg">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold-300 ring-1 ring-white/15">
            {hijriToday()}
          </p>
          <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            Mengasuh dengan kasih, memenuhi kebutuhan dasar &amp; perlindungan anak.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-100/85">
            Satu platform untuk mengelola data anak yatim, piatu, dan dhuafa: kebutuhan
            pangan, sandang, papan, kesehatan, pendidikan, ibadah, psikososial, hingga
            penanganan kasus perlindungan anak — semuanya tercatat rapi dan amanah.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "20", label: "Anak asuh" },
              { value: "16", label: "Kebutuhan dasar" },
              { value: "9", label: "Kasus perlindungan" },
              { value: "12", label: "Kegiatan" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-xl font-extrabold text-gold-300">{item.value}</p>
                <p className="text-[11px] font-medium text-brand-100/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <p className="text-xs leading-relaxed text-brand-100/70 italic">
            &ldquo;Aku dan orang yang menanggung anak yatim (kedudukannya) di surga seperti
            ini&quot; — lalu beliau mengisyaratkan jari telunjuk dan jari tengah. (HR. Bukhari)
          </p>
        </div>
      </section>

      {/* Panel form */}
      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-14">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Portal Pengasuh &amp; Pengurus
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Assalamu&apos;alaikum, silakan masuk
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Gunakan akun demo di bawah untuk menjelajahi sistem manajemen panti.
            </p>
          </div>
          <LoginForm />
          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Panti Asuhan Darul Qur&apos;an Al-Ihsan · Bandung
          </p>
        </div>
      </section>
    </main>
  );
}
