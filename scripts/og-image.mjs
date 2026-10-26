// Renders public/og-image.png (1200x630) and the icon set (favicon.ico, icon-192/512.png, apple-touch-icon.png, icon.svg).
// Usage: npm run og:image   (needs puppeteer-core + Edge/Chrome; PUPPETEER_CORE / BROWSER_PATH override)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const browserPath = process.env.BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const pub = path.resolve("public");
const FONT = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI Variable Display", Inter, "Segoe UI", system-ui, sans-serif`;

const og = `<!doctype html><html><head><style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f5f5f7;font-family:${FONT};position:relative;overflow:hidden;color:#1d1d1f}
.g{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
.card{position:absolute;left:90px;top:95px;width:1020px;height:440px;border-radius:40px;background:rgba(255,255,255,.62);
 border:1px solid rgba(255,255,255,.9);box-shadow:0 30px 80px rgba(0,0,0,.08);backdrop-filter:blur(30px);padding:70px 80px;display:flex;flex-direction:column}
.mono{width:84px;height:84px;border-radius:22px;background:linear-gradient(135deg,#0071e3,#af52de);color:#fff;font-weight:700;font-size:36px;display:flex;align-items:center;justify-content:center;letter-spacing:-1px}
h1{font-size:76px;font-weight:700;letter-spacing:-2.5px;margin-top:36px}
p{font-size:34px;color:#424245;margin-top:14px;font-weight:500}
.url{margin-top:auto;font-size:26px;color:#0071e3;font-weight:600}
</style></head><body>
<div class="g" style="width:520px;height:520px;background:#0071e3;left:-120px;top:-160px"></div>
<div class="g" style="width:460px;height:460px;background:#af52de;right:-80px;top:-120px"></div>
<div class="g" style="width:420px;height:420px;background:#ff2d55;right:180px;bottom:-240px"></div>
<div class="g" style="width:420px;height:420px;background:#30b0c7;left:160px;bottom:-260px"></div>
<div class="card"><div class="mono">MS</div><h1>Madhu Sudhan Srinivas</h1>
<p>MSc Business Analytics, DCU · data and AI tools</p><div class="url">smadhu6364-beep.github.io</div></div>
</body></html>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0071e3"/><stop offset="1" stop-color="#af52de"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="41.5" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="26" letter-spacing="-1" fill="#fff">MS</text></svg>`;
fs.writeFileSync(path.join(pub, "icon.svg"), svg);

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(og, { waitUntil: "load" });
await page.screenshot({ path: path.join(pub, "og-image.png") });

const pngs = {};
for (const [name, size, pad] of [["icon-512.png", 512, 0], ["icon-192.png", 192, 0], ["apple-touch-icon.png", 180, 0], ["f32", 32, 0], ["f16", 16, 0]]) {
  await page.setViewport({ width: size, height: size });
  // apple-touch gets a full-bleed square (iOS rounds it); others use the rounded svg
  const inner = name === "apple-touch-icon.png" ? svg.replace('rx="14"', 'rx="0"') : svg;
  await page.setContent(`<html><body style="margin:0;background:transparent">${inner.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  const buf = await page.screenshot({ omitBackground: true });
  if (name.endsWith(".png")) fs.writeFileSync(path.join(pub, name), buf); else pngs[name] = buf;
}
await browser.close();

// favicon.ico containing 16 and 32 PNGs
const imgs = [[16, pngs.f16], [32, pngs.f32]];
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
let offset = 6 + 16 * imgs.length; const dirs = [];
for (const [s, b] of imgs) {
  const d = Buffer.alloc(16); d.writeUInt8(s, 0); d.writeUInt8(s, 1); d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6);
  d.writeUInt32LE(b.length, 8); d.writeUInt32LE(offset, 12); offset += b.length; dirs.push(d);
}
fs.writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([header, ...dirs, ...imgs.map((i) => i[1])]));
console.log("wrote og-image.png, icon set");
