"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";

const HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4";
const BAR_HEIGHTS = [13,19,15,23,34,29,39,48,42,51,44,56,51,56,63,52,66,57,68,74,65,77,68,80,72,84,78,90,84,93,88,98];
const navigation = [
  {label:"作品总览",href:"/works/ai-visual-design",dropdown:true},
  {label:"AI视觉",href:"/works/ai-visual-design"},
  {label:"AI剧集",href:"/works/ai-series"},
  {label:"APP",href:"https://yibi-life-ledger.fey-star-4750.chatgpt.site",external:true},
  {label:"个人简历",href:"/resume"},
];

function Brand(){return <Link className="apogee-animate-fade-down flex shrink-0 items-center gap-3 text-white no-underline" href="/" aria-label="马仲钰作品集首页"><span className="grid h-7 w-7 place-items-center rounded-[9px] bg-white/[0.09]"><Sparkles aria-hidden="true" size={15} strokeWidth={1.7}/></span><span className="text-[17px] font-semibold tracking-[-0.02em]">MZY</span></Link>}

function NavigationLink({item,className,children}:{item:(typeof navigation)[number];className:string;children:React.ReactNode}){return item.external?<a className={className} href={item.href} target="_blank" rel="noreferrer">{children}</a>:<Link className={className} href={item.href}>{children}</Link>}

function ArchiveCard(){return <aside className="apogee-animate-scale apogee-archive-card w-full max-w-[470px] rounded-[28px] border border-white/[0.13] bg-white/[0.075] p-5 text-white backdrop-blur-[22px] sm:p-6 lg:p-7">
  <div className="flex items-start justify-between gap-5"><div><p className="m-0 text-[10px] font-semibold tracking-[0.19em] text-white/55">CREATIVE ARCHIVE</p><p className="mt-3 flex items-baseline gap-2 text-[52px] font-medium leading-none tracking-[-0.06em] sm:text-[64px]"><span>22</span><span className="text-[13px] font-semibold tracking-[0.12em] text-white/42">PROJECTS</span></p></div><span className="mt-1 rounded-full bg-white/[0.09] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white/70">2023—2026</span></div>
  <div className="mt-8 flex h-[118px] items-end gap-[5px] sm:h-[136px] sm:gap-1.5" aria-hidden="true">{BAR_HEIGHTS.map((height,index)=><i className="apogee-chart-bar block min-w-0 flex-1 rounded-t-[2px] bg-white/72" key={`${height}-${index}`} style={{height:`${height}%`,animationDelay:`${680+index*24}ms`}}/>)}</div>
  <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.1] pt-4 text-[11px] font-medium text-white/52"><span>视觉设计 · 动态影像 · 产品体验</span><Link className="group flex shrink-0 items-center gap-2 text-white/88 no-underline transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/55" href="/works/ai-visual-design">查看档案<ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" size={15} strokeWidth={1.7}/></Link></div>
</aside>}

export function AigcPortfolio(){
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{document.body.classList.toggle("apogee-menu-open",menuOpen);return()=>document.body.classList.remove("apogee-menu-open")},[menuOpen]);
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenuOpen(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[]);
  return <main className="apogee-portfolio relative isolate h-screen min-h-[620px] overflow-hidden bg-[#080a19] font-sans text-white">
    <video className="absolute inset-0 -z-20 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" src={HERO_VIDEO}/>
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,18,.75)_0%,rgba(5,7,18,.34)_49%,rgba(5,7,18,.58)_100%)]"/>
    <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-[#050712]/75 to-transparent"/>
    <header className="relative z-30 mx-auto flex h-[82px] w-[calc(100%-36px)] max-w-[1500px] items-center justify-between sm:w-[calc(100%-64px)] lg:h-[94px]">
      <Brand/>
      <nav aria-label="主要导航" className="apogee-animate-fade-down absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-white/[0.11] bg-black/20 p-1.5 backdrop-blur-xl lg:flex">{navigation.map(item=><NavigationLink className="group flex h-10 items-center gap-1.5 rounded-full px-5 text-[13px] font-medium text-white/64 no-underline transition-colors duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-white/50" item={item} key={item.label}>{item.label}{item.dropdown?<ChevronDown aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-px" size={13} strokeWidth={1.7}/>:null}</NavigationLink>)}</nav>
      <div className="apogee-animate-fade-down hidden items-center rounded-full border border-white/[0.11] bg-black/20 p-1.5 backdrop-blur-xl lg:flex"><Link className="flex h-10 items-center rounded-full px-5 text-[13px] font-medium text-white/66 no-underline transition-colors duration-200 hover:bg-white/[0.08] hover:text-white" href="/resume">个人简历</Link><Link className="apogee-primary-cta flex h-10 items-center rounded-full bg-white px-5 text-[13px] font-semibold no-underline transition-colors duration-200 hover:bg-white/88" href="/contact">联系我</Link></div>
      <button aria-expanded={menuOpen} aria-label={menuOpen?"关闭导航":"打开导航"} className="apogee-animate-fade-down grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/[0.13] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/55 lg:hidden" onClick={()=>setMenuOpen(current=>!current)} type="button">{menuOpen?<X size={19} strokeWidth={1.7}/>:<Menu size={20} strokeWidth={1.7}/>}</button>
    </header>
    <div className={`absolute inset-0 z-20 bg-[#070916]/78 backdrop-blur-xl transition-opacity duration-200 lg:hidden ${menuOpen?"pointer-events-auto opacity-100":"pointer-events-none opacity-0"}`}><button aria-label="关闭菜单遮罩" className="absolute inset-0 h-full w-full cursor-default bg-transparent" onClick={()=>setMenuOpen(false)} type="button"/><nav aria-label="移动端导航" className="relative mx-5 mt-[92px] overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#111526]/90 p-2">{navigation.map((item,index)=><NavigationLink className="flex min-h-14 items-center justify-between rounded-2xl px-4 text-[15px] font-medium text-white/82 no-underline transition-colors duration-200 hover:bg-white/[0.07] hover:text-white" item={item} key={item.label}><span className="flex items-center gap-3"><i className="not-italic text-[10px] tracking-[0.12em] text-white/32">0{index+1}</i>{item.label}</span><ArrowRight aria-hidden="true" size={16} strokeWidth={1.6}/></NavigationLink>)}<Link className="apogee-primary-cta mt-1 flex min-h-14 items-center justify-center rounded-2xl bg-white text-[14px] font-semibold no-underline" href="/contact">联系我</Link></nav></div>
    <section className="relative z-10 mx-auto grid h-[calc(100%-82px)] w-[calc(100%-36px)] max-w-[1500px] items-center gap-10 pb-10 sm:w-[calc(100%-64px)] lg:h-[calc(100%-94px)] lg:grid-cols-[minmax(0,1.08fr)_minmax(370px,.72fr)] lg:gap-16 lg:pb-16">
      <div className="max-w-[720px] self-center"><div className="apogee-animate-fade-up mb-5 flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-white/55 sm:mb-7"><span className="h-px w-8 bg-white/48"/>MA ZHONGYU · AIGC VISUAL DESIGNER</div><h1 className="apogee-animate-fade-up apogee-delay-1 m-0 text-[clamp(46px,6.3vw,92px)] font-medium leading-[0.93] tracking-[-0.062em] text-white">让想象成为<br/>可见的作品</h1><p className="apogee-animate-fade-up apogee-delay-2 mt-6 max-w-[600px] text-[14px] font-medium leading-7 text-white/62 sm:mt-8 sm:text-[15px] sm:leading-8">以 AIGC 连接视觉设计、动态影像与产品体验，构建完整、持续且可以被感知的创作现场。</p><div className="apogee-animate-fade-up apogee-delay-3 mt-8 flex flex-wrap items-center gap-3 sm:mt-10"><Link className="apogee-primary-cta group flex h-12 items-center gap-3 rounded-xl bg-white px-6 text-[14px] font-semibold no-underline transition-colors duration-200 hover:bg-white/88" href="/works/ai-visual-design">浏览作品<ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" size={17} strokeWidth={1.7}/></Link><Link className="flex h-12 items-center rounded-xl bg-white/[0.075] px-6 text-[14px] font-medium text-white/82 no-underline backdrop-blur-xl transition-colors duration-200 hover:bg-white/[0.12] hover:text-white" href="/contact">联系我</Link></div></div>
      <div className="hidden justify-self-end lg:block"><ArchiveCard/></div>
    </section>
    <div className="apogee-animate-fade-up apogee-delay-4 absolute bottom-5 right-5 z-10 hidden items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-white/38 sm:flex lg:bottom-7 lg:right-8"><span>SCROLL TO EXPLORE</span><span className="block h-px w-8 bg-white/30"/></div>
  </main>
}
