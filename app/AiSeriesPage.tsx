"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ExternalLink, Images, Play, Sparkles, X } from "lucide-react";
import type { PortfolioItem } from "./portfolioData";
import { portfolioItems } from "./portfolioData";
import { aiSeriesCategories, getAiSeriesPosterSrc } from "./aiSeriesData";
import { aiSeriesStories } from "./aiSeriesStories";
import { aiSeriesAssets } from "./aiSeriesAssetCatalog";
import { AnimatedDivider, ScrollProgress } from "./components/AdvancedDetails";
import { RevealText, ease } from "./components/MotionSystem";
import { NextProjectBanner, SiteHeader } from "./WorkPage";

export function AiSeriesPage({ item }: { item: PortfolioItem }) {
  const next = portfolioItems[2];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [startedEpisode, setStartedEpisode] = useState<number | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [assetsExpanded, setAssetsExpanded] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const category = aiSeriesCategories[categoryIndex];
  const project = category.projects[projectIndex];
  const story = category.slug === "tvc" ? undefined : aiSeriesStories[`${category.slug}/${project.slug}`];
  const assets = aiSeriesAssets[`${category.slug}/${project.slug}`];
  const storyImages = useMemo(() => {
    const productionAssets = [
      ...(assets?.characters ?? []),
      ...(assets?.scenes ?? []),
      ...(assets?.props ?? []),
    ];
    const candidates = productionAssets.length > 0
      ? productionAssets
      : project.episodes.map((entry) => ({ src: getAiSeriesPosterSrc(entry.poster), label: `${project.title}画面设定` }));
    return candidates.filter((asset, index, list) => list.findIndex((entry) => entry.src === asset.src) === index);
  }, [assets, project]);

  useEffect(() => {
    if (!storyOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setStoryOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [storyOpen]);

  const chooseCategory = (index: number) => {
    setCategoryIndex(index);
    setProjectIndex(0);
    setStartedEpisode(null);
    setStoryOpen(false);
    setAssetsExpanded(false);
  };
  const chooseProject = (index: number) => {
    setProjectIndex(index);
    setStartedEpisode(null);
    setStoryOpen(false);
    setAssetsExpanded(false);
  };
  const stepProject = (direction: -1 | 1) => chooseProject((projectIndex + direction + category.projects.length) % category.projects.length);
  const playPreview = async (index: number) => {
    videoRefs.current.forEach((video, videoIndex) => videoIndex !== index && video?.pause());
    setStartedEpisode(index);
    try { await videoRefs.current[index]?.play(); } catch { /* Native controls remain available. */ }
  };

  return (
    <>
      <ScrollProgress />
      <main className="work-page route-enter ai-series-page" style={{ "--accent": item.color } as React.CSSProperties}>
        <SiteHeader backHref="/#portfolio" backLabel="返回作品浏览" />
        <section className="work-hero series-hero">
          <div className="work-title-row">
            <div><span>PROJECT 02 / 2026</span><RevealText as="h1" quick>AI影像档案</RevealText></div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease }}>从连续短剧、商业广告到概念短片，在同一套观看体验中呈现完整的 AI 影像创作。</motion.p>
          </div>
          <AnimatedDivider />
        </section>

        <section className="series-showcase" aria-label="AI 影像分类与项目预览">
          <div className="series-showcase-tabs" role="tablist" aria-label="影像类型">
            {aiSeriesCategories.map((entry, index) => <button type="button" role="tab" aria-selected={categoryIndex === index} className={categoryIndex === index ? "is-active" : ""} onClick={() => chooseCategory(index)} key={entry.slug}>{entry.title}</button>)}
          </div>
          <div className="series-showcase-project-nav" aria-label={`${category.title}项目选择`}>
            <button type="button" onClick={() => stepProject(-1)} aria-label="上一个项目"><ArrowLeft aria-hidden="true" /></button>
            <div role="tablist" aria-label="项目列表">
              {category.projects.map((entry, index) => <button type="button" role="tab" aria-selected={projectIndex === index} className={projectIndex === index ? "is-active" : ""} onClick={() => chooseProject(index)} key={entry.slug}><span>{String(index + 1).padStart(2, "0")}</span>{entry.title}</button>)}
            </div>
            <button type="button" onClick={() => stepProject(1)} aria-label="下一个项目"><ArrowRight aria-hidden="true" /></button>
          </div>

          <motion.article className={`series-showcase-card${project.episodes.length > 1 ? " has-multiple-episodes" : ""}${assetsExpanded ? " is-assets-expanded" : ""}`} key={`${category.slug}/${project.slug}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease }}>
            <div className="series-showcase-episode-list" aria-label={`${project.title}剧集列表`}>
              {project.episodes.map((episode, episodeIndex) => {
                const episodeSrc = Array.isArray(episode.src) ? episode.src[0] : episode.src;
                const hasStarted = startedEpisode === episodeIndex;
                return <div className="series-showcase-media" key={`${episode.label}-${episodeSrc}`}>
                  {/* The portfolio source videos do not ship separate timed-text files. */}
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video ref={(node) => { videoRefs.current[episodeIndex] = node; }} src={episodeSrc} poster={getAiSeriesPosterSrc(episode.poster)} controls={hasStarted} playsInline preload="metadata" />
                  {!hasStarted && <button type="button" className="series-showcase-play" onClick={() => playPreview(episodeIndex)} aria-label={`播放${project.title}${episode.label}`}><Play aria-hidden="true" /></button>}
                  {episode.externalUrl && <a className="series-bilibili-link series-showcase-bilibili-link" href={episode.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`前往 Bilibili 查看${episode.title}完整版`}><span>点击查看</span><b>BILIBILI 完整版</b><ExternalLink aria-hidden="true" /></a>}
                  <span>{episode.label}{project.episodes.length > 1 ? ` · ${String(episodeIndex + 1).padStart(2, "0")} / ${String(project.episodes.length).padStart(2, "0")}` : ""}</span>
                </div>;
              })}
            </div>
            <div className="series-showcase-copy">
              <span className="series-showcase-kicker">{category.en} / {String(projectIndex + 1).padStart(2, "0")}</span>
              <h2>{project.title}</h2>
              <strong>{story?.en ?? project.note}</strong>
              <p>{story?.summary ?? project.note}</p>
              {!assetsExpanded && storyImages.length > 0 && <div className="series-showcase-thumbs">{storyImages.slice(0, 3).map((asset) => <a href={asset.src} target="_blank" rel="noreferrer" aria-label={`查看${asset.label}原图`} key={asset.src}><img src={asset.src} alt={asset.label} loading="lazy" decoding="async" /></a>)}</div>}
              <div className="series-showcase-actions">
                {storyImages.length > 3 && <button type="button" className="series-showcase-assets-toggle" aria-expanded={assetsExpanded} aria-controls={`${category.slug}-${project.slug}-assets`} onClick={() => setAssetsExpanded((current) => !current)}><Images aria-hidden="true" /><span>{assetsExpanded ? "收起资产" : `展开全部资产 · ${String(storyImages.length).padStart(2, "0")}`}</span><ChevronDown aria-hidden="true" /></button>}
                {story && <button type="button" className="series-showcase-story" onClick={() => setStoryOpen(true)}><BookOpen aria-hidden="true" /><span>查看故事设定</span><ArrowRight aria-hidden="true" /></button>}
              </div>
            </div>
            {assetsExpanded && <motion.section className="series-showcase-assets-panel" id={`${category.slug}-${project.slug}-assets`} aria-label={`${project.title}全部资产`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease }}><header><span>PRODUCTION ASSETS</span><h3>全部资产 · {String(storyImages.length).padStart(2, "0")}</h3></header><div>{storyImages.map((asset) => <a href={asset.src} target="_blank" rel="noreferrer" aria-label={`查看${asset.label}原图`} key={asset.src}><img src={asset.src} alt={asset.label} loading="lazy" decoding="async" /><span>{asset.label}</span></a>)}</div></motion.section>}
          </motion.article>
        </section>

        <NextProjectBanner item={next} number="03" />

        {storyOpen && story && <div className="series-story-modal">
          <section className="series-story-dialog" role="dialog" aria-modal="true" aria-labelledby="showcase-story-title" aria-describedby="showcase-story-description">
            <button type="button" className="series-story-close" onClick={() => setStoryOpen(false)} aria-label="关闭故事设定"><X aria-hidden="true" /></button>
            <header><span>STORY SETTING / {category.en}</span><h2 id="showcase-story-title">{project.title}</h2><strong>{story.en}</strong></header>
            <div className="series-story-body"><span>故事简介</span><p id="showcase-story-description">{story.detail}</p><blockquote><Sparkles aria-hidden="true" /><b>核心主题：</b>{story.theme}</blockquote></div>
            {storyImages.length > 0 && <div className="series-story-gallery"><h3>设定图 · {String(storyImages.length).padStart(2, "0")}</h3><div>{storyImages.map((asset) => <a href={asset.src} target="_blank" rel="noreferrer" key={asset.src}><img src={asset.src} alt={asset.label} loading="lazy" decoding="async" /><span>{asset.label}</span></a>)}</div></div>}
          </section>
        </div>}
      </main>
    </>
  );
}
