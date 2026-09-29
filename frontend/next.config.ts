import type { NextConfig } from "next";

// Work around a Next.js 15.5.x build race condition where worker threads
// intermittently fail with `ENOENT .../server/pages-manifest.json`.
// See: https://github.com/vercel/next.js/issues (pages-manifest race)
process.env.NEXT_PRIVATE_WORKER_THREADS = "false";

const nextConfig: NextConfig = {};

export default nextConfig;
