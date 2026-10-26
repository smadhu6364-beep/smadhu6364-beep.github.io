// Runs before build and typecheck. Writes lib/private/ (gitignored).
// When PUBLISH_AIRBNB is true in lib/data.ts and the gitignored private/airbnb/
// folder exists, it copies the Airbnb project, report and images in.
// Otherwise it writes an empty stub, so nothing about that project is built.
import fs from "node:fs";
import path from "node:path";

const flag = /export const PUBLISH_AIRBNB\s*=\s*true/.test(fs.readFileSync("lib/data.ts", "utf8"));
const src = path.resolve("private", "airbnb");
const libDir = path.resolve("lib", "private");
const imgDir = path.resolve("public", "projects", "airbnb");

fs.rmSync(libDir, { recursive: true, force: true });
fs.rmSync(imgDir, { recursive: true, force: true });
fs.mkdirSync(libDir, { recursive: true });

if (flag && fs.existsSync(src)) {
  for (const f of ["airbnb.tsx", "AirbnbReport.tsx", "airbnbData.ts"]) fs.copyFileSync(path.join(src, f), path.join(libDir, f));
  fs.cpSync(path.join(src, "images"), imgDir, { recursive: true });
  console.log("private: Airbnb project included");
} else {
  if (flag) console.warn("private: PUBLISH_AIRBNB is true but private/airbnb/ is missing, so it is left out");
  fs.writeFileSync(
    path.join(libDir, "airbnb.tsx"),
    `import type { Project } from "../data";
import type { CaseStudy } from "../caseStudies";

export const airbnbKpi: { value: string; label: string; sub: string } | null = null;
export const airbnbProject: Project | null = null;
export const airbnbCaseStudy: CaseStudy | null = null;
export function AirbnbReport() {
  return null;
}
`,
  );
  console.log("private: stub written");
}
