import type { Metadata } from "next";
import PropertyDashboard from "@/components/PropertyDashboard";

// The dashboard on its own, with no header or footer, so it can run inside the
// project switcher on the home page.
export const metadata: Metadata = {
  title: "Irish property dashboard",
  robots: { index: false },
};

export default function DashboardEmbed() {
  return (
    <main className="p-3 sm:p-4">
      <PropertyDashboard />
    </main>
  );
}
