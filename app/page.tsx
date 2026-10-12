import type { Metadata } from "next";
import { AigcPortfolio } from "./AigcPortfolio";

export const metadata: Metadata = {
  title: "马仲钰 — AIGC Visual Creator",
  description: "马仲钰的 AI 视觉设计、AI 剧集与数字产品作品集。",
  openGraph: { images: ["/og.webp"] },
};

export default function Home() {
  return <AigcPortfolio />;
}
