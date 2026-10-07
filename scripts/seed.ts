import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const { db } = await import("@/db");
  const { ensureSeeded } = await import("@/lib/seed");
  const { sql } = await import("drizzle-orm");

  console.log("[seed] memulai seeding ke Neon...");
  await ensureSeeded();

  const tables = [
    "users",
    "anak",
    "kebutuhan",
    "perlindungan",
    "kegiatan",
    "donasi",
    "pengeluaran",
  ] as const;

  console.log("\n[seed] jumlah baris per tabel:");
  for (const table of tables) {
    const result = await db.execute<{ count: string }>(
      sql.raw(`select count(*)::text as count from ${table}`),
    );
    const rows = (result as unknown as { rows?: { count: string }[] }).rows ?? [];
    console.log(`  ${table.padEnd(14)} ${rows[0]?.count ?? "?"} baris`);
  }

  console.log("\n[seed] selesai. Login demo: admin@panti.id / panti123");
  process.exit(0);
}

main().catch((error) => {
  console.error("[seed] gagal:", error);
  process.exit(1);
});
