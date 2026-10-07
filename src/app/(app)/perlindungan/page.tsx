import ResourceView from "@/components/resource-view";
import { getPerlindunganRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Perlindungan Anak · SIMPANTI" };

export default async function PerlindunganPage() {
  const [rows, refs] = await Promise.all([getPerlindunganRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="perlindungan"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
