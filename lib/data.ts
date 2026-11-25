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
    "Two years in travel operations in Bengaluru (Trip Factory, Thomas Cook), now an MSc Business Analytics student at DCU building SQL, Python and LLM projects. I'm looking for data analyst roles in Ireland.",
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
      "Audited booking records for errors and corrected them, keeping customer data accurate.",
      "Resolved customer booking queries by tracing each one back to the record that caused it.",
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
    tags: ["Customer service", "Query and complaint resolution", "Inventory checks", "Shift reporting", "Advanced Excel"],
    points: [
      "Compiled daily shift figures into Excel tracking sheets that supervisors used to plan the week.",
      "Ran stock checks and inventory reconciliation at set checkpoints.",
      "Handled customer onboarding and card payment processing, and resolved complaints in a high-footfall setting.",
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
    id: "yelp-ml",
    name: "Which restaurants are about to get worse reviews?",
    tagline: "Predicting next year's rise in 1-2 star Yelp reviews, and checking whether ML beats a simple rule.",
    repo: "https://github.com/smadhu6364-beep/baa1112-group3-ml",
    featured: true,
    kind: "Data & BI",
    credit: "DCU MSc group project (5 people); I built the cleaning, models and validation",
    tags: ["Python", "pandas", "scikit-learn", "Machine learning", "Statistics", "Data visualisation"],
    stack: ["Python", "pandas", "scikit-learn", "HistGradientBoosting", "Bootstrap CIs"],
    detail: [
      "4.72 million Yelp reviews for 52,268 restaurants, turned into 137,894 restaurant-years (2010-2020) with a time-based train, validation and test split to stop leakage.",
      "Tuned gradient boosting reached a test ROC-AUC of 0.706, only 0.011 above a five-input statistical baseline (95% CI 0.007-0.015): most of the signal is regression to the mean, so we recommended the simple rule first and kept ML as a challenger.",
      "As a watch list, the top 10% of flagged restaurants saw a real rise 55% of the time, against 34% at random.",
    ],
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
      "Every residential sale on the Property Price Register from 2010 to October 2026, analysed in nine SQL files.",
      "The national median was €380,000 in 2025, up from €148,000 in 2013. Dublin's lead over the rest of the country has shrunk from 2.22 times to 1.49 times.",
    ],
    demo: "/dashboard/",
    caseStudy: true,
  },
  {
    id: "property-dashboard",
    name: "Irish property dashboard",
    tagline: "Filter 812,018 Irish house sales by county and year: prices, volumes and rankings in one view.",
    repo: "https://github.com/smadhu6364-beep/irish-property-sql",
    demo: "/dashboard/",
    kind: "Data & BI",
    tags: ["SQL", "DuckDB", "Data visualisation", "TypeScript", "React"],
    stack: ["SQL", "DuckDB", "React", "TypeScript"],
    detail: [
      "KPI tiles, a county filter, a year range, a price trend against the national median and a county league table.",
      "Built on a new window-function query (LAG for year-on-year change, RANK by county) over the property results.",
    ],
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
      "Eleven issue types, low/medium/high severity, photos stored in Firebase, colour-coded pins on a Leaflet map, upvotes to confirm an issue, and a dashboard with resolution rate.",
    ],
    image: { src: "/projects/civicpulse.webp", alt: "CivicPulse report form with photo upload, description and a map for picking the location", w: 1280, h: 800 },
    caseStudy: true,
  },
  {
    id: "roam",
    name: "Roam",
    tagline: "Plan a trip end to end: find a destination, build the itinerary, watch the cost add up, check out.",
    repo: "https://github.com/smadhu6364-beep/roam-travel",
    demo: "https://madhu.is-a.dev/roam-travel/",
    kind: "Web apps",
    tags: ["TypeScript", "React", "Next.js", "GitHub Actions"],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind"],
    detail: [
      "17 pages: destination search with budget, season and activity filters, an itinerary builder with a live cost calculator, and a booking and checkout flow.",
      "Front end only: flights, payments and accounts are not connected to a backend yet. Forms are validated with Zod; light and dark themes.",
    ],
    image: { src: "/projects/roam.webp", alt: "Roam home page with the headline Plan. Explore. Experience. and a destination search box", w: 1280, h: 800 },
    caseStudy: true,
  },
  {
    id: "aiml",
    name: "In-browser vision demos",
    tagline: "Four real-time computer vision demos on your webcam, running entirely in the browser.",
    repo: "https://github.com/smadhu6364-beep/aiml-project",
    demo: "https://madhu.is-a.dev/aiml-project/",
    kind: "AI & LLMs",
    tags: ["JavaScript", "React", "TensorFlow.js"],
    stack: ["TensorFlow.js", "React", "BodyPix", "Face Mesh", "Handpose", "COCO-SSD"],
    detail: [
      "Object detection for 80 everyday object types (COCO-SSD), a 468-point face mesh, 21-point hand tracking with thumbs-up and victory gestures, and body-part segmentation (BodyPix).",
      "Pre-trained Google models loaded with TensorFlow.js and React; inference runs on the device, so no video is uploaded anywhere.",
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
    skills: ["scikit-learn", "Machine learning", "Gemini API", "Prompt engineering", "TensorFlow.js", "LLM evaluation", "Reproducible research"],
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

