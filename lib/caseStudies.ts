import { PUBLISH_AIRBNB } from "./data";
import { airbnbCaseStudy } from "./private/airbnb";

// Case-study copy. Every fact here comes from the project's README or code.

export type DiagramNode = { label: string; sub?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  /** Headline numbers for the report header. Taken from the README, data.ts or source files. */
  kpis: { value: string; label: string }[];
  overview: string[];
  problem: string[];
  built: string[];
  /** Optional key findings, shown in their own section */
  findings?: string[];
  /** Heading for the image gallery (defaults to "More screens") */
  galleryTitle?: string;
  diagram: { caption: string; nodes: DiagramNode[] };
  decisions: { title: string; body: string }[];
  stack: { layer: string; tech: string }[];
  status: string[];
  learned: string[];
  links: { label: string; href: string }[];
  images?: { src: string; alt: string; w: number; h: number; caption: string }[];
};

const allCaseStudies: CaseStudy[] = [
  {
    slug: "benchmark",
    title: "LLM Risk Register Benchmark",
    summary: "A reproducible benchmark that tests whether large language models can draft a project risk register from real planning documents.",
    role: "Co-author with Kruthik Jadhav · research code and data pipeline",
    kpis: [
      { value: "456", label: "unit tests, all run offline" },
      { value: "21", label: "real projects in the corpus" },
      { value: "3 × 3", label: "models by prompting strategies" },
      { value: "3", label: "ways of evaluating the output" },
    ],
    overview: [
      "This is the code and data behind a paper we're preparing for an IEEE conference: \"Evaluating Large Language Models for Automated Risk Register Generation from Project Documentation: A Benchmark Study.\"",
      "We compare three LLMs from different providers, each with three prompting strategies (zero-shot, few-shot and structured reasoning).",
    ],
    problem: [
      "Risk registers are written by hand from long planning documents. It's slow work, and it's tempting to hand it to an LLM. But nobody has a clear answer to how complete those AI-drafted registers are, or which kinds of risk they tend to miss or make up.",
      "To test that fairly you need real projects where both the planning documents and a human-written risk register are public. The corpus is 21 such projects: 18 World Bank Project Appraisal Documents and 3 UK government business cases in the Five Case Model format.",
    ],
    built: [
      "A Python pipeline that extracts text from the source PDFs, audits the corpus for leakage, runs the model and prompt grid, matches generated risks against the human register, and computes metrics and figures.",
      "Three evaluation methods: semantic matching against the ground truth (recall, precision, coverage), expert Likert ratings with Fleiss' kappa, and an LLM-as-judge pass that is supplementary only.",
      "A tooling layer around the expensive part: an environment check before any spend, a cost estimate that makes no API calls, batch submission for two of the providers, and a builder for blinded rater packets.",
    ],
    diagram: {
      caption: "Pipeline from source documents to scored results. Only planning documents reach the models. The human register is held out.",
      nodes: [
        { label: "Planning PDFs", sub: "21 projects" },
        { label: "Extract + audit", sub: "leakage check" },
        { label: "Run grid", sub: "3 models × 3 prompts" },
        { label: "Match", sub: "vs held-out register" },
        { label: "Metrics", sub: "figures, ratings" },
      ],
    },
    decisions: [
      {
        title: "A strict no-leakage rule",
        body: "Models only ever see the planning documents. The human register is ground truth and is kept out of the input. An audit script flags leakage with a FAIL/WARN/PASS result, and tests check that leakage-sensitive paths stay gitignored.",
      },
      {
        title: "Tests where mistakes would quietly spoil the results",
        body: "The 456 unit tests stub the embedding model, the PDF reader and all three model APIs, so the suite runs offline with no keys or spend. Coverage is concentrated where the project has actually had bugs, including a permanent regression test for a scoring bug where a boolean was being read as an integer.",
      },
      {
        title: "A validated matching threshold",
        body: "Semantic matching needs a cut-off for \"same risk\". Rather than picking one by eye, the threshold was chosen with a sweep against a hand-labelled set, and that sweep logic is tested too.",
      },
      {
        title: "Guards on the run itself",
        body: "Raw outputs are append-only, and the run driver has a cost guard that estimates spend before anything is sent, so the full grid stays within the project budget.",
      },
    ],
    stack: [
      { layer: "Language", tech: "Python 3.11+, pinned dependencies" },
      { layer: "Matching", tech: "Sentence-transformer embeddings" },
      { layer: "Models", tech: "Three LLMs via their providers' APIs" },
      { layer: "Analysis", tech: "Fleiss' kappa, matplotlib figures" },
      { layer: "Testing", tech: "unittest, 456 tests, fully offline" },
    ],
    status: [
      "The corpus (21 of 21 projects) and the pipeline are complete and unit-tested. The run driver has been pre-flighted end to end with stubbed providers.",
      "Results aren't shown here while the paper is being prepared for submission. The expert-rating part of the study needs recruited human raters.",
      "The batch code path is tested against mocked provider responses only. It hasn't been run against a live API.",
    ],
    learned: [
      "Most of the work in an evaluation is making sure you aren't fooling yourself. That means keeping the answers away from the model and checking it stays that way.",
      "Cheap offline tests pay for themselves when every real run costs money.",
      "Writing the methodology down and freezing it before running anything makes later decisions much easier to defend.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/public-reproducible-benchmark" }],
  },
  {
    slug: "irish-property",
    title: "Irish property prices",
    summary: "An SQL analysis of every residential sale on Ireland's Property Price Register from January 2010 to October 2026, asking how prices and sales have changed and where they have moved most.",
    role: "Solo project. All the analysis is SQL run in DuckDB. Python only downloads the file, runs the SQL in order and draws the charts.",
    kpis: [
      { value: "812,018", label: "sales after cleaning (from 813,106 rows)" },
      { value: "€380,000", label: "national median in 2025, up from €148,000 in 2013" },
      { value: "€498,999", label: "Dublin median in 2025, against €335,000 elsewhere" },
      { value: "1.49x", label: "Dublin to rest of Ireland in 2025, down from 2.22x in 2014" },
      { value: "12.6%", label: "of a year's sales close in December, on average" },
    ],
    overview: [
      "The Property Price Register lists every home sold in Ireland since 2010 with its price, date, address and county. I wanted to see what it says about the market once the data is cleaned properly.",
    ],
    problem: [
      "Headlines quote one number for house prices, but the picture is very different in Dublin, in the commuter counties and in the west. The raw file is also awkward: prices stored as text, dates as DD/MM/YYYY, Irish and English descriptions, and VAT left out on most new homes.",
      "The question: how have prices and sales changed since 2010, and where in the country have they moved most?",
    ],
    built: [
      "Eight numbered SQL files, one per question: load and clean, yearly overview, counties, Dublin against the rest, new against second-hand, seasonality, rolling medians and data quality.",
      "Cleaning in SQL. The file is read as Windows-1252 so the euro sign survives, prices are stripped to digits with regexp_replace, dates go through try_strptime so bad rows can be counted instead of crashing the query, and 1,088 exact duplicates are removed.",
      "Non-market sales (41,190) and prices under €10,000 or over €10m (1,284) stay in the sales table but are left out of a single market_sales view, so every price query uses the same rules.",
      "VAT is added back at 13.5% on new homes recorded without it. Without that step the 2025 new-home median would read €387,665 instead of €440,000.",
      "CTEs build each query in readable steps. Window functions do the rest: LAG for year-on-year change, RANK for county order and the busiest month, PARTITION BY for each month's share of its year, and a 12-month rolling median using RANGE over dates.",
      "Fifteen data-quality checks stacked with UNION ALL into one report, plus pytest checks on the cleaning logic that run on a 1,000-row sample.",
    ],
    findings: [
      "The national median sale price was €380,000 in 2025, up from a low of €148,000 in 2013 (+157%) and well above the 2010 level of €215,650.",
      "Growth is slowing. The rolling 12-month median reached €395,000 by October 2026, up 5.3% on a year earlier, down from a peak of 11.3% in May 2025.",
      "Dublin is still the dearest county at €498,999, but the rest of the country is catching up. A Dublin home cost 2.22 times the median elsewhere in 2014 and 1.49 times in 2025. In euro the gap has stayed at about €150,000 to €175,000 since 2016.",
      "Smaller, cheaper counties rose fastest after 2020. Sligo's median more than doubled (+107%, €122,500 to €254,000), with Leitrim (+96%) and Roscommon (+91%) close behind. Dublin rose least (+33%).",
      "New homes were 22.9% of sales in 2025, up from 12.3% in 2013, and their premium over second-hand homes fell from 55.6% in 2020 to 27.5% (€440,000 against €345,000).",
      "December is by far the busiest month for completed sales: 12.6% of a year's sales on average, against 5.6% in January. It was the busiest month in 15 of the 16 full years.",
    ],
    diagram: {
      caption: "How the pipeline runs, from download to charts.",
      nodes: [
        { label: "Register CSV", sub: "813,106 rows" },
        { label: "01 clean", sub: "sales, market_sales" },
        { label: "02 to 08 SQL", sub: "CTEs, windows" },
        { label: "results/ CSVs", sub: "one per file" },
        { label: "Charts", sub: "matplotlib" },
      ],
    },
    decisions: [
      {
        title: "Medians, not means",
        body: "A few homes sell for millions and drag the average up. In 2025 the mean was €434,741 and the median €380,000. The CSO and Daft report medians for the same reason.",
      },
      {
        title: "Filter once, in a view",
        body: "Non-market and extreme sales are left out in the market_sales view instead of in each query, so no query can forget the filter.",
      },
      {
        title: "A rolling median over all sales",
        body: "The 12-month median is taken over every sale in the window, not as a median of 12 monthly medians, which would give quiet months as much weight as busy ones.",
      },
      {
        title: "Keep the outliers",
        body: "1.7% of market sales sit above Q3 + 3 x IQR. They stay in, because a €1.5m house in Dublin 4 is real, and the median handles them.",
      },
    ],
    stack: [
      { layer: "Analysis", tech: "SQL in DuckDB" },
      { layer: "Glue", tech: "Python runs the SQL files in order and saves results with pandas" },
      { layer: "Charts", tech: "matplotlib" },
      { layer: "Tests", tech: "pytest on a 1,000-row sample" },
      { layer: "Data", tech: "Residential Property Price Register (PSRA), downloaded 26 Oct 2026" },
    ],
    status: [
      "These are sale prices declared for stamp duty, not asking prices, so the register says nothing about bidding wars.",
      "VAT is added back at the standard 13.5% residential rate wherever the flag says the price excludes it. That assumes the rate applied to every such sale.",
      "Sales are dated when they closed, not when they were agreed, and late filings mean recent months can be revised upwards. 2026 is a part year, so 2025 is the latest full year.",
      "There is no floor area (size bands exist for only 6.5% of rows), no bedrooms and no house or apartment split, so a rising median can partly reflect a change in what was sold. The CSO's price index adjusts for that mix.",
      "Some bulk deals slip past the filters, and 287 addresses name a different county from the county column.",
      "The register is a guide only. The PSRA makes it available for re-use and its data on data.gov.ie is under CC BY 4.0. The raw file is not in the repo; a script downloads it.",
    ],
    learned: [
      "Most of the work is in the cleaning. The encoding, the text prices and the VAT each changed the answer before any analysis started.",
      "Window functions let one query answer questions that would otherwise need several, like each month's share of its own year.",
      "Writing the data-quality checks as a query of their own makes it easy to say what the data cannot answer.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/irish-property-sql" }],
    galleryTitle: "More charts",
    images: [
      { src: "/projects/irish-property.webp", alt: "Line chart of median sale price by year, 2010 to 2025, for Dublin and the rest of Ireland", w: 1200, h: 630, caption: "Median sale price by year, Dublin against the rest of Ireland." },
      { src: "/projects/irish-property-median.webp", alt: "Chart of the national median sale price by year as a line, with the number of sales as bars, 2010 to 2025", w: 1228, h: 649, caption: "National median price (line) and number of sales (bars) by year." },
      { src: "/projects/irish-property-counties.webp", alt: "Bar chart of median sale price by county in 2025, from Dublin at 498,999 euro down to Longford at 185,000 euro", w: 1107, h: 996, caption: "Median sale price by county, 2025." },
      { src: "/projects/irish-property-new.webp", alt: "Chart comparing new and second-hand home medians by year, with VAT added back on new homes", w: 1149, h: 649, caption: "New against second-hand homes." },
    ],
  },
  {
    slug: "civicpulse",
    title: "CivicPulse",
    summary: "Turn one photo of a local problem into a categorised report, a ready-to-send complaint letter and a pin on a community map.",
    role: "Full-stack: React front end, FastAPI back end, Gemini integration",
    kpis: [
      { value: "11", label: "issue categories" },
      { value: "3", label: "severity levels" },
      { value: "1 photo", label: "is all a report needs" },
      { value: "0", label: "credentials needed for CI" },
    ],
    overview: [
      "Potholes, broken streetlights and dumped rubbish rarely get reported, because reporting them is a hassle.",
      "CivicPulse makes it one step. You upload a photo, drop a pin and add a line of description. The app works out the rest.",
    ],
    problem: [
      "Even when people want to report something, they don't know which department handles it or how to write a complaint that gets taken seriously. And there's no easy way to see whether a neighbour has already flagged the same thing.",
    ],
    built: [
      "Gemini Vision reads the photo alongside the description, puts the issue into one of eleven categories and scores its severity as low, medium or high.",
      "The category is mapped to the responsible department, for example potholes to Roads and Infrastructure, or leaks to Water and Sewerage. A formal complaint letter is drafted with a timeline that depends on severity.",
      "Reports are stored in Firestore with the photo in Firebase Storage, and plotted on a Leaflet map with colour-coded severity pins. Other residents can upvote to confirm an issue, and a dashboard shows totals, resolution rate and breakdowns by category and severity.",
    ],
    diagram: {
      caption: "Request flow for a new report.",
      nodes: [
        { label: "React form", sub: "photo, pin, text" },
        { label: "FastAPI", sub: "POST /api/issues" },
        { label: "Gemini Vision", sub: "category, severity" },
        { label: "Letter + route", sub: "department map" },
        { label: "Firestore", sub: "map, dashboard" },
      ],
    },
    decisions: [
      {
        title: "Keep the department routing in code",
        body: "Gemini decides the category and a plain lookup table decides the department. That keeps the routing predictable and easy to change, rather than leaving it to the model each time.",
      },
      {
        title: "Fail soft when the AI is unavailable",
        body: "If Gemini is down or the key is missing, the back end still saves the report with category \"other\", medium severity and a template letter. A report is never lost because a model call failed.",
      },
      {
        title: "Tests that need no keys",
        body: "The back-end tests stub Gemini and Firestore, so CI can run them and build the front end without any credentials.",
      },
    ],
    stack: [
      { layer: "Front end", tech: "React 19, Vite 8, Tailwind CSS 4, React Router 7, react-leaflet" },
      { layer: "Back end", tech: "Python, FastAPI" },
      { layer: "AI", tech: "Google Gemini via the google-genai SDK" },
      { layer: "Data", tech: "Firebase Firestore and Storage" },
      { layer: "Deploy", tech: "Docker Compose locally, Google Cloud Run" },
    ],
    status: [
      "There's no hosted demo. Running it needs your own Gemini API key and Firebase project.",
      "No user accounts or moderation yet, so anyone can report and upvote.",
      "CI runs the back-end tests and the front-end build. It doesn't call Gemini or Firebase.",
    ],
    learned: [
      "An LLM is most useful for the fuzzy step (what's in this photo?) and least useful for rules you can write down yourself.",
      "Designing the fallback path first made the whole app easier to test.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/civicpulse" }],
    images: [
      { src: "/projects/civicpulse.webp", alt: "CivicPulse report form with photo upload, description and a map for picking the location", w: 1280, h: 800, caption: "The report form: photo, description and a map picker." },
    ],
  },
  {
    slug: "roam",
    title: "Roam",
    summary: "A trip-planning and booking interface: browse destinations, build an itinerary, watch the cost add up and walk through checkout.",
    role: "Front-end build",
    kpis: [
      { value: "4", label: "main screens in the flow" },
      { value: "0", label: "API routes, so it exports as static HTML" },
      { value: "Next.js 16", label: "with React 19 and TypeScript" },
      { value: "Live", label: "on GitHub Pages" },
    ],
    overview: [
      "Roam is a front-end prototype of a travel planning site. Every page and component is built and interactive, and it's live on GitHub Pages.",
    ],
    problem: [
      "Planning a trip usually means juggling destination research, a rough itinerary and a running budget across several tabs. Roam explores what it looks like to keep all three in one place before you book.",
    ],
    built: [
      "Destination browsing with search and filters for budget, season and activity.",
      "A trip planner with an itinerary builder, a cost calculator and an \"expert review\" panel.",
      "A booking flow with review, payment and confirmation screens, plus a user dashboard, auth screens, content pages, and light and dark themes.",
    ],
    diagram: {
      caption: "The main path through the prototype.",
      nodes: [
        { label: "Destinations", sub: "search, filters" },
        { label: "Planner", sub: "itinerary, costs" },
        { label: "Booking", sub: "review, payment" },
        { label: "Dashboard", sub: "bookings, profile" },
      ],
    },
    decisions: [
      {
        title: "Static export",
        body: "There are no API routes, so the whole site is exported as static HTML and deployed to GitHub Pages by GitHub Actions. That makes it free to host and easy to share.",
      },
      {
        title: "Off-the-shelf accessible components",
        body: "UI is built on Radix UI primitives via shadcn/ui, with React Hook Form and Zod for form validation, rather than hand-rolling dialogs and inputs.",
      },
      {
        title: "Clean up credentials properly",
        body: "An earlier local copy had live API credentials in an env file the old .gitignore didn't exclude. It was never pushed, and .gitignore now excludes every .env file except the example.",
      },
    ],
    stack: [
      { layer: "Framework", tech: "Next.js 16 (App Router, static export), React 19, TypeScript" },
      { layer: "Styling", tech: "Tailwind CSS 4, tailwindcss-animate" },
      { layer: "Components", tech: "Radix UI, shadcn/ui" },
      { layer: "Forms and charts", tech: "React Hook Form, Zod, Recharts" },
      { layer: "Hosting", tech: "GitHub Pages via GitHub Actions" },
    ],
    status: [
      "Front-end prototype. Flight search, payments and accounts aren't connected to a back end.",
      "All data is hard-coded sample data and nothing is saved. Login, signup and payment forms don't submit anywhere.",
      "Images are placeholders.",
    ],
    learned: [
      "Building the whole flow as a clickable prototype first shows which back-end pieces actually matter.",
      "Static export forces you to be honest about what's real and what's mocked.",
    ],
    links: [
      { label: "Live demo", href: "https://smadhu6364-beep.github.io/roam-travel/" },
      { label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/roam-travel" },
    ],
    images: [
      { src: "/projects/roam.webp", alt: "Roam home page with the headline Plan. Explore. Experience. and a destination search box", w: 1280, h: 800, caption: "Home page." },
      { src: "/projects/roam-planner.webp", alt: "Roam trip planner with itinerary and cost calculator", w: 1280, h: 800, caption: "The trip planner." },
    ],
  },
];

export const caseStudies = PUBLISH_AIRBNB && airbnbCaseStudy ? [airbnbCaseStudy, ...allCaseStudies] : allCaseStudies;

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
