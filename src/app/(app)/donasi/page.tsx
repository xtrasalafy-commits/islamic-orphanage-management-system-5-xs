import ResourceView from "@/components/resource-view";
import { getDonasiRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Donasi & Infaq · SIMPANTI" };

export default async function DonasiPage() {
  const [rows, refs] = await Promise.all([getDonasiRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="donasi"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
