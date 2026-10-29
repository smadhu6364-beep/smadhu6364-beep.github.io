import { Fraunces, JetBrains_Mono } from "next/font/google";
import LaplandHome from "@/components/lapland/Home";

const serif = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export default function Home() {
  return <LaplandHome serif={serif.className} mono={mono.className} />;
}
