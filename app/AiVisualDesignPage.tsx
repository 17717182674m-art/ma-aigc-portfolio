"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { PortfolioItem } from "./portfolioData";
import { portfolioItems } from "./portfolioData";
import { aiVisualThemes, type AiVisualImage } from "./aiVisualData";
import { ThemeLightbox } from "./AiVisualThemePage";
import DepthCarousel from "./components/DepthCarousel";
import { AnimatedDivider, ScrollProgress } from "./components/AdvancedDetails";
import { Button } from "./components/Button";
import { beginRouteTransition, RevealText, ease } from "./components/MotionSystem";
import { NextProjectBanner, SiteHeader } from "./WorkPage";

function BannerRail({
  images,
  onOpen,
  storageKey,
}: {
  images: AiVisualImage[];
  onOpen: (index: number) => void;
  storageKey: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const dragRef = useRef<{
    x: number;
    scrollLeft: number;
    id: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const goToIndex = (rawIndex: number, behavior: ScrollBehavior = "smooth") => {
    const rail = railRef.current;
    if (!rail || images.length === 0) return;
    const index = (rawIndex + images.length) % images.length;
    const frame = rail.children[index] as HTMLElement | undefined;
    if (!frame) return;
    const paddingLeft = Number.parseFloat(getComputedStyle(rail).paddingLeft);
    rail.scrollTo({
      left: frame.offsetLeft - paddingLeft,
      behavior,
    });
    setActive(index);
    sessionStorage.setItem(storageKey, String(index));
  };

  useEffect(() => {
    const saved = Number(sessionStorage.getItem(storageKey) ?? 0);
    const frame = requestAnimationFrame(() => goToIndex(saved, "auto"));
    return () => cancelAnimationFrame(frame);
    // The saved index is only consumed when this rail is mounted or restored.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, images.length]);

  const closestIndex = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    const paddingLeft = Number.parseFloat(getComputedStyle(rail).paddingLeft);
    return Array.from(rail.children).reduce(
      (closest, child, index) => {
        const distance = Math.abs(
          (child as HTMLElement).offsetLeft - paddingLeft - rail.scrollLeft,
        );
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
  };

  const endDrag = () => {
    if (railRef.current) railRef.current.classList.remove("is-dragging");
    const moved = dragRef.current?.moved ?? false;
    dragRef.current = null;
    suppressClickRef.current = moved;
    if (moved) goToIndex(closestIndex());
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  return (
    <div className="banner-browser">
      <div
        ref={railRef}
        className="banner-rail"
        aria-label="Banner 作品横向浏览"
        onPointerDown={(event) => {
        const rail = railRef.current;
        if (!rail) return;
        dragRef.current = {
          x: event.clientX,
          scrollLeft: rail.scrollLeft,
          id: event.pointerId,
          moved: false,
        };
        rail.setPointerCapture(event.pointerId);
        rail.classList.add("is-dragging");
      }}
        onPointerMove={(event) => {
        const rail = railRef.current;
        const drag = dragRef.current;
        if (!rail || !drag) return;
        if (Math.abs(event.clientX - drag.x) > 6) drag.moved = true;
        rail.scrollLeft = drag.scrollLeft - (event.clientX - drag.x);
      }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          if (dragRef.current) endDrag();
        }}
      >
        {images.map((item, index) => (
          <button
            type="button"
            className="banner-frame"
            key={item.image}
            aria-label={`展开${item.alt}`}
            onFocus={() => {
              setActive(index);
              sessionStorage.setItem(storageKey, String(index));
            }}
            onClick={() => {
              if (!suppressClickRef.current) onOpen(index);
            }}
          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="banner-switch banner-switch-prev"
        aria-label="上一张 Banner"
        onClick={() => goToIndex(active - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="banner-switch banner-switch-next"
        aria-label="下一张 Banner"
        onClick={() => goToIndex(active + 1)}
      >
        ›
      </button>
      <div className="banner-status" aria-live="polite">
        <span>
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <i>
          <b style={{ width: `${((active + 1) / images.length) * 100}%` }} />
        </i>
        <small>DRAG OR CLICK TO EXPLORE</small>
      </div>
    </div>
  );
}

function VisualThemeIndex({
  active,
  onChange,
}: {
  active: string;
  onChange: (slug: string) => void;
}) {
  const [isFloating, setIsFloating] = useState(false);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    let observer: IntersectionObserver | undefined;
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    const observeMarker = () => {
      observer?.disconnect();
      const floatingTop = mobileQuery.matches ? 76 : 88;
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsFloating(
            !entry.isIntersecting && entry.boundingClientRect.top <= floatingTop,
          );
        },
        { rootMargin: `-${floatingTop}px 0px 0px`, threshold: 0 },
      );
      observer.observe(marker);
    };

    observeMarker();
    mobileQuery.addEventListener("change", observeMarker);
    return () => {
      observer?.disconnect();
      mobileQuery.removeEventListener("change", observeMarker);
    };
  }, []);

  return (
    <div className="visual-theme-index-shell">
      <span
        ref={markerRef}
        className="visual-theme-index-marker"
        aria-hidden="true"
      />
      <nav
        className={`visual-theme-index wrap${isFloating ? " is-floating" : ""}`}
        aria-label="AI 视觉作品目录"
      >
        {aiVisualThemes.map((theme, index) => (
          <button
            type="button"
            className={active === theme.slug ? "is-active" : ""}
            aria-selected={active === theme.slug}
            role="tab"
            onClick={() => onChange(theme.slug)}
            key={theme.slug}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {theme.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function AiVisualDesignPage({ item }: { item: PortfolioItem }) {
  const router = useRouter();
  const next = portfolioItems[1];
  const [activeThemeSlug, setActiveThemeSlug] = useState(() => {
    if (typeof window === "undefined") return aiVisualThemes[0].slug;
    const fromHash = window.location.hash.replace("#visual-", "");
    const saved = sessionStorage.getItem("ai-visual-active-theme");
    return (
      aiVisualThemes.find((theme) => theme.slug === fromHash || theme.slug === saved)?.slug ??
      aiVisualThemes[0].slug
    );
  });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const activeTheme =
    aiVisualThemes.find((theme) => theme.slug === activeThemeSlug) ?? aiVisualThemes[0];

  useEffect(() => {
    router.prefetch(`/works/ai-visual-design/${activeTheme.slug}`);
  }, [activeTheme.slug, router]);

  const selectTheme = (slug: string) => {
    setSelectedImage(null);
    setActiveThemeSlug(slug);
    sessionStorage.setItem("ai-visual-active-theme", slug);
    history.replaceState(null, "", `#visual-${slug}`);
  };

  const openTheme = (slug: string) => {
    sessionStorage.setItem("route-scroll:/works/ai-visual-design", String(scrollY));
    beginRouteTransition();
    router.push(`/works/ai-visual-design/${slug}`);
  };

  const openImage = (image: string) => {
    const index = activeTheme.images.findIndex((item) => item.image === image);
    if (index >= 0) setSelectedImage(index);
  };

  return (
    <>
      <ScrollProgress />
      <main
        className="work-page route-enter ai-visual-page"
        style={{ "--accent": item.color } as React.CSSProperties}
      >
        <SiteHeader backHref="/#portfolio" backLabel="返回作品浏览" />

        <section className="work-hero ai-visual-intro">
          <div className="work-title-row">
            <div>
              <span>PROJECT 01 / 2026</span>
              <RevealText as="h1" quick>AI视觉设计 展示页</RevealText>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease }}
            >
              {item.intro}
            </motion.p>
          </div>
          <AnimatedDivider />
        </section>

        <section id="visual-chapters" className="ai-theme-collection">
          <header className="ai-theme-collection-head wrap">
            <span className="section-label">VISUAL CHAPTERS / 视觉主题</span>
            <p>六个创作方向，六组生成式视觉实验。</p>
          </header>

          <VisualThemeIndex active={activeTheme.slug} onChange={selectTheme} />

          <div className="ai-theme-grid ai-theme-switcher-stage wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                className={`ai-theme-card ai-theme-${activeTheme.slug}`}
                id={`visual-${activeTheme.slug}`}
                key={activeTheme.slug}
                role="tabpanel"
                aria-label={activeTheme.title}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.34, ease }}
              >
                <header className="ai-theme-card-head">
                  <div>
                    <span>{String(aiVisualThemes.indexOf(activeTheme) + 1).padStart(2, "0")}</span>
                    <h2>{activeTheme.title}</h2>
                    <small>{activeTheme.en}</small>
                  </div>
                  <Button
                    type="button"
                    className="ai-theme-open"
                    variant="minimal"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => openTheme(activeTheme.slug)}
                  >
                    展开浏览
                  </Button>
                </header>

                <div className="ai-theme-stage">
                  {activeTheme.mode === "banner" ? (
                    <BannerRail
                      images={activeTheme.images}
                      onOpen={setSelectedImage}
                      storageKey={`ai-visual-slide-${activeTheme.slug}`}
                    />
                  ) : (
                    <DepthCarousel
                      items={activeTheme.previewImages}
                      cardWidth={activeTheme.cardWidth}
                      cardHeight={activeTheme.cardHeight}
                      spread={activeTheme.spread}
                      depth={170}
                      tilt={14}
                      tiltDirection={activeTheme.tiltDirection}
                      visibleCards={4}
                      falloff={0.16}
                      blur={3}
                      duration={620}
                      radius={6}
                      autoplay={false}
                      loop
                      storageKey={`ai-visual-slide-${activeTheme.slug}`}
                      onItemClick={(_item: unknown, index: number) =>
                        openImage(activeTheme.previewImages[index].image)
                      }
                    />
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <NextProjectBanner item={next} number="02" />
      </main>
      <ThemeLightbox
        theme={activeTheme}
        index={selectedImage}
        onClose={() => setSelectedImage(null)}
        onStep={(step) =>
          setSelectedImage((current) =>
            current === null
              ? null
              : (current + step + activeTheme.images.length) % activeTheme.images.length,
          )
        }
      />
    </>
  );
}
