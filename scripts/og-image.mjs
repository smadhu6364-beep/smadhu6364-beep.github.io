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
body{width:1200px;height:630px;background:#f5f5f7;font-family:${FONT};color:#1d1d1f;overflow:hidden}
.top{height:84px;background:#fff;border-bottom:1px solid #e5e5ea;display:flex;align-items:center;padding:0 48px;gap:18px}
.mono{width:50px;height:50px;border-radius:13px;background:#0071e3;color:#fff;font-weight:700;font-size:22px;display:flex;align-items:center;justify-content:center}
.nm{font-size:26px;font-weight:700}.sub{font-size:17px;color:#6e6e73}
.tabs{margin-left:auto;display:flex;gap:28px;font-size:18px;color:#6e6e73}.tabs b{color:#1d1d1f;border-bottom:3px solid #0071e3;padding-bottom:6px}
.wrap{padding:30px 48px}
.line{font-size:27px;font-weight:600;line-height:1.3;max-width:1100px}
.k{display:flex;gap:18px;margin-top:24px}
.kp{flex:1;background:#fff;border:1px solid #e5e5ea;border-radius:18px;padding:20px 22px;height:142px}
.kl{font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#6e6e73;font-weight:600}
.kv{font-size:52px;font-weight:700;letter-spacing:-1px;margin-top:8px}
.row{display:flex;gap:18px;margin-top:18px}
.chart{background:#fff;border:1px solid #e5e5ea;border-radius:18px;padding:16px 20px;width:520px;height:232px;position:relative}
.ct{font-size:15px;font-weight:600}.leg{font-size:13px;color:#6e6e73;margin-top:2px}
.chart svg{position:absolute;left:30px;bottom:12px;width:470px;height:160px}
.cta{flex:1;background:#0071e3;color:#fff;border-radius:18px;padding:30px 34px;height:232px;display:flex;flex-direction:column;justify-content:space-between}
.cta div{font-size:28px;font-weight:600;line-height:1.3}.cta span{font-size:30px;font-weight:700}
</style></head><body>
<div class="top"><div class="mono">MS</div><div><div class="nm">Madhu Sudhan Srinivas</div><div class="sub">Business Analytics MSc · Dublin</div></div>
<div class="tabs"><b>Overview</b><span>Projects</span><span>Experience</span><span>Skills</span><span>Contact</span></div></div>
<div class="wrap"><div class="line">MSc Business Analytics at DCU. Power BI, Python and statistics. Looking for data analyst roles in Ireland.</div>
<div class="k"><div class="kp"><div class="kl">Sales analysed in SQL</div><div class="kv">812,018</div></div>
<div class="kp"><div class="kl">Projects</div><div class="kv">5</div></div>
<div class="kp"><div class="kl">Business Analytics</div><div class="kv">MSc</div></div>
<div class="kp"><div class="kl">Operations experience</div><div class="kv">2+ yrs</div></div></div>
<div class="row"><div class="chart"><div class="ct">Median house price, 2010 to 2025</div><div class="leg"><span style="color:#0071e3">● Dublin</span> &nbsp; <span style="color:#af52de">● Rest of Ireland</span></div><svg width="430" height="190" viewBox="0 0 430 190"><polyline points="10.0,108.2 37.3,119.3 64.7,133.2 92.0,125.4 119.3,114.7 146.7,107.1 174.0,93.9 201.3,82.2 228.7,74.8 256.0,74.8 283.3,68.7 310.7,62.6 338.0,50.5 365.3,46.4 392.7,29.7 420.0,18.5" fill="none" stroke="#0071e3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="10.0,144.2 37.3,157.9 64.7,167.9 92.0,172.2 119.3,172.7 146.7,167.9 174.0,161.8 201.3,152.9 228.7,145.6 256.0,139.5 283.3,138.3 310.7,129.4 338.0,118.1 365.3,109.2 392.7,99.0 420.0,84.9" fill="none" stroke="#af52de" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<div class="cta"><div>An interactive portfolio that works like a report. Pick a skill and every visual filters.</div><span>smadhu6364-beep.github.io</span></div></div></div>
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
