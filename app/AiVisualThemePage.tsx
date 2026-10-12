"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import type {
  AiVisualGroup,
  AiVisualThemeWithImages,
} from "./aiVisualData";
import { AnimatedDivider, ScrollProgress } from "./components/AdvancedDetails";
import { RevealText, ease } from "./components/MotionSystem";
import { SiteHeader } from "./WorkPage";

function ThemeLightbox({
  theme,
  index,
  onClose,
  onStep,
}: {
  theme: AiVisualThemeWithImages;
  index: number | null;
  onClose: () => void;
  onStep: (step: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const wheelTime = useRef(0);
  const drag = useRef<{x:number;y:number;left:number;top:number;id:number}|null>(null);
  const [zoom,setZoom]=useState(1);
  const [position,setPosition]=useState({x:0,y:0});

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  const closeLightbox = useCallback(() => {
    resetView();
    onClose();
  }, [onClose, resetView]);
  const stepLightbox = useCallback((step: number) => {
    resetView();
    onStep(step);
  }, [onStep, resetView]);

  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, index, stepLightbox]);

  useEffect(() => {
    if (index === null || theme.images.length < 2) return;
    [-1, 1].forEach((step) => {
      const next = (index + step + theme.images.length) % theme.images.length;
      const image = new Image();
      image.src = theme.images[next].image;
    });
  }, [index, theme.images]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className={`art-lightbox${theme.mode === "banner" ? " is-banner" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${theme.title}大图浏览`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onWheel={(event)=>{
            event.preventDefault();
            if(event.ctrlKey||zoom>1){setZoom(value=>Math.min(3,Math.max(1,value+(event.deltaY<0?.2:-.2))));return}
            const now=performance.now();if(now-wheelTime.current<380||Math.abs(event.deltaY)<12)return;wheelTime.current=now;stepLightbox(event.deltaY>0?1:-1);
          }}
        >
          <button className="art-lightbox-close" type="button" onClick={closeLightbox} aria-label="关闭大图">
            <X /><span>关闭</span>
          </button>
          <button
            className="art-lightbox-nav art-lightbox-prev"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              stepLightbox(-1);
            }}
            aria-label="上一张"
          >
            <ChevronLeft />
          </button>
          <motion.figure
            key={theme.images[index].image}
            className="art-lightbox-content"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease }}
            onPointerDown={(event)=>{if(zoom<=1)return;drag.current={x:event.clientX,y:event.clientY,left:position.x,top:position.y,id:event.pointerId};event.currentTarget.setPointerCapture(event.pointerId)}}
            onPointerMove={(event)=>{if(!drag.current)return;setPosition({x:drag.current.left+event.clientX-drag.current.x,y:drag.current.top+event.clientY-drag.current.y})}}
            onPointerUp={()=>{drag.current=null}}
            onPointerCancel={()=>{drag.current=null}}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = endX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) > 45) stepLightbox(delta > 0 ? -1 : 1);
            }}
          >
            <div className={`art-lightbox-image-wrap${zoom>1?" is-zoomed":""}`} style={{transform:`translate3d(${position.x}px,${position.y}px,0) scale(${zoom})`}}><img src={theme.images[index].image} alt={theme.images[index].alt} draggable={false}/></div>
            <figcaption>
              <span>{theme.groups ? theme.images[index].alt : theme.title}</span>
              <b>
                {String(index + 1).padStart(2, "0")} / {String(theme.images.length).padStart(2, "0")}
              </b>
            </figcaption>
          </motion.figure>
          <div className="art-lightbox-tools">
            <button type="button" onClick={()=>setZoom(value=>Math.max(1,value-.25))} aria-label="缩小"><ZoomOut/></button>
            <button type="button" onClick={()=>{setZoom(1);setPosition({x:0,y:0})}} aria-label="恢复原始大小"><RotateCcw/><span>{Math.round(zoom*100)}%</span></button>
            <button type="button" onClick={()=>setZoom(value=>Math.min(3,value+.25))} aria-label="放大"><ZoomIn/></button>
          </div>
          <button
            className="art-lightbox-nav art-lightbox-next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              stepLightbox(1);
            }}
            aria-label="下一张"
          >
            <ChevronRight />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IpGroupBrowser({
  group,
  groupIndex,
  onOpen,
}: {
  group: AiVisualGroup;
  groupIndex: number;
  onOpen: (image: string) => void;
}) {
  const [active, setActive] = useState(0);
  const current = group.images[active];

  return (
    <motion.section
      className="ip-group-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.38, ease }}
      aria-labelledby={`ip-group-${group.slug}`}
    >
      <header className="ip-group-head">
        <span>{String(groupIndex + 1).padStart(2, "0")}</span>
        <div>
          <h2 id={`ip-group-${group.slug}`}>{group.title}</h2>
          <p>{group.description}</p>
        </div>
        <small>{group.images.length} 张作品</small>
      </header>

      <div className="ip-group-browser">
        <button
          type="button"
          className="ip-group-main"
          aria-label={`查看${current.alt}大图`}
          onClick={() => onOpen(current.image)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.alt}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease }}
            />
          </AnimatePresence>
          <span className="ip-group-open">查看大图</span>
        </button>

        <aside className="ip-group-rail" aria-label={`${group.title}作品选择`}>
          {group.images.map((item, index) => (
            <button
              type="button"
              className={index === active ? "is-active" : ""}
              aria-current={index === active ? "true" : undefined}
              aria-label={`显示${item.alt}`}
              key={item.image}
              onClick={() => setActive(index)}
            >
              <img src={item.image} alt="" loading="lazy" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </aside>
      </div>
    </motion.section>
  );
}

export function AiVisualThemePage({ theme }: { theme: AiVisualThemeWithImages }) {
  const isBanner = theme.mode === "banner";
  const [selected, setSelected] = useState<number | null>(null);

  const stepLightbox = (step: number) => {
    setSelected((current) => {
      if (current === null) return null;
      return (current + step + theme.images.length) % theme.images.length;
    });
  };

  const openImage = (image: string) => {
    const index = theme.images.findIndex((item) => item.image === image);
    if (index >= 0) setSelected(index);
  };

  return (
    <>
      <ScrollProgress />
      <main
        className={`work-page route-enter ai-theme-detail ai-theme-detail-${theme.slug}`}
        style={{ "--accent": "#ff795f" } as React.CSSProperties}
      >
        <SiteHeader backHref="/works/ai-visual-design#visual-chapters" backLabel="返回视觉目录" />
        <section className="ai-theme-detail-head">
          <div className="ai-theme-detail-title">
            <span>AI VISUAL ARCHIVE / {theme.en}</span>
            <RevealText as="h1" quick>
              {theme.title}
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: 0.04, ease }}
            >
              {String(theme.count).padStart(2, "0")} WORKS · 2026
            </motion.p>
          </div>
          <AnimatedDivider />
          <dl className="ai-theme-notes">
            <div><dt>项目定位</dt><dd>{theme.positioning}</dd></div>
            <div><dt>个人负责</dt><dd>{theme.role}</dd></div>
            <div><dt>使用工具</dt><dd>{theme.tools}</dd></div>
          </dl>
        </section>
        {theme.groups ? (
          <section className="ai-ip-groups" aria-label={`${theme.title}分组作品浏览`}>
            {theme.groups.map((group, index) => (
              <IpGroupBrowser
                group={group}
                groupIndex={index}
                key={group.slug}
                onOpen={openImage}
              />
            ))}
          </section>
        ) : (
          <section
            className={`ai-expanded-gallery ${isBanner ? "is-banner" : "is-grid"}`}
            aria-label={`${theme.title}完整作品浏览`}
          >
            {theme.images.map((item, index) => (
              <motion.figure
                key={item.image}
                className="ai-expanded-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.38, delay: (index % 2) * 0.035, ease }}
              >
                <button
                  type="button"
                  className="ai-expanded-media"
                  aria-label={`查看${item.alt}大图`}
                  onClick={() => setSelected(index)}
                >
                  <img src={item.image} alt={item.alt} loading="lazy" />
                  <span className="ai-expanded-hint">查看大图</span>
                </button>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{item.alt}</small>
                </figcaption>
              </motion.figure>
            ))}
          </section>
        )}
      </main>
      <ThemeLightbox
        theme={theme}
        index={selected}
        onClose={() => setSelected(null)}
        onStep={stepLightbox}
      />
    </>
  );
}
