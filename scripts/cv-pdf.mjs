// Regenerates public/Madhu_Sudhan_Srinivas_CV.pdf from the built /cv/ page.
// Usage: npm run build && npm run cv:pdf   (needs puppeteer-core + Edge/Chrome; set PUPPETEER_CORE / BROWSER_PATH to override)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const browserPath = process.env.BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const port = 4617;
const server = spawn("npx", ["serve", "out", "-l", String(port)], { shell: true, stdio: "ignore" });

const up = () => new Promise((r) => http.get(`http://localhost:${port}/cv/`, (res) => r(res.statusCode === 200)).on("error", () => r(false)));
for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500));

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await page.goto(`http://localhost:${port}/cv/`, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  const file = path.resolve("public", "Madhu_Sudhan_Srinivas_CV.pdf");
  await page.pdf({ path: file, format: "A4", printBackground: false, margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" } });
  console.log("wrote", file, fs.statSync(file).size, "bytes");
} finally {
  await browser.close();
  server.kill();
  if (process.platform === "win32") spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
}
