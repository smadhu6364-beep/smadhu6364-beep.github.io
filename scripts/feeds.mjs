// Fetches the "Trending in Dublin" and "Tech news" headlines at build time and
// writes lib/feeds.json. The site is static, so this runs on every build, and
// the deploy workflow rebuilds once a day to keep it fresh.
// If a source is down, the previous file is kept so the build never fails.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("lib/feeds.json");
const UA = { "User-Agent": "madhu-portfolio-build (+https://smadhu6364-beep.github.io)" };

const decode = (s) =>
  s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

async function dublin() {
  // business, tech and what's-on stories; crime and court news is left out on purpose
  const q = encodeURIComponent("Dublin (tech OR startup OR business OR jobs OR data OR AI OR festival OR events OR culture) when:3d");
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-IE&gl=IE&ceid=IE:en`;
  const xml = await (await fetch(url, { headers: UA })).text();
  const grim = /charged|murder|stab|assault|police|garda|court|trial|died|death|dead|crash|shoot|gun|arrest|killed|fire brigade|sentenc|jail|prison|drug|crime|attack|injur|victim/i;
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const get = (tag) => decode((item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) || [])[1] || "");
    const source = get("source");
    const title = get("title").replace(new RegExp(`\\s+-\\s+${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "");
    return { title, source, link: get("link"), date: new Date(get("pubDate")).toISOString() };
  }).filter((n) => n.title && !grim.test(n.title)).slice(0, 6);
}

async function tech() {
  const ids = await (await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", { headers: UA })).json();
  const items = await Promise.all(
    ids.slice(0, 12).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { headers: UA }).then((r) => r.json())),
  );
  return items
    .filter((i) => i && i.url && i.title)
    .slice(0, 6)
    .map((i) => ({ title: i.title, link: i.url, points: i.score, comments: `https://news.ycombinator.com/item?id=${i.id}`, site: new URL(i.url).hostname.replace(/^www\./, "") }));
}

const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { dublin: [], tech: [], updated: null };
const result = { ...previous };
try { const d = await dublin(); if (d.length) result.dublin = d; } catch (e) { console.warn("feeds: Dublin news skipped:", e.message); }
try { const t = await tech(); if (t.length) result.tech = t; } catch (e) { console.warn("feeds: tech news skipped:", e.message); }
if (result.dublin !== previous.dublin || result.tech !== previous.tech) result.updated = new Date().toISOString();
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`feeds: ${result.dublin.length} Dublin, ${result.tech.length} tech (updated ${result.updated})`);
