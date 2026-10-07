import { eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  anak,
  donasi,
  kebutuhan,
  kegiatan,
  pengeluaran,
  perlindungan,
  users,
} from "@/db/schema";
import {
  RESOURCE_FIELDS,
  type FieldSpec,
  type ResourceKey,
} from "@/lib/fields";

type AnyTable =
  | typeof anak
  | typeof kebutuhan
  | typeof perlindungan
  | typeof kegiatan
  | typeof donasi
  | typeof pengeluaran
  | typeof users;

export const RESOURCE_TABLE: Record<ResourceKey, AnyTable> = {
  anak,
  kebutuhan,
  perlindungan,
  kegiatan,
  donasi,
  pengeluaran,
  pengasuh: users,
};

export const RESOURCE_ID: Record<ResourceKey, PgColumn> = {
  anak: anak.id,
  kebutuhan: kebutuhan.id,
  perlindungan: perlindungan.id,
  kegiatan: kegiatan.id,
  donasi: donasi.id,
  pengeluaran: pengeluaran.id,
  pengasuh: users.id,
};

export function isResourceKey(value: string): value is ResourceKey {
  return Object.prototype.hasOwnProperty.call(RESOURCE_TABLE, value);
}

export type Values = Record<string, string | number | null>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function coerce(field: FieldSpec, raw: unknown): string | number | null {
  const empty = raw === undefined || raw === null || raw === "";
  if (field.type === "number" || field.type === "currency") {
    if (empty) return 0;
    const cleaned = String(raw).replace(/[^\d-]/g, "");
    const parsed = Number.parseInt(cleaned, 10);
    if (Number.isNaN(parsed)) throw new ValidationError(`${field.label} harus berupa angka`);
    return parsed;
  }
  if (field.type === "ref-anak" || field.type === "ref-pengasuh") {
    if (empty) return null;
    const parsed = Number.parseInt(String(raw), 10);
    if (Number.isNaN(parsed)) throw new ValidationError(`${field.label} tidak valid`);
    return parsed;
  }
  if (empty) return null;
  return String(raw).trim();
}

/** Ubah payload mentah menjadi nilai kolom sesuai spesifikasi field. */
export function buildValues(
  key: ResourceKey,
  body: Record<string, unknown>,
  opts: { partial: boolean },
): Values {
  const fields = RESOURCE_FIELDS[key];
  const values: Values = {};

  for (const field of fields) {
    const present = Object.prototype.hasOwnProperty.call(body, field.name);
    if (!present) {
      if (!opts.partial && field.required) {
        throw new ValidationError(`${field.label} wajib diisi`);
      }
      continue;
    }
    const value = coerce(field, body[field.name]);
    if (field.required && (value === null || value === "")) {
      throw new ValidationError(`${field.label} wajib diisi`);
    }
    if (
      field.type === "select" &&
      field.options &&
      value !== null &&
      !field.options.some((option) => option.value === value)
    ) {
      throw new ValidationError(`${field.label} tidak valid`);
    }
    values[field.name] = value;
  }

  if (Object.keys(values).length === 0) {
    throw new ValidationError("Tidak ada data yang dikirim");
  }
  return values;
}

export async function insertResource(key: ResourceKey, values: Values): Promise<number> {
  const table = RESOURCE_TABLE[key];
  if (key === "pengasuh") {
    const { hashPassword } = await import("@/lib/auth");
    const payload = { ...values } as Record<string, unknown>;
    const email = String(payload.email ?? "").toLowerCase();
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) throw new ValidationError("Email sudah terdaftar, gunakan email lain");
    payload.email = email;
    payload.passwordHash = hashPassword("panti123");
    const inserted = await db.insert(users).values(payload as never).returning({ id: users.id });
    return Number(inserted[0]!.id);
  }
  if (key === "anak" && values.pengasuhId === null) delete values.pengasuhId;
  const inserted = await db
    .insert(table)
    .values(values as never)
    .returning({ id: RESOURCE_ID[key] });
  return Number(inserted[0]!.id);
}

export async function updateResource(
  key: ResourceKey,
  id: number,
  values: Values,
): Promise<boolean> {
  const table = RESOURCE_TABLE[key];
  if (key === "pengasuh") {
    const payload = { ...values } as Record<string, unknown>;
    if (typeof payload.email === "string") payload.email = payload.email.toLowerCase();
    const updated = await db
      .update(users)
      .set(payload as never)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return updated.length > 0;
  }
  const updated = await db
    .update(table)
    .set(values as never)
    .where(eq(RESOURCE_ID[key], id))
    .returning({ id: RESOURCE_ID[key] });
  return updated.length > 0;
}

export async function deleteResource(key: ResourceKey, id: number): Promise<boolean> {
  const table = RESOURCE_TABLE[key];
  const deleted = await db
    .delete(table)
    .where(eq(RESOURCE_ID[key], id))
    .returning({ id: RESOURCE_ID[key] });
  return deleted.length > 0;
}
