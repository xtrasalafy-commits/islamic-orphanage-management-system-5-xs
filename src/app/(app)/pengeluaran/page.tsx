import ResourceView from "@/components/resource-view";
import { getPengeluaranRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pengeluaran · SIMPANTI" };

export default async function PengeluaranPage() {
  const [rows, refs] = await Promise.all([getPengeluaranRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="pengeluaran"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
