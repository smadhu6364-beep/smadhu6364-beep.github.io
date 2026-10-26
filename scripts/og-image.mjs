// Renders public/og-image.png (1200x630) and the icon set (favicon.ico, icon-192/512.png, apple-touch-icon.png, icon.svg).
// Usage: npm run og:image   (needs puppeteer-core + Edge/Chrome; PUPPETEER_CORE / BROWSER_PATH override)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE || "puppeteer-core");
const browserPath = process.env.BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const pub = path.resolve("public");
const SERIF = `"Instrument Serif", Georgia, "Times New Roman", serif`;
const FONT = `Inter, -apple-system, "Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif`;

const og = `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;600;700&display=swap"><style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f5f4ef;font-family:${FONT};color:#181714;overflow:hidden;position:relative}
.top{display:flex;align-items:center;gap:16px;padding:44px 64px 0}
.mono{width:52px;height:52px;border-radius:50%;background:#181714;color:#f5f4ef;font-family:${SERIF};font-style:italic;font-size:34px;display:flex;align-items:center;justify-content:center;padding-bottom:4px}
.nm{font-size:24px;font-weight:600;letter-spacing:-.3px}
.dot{margin-left:auto;font-size:19px;color:#3d3b36;display:flex;align-items:center;gap:10px}.dot i{width:12px;height:12px;border-radius:50%;background:#2e8c4a}
h1{position:absolute;left:64px;top:170px;font-size:92px;line-height:1.02;font-weight:700;letter-spacing:-3.6px;width:700px}
h1 em{font-family:${SERIF};font-weight:400;font-size:100px;letter-spacing:-1px}
.sub{position:absolute;left:64px;bottom:56px;font-size:22px;color:#4a4842}
.card{position:absolute;right:70px;top:150px;width:350px;height:330px;background:#fbfaf6;border:1px solid #dad7cd;border-radius:6px;transform:rotate(2.5deg);padding:44px 34px;box-shadow:0 30px 50px -30px rgba(40,30,10,.45);background-image:repeating-linear-gradient(180deg,transparent 0 31px,rgba(218,215,205,.7) 31px 32px)}
.tape{position:absolute;top:-16px;left:50%;width:120px;height:32px;margin-left:-60px;transform:rotate(-3deg);background:rgba(231,236,149,.9)}
.lb{font-size:13px;letter-spacing:.14em;color:#58554e;font-weight:600}
.q{font-family:${SERIF};font-style:italic;font-size:34px;line-height:1.15;margin-top:22px}
.cur{position:absolute;left:34px;right:34px;bottom:30px;border-top:1px dashed #dad7cd;padding-top:14px;font-size:16px}
.band{position:absolute;right:0;bottom:0;width:470px;height:12px;background:#e7ec95}
</style></head><body>
<div class="top"><div class="mono">m</div><div class="nm">Madhu Sudhan Srinivas</div><div class="dot"><i></i>Open to data analyst roles in Ireland</div></div>
<h1>From the front line <em>to the data.</em></h1>
<div class="sub">MSc Business Analytics, DCU · SQL, Python, Power BI</div>
<div class="card"><div class="tape"></div><div class="lb">FIELD NOTES · VOL. 01 / 2026</div><div class="q">&ldquo;Clean the data first. It usually changes the answer.&rdquo;</div><div class="cur">&#8627; Currently: MSc Business Analytics at DCU</div></div>
<div class="band"></div>
</body></html>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#181714"/><text x="32" y="42" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="40" fill="#f5f4ef">m</text></svg>`;
fs.writeFileSync(path.join(pub, "icon.svg"), svg);

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(og, { waitUntil: "networkidle0" }).catch(() => {});
await page.evaluateHandle("document.fonts.ready");
await page.screenshot({ path: path.join(pub, "og-image.png") });

const pngs = {};
for (const [name, size, pad] of [["icon-512.png", 512, 0], ["icon-192.png", 192, 0], ["apple-touch-icon.png", 180, 0], ["f32", 32, 0], ["f16", 16, 0]]) {
  await page.setViewport({ width: size, height: size });
  // apple-touch gets a full-bleed square (iOS rounds it); others use the rounded svg
  const inner = name === "apple-touch-icon.png" ? svg.replace('rx="32"', 'rx="0"') : svg;
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
