import ResourceView from "@/components/resource-view";
import { getKebutuhanRows, getRefOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Kebutuhan Dasar · SIMPANTI" };

export default async function KebutuhanPage() {
  const [rows, refs] = await Promise.all([getKebutuhanRows(), getRefOptions()]);
  return (
    <ResourceView
      resource="kebutuhan"
      rows={rows}
      anakOptions={refs.anakOptions}
      pengasuhOptions={refs.pengasuhOptions}
    />
  );
}
