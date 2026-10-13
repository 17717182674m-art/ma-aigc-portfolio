"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const normalizeItem = (item) =>
  typeof item === "string" ? { image: item, alt: "" } : item;

export default function DepthCarousel({
  items = /** @type {Array<{image: string, alt?: string}>} */ ([]),
  cardWidth = 300,
  cardHeight = 380,
  radius = 8,
  tint = "#05060a",
  depth = 180,
  spread = 64,
  tilt = 16,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.18,
  blur = 4,
  duration = 700,
  ease = "power3.out",
  autoplay = false,
  autoplayDelay = 3600,
  loop = true,
  showControls = true,
  showIndicators = true,
  initialIndex = 0,
  storageKey,
  onChange = undefined,
  onItemClick,
  className = "",
}) {
  const data = useMemo(
    () => (Array.isArray(items) ? items : []).map(normalizeItem),
    [items],
  );
  const count = data.length;
  const startingIndex = count
    ? ((initialIndex % count) + count) % count
    : 0;
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);
  const positionRef = useRef(startingIndex);
  const focusRef = useRef(startingIndex);
  const tweenRef = useRef(null);
  const scaleRef = useRef(1);
  const configRef = useRef({});
  const onChangeRef = useRef(onChange);
  const dragRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const reducedRef = useRef(false);
  const [active, setActive] = useState(startingIndex);

  onChangeRef.current = onChange;
  configRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
  };

  const layout = useCallback((position) => {
    const config = configRef.current;
    if (!config.count) return;
    const direction = config.tiltDirection === "left" ? -1 : 1;

    for (let index = 0; index < config.count; index += 1) {
      const card = cardRefs.current[index];
      if (!card) continue;
      let distance = index - position;

      if (config.loop && config.count > 1) {
        distance = ((distance % config.count) + config.count) % config.count;
        if (distance > config.count / 2) distance -= config.count;
      }

      const behind = Math.max(0, distance);
      const shown = Math.abs(distance) <= config.visibleCards + 0.5;
      const translateZ = -config.depth * distance;
      const translateX = direction * config.spread * distance;
      const rotateY = direction * config.tilt * clamp(distance, 0, 1);
      let opacity = distance < 0 ? Math.max(0, 1 + distance) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.18, 1 - behind * config.falloff);
      const blurAmount =
        config.blur > 0
          ? Math.min(
              config.blur,
              (behind / Math.max(1, config.visibleCards)) * config.blur,
            )
          : 0;

      card.style.transform = `translate(-50%, -50%) scale(${scaleRef.current}) translateX(${translateX.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(3)}deg)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurAmount.toFixed(2)}px)`;
      card.style.zIndex = String(Math.round(2000 - distance * 20));
      card.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const overlay = overlayRefs.current[index];
      if (overlay) {
        overlay.style.opacity = clamp(
          behind * config.falloff * 1.25,
          0,
          0.78,
        ).toFixed(3);
      }
    }
  }, []);

  const notify = useCallback(
    (index) => {
      setActive(index);
      if (storageKey) sessionStorage.setItem(storageKey, String(index));
      onChangeRef.current?.(index, data[index]);
    },
    [data, storageKey],
  );

  const tweenTo = useCallback(
    (target, animate) => {
      tweenRef.current?.kill();
      const config = configRef.current;
      const proxy = { position: positionRef.current };
      tweenRef.current = gsap.to(proxy, {
        position: target,
        duration:
          animate && !reducedRef.current ? config.duration / 1000 : 0,
        ease: config.ease,
        onUpdate: () => {
          positionRef.current = proxy.position;
          layout(proxy.position);
        },
        onComplete: () => {
          if (config.count) {
            positionRef.current =
              ((positionRef.current % config.count) + config.count) %
              config.count;
          }
          layout(positionRef.current);
        },
      });
    },
    [layout],
  );

  const setFocus = useCallback(
    (rawIndex, animate = true) => {
      const config = configRef.current;
      if (!config.count) return;
      const index = config.loop
        ? ((rawIndex % config.count) + config.count) % config.count
        : clamp(rawIndex, 0, config.count - 1);
      let delta = index - positionRef.current;
      if (config.loop && config.count > 1) {
        delta = ((delta % config.count) + config.count) % config.count;
        if (delta > config.count / 2) delta -= config.count;
      }
      tweenTo(positionRef.current + delta, animate);
      if (index !== focusRef.current) {
        focusRef.current = index;
        notify(index);
      }
    },
    [notify, tweenTo],
  );

  const navigateBy = useCallback(
    (step) => setFocus(focusRef.current + step, true),
    [setFocus],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const compact = entry.contentRect.width < 500;
      const needed = cardWidth + Math.abs(spread) * 2 * (compact ? 0.45 : 1) + (compact ? 0 : 40);
      scaleRef.current = clamp(entry.contentRect.width / needed, 0.48, 1.04);
      layout(positionRef.current);
    });
    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [cardWidth, layout, spread]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const onWheel = (event) => {
      if (configRef.current.count < 2) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      tweenRef.current?.kill();
      const delta = event.deltaMode === 1 ? event.deltaX * 24 : event.deltaX;
      positionRef.current += clamp(
        delta / (configRef.current.cardWidth * 0.9),
        -0.6,
        0.6,
      );
      layout(positionRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(
        () => setFocus(Math.round(positionRef.current), true),
        130,
      );
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [layout, setFocus]);

  const onPointerDown = useCallback((event) => {
    if (configRef.current.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: event.clientX,
      startPosition: positionRef.current,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      id: event.pointerId,
    };
    suppressClickRef.current = false;
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      const stepWidth = Math.max(
        configRef.current.cardWidth * 0.55 * scaleRef.current,
        40,
      );
      const deltaX = event.clientX - drag.x;
      if (!drag.moved && Math.abs(deltaX) > 4) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const elapsed = Math.max(now - drag.lastTime, 1);
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
      drag.lastX = event.clientX;
      drag.lastTime = now;
      positionRef.current = drag.startPosition - deltaX / stepWidth;
      layout(positionRef.current);
    },
    [layout],
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    suppressClickRef.current = drag.moved;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    if (!drag.moved) return;
    const stepWidth = Math.max(
      configRef.current.cardWidth * 0.55 * scaleRef.current,
      40,
    );
    const projected =
      positionRef.current - (drag.velocity * 180) / stepWidth;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!autoplay || reducedRef.current || count < 2) return undefined;
    const root = rootRef.current;
    let paused = false;
    const stop = () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
    autoplayTimerRef.current = window.setInterval(() => {
      if (!paused) navigateBy(1);
    }, Math.max(autoplayDelay, 800));
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    root?.addEventListener("mouseenter", pause);
    root?.addEventListener("mouseleave", resume);
    root?.addEventListener("focusin", pause);
    root?.addEventListener("focusout", resume);
    return () => {
      stop();
      root?.removeEventListener("mouseenter", pause);
      root?.removeEventListener("mouseleave", resume);
      root?.removeEventListener("focusin", pause);
      root?.removeEventListener("focusout", resume);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(positionRef.current);
  }, [
    blur,
    cardHeight,
    cardWidth,
    count,
    depth,
    falloff,
    layout,
    radius,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
  ]);

  useEffect(() => {
    const saved = storageKey
      ? Number(sessionStorage.getItem(storageKey) ?? initialIndex)
      : initialIndex;
    setFocus(saved, false);
  }, [initialIndex, setFocus, storageKey]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ "--dc-perspective": `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label="作品景深轮播"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigateBy(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          navigateBy(1);
        }
      }}
    >
      <div className="depth-carousel__stage">
        {data.map((item, index) => (
          <div
            key={item.image}
            className="depth-carousel__card"
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${count}`}
            aria-hidden={active !== index}
            onClick={() => {
              if (suppressClickRef.current) return;
              if (active === index && onItemClick) {
                onItemClick(item, index);
                return;
              }
              setFocus(index, true);
            }}
          >
            <img
              className="depth-carousel__img"
              src={item.image}
              alt={item.alt || ""}
              loading="lazy"
              draggable={false}
            />
            <span
              className="depth-carousel__tint"
              ref={(element) => {
                overlayRefs.current[index] = element;
              }}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="上一张"
            onClick={() => navigateBy(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="下一张"
            onClick={() => navigateBy(1)}
          >
            ›
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" aria-label="轮播页码">
          {data.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-label={`查看第 ${index + 1} 张`}
              aria-current={active === index ? "true" : undefined}
              className={`depth-carousel__dot${active === index ? " is-active" : ""}`}
              onClick={() => setFocus(index, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
