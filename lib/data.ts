export const profile = {
  name: "Madhu Sudhan Srinivas",
  short: "Madhu",
  location: "Dublin 9, Ireland",
  email: "smadhu6364@gmail.com",
  github: "https://github.com/smadhu6364-beep",
  githubHandle: "smadhu6364-beep",
  positioning:
    "I've run day-to-day operations on busy front lines, and now I build data and AI tools. I'm looking for data and analytics roles in Ireland.",
};

export type Stint = {
  pos: number;
  team: string;
  role: string;
  place: string;
  dates: string;
  length: string;
  points: string[];
};

export const experience: Stint[] = [
  {
    pos: 1,
    team: "Thomas Cook (India) Limited",
    role: "Operations Executive (Customer Service)",
    place: "Bengaluru",
    dates: "Apr 2026 – Sep 2026",
    length: "6 months",
    points: [
      "Answered customer queries and resolved booking issues in a busy, high-volume operations team.",
      "Found and corrected errors in booking records.",
      "Worked with teammates to keep daily operations running.",
    ],
  },
  {
    pos: 2,
    team: "Trip Factory",
    role: "Operations Coordinator",
    place: "Bengaluru",
    dates: "Jul 2024 – Mar 2026",
    length: "1 yr 9 mo",
    points: [
      "Handled customer onboarding and card payments, and resolved complaints in a high-footfall setting.",
      "Ran stock checks and inventory checkpoints.",
      "Compiled shift figures in tracking files so supervisors could plan the week.",
    ],
  },
  {
    pos: 3,
    team: "Amitri Cafe",
    role: "Cafe Team Member",
    place: "Bengaluru",
    dates: "6 months",
    length: "6 months",
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
};

export const projects: Project[] = [
  {
    id: "benchmark",
    name: "LLM Risk Register Benchmark",
    tagline: "Can LLMs draft a project risk register from real planning documents?",
    repo: "https://github.com/smadhu6364-beep/public-reproducible-benchmark",
    stack: ["Python", "LLM evaluation", "Prompt engineering", "Reproducible research"],
    detail: [
      "A benchmark study, co-authored with Kruthik Jadhav, that evaluates three LLMs across three prompting strategies for automated risk-register generation.",
      "Inputs are real project planning documents from 21 World Bank and UK government sources.",
      "Reproducible pipeline with a strict no-leakage evaluation design, covered by 438 unit tests.",
    ],
    note: "Being prepared for an IEEE conference submission.",
  },
  {
    id: "civicpulse",
    name: "CivicPulse",
    tagline: "Snap a local problem, get a complaint letter and a pin on the map.",
    repo: "https://github.com/smadhu6364-beep/civicpulse",
    stack: ["React", "FastAPI", "Gemini Vision", "Firebase", "Leaflet"],
    detail: [
      "Take a photo of a local problem. Gemini Vision categorises it, scores its severity, works out which authority is responsible and drafts a complaint letter.",
      "Reports appear on a live community map.",
    ],
  },
  {
    id: "roam",
    name: "Roam",
    tagline: "A trip-planning and booking interface prototype.",
    repo: "https://github.com/smadhu6364-beep/roam-travel",
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind"],
    detail: [
      "Front-end prototype for planning and booking trips.",
      "Flights and payments are scaffolded, not live.",
    ],
  },
  {
    id: "foodiepy",
    name: "Foodiepy",
    tagline: "Food-demand forecasting and inventory in Django.",
    repo: "https://github.com/smadhu6364-beep/foodiepy",
    stack: ["Django", "Python", "Gradient boosting"],
    detail: [
      "Built with three other contributors.",
      "Gradient boosting forecasts order volume for fulfilment centres, feeding an inventory app.",
    ],
  },
  {
    id: "aiml",
    name: "In-browser vision demos",
    tagline: "Body, face, hand and object detection running in the browser.",
    repo: "https://github.com/smadhu6364-beep/aiml-project",
    stack: ["TensorFlow.js", "React", "BodyPix", "Face Mesh", "Handpose", "COCO-SSD"],
    detail: [
      "A set of demos using BodyPix, Face Mesh, Handpose and COCO-SSD with TensorFlow.js and React.",
      "Everything runs client-side, no server needed.",
    ],
  },
];

export type Compound = {
  name: string;
  compound: string;
  letter: string;
  color: string;
  skills: string[];
};

export const compounds: Compound[] = [
  {
    name: "Data",
    compound: "Soft",
    letter: "S",
    color: "#e10600",
    skills: ["Python", "SQL", "Advanced Excel", "Power BI", "Statistics", "Data visualisation"],
  },
  {
    name: "Web",
    compound: "Medium",
    letter: "M",
    color: "#ffd21a",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "Django", "Leaflet.js", "Firebase"],
  },
  {
    name: "AI / ML",
    compound: "Hard",
    letter: "H",
    color: "#f4f1ea",
    skills: ["Gemini API", "Prompt engineering", "scikit-learn", "LLM evaluation", "Reproducible research"],
  },
  {
    name: "Tools",
    compound: "Intermediate",
    letter: "I",
    color: "#22c55e",
    skills: ["Docker", "Git", "GitHub Actions"],
  },
  {
    name: "Operations",
    compound: "Wet",
    letter: "W",
    color: "#3b82f6",
    skills: ["Query and complaint resolution", "Records accuracy", "Inventory checks", "Shift reporting"],
  },
];

export const education = [
  {
    round: "R2",
    status: "Current",
    title: "MSc in Business Analytics (Computing)",
    school: "Dublin City University",
    place: "Dublin",
    dates: "2026 – present",
    modules: [
      "Statistics",
      "Visualisation & Communication (Power BI)",
      "Programming & Machine Learning (Python)",
      "Research Skills",
    ],
  },
  {
    round: "R1",
    status: "Completed",
    title: "BE Computer Science Engineering",
    school: "DSATM",
    place: "Bangalore",
    dates: "2019 – 2023",
    modules: [] as string[],
  },
];

export const sections = [
  { id: "start", label: "Grid", corner: "T1", sector: 1 },
  { id: "pitwall", label: "Pit wall", corner: "T3", sector: 1 },
  { id: "telemetry", label: "Telemetry", corner: "T6", sector: 2 },
  { id: "tyres", label: "Tyres", corner: "T9", sector: 2 },
  { id: "qualifying", label: "Qualifying", corner: "T11", sector: 3 },
  { id: "finish", label: "Finish", corner: "T14", sector: 3 },
] as const;
