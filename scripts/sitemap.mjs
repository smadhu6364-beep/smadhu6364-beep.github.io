// Runs after `next build`: writes out/sitemap.xml listing /, /cv/ and every exported /projects/<slug>/ page.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://smadhu6364-beep.github.io";
const out = path.resolve("out");
const today = new Date().toISOString().slice(0, 10);
const paths = ["/", "/cv/"];
const projDir = path.join(out, "projects");
if (fs.existsSync(projDir)) {
  for (const d of fs.readdirSync(projDir, { withFileTypes: true })) {
    if (d.isDirectory() && fs.existsSync(path.join(projDir, d.name, "index.html"))) paths.push(`/projects/${d.name}/`);
  }
}
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(out, "sitemap.xml"), xml);
console.log(`sitemap.xml: ${paths.length} URLs`);
