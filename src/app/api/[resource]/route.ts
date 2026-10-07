import { getSessionUser } from "@/lib/auth";
import {
  ValidationError,
  buildValues,
  insertResource,
  isResourceKey,
} from "@/lib/resource-server";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ resource: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ ok: false, error: "Sesi berakhir, silakan login ulang" }, { status: 401 });
  }

  const { resource } = await params;
  if (!isResourceKey(resource)) {
    return Response.json({ ok: false, error: "Resource tidak dikenal" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const values = buildValues(resource, body, { partial: false });
    const id = await insertResource(resource, values);
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ ok: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Gagal menyimpan data";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
