import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {};

export default async function nextConfigSetup(phase: string): Promise<NextConfig> {
  if (phase === PHASE_PRODUCTION_BUILD) {
    try {
      const { packageSource } = await import("./scripts/package-source.mjs");
      await packageSource();
    } catch (error) {
      console.warn("[next.config] gagal membuat source-code.zip:", error);
    }
  }
  return nextConfig;
}
