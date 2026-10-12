"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import type { PortfolioItem } from "./portfolioData";
import { portfolioItems } from "./portfolioData";
import {
  InstantRouteLink,
  ParallaxVisual,
  RevealText,
  ease,
} from "./components/MotionSystem";
import {
  AnimatedDivider,
  Magnetic,
  ScrollProgress,
} from "./components/AdvancedDetails";
import { buttonClassName } from "./components/Button";

export function PortfolioReturnLink({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <InstantRouteLink className={className} href="/#portfolio">
      {children}
    </InstantRouteLink>
  );
}

export function SiteHeader({ backHref, backLabel = "返回上一级" }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="inner-header">
      <InstantRouteLink className="brand" href="/">
        <Sparkles size={18} /> MZY
      </InstantRouteLink>
      <nav>
        {backHref && (
          backHref === "/#portfolio" ? (
            <PortfolioReturnLink className={buttonClassName({ variant: "minimal", size: "sm", className: "inner-back" })}><ArrowLeft size={16} />{backLabel}</PortfolioReturnLink>
          ) : (
            <InstantRouteLink className={buttonClassName({ variant: "minimal", size: "sm", className: "inner-back" })} href={backHref}><ArrowLeft size={16} />{backLabel}</InstantRouteLink>
          )
        )}
        <InstantRouteLink href="/">首页</InstantRouteLink>
        <InstantRouteLink href="/contact">联系方式</InstantRouteLink>
      </nav>
    </header>
  );
}

export function NextProjectBanner({
  item,
  number,
}: {
  item: PortfolioItem;
  number: string;
}) {
  const href = item.href ?? `/works/${item.slug}`;
  const tags = [item.en, "2026"];
  const content = (
    <>
      <div className="next-visual">
        {item.cover ? (
          <img src={item.cover} alt={`${item.title}项目封面`} />
        ) : (
          <em>{item.en}</em>
        )}
        <div className="next-banner-panel">
          <div className="next-banner-tags" aria-label="项目标签">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <i className="next-banner-action">
            VIEW PROJECT <ArrowUpRight />
          </i>
        </div>
      </div>
      <div className="next-title">
        <div>
          <strong>{item.title}</strong>
          <span>{item.intro}</span>
        </div>
        <Magnetic>
          <i>
            NEXT <ArrowRight />
          </i>
        </Magnetic>
      </div>
    </>
  );

  return (
    <section className="next-project-full" id="next-project">
      <div className="next-kicker">
        <span>NEXT PROJECT</span>
        <b>{number}</b>
      </div>
      {item.href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
      ) : (
        <InstantRouteLink href={href}>{content}</InstantRouteLink>
      )}
    </section>
  );
}

export function WorkPage({ item }: { item: PortfolioItem }) {
  const current = portfolioItems.findIndex((entry) => entry.slug === item.slug);
  const next = portfolioItems[(current + 1) % portfolioItems.length];
  const projectNo = String(current + 1).padStart(2, "0");

  return (
    <>
      <ScrollProgress />
      <main
        className="work-page route-enter"
        style={{ "--accent": item.color } as React.CSSProperties}
      >
        <SiteHeader backHref="/#portfolio" backLabel="返回作品浏览" />
        <section className="work-hero">
          <div className="work-title-row">
            <div>
              <span>PROJECT {projectNo} / 2026</span>
              <RevealText as="h1" quick>{`${item.title} 展示页`}</RevealText>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease }}
            >
              {item.intro}
            </motion.p>
          </div>
          <AnimatedDivider />
        </section>
        <section className="project-story">
          <aside className="sticky-project-info">
            <span>PROJECT {projectNo}</span>
            <h2>{item.title}</h2>
            <p>
              {item.en}
              <br />
              2026
            </p>
            <AnimatedDivider />
            <dl>
              <div>
                <dt>ROLE</dt>
                <dd>
                  Art Direction
                  <br />
                  Visual Design
                  <br />
                  AIGC
                </dd>
              </div>
              <div>
                <dt>TOOLS</dt>
                <dd>
                  Figma
                  <br />
                  Photoshop
                  <br />
                  Generative AI
                </dd>
              </div>
            </dl>
          </aside>
          <div className="editorial-visuals">
            {item.labels.map((label, index) => (
              <motion.article
                key={label}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: index * 0.06, ease }}
                className={`editorial-shot shot-${index + 1}`}
              >
                <ParallaxVisual>
                  <div className="generated-art">
                    <span className="orb orb-a" />
                    <span className="orb orb-b" />
                    <div className="art-no">{String(index + 1).padStart(2, "0")}</div>
                    <div className="art-word">{item.en.split(" ")[0]}</div>
                  </div>
                </ParallaxVisual>
                <div className="tile-meta">
                  <div>
                    <span>
                      {String(index + 1).padStart(2, "0")} / {label.toUpperCase()}
                    </span>
                    <h2>{label}</h2>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
        <NextProjectBanner
          item={next}
          number={String(current + 2 > portfolioItems.length ? 1 : current + 2).padStart(2, "0")}
        />
      </main>
    </>
  );
}

export function ContactPage() {
  const [copied, setCopied] = useState<"phone" | "email" | "wechat" | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copyContact = async (
    key: "phone" | "email" | "wechat",
    value: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(key);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(null), 1500);
  };

  const rows = [
    { key: "phone" as const, label: "电话", value: "17717182674" },
    { key: "email" as const, label: "邮箱", value: "1239461802@qq.com" },
    { key: "wechat" as const, label: "微信", value: "mzyd201" },
  ];

  return (
    <main className="contact-page route-enter">
      <div className={`copy-toast${copied ? " is-visible" : ""}`} role="status">{copied ? `${rows.find((row) => row.key === copied)?.label}已复制` : ""}</div>
      <SiteHeader backHref="/" backLabel="返回首页" />
      <section className="contact-main">
        <span className="section-label">LET&apos;S CREATE TOGETHER</span>
        <RevealText as="h1" quick>
          有一个大胆的想法？聊聊如何让它发生。
        </RevealText>
        <AnimatedDivider />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.42, ease }}
          className="contact-grid"
        >
          {rows.map((row) => (
            <button
              type="button"
              key={row.key}
              className={copied === row.key ? "is-copied" : ""}
              onClick={(event) => {
                const selection = window.getSelection();
                if (
                  selection &&
                  !selection.isCollapsed &&
                  event.currentTarget.contains(selection.anchorNode)
                ) {
                  return;
                }
                void copyContact(row.key, row.value);
              }}
              aria-label={`复制${row.label} ${row.value}`}
            >
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <i className="contact-copy-action" aria-live="polite">
                <ArrowUpRight aria-hidden="true" />
                <small>{copied === row.key ? "已复制" : "点击复制"}</small>
              </i>
            </button>
          ))}
        </motion.div>
      </section>
      <div className="contact-orb" />
    </main>
  );
}
