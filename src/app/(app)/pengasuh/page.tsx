import ResourceView from "@/components/resource-view";
import { getPengasuhRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pengasuh & Pengurus · SIMPANTI" };

export default async function PengasuhPage() {
  const [rows, refs] = await Promise.all([getPengasuhRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="pengasuh"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
