import type { ReactNode } from "react";
import Shell from "@/components/shell";
import { ToastProvider } from "@/components/ui";
import { PERAN_LABEL, requireUser } from "@/lib/auth";
import { getNavCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  let counts = { anakAktif: 0, kebutuhanBelum: 0, kasusAktif: 0 };
  try {
    counts = await getNavCounts();
  } catch (error) {
    console.error("[layout] gagal memuat hitungan", error);
  }

  return (
    <ToastProvider>
      <Shell
        user={{
          nama: user.nama,
          email: user.email,
          peranLabel: PERAN_LABEL[user.peran] ?? "Pengasuh",
        }}
        counts={counts}
      >
        {children}
      </Shell>
    </ToastProvider>
  );
}
