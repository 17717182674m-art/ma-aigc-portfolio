import type { Metadata } from "next";
import "./globals.css";
import { SiteEffects } from "./components/MotionSystem";
import { PortfolioBackdrop } from "./components/PortfolioBackdrop";

export const metadata: Metadata = {
  title: "马仲钰 — AIGC 视觉设计师",
  description: "马仲钰的 AIGC 视觉设计作品集，涵盖品牌视觉、海报、IP 形象与动态影像。",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "马仲钰 — AIGC 视觉设计师", description: "AIGC Visual Design Portfolio / 2026", images: [{ url: "/og.webp", width: 1680, height: 945 }] },
  twitter: { card: "summary_large_image", title: "马仲钰 — AIGC 视觉设计师", description: "AIGC Visual Design Portfolio / 2026", images: ["/og.webp"] },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><head><link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net"/><link rel="dns-prefetch" href="//d8j0ntlcm91z4.cloudfront.net"/><link rel="preconnect" href="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev"/><link rel="stylesheet" href="https://fonts.cdnfonts.com/css/suisse-intl"/></head><body><PortfolioBackdrop/><SiteEffects/>{children}</body></html>;
}
