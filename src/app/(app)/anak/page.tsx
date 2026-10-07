import ResourceView from "@/components/resource-view";
import { getAnakRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Data Anak Asuh · SIMPANTI" };

export default async function AnakPage() {
  const [rows, refs] = await Promise.all([getAnakRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="anak"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
