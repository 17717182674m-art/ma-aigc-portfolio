"use client";

import { usePathname } from "next/navigation";

const BACKDROP_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4";

export function PortfolioBackdrop(){
  const pathname=usePathname();
  if(pathname==="/")return null;
  return <div className="site-world-backdrop apogee-inner-backdrop" aria-hidden="true">
    <video src={BACKDROP_VIDEO} autoPlay muted loop playsInline preload="metadata" tabIndex={-1}/>
  </div>;
}
