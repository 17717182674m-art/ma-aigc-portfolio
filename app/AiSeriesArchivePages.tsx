"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ExternalLink, Layers3, Maximize2, Pause, Play, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { getAiSeriesPosterSrc, type AiSeriesCategory, type AiSeriesEpisode, type AiSeriesProject } from "./aiSeriesData";
import { aiSeriesStories } from "./aiSeriesStories";
import { aiSeriesAssets } from "./aiSeriesAssetCatalog";
import { ScrollProgress } from "./components/AdvancedDetails";
import { InstantRouteLink, RevealText, ease } from "./components/MotionSystem";
import { SiteHeader } from "./WorkPage";
import { Button } from "./components/Button";

const seriesAccent = "#aa82ff";


function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const rounded = Math.floor(value);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = String(rounded % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
}

function EpisodePlayer({ episode, index }: { episode: AiSeriesEpisode; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const continuePlayingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const localTimeRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [segment, setSegment] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const sources = useMemo(() => Array.isArray(episode.src) ? episode.src : [episode.src], [episode.src]);
  const [playbackSources, setPlaybackSources] = useState<string[]>(sources);
  const [prepareSource, setPrepareSource] = useState(false);
  const [seekReady, setSeekReady] = useState(false);
  const [segmentDurations, setSegmentDurations] = useState<number[]>(() => sources.map(() => 0));
  const durationsReady = segmentDurations.length === sources.length && segmentDurations.every((value) => value > 0);
  const totalDuration = durationsReady ? segmentDurations.reduce((sum, value) => sum + value, 0) : segmentDurations[segment] || 0;
  const progress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 0;

  useEffect(() => {
    if (!prepareSource) return;
    const controller = new AbortController();
    const objectUrls: string[] = [];
    let disposed = false;

    void Promise.all(sources.map(async (src) => {
      try {
        const response = await fetch(src, { signal: controller.signal, cache: "force-cache" });
        if (!response.ok) return src;
        const objectUrl = URL.createObjectURL(await response.blob());
        objectUrls.push(objectUrl);
        return objectUrl;
      } catch {
        return src;
      }
    })).then((loadedSources) => {
      if (disposed) return;
      setPlaybackSources(loadedSources);
      setSeekReady(loadedSources.every((src) => src.startsWith("blob:")));
    });

    return () => {
      disposed = true;
      controller.abort();
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [prepareSource, sources]);

  useEffect(() => {
    if (playbackSources.length === 1 || !playbackSources.every((src) => src.startsWith("blob:"))) return;
    const loaders = playbackSources.map((src, sourceIndex) => {
      const loader = document.createElement("video");
      loader.preload = "metadata";
      loader.src = src;
      loader.addEventListener("loadedmetadata", () => {
        if (!Number.isFinite(loader.duration)) return;
        setSegmentDurations((values) => values.map((value, valueIndex) => valueIndex === sourceIndex ? loader.duration : value));
      }, { once: true });
      loader.load();
      return loader;
    });
    return () => loaders.forEach((loader) => {
      loader.removeAttribute("src");
      loader.load();
    });
  }, [playbackSources, sources]);

  useEffect(() => {
    const current = videoRef.current;
    if (!current) return;
    if (playbackSources[segment]?.startsWith("blob:")) {
      continuePlayingRef.current = continuePlayingRef.current || !current.paused;
      if (localTimeRef.current > 0 && pendingSeekRef.current === null) pendingSeekRef.current = localTimeRef.current;
    }
    current.load();
  }, [segment, playbackSources]);

  const togglePlayback = async () => {
    const current = videoRef.current;
    if (!current) return;
    if (current.paused) {
      setPlaybackSources(sources);
      setSeekReady(false);
      setSegmentDurations(sources.map(() => 0));
      setPrepareSource(true);
      document.querySelectorAll<HTMLVideoElement>("video.series-video").forEach((item) => {
        if (item !== current) item.pause();
      });
      setStarted(true);
      await current.play();
    } else {
      current.pause();
    }
  };

  const handleEnded = () => {
    if (segment < sources.length - 1) {
      continuePlayingRef.current = true;
      pendingSeekRef.current = 0;
      localTimeRef.current = 0;
      setSegment((value) => value + 1);
      return;
    }
    setPlaying(false);
    if (segment > 0) {
      pendingSeekRef.current = 0;
      localTimeRef.current = 0;
      setSegment(0);
    }
  };

  const handleLoadedMetadata = () => {
    const current = videoRef.current;
    if (!current || !Number.isFinite(current.duration)) return;
    setSegmentDurations((values) => values.map((value, valueIndex) => valueIndex === segment ? current.duration : value));
    if (pendingSeekRef.current !== null) {
      current.currentTime = Math.min(pendingSeekRef.current, Math.max(0, current.duration - 0.05));
    }
    if (continuePlayingRef.current) {
      continuePlayingRef.current = false;
      void current.play();
    }
  };

  const updateElapsed = () => {
    const current = videoRef.current;
    if (!current) return;
    localTimeRef.current = current.currentTime;
    if (pendingSeekRef.current !== null && Math.abs(current.currentTime - pendingSeekRef.current) < 0.75) pendingSeekRef.current = null;
    const previousSegments = durationsReady ? segmentDurations.slice(0, segment).reduce((sum, value) => sum + value, 0) : 0;
    setElapsed(previousSegments + current.currentTime);
  };

  const seekTo = (target: number) => {
    const current = videoRef.current;
    if (!current || totalDuration <= 0) return;
    const safeTarget = Math.min(Math.max(target, 0), Math.max(0, totalDuration - 0.05));
    setStarted(true);
    setElapsed(safeTarget);

    if (!durationsReady || sources.length === 1) {
      pendingSeekRef.current = safeTarget;
      current.currentTime = safeTarget;
      return;
    }

    let accumulated = 0;
    let targetSegment = segmentDurations.length - 1;
    for (let sourceIndex = 0; sourceIndex < segmentDurations.length; sourceIndex += 1) {
      if (safeTarget < accumulated + segmentDurations[sourceIndex]) {
        targetSegment = sourceIndex;
        break;
      }
      accumulated += segmentDurations[sourceIndex];
    }
    const segmentTime = safeTarget - accumulated;
    if (targetSegment === segment) {
      pendingSeekRef.current = segmentTime;
      current.currentTime = segmentTime;
      return;
    }
    continuePlayingRef.current = !current.paused;
    pendingSeekRef.current = segmentTime;
    setSegment(targetSegment);
  };

  const toggleMute = () => {
    const current = videoRef.current;
    if (!current) return;
    current.muted = !current.muted;
    setMuted(current.muted);
  };

  const enterFullscreen = () => {
    const visual = videoRef.current?.closest(".series-episode-visual") as HTMLElement | null;
    void visual?.requestFullscreen?.();
  };

  return (
    <figure className={`series-episode-card is-${episode.orientation}`}>
      <div className="series-episode-visual">
        {/* Original works contain their own embedded captions where applicable. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className={`series-video${playing ? " is-playing" : ""}`}
          src={playbackSources[segment] || sources[segment]}
          playsInline
          preload={started ? "metadata" : "none"}
          poster={getAiSeriesPosterSrc(episode.poster)}
          onClick={started ? togglePlayback : undefined}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onTimeUpdate={updateElapsed}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
        />
        <span className="series-episode-label">{episode.label}</span>
        {episode.externalUrl && (
          <a className={`series-bilibili-link${episode.externalPlatform === "xiaohongshu" ? " series-xiaohongshu-link" : ""}`} href={episode.externalUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`前往${episode.externalPlatform === "xiaohongshu" ? "小红书" : "Bilibili"}查看${episode.title}完整版`}>
            <span>点击查看</span><b>{episode.externalPlatform === "xiaohongshu" ? "小红书完整视频" : "BILIBILI 完整版"}</b><ExternalLink aria-hidden="true" />
          </a>
        )}
        {!started && (
          <>
            <button type="button" className="series-screen-play" onClick={togglePlayback} aria-label={`点击画面播放${episode.title}`}>
              <span><Play aria-hidden="true" /></span>
            </button>
            <Button type="button" className="series-play-button" variant="soft" size="lg" icon={Play} iconPosition="start" onClick={togglePlayback} aria-label={`播放${episode.title}`}>
              <b>点击播放</b>
            </Button>
          </>
        )}
        {started && (
          <div className={`series-player-controls${seekReady ? " is-seek-ready" : " is-loading-source"}`}>
            <button type="button" className="series-control-toggle" onClick={togglePlayback} aria-label={playing ? `暂停${episode.title}` : `播放${episode.title}`}>
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            <span className="series-player-time">{formatPlaybackTime(elapsed)} <i>/</i> {formatPlaybackTime(totalDuration)}</span>
            <input
              className="series-player-seek"
              type="range"
              min="0"
              max={Math.max(totalDuration, 0.01)}
              step="0.05"
              value={Math.min(elapsed, Math.max(totalDuration, 0.01))}
              style={{ "--seek-progress": `${progress}%` } as React.CSSProperties}
              onChange={(event) => seekTo(Number(event.currentTarget.value))}
              aria-label={`${episode.title}播放进度，可点击或拖动跳转`}
            />
            <span className="series-seek-status" role="status"><i />{seekReady ? "可自由跳转" : "正在准备快进"}</span>
            <button type="button" onClick={toggleMute} aria-label={muted ? "打开声音" : "静音"}>
              {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            </button>
            <button type="button" onClick={enterFullscreen} aria-label="全屏播放"><Maximize2 aria-hidden="true" /></button>
          </div>
        )}
      </div>
      <figcaption className="series-episode-caption">
        <span><b>{String(index + 1).padStart(2, "0")}</b>{episode.title}</span>
        <small>{episode.duration}</small>
      </figcaption>
    </figure>
  );
}

function ProjectAssetGallery({ category, project }: { category: AiSeriesCategory; project: AiSeriesProject }) {
  const assets = aiSeriesAssets[`${category.slug}/${project.slug}`];
  if (!assets) return null;
  const groups = [
    { key: "characters" as const, number: "01", title: "人物", en: "CHARACTERS" },
    { key: "scenes" as const, number: "02", title: "场景", en: "SCENES" },
    { key: "props" as const, number: "03", title: "物品", en: "PROPS" },
  ];
  const total = groups.reduce((sum, group) => sum + assets[group.key].length, 0);
  if (total === 0) return null;

  return (
    <section className="series-assets" aria-labelledby="series-assets-title">
      <header className="series-assets-intro">
        <div>
          <span>PRODUCTION ASSETS / {String(total).padStart(2, "0")}</span>
          <h2 id="series-assets-title">创作资产</h2>
        </div>
        <p>按制作环节整理人物、场景与物品设定，点击图片可查看原始尺寸。</p>
      </header>
      <div className="series-asset-groups">
        {groups.map((group) => (
          <section className="series-asset-group" key={group.key} aria-labelledby={`asset-${group.key}`}>
            <header>
              <span>{group.number}</span>
              <div><h3 id={`asset-${group.key}`}>{group.title}</h3><small>{group.en}</small></div>
              <b>{String(assets[group.key].length).padStart(2, "0")}</b>
            </header>
            {assets[group.key].length > 0 ? (
              <div className="series-asset-grid">
                {assets[group.key].map((asset, index) => (
                  <a href={asset.src} target="_blank" rel="noreferrer" key={asset.src} aria-label={`查看${asset.label}原图`}>
                    <img src={asset.src} alt={asset.label} loading="lazy" decoding="async" />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <em>{asset.label}</em>
                  </a>
                ))}
              </div>
            ) : <p className="series-assets-empty">该作品暂无独立{group.title}设定图</p>}
          </section>
        ))}
      </div>
    </section>
  );
}

function ProjectStorySetting({ category, project }: { category: AiSeriesCategory; project: AiSeriesProject }) {
  const [open, setOpen] = useState(false);
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
      : project.episodes.map((episode) => ({ src: getAiSeriesPosterSrc(episode.poster), label: `${project.title}画面设定` }));
    return candidates.filter((asset, index, list) => list.findIndex((entry) => entry.src === asset.src) === index);
  }, [assets, project]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!story) return null;

  return (
    <section className="series-story" id="story-setting" aria-labelledby="series-story-title">
      <div className="series-story-visual" aria-hidden="true">
        <img src={getAiSeriesPosterSrc(project.episodes[0].poster)} alt="" loading="lazy" decoding="async" />
        <span>STORY WORLD / {category.en}</span>
      </div>
      <div className="series-story-copy">
        <span className="series-story-kicker">STORY SETTING / 故事设定</span>
        <h2 id="series-story-title">{project.title}</h2>
        <strong>{story.en}</strong>
        <p>{story.summary}</p>
        {storyImages.length > 0 && (
          <div className="series-story-thumbs" aria-label="故事设定图预览">
            {storyImages.slice(0, 3).map((asset) => <img key={asset.src} src={asset.src} alt={asset.label} loading="lazy" decoding="async" />)}
          </div>
        )}
        <button type="button" className="series-story-open" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <BookOpen aria-hidden="true" />
          <span>查看故事设定</span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="series-story-modal">
          <section className="series-story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-dialog-title" aria-describedby="story-dialog-description">
            <button type="button" className="series-story-close" onClick={() => setOpen(false)} aria-label="关闭故事设定"><X aria-hidden="true" /></button>
            <header>
              <span>STORY SETTING / {category.en}</span>
              <h2 id="story-dialog-title">{project.title}</h2>
              <strong>{story.en}</strong>
            </header>
            <div className="series-story-body">
              <span>故事简介</span>
              <p id="story-dialog-description">{story.detail}</p>
              <blockquote><Sparkles aria-hidden="true" /><b>核心主题：</b>{story.theme}</blockquote>
            </div>
            {storyImages.length > 0 && (
              <div className="series-story-gallery" aria-label="设定图">
                <h3>设定图 · {String(storyImages.length).padStart(2, "0")}</h3>
                <div>{storyImages.map((asset) => <a href={asset.src} target="_blank" rel="noreferrer" key={asset.src}><img src={asset.src} alt={asset.label} loading="lazy" decoding="async" /><span>{asset.label}</span></a>)}</div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

export function AiSeriesCategoryPage({ category }: { category: AiSeriesCategory }) {
  return (
    <>
      <ScrollProgress />
      <main className="work-page route-enter ai-series-page series-category-page" style={{ "--accent": seriesAccent } as React.CSSProperties}>
        <SiteHeader backHref="/works/ai-series" backLabel="返回 AI 剧集" />
        <section className="series-category-hero">
          <div className="series-category-heading">
            <span>AI SERIES / {category.title}</span>
            <RevealText as="h1" quick>{category.en}</RevealText>
            <p>{category.description}</p>
          </div>
        </section>

        <section className="series-project-grid" aria-label={`${category.title}作品`}>
          {category.projects.map((project, index) => (
            <motion.div key={project.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: Math.min(index * 0.035, 0.18), ease }}>
              <InstantRouteLink className="series-project-card" href={`/works/ai-series/${category.slug}/${project.slug}`} rememberScroll>
                <img className="series-project-cover" src={getAiSeriesPosterSrc(project.episodes[0].poster)} alt="" />
                <span className="series-project-shade" aria-hidden="true" />
                <span className="series-project-no">PROJECT {String(index + 1).padStart(2, "0")}</span>
                <span className="series-project-arrow" aria-hidden="true"><ArrowRight /></span>
                <div className="series-project-copy">
                  <strong>{project.title}</strong>
                  <p>{project.note}</p>
                  <div className="series-episode-tags">
                    {project.episodes.map((episode) => <span key={episode.poster}>{episode.label}</span>)}
                  </div>
                </div>
                <footer className="series-project-footer"><span><Layers3 /> {project.episodes.length} 集</span><b>查看项目</b></footer>
              </InstantRouteLink>
            </motion.div>
          ))}
        </section>
      </main>
    </>
  );
}

export function AiSeriesProjectPage({ category, project }: { category: AiSeriesCategory; project: AiSeriesProject }) {
  const [activeEpisode,setActiveEpisode]=useState(0);
  useEffect(()=>{
    if(project.episodes.length<2)return;
    const anchors=Array.from(document.querySelectorAll<HTMLElement>(".series-episode-anchor"));
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const index=anchors.indexOf(visible.target as HTMLElement);if(index>=0)setActiveEpisode(index)}},{rootMargin:"-22% 0px -52%",threshold:[0,.2,.5]});
    anchors.forEach(anchor=>observer.observe(anchor));
    return()=>observer.disconnect();
  },[project.episodes.length]);
  const jumpToEpisode=(index:number)=>(event:React.MouseEvent<HTMLAnchorElement>)=>{event.preventDefault();const target=document.getElementById(`episode-${index+1}`);if(!target)return;history.replaceState(null,"",`#episode-${index+1}`);target.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth",block:"start"})};
  return (
    <>
      <ScrollProgress />
      <main className="work-page route-enter ai-series-page series-detail-page" style={{ "--accent": seriesAccent } as React.CSSProperties}>
        <SiteHeader backHref={`/works/ai-series/${category.slug}`} backLabel={`返回${category.title}`} />
        <section className="series-detail-hero">
          <div>
            <span>{category.en} / {String(project.episodes.length).padStart(2, "0")} EPISODE{project.episodes.length > 1 ? "S" : ""}</span>
            <RevealText as="h1" quick>{project.title}</RevealText>
            <p>{project.note}</p>
          </div>
        </section>

        {project.episodes.length > 1 && <nav className="series-episode-nav" aria-label={`${project.title}集数导航`}>{project.episodes.map((episode,index)=><a className={activeEpisode===index?"is-current":""} aria-current={activeEpisode===index?"true":undefined} onClick={jumpToEpisode(index)} href={`#episode-${index+1}`} key={episode.poster}><span>{String(index+1).padStart(2,"0")}</span>{episode.label}</a>)}</nav>}
        <section className={`series-episode-stage${project.episodes.length === 1 ? " is-single" : ""}`} aria-label={`${project.title}剧集`}>
          {project.episodes.map((episode, index) => <div className={`series-episode-anchor is-${episode.orientation}`} id={`episode-${index+1}`} key={episode.poster}><EpisodePlayer episode={episode} index={index} /></div>)}
        </section>
        <ProjectStorySetting category={category} project={project} />
        <ProjectAssetGallery category={category} project={project} />
      </main>
    </>
  );
}
