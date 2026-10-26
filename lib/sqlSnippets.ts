// Trimmed from smadhu6364-beep/irish-property-sql/sql. The result rows are real
// rows from the matching results/*.csv file.
import { counties, dublinVsRest, quality, rolling } from "./propertyData";

export type Snippet = {
  id: string;
  tab: string;
  file: string;
  answers: string;
  sql: string;
  rowsLabel: string;
  columns: string[];
  rows: (string | number)[][];
};

const eur = (v: number) => "€" + v.toLocaleString("en-IE");
const REPO = "https://github.com/smadhu6364-beep/irish-property-sql/blob/master/sql/";
export const fileUrl = (f: string) => REPO + f;

export const snippets: Snippet[] = [
  {
    id: "dublin",
    tab: "Dublin vs the rest",
    file: "04_dublin_vs_rest.sql",
    answers: "How big is the price gap between Dublin and the rest of the country, and has it grown or shrunk since 2010?",
    sql: `WITH labelled AS (
    SELECT sale_year,
           CASE WHEN county = 'Dublin' THEN 'Dublin' ELSE 'Rest of Ireland' END AS region,
           price_incl_vat
    FROM market_sales
),
by_region AS (
    SELECT sale_year, region, count(*) AS sales, median(price_incl_vat) AS median_price
    FROM labelled
    GROUP BY sale_year, region
),
side_by_side AS (
    -- Conditional aggregation turns two rows into two columns
    SELECT sale_year,
           max(CASE WHEN region = 'Dublin'          THEN median_price END) AS dublin_median,
           max(CASE WHEN region = 'Rest of Ireland' THEN median_price END) AS rest_median
    FROM by_region
    GROUP BY sale_year
)
SELECT sale_year,
       round(dublin_median)                  AS dublin_median_eur,
       round(rest_median)                    AS rest_median_eur,
       round(dublin_median / rest_median, 2) AS dublin_to_rest_ratio
FROM side_by_side
ORDER BY sale_year;`,
    rowsLabel: "First 5 rows",
    columns: ["sale_year", "dublin_median_eur", "rest_median_eur", "ratio"],
    rows: dublinVsRest.slice(0, 5).map((r) => [r.year, eur(r.dublin), eur(r.rest), r.ratio.toFixed(2)]),
  },
  {
    id: "rolling",
    tab: "Rolling 12-month median",
    file: "07_window_functions.sql",
    answers: "Smoothing out month-to-month noise, what is the trend in the national median price, and how fast is it rising on a year earlier?",
    sql: `WITH rolling AS (
    -- Median of every sale in this month and the 11 before it
    SELECT sale_month_start,
           median(price_incl_vat) OVER (
               ORDER BY sale_month_start
               RANGE BETWEEN INTERVAL 11 MONTH PRECEDING AND CURRENT ROW
           ) AS rolling_12m_median
    FROM market_sales
),
monthly_rolling AS (
    SELECT sale_month_start, any_value(rolling_12m_median) AS rolling_12m_median
    FROM rolling
    GROUP BY sale_month_start
)
SELECT sale_month_start AS month,
       round(rolling_12m_median) AS rolling_12m_median_eur,
       -- LAG(x, 12) reads the value from 12 months earlier
       round(100.0 * (rolling_12m_median
           / lag(rolling_12m_median, 12) OVER (ORDER BY sale_month_start) - 1), 1)
           AS rolling_median_yoy_pct
FROM monthly_rolling
ORDER BY month;`,
    rowsLabel: "Last 5 full months",
    columns: ["month", "rolling_12m_median_eur", "rolling_median_yoy_pct"],
    rows: rolling.filter((r) => r.month >= "2026-05" && r.month <= "2026-09").map((r) => [r.month, eur(r.rolling), (r.yoy ?? 0).toFixed(1)]),
  },
  {
    id: "county",
    tab: "County change",
    file: "03_by_county.sql",
    answers: "In the latest full year, how do prices differ across the 26 counties, and how far has each county's median moved since five years earlier?",
    sql: `WITH latest AS (
    -- Latest full year = the latest year with December sales in it
    SELECT max(sale_year) AS latest_year
    FROM market_sales
    WHERE sale_month = 12
),
county_year AS (
    SELECT county, sale_year, count(*) AS sales,
           median(price_incl_vat) AS median_price
    FROM market_sales
    GROUP BY county, sale_year
)
SELECT cur.county,
       round(cur.median_price)  AS median_price_latest_year,
       round(prev.median_price) AS median_price_comparison_year,
       round(100.0 * (cur.median_price / prev.median_price - 1), 1) AS median_change_pct,
       RANK() OVER (ORDER BY cur.median_price DESC) AS price_rank
FROM county_year AS cur
JOIN latest ON cur.sale_year = latest.latest_year
JOIN county_year AS prev
  ON prev.county = cur.county
 AND prev.sale_year = latest.latest_year - 5
ORDER BY price_rank;`,
    rowsLabel: "First 5 rows (2025 against 2020)",
    columns: ["county", "2025", "2020", "change_pct", "rank"],
    rows: counties.slice(0, 5).map((c) => [c.county, eur(c.median), eur(c.median2020), c.change.toFixed(1), c.rank]),
  },
  {
    id: "quality",
    tab: "Data-quality checks",
    file: "08_data_quality.sql",
    answers: "How far can I trust this data? Where are the gaps, odd values and inconsistencies to know about before quoting a number?",
    sql: `WITH checks AS (
    SELECT 1 AS check_no, 'Rows in clean sales table' AS check_name,
           CAST(count(*) AS DOUBLE) AS value
    FROM sales
    UNION ALL
    SELECT 2, 'Missing address',
           count(*) FILTER (WHERE address IS NULL OR address = '')
    FROM sales
    UNION ALL
    SELECT 4, 'Missing Eircode, all years (%)',
           round(100.0 * count(*) FILTER (WHERE eircode IS NULL) / count(*), 1)
    FROM sales
    UNION ALL
    SELECT 6, 'Property size band filled in (%)',
           round(100.0 * count(*) FILTER (WHERE size_description IS NOT NULL) / count(*), 1)
    FROM sales
    -- ... 15 checks in all, stacked with UNION ALL
)
SELECT * FROM checks
ORDER BY check_no;`,
    rowsLabel: "Rows for the checks shown",
    columns: ["check_no", "check_name", "value"],
    rows: quality.filter((q) => [1, 2, 4, 6].includes(Number(q.no))).map((q) => [q.no, q.name, q.value.toLocaleString("en-IE")]),
  },
];

const KW = new Set(
  "with as select from where group by order join on and or not in is null case when then else end union all over range between interval month preceding current row rows unbounded filter cast double distinct having using desc asc".split(" "),
);

/** Tiny SQL highlighter: returns [className, text] pairs. No dependencies. */
export function highlight(sql: string): [string, string][] {
  const out: [string, string][] = [];
  const re = /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)|(\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    if (m[1]) out.push(["c", m[1]]);
    else if (m[2]) out.push(["s", m[2]]);
    else if (m[3]) out.push(["n", m[3]]);
    else if (m[4]) out.push([KW.has(m[4].toLowerCase()) ? "k" : "f", m[4]]);
    else if (m[5]) out.push([KW.has(m[5].toLowerCase()) ? "k" : "", m[5]]);
    else out.push(["", m[6]]);
  }
  return out;
}
