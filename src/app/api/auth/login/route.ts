import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json(
        { ok: false, error: "Email dan kata sandi wajib diisi" },
        { status: 400 },
      );
    }

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json(
        { ok: false, error: "Email atau kata sandi salah" },
        { status: 401 },
      );
    }
    if (user.status !== "aktif") {
      return Response.json(
        { ok: false, error: "Akun ini sudah tidak aktif. Hubungi kepala panti." },
        { status: 403 },
      );
    }

    await createSession(user.id);
    return Response.json({
      ok: true,
      user: { id: user.id, nama: user.nama, peran: user.peran },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal masuk";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
