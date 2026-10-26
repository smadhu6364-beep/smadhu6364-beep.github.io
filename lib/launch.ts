// Launch-page copy for each case study. Every number here is taken from
// lib/data.ts, lib/caseStudies.ts or the project READMEs. Nothing invented.

export type StoryVisual = { kind: "image"; index: number } | { kind: "diagram"; active: number[] };

export type Launch = {
  eyebrow: string;
  headline: string;
  subhead: string;
  story: { title: string; body: string; visual: StoryVisual }[];
  facts: { value: string; label: string }[];
};

export const launches: Record<string, Launch> = {
  benchmark: {
    eyebrow: "Research benchmark",
    headline: "Testing LLMs on real risk registers.",
    subhead: "Written with Kruthik Jadhav and being prepared for an IEEE conference.",
    story: [
      {
        title: "Start with real projects",
        body: "The corpus is 21 public projects, 18 from the World Bank and 3 UK government business cases. Each one comes with a risk register written by people.",
        visual: { kind: "diagram", active: [0] },
      },
      {
        title: "Keep the answers hidden",
        body: "The models only ever see the planning documents. An audit script checks for leakage before anything runs, and tests make sure it stays that way.",
        visual: { kind: "diagram", active: [1] },
      },
      {
        title: "Run every model with every prompt",
        body: "Three models from different providers, each tried with three prompting strategies. A cost guard estimates the spend before a single request goes out.",
        visual: { kind: "diagram", active: [2] },
      },
      {
        title: "Score against the human register",
        body: "Generated risks are matched to the held-out register by meaning and then scored. Expert ratings and an LLM judge give two more views of the same output.",
        visual: { kind: "diagram", active: [3, 4] },
      },
    ],
    facts: [
      { value: "456", label: "unit tests, all run offline" },
      { value: "21", label: "real projects in the corpus" },
      { value: "18 + 3", label: "World Bank and UK government sources" },
      { value: "3 × 3", label: "models by prompting strategies" },
      { value: "3", label: "ways of evaluating the output" },
      { value: "0", label: "API keys needed to run the tests" },
    ],
  },
  civicpulse: {
    eyebrow: "Full-stack web app",
    headline: "Report a pothole with one photo.",
    subhead: "Gemini looks at the picture, works out who should fix it and drafts the complaint letter.",
    story: [
      {
        title: "Take a photo",
        body: "Upload a picture, drop a pin on the map and add a line about what's wrong. That's the whole form.",
        visual: { kind: "image", index: 0 },
      },
      {
        title: "Gemini reads it",
        body: "Gemini Vision looks at the photo and the description, picks one of eleven categories and rates the severity as low, medium or high.",
        visual: { kind: "diagram", active: [2] },
      },
      {
        title: "It goes to the right department",
        body: "A plain lookup table maps the category to a department, so potholes go to Roads and leaks go to Water. The letter's timeline depends on how serious it is.",
        visual: { kind: "diagram", active: [3] },
      },
      {
        title: "It shows up on the map",
        body: "Reports are saved to Firestore and plotted as colour-coded pins. Neighbours can upvote an issue to confirm they've seen it too.",
        visual: { kind: "diagram", active: [4] },
      },
    ],
    facts: [
      { value: "11", label: "issue categories" },
      { value: "3", label: "severity levels" },
      { value: "React 19", label: "front end, with a FastAPI back end" },
      { value: "Gemini Vision", label: "reads every photo" },
      { value: "0", label: "credentials needed for CI" },
    ],
  },
  foodiepy: {
    eyebrow: "University group project",
    headline: "Forecast the orders, then track the stock.",
    subhead: "A Django app I built with three other students to help food businesses plan ahead.",
    story: [
      {
        title: "Fill in the forecast form",
        body: "Meal category, cuisine, price, promotions and centre details go into one form.",
        visual: { kind: "image", index: 1 },
      },
      {
        title: "The model makes the call",
        body: "A scikit-learn gradient boosting model returns the number of orders the centre should expect.",
        visual: { kind: "diagram", active: [2, 3] },
      },
      {
        title: "Keep track of stock and orders",
        body: "Owners add products and customers, and follow each order from pending to out for delivery to delivered.",
        visual: { kind: "image", index: 0 },
      },
      {
        title: "Brought up to date",
        body: "In 2026 I moved it from Django 3.1 to Django 5.2 LTS, with CI running the checks, migrations and tests.",
        visual: { kind: "diagram", active: [1] },
      },
    ],
    facts: [
      { value: "Django 5.2", label: "LTS, upgraded from 3.1" },
      { value: "4", label: "people on the team" },
      { value: "3.11 + 3.13", label: "Python versions tested in CI" },
      { value: "3", label: "order stages tracked" },
    ],
  },
  roam: {
    eyebrow: "Front-end prototype",
    headline: "One place to plan a trip.",
    subhead: "Browse destinations, build an itinerary and watch the cost add up before you book.",
    story: [
      {
        title: "Find somewhere to go",
        body: "Search destinations and filter by budget, season and activity.",
        visual: { kind: "image", index: 0 },
      },
      {
        title: "Plan the days",
        body: "The planner builds an itinerary and keeps a running total of the cost as you add things.",
        visual: { kind: "image", index: 1 },
      },
      {
        title: "Walk through booking",
        body: "Review, payment and confirmation screens, then a dashboard for your bookings. None of it is connected to a real back end yet.",
        visual: { kind: "diagram", active: [2, 3] },
      },
    ],
    facts: [
      { value: "Next.js 16", label: "with React 19 and TypeScript" },
      { value: "0", label: "API routes, so it exports as static HTML" },
      { value: "Free", label: "to host on GitHub Pages" },
      { value: "4", label: "main screens in the flow" },
    ],
  },
};
