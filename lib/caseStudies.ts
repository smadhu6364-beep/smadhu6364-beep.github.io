// Case-study copy. Every fact here comes from the project's README or code.

export type DiagramNode = { label: string; sub?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  overview: string[];
  problem: string[];
  built: string[];
  diagram: { caption: string; nodes: DiagramNode[] };
  decisions: { title: string; body: string }[];
  stack: { layer: string; tech: string }[];
  status: string[];
  learned: string[];
  links: { label: string; href: string }[];
  images?: { src: string; alt: string; w: number; h: number; caption: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "benchmark",
    title: "LLM Risk Register Benchmark",
    summary: "A reproducible benchmark that tests whether large language models can draft a project risk register from real planning documents.",
    role: "Co-author with Kruthik Jadhav · research code and data pipeline",
    overview: [
      "This is the code and data behind a paper we're preparing for an IEEE conference: \"Evaluating Large Language Models for Automated Risk Register Generation from Project Documentation: A Benchmark Study.\"",
      "We compare three LLMs (Claude, GPT and one open-source model) across three prompting strategies: zero-shot, few-shot and structured reasoning.",
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
      caption: "Pipeline from source documents to scored results. Only planning documents reach the models; the human register is held out.",
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
        body: "Raw outputs are append-only, and the run driver has a cost guard. The synchronous grid came in over the budget in the project spec, so we added batch mode for Claude and GPT to bring it under.",
      },
    ],
    stack: [
      { layer: "Language", tech: "Python 3.11+, pinned dependencies" },
      { layer: "Matching", tech: "Sentence-transformer embeddings" },
      { layer: "Models", tech: "Claude, GPT, one open-source model (sync and batch APIs)" },
      { layer: "Analysis", tech: "Fleiss' kappa, matplotlib figures" },
      { layer: "Testing", tech: "unittest, 456 tests, fully offline" },
    ],
    status: [
      "The corpus (21 of 21 projects) and the pipeline are complete and unit-tested. The run driver has been pre-flighted end to end with stubbed providers.",
      "The full experiment run hasn't happened yet. It needs real API keys and recruited human raters for the expert ratings, so there are no results to show here.",
      "The batch code path is tested against mocked provider responses only. It hasn't been run against a live API.",
    ],
    learned: [
      "Most of the work in an evaluation is making sure you aren't fooling yourself: keeping the answers away from the model and checking that keeps holding.",
      "Cheap offline tests pay for themselves when every real run costs money.",
      "Writing the methodology down and freezing it before running anything makes later decisions much easier to defend.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/public-reproducible-benchmark" }],
  },
  {
    slug: "civicpulse",
    title: "CivicPulse",
    summary: "Turn one photo of a local problem into a categorised report, a ready-to-send complaint letter and a pin on a community map.",
    role: "Full-stack: React front end, FastAPI back end, Gemini integration",
    overview: [
      "Potholes, broken streetlights, illegal dumping: the small things that make a neighbourhood feel neglected rarely get reported, because reporting them is a hassle.",
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
        body: "Gemini decides the category; a plain lookup table decides the department. That keeps the routing predictable and easy to change, rather than leaving it to the model each time.",
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
      "No user accounts or moderation yet: anyone can report and upvote.",
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
    slug: "foodiepy",
    title: "Foodiepy",
    summary: "Food-demand forecasting and inventory management for restaurants and fulfilment centres, built in Django.",
    role: "University group project with Darshan Bhavsar, Jigar Parmar and Nirmal Trivedi",
    overview: [
      "Foodiepy predicts how many orders a fulfilment centre should prepare for, and gives owners a simple place to track stock, customers and orders.",
    ],
    problem: [
      "A food delivery business works with perishable stock. Order too much and it goes to waste; order too little and customers go elsewhere.",
    ],
    built: [
      "A forecast form that takes meal category, cuisine, prices, promotions and centre details and passes them to a scikit-learn Gradient Boosting regression model, which returns the expected number of orders.",
      "An inventory side: sign up, log in, add products and customers, and track each order through pending, out for delivery and delivered. Orders can be filtered with django-filter.",
      "In 2026 it was upgraded from Django 3.1 to Django 5.2 LTS, with CI that runs the system check, migrations and tests on Python 3.11 and 3.13.",
    ],
    diagram: {
      caption: "How a forecast request is handled.",
      nodes: [
        { label: "Forecast form", sub: "meal, price, centre" },
        { label: "Django view", sub: "builds features" },
        { label: "Gradient Boosting", sub: "scikit-learn .pkl" },
        { label: "Expected orders", sub: "shown to owner" },
      ],
    },
    decisions: [
      {
        title: "Fail clearly when the model is missing",
        body: "The trained model file was never committed. Rather than letting the page crash, the forecast view now checks for it and shows a clear message.",
      },
      {
        title: "Upgrade to a long-term-support release",
        body: "Moving to Django 5.2 LTS means the app sits on a supported version, and CI catches anything that breaks on newer Python.",
      },
      {
        title: "Secrets from the environment",
        body: "The secret key, debug flag and allowed hosts come from environment variables, with debug off by default.",
      },
    ],
    stack: [
      { layer: "Back end", tech: "Python, Django 5.2 LTS, SQLite" },
      { layer: "ML", tech: "scikit-learn Gradient Boosting, trained in a Colab notebook" },
      { layer: "Front end", tech: "Django templates, Bootstrap 5" },
      { layer: "CI", tech: "GitHub Actions on Python 3.11 and 3.13" },
    ],
    status: [
      "Forecasting is switched off in the current repo. The trained model file (gradientboostmodel.pkl) was never committed, so it needs retraining from the Colab notebook with the current scikit-learn.",
      "The inventory side, system check, migrations and tests all work and pass in CI.",
      "It was a university group project and isn't tuned for any real company's data.",
    ],
    learned: [
      "A model isn't shipped until the trained artefact is versioned with the code. This one was lost because nobody committed it.",
      "Upgrading an old project is a good way to learn a framework properly: every deprecation tells you something about how it works.",
    ],
    links: [
      { label: "Code on GitHub", href: "https://github.com/smadhu6364-beep/foodiepy" },
      { label: "Demo video", href: "https://youtu.be/45kdILuQyTs" },
    ],
    images: [
      { src: "/projects/foodiepy.webp", alt: "Foodiepy landing page: forecast food demand for the next few weeks", w: 1280, h: 800, caption: "Landing page." },
      { src: "/projects/foodiepy-forecast.webp", alt: "Foodiepy forecast form with fields for meal and centre details", w: 1280, h: 800, caption: "The forecast form." },
    ],
  },
  {
    slug: "roam",
    title: "Roam",
    summary: "A trip-planning and booking interface: browse destinations, build an itinerary, watch the cost add up and walk through checkout.",
    role: "Front-end build",
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
      caption: "Main user journey through the prototype.",
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
      "Building the whole journey as a clickable prototype first shows which back-end pieces actually matter.",
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

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
