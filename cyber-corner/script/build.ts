import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

async function runBuild() {
  try {
    // 1. Build frontend
    console.log("Building frontend...");
    execSync("npx vite build", { stdio: "inherit", cwd: root });

    // 2. Build backend
    console.log("Building backend...");
    const entryPath = path.resolve(root, "server", "index.ts");
    const outDir = path.resolve(root, "dist");

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    await build({
      entryPoints: [entryPath],
      bundle: true,
      platform: "node",
      target: "node20",
      outfile: path.join(outDir, "index.cjs"),
      format: "cjs",
      external: ["fsevents", "vite", "pg-native"], // Externalize things that don't bundle well
      sourcemap: true,
    });

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

runBuild();
