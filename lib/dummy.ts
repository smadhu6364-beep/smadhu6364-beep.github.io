// Content for the Verstappen-style home page, taken from lib/data.ts.
// Hobbies are still placeholders until Madhu sends his own.
import { education as edu, experience as jobs, profile, projects as all } from "./data";

export const L = profile.positioning;

export const experience = jobs.map((j) => ({ company: j.company, role: j.role, place: j.place, dates: j.dates, points: j.points.slice(0, 3) }));

// Oldest first, so the flight reads Bengaluru -> Dublin.
export const education = [...edu].reverse().map((e) => ({
  title: e.title,
  school: e.school === "Dublin City University" ? "DCU" : e.school,
  place: e.place === "Bangalore" ? "Bengaluru" : e.place,
  dates: e.dates,
  note: e.modules.length ? e.modules.join(" · ") : "Undergraduate degree in Bengaluru, before the move to Dublin.",
}));

export const projects = all.map((p) => ({ id: p.id, name: p.name, tagline: p.tagline, repo: p.repo }));

const PLACEHOLDER = "Placeholder. Send me the real one and I'll swap it in.";
export const hobbies = ["Hobby one", "Hobby two", "Hobby three", "Hobby four"].map((title) => ({ title, note: PLACEHOLDER }));
