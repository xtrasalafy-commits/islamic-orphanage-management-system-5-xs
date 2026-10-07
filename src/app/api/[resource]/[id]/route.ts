import { getSessionUser } from "@/lib/auth";
import {
  ValidationError,
  buildValues,
  deleteResource,
  isResourceKey,
  updateResource,
} from "@/lib/resource-server";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ resource: string; id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ ok: false, error: "Sesi berakhir, silakan login ulang" }, { status: 401 });
  }
  const { resource, id } = await params;
  if (!isResourceKey(resource)) {
    return Response.json({ ok: false, error: "Resource tidak dikenal" }, { status: 404 });
  }
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return Response.json({ ok: false, error: "ID tidak valid" }, { status: 400 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const values = buildValues(resource, body, { partial: true });
    const updated = await updateResource(resource, numericId, values);
    if (!updated) {
      return Response.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ ok: true, id: numericId });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ ok: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Gagal memperbarui data";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ ok: false, error: "Sesi berakhir, silakan login ulang" }, { status: 401 });
  }
  const { resource, id } = await params;
  if (!isResourceKey(resource)) {
    return Response.json({ ok: false, error: "Resource tidak dikenal" }, { status: 404 });
  }
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return Response.json({ ok: false, error: "ID tidak valid" }, { status: 400 });
  }
  if (resource === "pengasuh" && numericId === user.id) {
    return Response.json(
      { ok: false, error: "Tidak dapat menghapus akun yang sedang digunakan" },
      { status: 400 },
    );
  }
  try {
    const deleted = await deleteResource(resource, numericId);
    if (!deleted) {
      return Response.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ ok: true, id: numericId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus data";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
