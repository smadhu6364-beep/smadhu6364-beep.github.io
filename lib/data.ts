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

export type Job = {
  company: string;
  role: string;
  place: string;
  dates: string;
  length: string;
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Thomas Cook (India) Limited",
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
    company: "Trip Factory",
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
    company: "Amitri Cafe",
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
  demo?: string;
  featured?: boolean;
  /** Screenshot under /public/projects, or omitted when the card shows a diagram */
  image?: { src: string; alt: string; w: number; h: number };
  /** Has a case study at /projects/<id>/ */
  caseStudy?: boolean;
};

export const projects: Project[] = [
  {
    id: "benchmark",
    name: "LLM Risk Register Benchmark",
    tagline: "Can LLMs draft a project risk register from real planning documents?",
    repo: "https://github.com/smadhu6364-beep/public-reproducible-benchmark",
    featured: true,
    stack: ["Python", "LLM evaluation", "Prompt engineering", "Reproducible research"],
    detail: [
      "A benchmark study, co-authored with Kruthik Jadhav, that evaluates three LLMs across three prompting strategies for automated risk-register generation.",
      "Inputs are real project planning documents from 21 World Bank and UK government sources.",
      "Reproducible pipeline with a strict no-leakage evaluation design, covered by 456 unit tests.",
    ],
    note: "Targeting an IEEE conference.",
    caseStudy: true,
  },
  {
    id: "civicpulse",
    name: "CivicPulse",
    tagline: "Snap a local problem, get a complaint letter and a pin on the map.",
    repo: "https://github.com/smadhu6364-beep/civicpulse",
    featured: true,
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
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind"],
    detail: [
      "Front-end prototype for planning and booking trips.",
      "Flights and payments are scaffolded, not live.",
    ],
    image: { src: "/projects/roam.webp", alt: "Roam home page with the headline Plan. Explore. Experience. and a destination search box", w: 1280, h: 800 },
    caseStudy: true,
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
    image: { src: "/projects/foodiepy.webp", alt: "Foodiepy landing page: forecast food demand for the next few weeks", w: 1280, h: 800 },
    caseStudy: true,
  },
  {
    id: "aiml",
    name: "In-browser vision demos",
    tagline: "Body, face, hand and object detection running in the browser.",
    repo: "https://github.com/smadhu6364-beep/aiml-project",
    demo: "https://smadhu6364-beep.github.io/aiml-project/",
    stack: ["TensorFlow.js", "React", "BodyPix", "Face Mesh", "Handpose", "COCO-SSD"],
    detail: [
      "A set of demos using BodyPix, Face Mesh, Handpose and COCO-SSD with TensorFlow.js and React.",
      "Everything runs client-side, no server needed.",
    ],
    image: { src: "/projects/aiml.webp", alt: "Browser Vision Lab page listing object detection, face mesh, hand gestures and body segmentation demos", w: 1100, h: 900 },
  },
];

export const skills = [
  {
    name: "Data",
    skills: ["Python", "SQL", "Advanced Excel", "Power BI", "Statistics", "Data visualisation"],
  },
  {
    name: "Web",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "Django", "Leaflet.js", "Firebase"],
  },
  {
    name: "AI / ML",
    skills: ["Gemini API", "Prompt engineering", "scikit-learn", "LLM evaluation", "Reproducible research"],
  },
  {
    name: "Tools",
    skills: ["Docker", "Git", "GitHub Actions"],
  },
  {
    name: "Operations",
    skills: ["Query and complaint resolution", "Records accuracy", "Inventory checks", "Shift reporting"],
  },
];

export const education = [
  {
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
    status: "Completed",
    title: "BE Computer Science Engineering",
    school: "DSATM",
    place: "Bangalore",
    dates: "2019 – 2023",
    modules: [] as string[],
  },
];

