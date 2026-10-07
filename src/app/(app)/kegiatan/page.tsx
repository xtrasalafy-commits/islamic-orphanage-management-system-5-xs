import ResourceView from "@/components/resource-view";
import { getKegiatanRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Kegiatan Panti · SIMPANTI" };

export default async function KegiatanPage() {
  const [rows, refs] = await Promise.all([getKegiatanRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="kegiatan"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
