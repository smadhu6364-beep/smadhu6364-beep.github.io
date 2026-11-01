import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyDashboard from "@/components/PropertyDashboard";

export const metadata: Metadata = {
  title: "Irish property dashboard | Madhu Sudhan Srinivas",
  description: "An interactive dashboard over 812,018 Irish house sales: filter by county and years to see median prices, sales volumes and rankings.",
  alternates: { canonical: "/dashboard/" },
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-8">
        <p className="pt-10">
          <Link href="/#work" className="label inline-flex min-h-10 items-center gap-2 hover:text-ink">← All work</Link>
        </p>
        <p className="label mt-4">Dashboard · Data &amp; BI</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          Irish property <span className="serif-i">dashboard</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
          Pick a county and a range of years to see how prices and sales have moved. It runs on the results of my SQL project over every residential sale on the Property Price Register since 2010.
        </p>
        <div className="mt-8 rounded-[24px] border border-line bg-bg/60 p-4 sm:p-6">
          <PropertyDashboard />
        </div>
        <div className="mt-8 grid gap-6 text-[15px] leading-relaxed sm:grid-cols-3">
          <div>
            <p className="label">How it&rsquo;s built</p>
            <p className="mt-2 text-ink/80">SQL in DuckDB does all the analysis: CTEs, window functions (LAG for year-on-year change, RANK for the county league table) and medians. The dashboard only filters and draws the result tables.</p>
          </div>
          <div>
            <p className="label">The data</p>
            <p className="mt-2 text-ink/80">812,018 full-market sales after cleaning, January 2010 to October 2026, prices including VAT. 2026 is a part year, so the default view stops at 2025.</p>
          </div>
          <div>
            <p className="label">The code</p>
            <p className="mt-2 text-ink/80">
              The query behind it is <a className="link-u" href="https://github.com/smadhu6364-beep/irish-property-sql/blob/master/sql/09_county_year.sql" target="_blank" rel="noreferrer">09_county_year.sql</a>. The full write-up is the{" "}
              <Link className="link-u" href="/projects/irish-property/">Irish property case study</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
