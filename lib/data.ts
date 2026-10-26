import { airbnbProject } from "./private/airbnb";

/**
 * Set to true to add the private group project (kept in the gitignored
 * private/ folder) to the site, with its report page, sitemap entry and images.
 * Keep it false until the coursework has been submitted. scripts/private.mjs
 * copies the files in at build time only when this is true.
 */
export const PUBLISH_AIRBNB = false;

export const profile = {
  name: "Madhu Sudhan Srinivas",
  short: "Madhu",
  location: "Dublin 9, Ireland",
  email: "smadhu6364@gmail.com",
  github: "https://github.com/smadhu6364-beep",
  githubHandle: "smadhu6364-beep",
  linkedin: "https://www.linkedin.com/in/madhu-sudhan-a966b3225/",
  linkedinHandle: "madhu-sudhan-a966b3225",
  positioning:
    "I've run day-to-day operations on busy front lines, and now I build data and AI tools. I'm looking for data and analytics roles in Ireland.",
};

export type Job = {
  company: string;
  role: string;
  place: string;
  dates: string;
  length: string;
  /** "YYYY-MM"; omitted when the CV doesn't give dates */
  start?: string;
  end?: string;
  /** Skills from the skills list that this role used */
  tags: string[];
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Thomas Cook (India) Limited",
    role: "Operations Executive (Customer Service)",
    place: "Bengaluru",
    dates: "Apr 2026 – Sep 2026",
    length: "6 months",
    start: "2026-04",
    end: "2026-09",
    tags: ["Customer service", "Query and complaint resolution", "Records accuracy"],
    points: [
      "Answered customer queries and resolved booking issues in a busy, high-volume operations team.",
      "Found and corrected errors in booking records.",
      "Worked with teammates to keep daily operations running.",
    ],
  },
  {
    company: "Trip Factory",
    role: "Operations Coordinator",
    place: "Bengaluru",
    dates: "Jul 2024 – Mar 2026",
    length: "1 yr 9 mo",
    start: "2024-07",
    end: "2026-03",
    tags: ["Customer service", "Query and complaint resolution", "Inventory checks", "Shift reporting"],
    points: [
      "Handled customer onboarding and card payments, and resolved complaints in a high-footfall setting.",
      "Ran stock checks and inventory checkpoints.",
      "Compiled shift figures in tracking files so supervisors could plan the week.",
    ],
  },
  {
    company: "Amitri Cafe",
    role: "Cafe Team Member",
    place: "Bengaluru",
    dates: "6 months",
    length: "6 months",
    tags: ["Customer service"],
    points: [
      "Took orders and kept service moving at peak times.",
      "Kept to food hygiene standards.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  repo: string;
  stack: string[];
  detail: string[];
  note?: string;
  demo?: string;
  featured?: boolean;
  /** Screenshot under /public/projects, or omitted when the card shows a diagram */
  image?: { src: string; alt: string; w: number; h: number };
  /** Has a case study at /projects/<id>/ */
  caseStudy?: boolean;
  kind: ProjectKind;
  /** Skills from the skills list that this project used (drives the cross-filter) */
  tags: string[];
  /** Group or co-author credit shown on the tile */
  credit?: string;
};

export const projectKinds = ["Data & BI", "AI & LLMs", "Web apps"] as const;
export type ProjectKind = (typeof projectKinds)[number];

const allProjects: Project[] = [
  {
    id: "benchmark",
    name: "LLM Risk Register Benchmark",
    tagline: "Can LLMs draft a project risk register from real planning documents?",
    repo: "https://github.com/smadhu6364-beep/public-reproducible-benchmark",
    featured: true,
    kind: "AI & LLMs",
    credit: "Co-authored with Kruthik Jadhav",
    tags: ["Python", "LLM evaluation", "Prompt engineering", "Reproducible research", "Statistics"],
    stack: ["Python", "LLM evaluation", "Prompt engineering", "Reproducible research"],
    detail: [
      "A benchmark study that evaluates three LLMs across three prompting strategies for automated risk-register generation.",
      "Inputs are real project planning documents from 21 World Bank and UK government sources.",
      "Reproducible pipeline with a strict no-leakage evaluation design, covered by 456 unit tests.",
    ],
    note: "Being prepared for an IEEE conference.",
    caseStudy: true,
  },
  {
    id: "irish-property",
    name: "Irish property prices",
    tagline: "How have Irish house prices changed since 2010, and where have they moved most?",
    repo: "https://github.com/smadhu6364-beep/irish-property-sql",
    featured: true,
    kind: "Data & BI",
    tags: ["SQL", "DuckDB", "Python", "pandas", "Data visualisation", "Statistics"],
    stack: ["SQL", "DuckDB", "Python", "pandas", "matplotlib"],
    detail: [
      "Every residential sale on the Property Price Register from 2010 to October 2026, analysed in eight SQL files.",
      "The national median was €380,000 in 2025, up from €148,000 in 2013. Dublin's lead over the rest of the country has shrunk from 2.22 times to 1.49 times.",
    ],
    caseStudy: true,
  },
  {
    id: "civicpulse",
    name: "CivicPulse",
    tagline: "Snap a local problem, get a complaint letter and a pin on the map.",
    repo: "https://github.com/smadhu6364-beep/civicpulse",
    featured: true,
    kind: "AI & LLMs",
    tags: ["Python", "JavaScript", "React", "FastAPI", "Firebase", "Leaflet.js", "Gemini API", "Docker", "GitHub Actions"],
    stack: ["React", "FastAPI", "Gemini Vision", "Firebase", "Leaflet"],
    detail: [
      "Take a photo of a local problem. Gemini Vision categorises it, scores its severity, works out which authority is responsible and drafts a complaint letter.",
      "Reports appear on a live community map.",
    ],
    image: { src: "/projects/civicpulse.webp", alt: "CivicPulse report form with photo upload, description and a map for picking the location", w: 1280, h: 800 },
    caseStudy: true,
  },
  {
    id: "roam",
    name: "Roam",
    tagline: "A trip-planning and booking interface prototype.",
    repo: "https://github.com/smadhu6364-beep/roam-travel",
    demo: "https://smadhu6364-beep.github.io/roam-travel/",
    kind: "Web apps",
    tags: ["TypeScript", "React", "Next.js", "GitHub Actions"],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind"],
    detail: [
      "Front-end prototype for planning and booking trips.",
      "Flights and payments are scaffolded, not live.",
    ],
    image: { src: "/projects/roam.webp", alt: "Roam home page with the headline Plan. Explore. Experience. and a destination search box", w: 1280, h: 800 },
    caseStudy: true,
  },
  {
    id: "aiml",
    name: "In-browser vision demos",
    tagline: "Body, face, hand and object detection running in the browser.",
    repo: "https://github.com/smadhu6364-beep/aiml-project",
    demo: "https://smadhu6364-beep.github.io/aiml-project/",
    kind: "AI & LLMs",
    tags: ["JavaScript", "React", "TensorFlow.js"],
    stack: ["TensorFlow.js", "React", "BodyPix", "Face Mesh", "Handpose", "COCO-SSD"],
    detail: [
      "A set of demos using BodyPix, Face Mesh, Handpose and COCO-SSD with TensorFlow.js and React.",
      "Everything runs client-side, no server needed.",
    ],
  },
];

/** Projects visible on this build. The private one is only added when PUBLISH_AIRBNB is true (see scripts/private.mjs). */
export const projects: Project[] = PUBLISH_AIRBNB && airbnbProject ? [airbnbProject, ...allProjects] : allProjects;

export const skills = [
  {
    name: "Data",
    skills: ["Python", "SQL", "DuckDB", "pandas", "Advanced Excel", "Power BI", "Statistics", "Data visualisation"],
  },
  {
    name: "Web",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "Leaflet.js", "Firebase"],
  },
  {
    name: "AI / ML",
    skills: ["Gemini API", "Prompt engineering", "TensorFlow.js", "LLM evaluation", "Reproducible research"],
  },
  {
    name: "Tools",
    skills: ["Docker", "Git", "GitHub Actions"],
  },
  {
    name: "Operations",
    skills: ["Customer service", "Query and complaint resolution", "Records accuracy", "Inventory checks", "Shift reporting"],
  },
];

export const education = [
  {
    status: "Current",
    title: "MSc in Business Analytics (Computing)",
    school: "Dublin City University",
    place: "Dublin",
    dates: "2026 – present",
    start: "2026-09",
    tags: ["Statistics", "Power BI", "Python", "Data visualisation"],
    modules: [
      "Statistics",
      "Visualisation & Communication (Power BI)",
      "Programming & Machine Learning (Python)",
      "Research Skills",
    ],
  },
  {
    status: "Completed",
    title: "BE Computer Science Engineering",
    school: "DSATM",
    place: "Bangalore",
    dates: "2019 – 2023",
    start: "2019-01",
    end: "2023-12",
    tags: [] as string[],
    modules: [] as string[],
  },
];

