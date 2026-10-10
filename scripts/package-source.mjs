import { ZipArchive } from "archiver";
import { createWriteStream, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/** Folder/berkas yang TIDAK boleh masuk ke source-code.zip */
const IGNORE = [
  "node_modules/**",
  ".git/**",
  ".next/**",
  ".kilo/**",
  ".vercel/**",
  "out/**",
  "build/**",
  "public/source-code.zip",
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
  ".env.development",
  ".env.development.local",
  ".env.test.local",
  "*.log",
  ".DS_Store",
];

/**
 * Mempaketkan source code lengkap (tanpa node_modules, build output, dan
 * berkas env yang berisi kredensial) menjadi public/source-code.zip.
 */
export async function packageSource(cwd = process.cwd()) {
  const outDir = path.join(cwd, "public");
  const outPath = path.join(outDir, "source-code.zip");
  mkdirSync(outDir, { recursive: true });

  await new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);
    archive.glob("**/*", { cwd, ignore: IGNORE, dot: true, nodir: true });
    archive.finalize();
  });

  const size = statSync(outPath).size;
  console.log(
    `[package-source] ${path.relative(cwd, outPath)} dibuat (${(size / 1024).toFixed(0)} KB)`,
  );
  return outPath;
}

const invokedDirectly =
  process.argv[1] === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  packageSource().catch((error) => {
    console.error("[package-source] gagal:", error);
    process.exit(1);
  });
}
