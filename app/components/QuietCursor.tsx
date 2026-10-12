"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "[role='button']",
  ".project-index",
  ".cursor-play",
  ".next-project-full",
].join(",");

export default function QuietCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname !== "/" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasMoved = false;
    let frame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.45;
      currentY += (targetY - currentY) * 0.45;
      if (cursorRef.current && hasMoved) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (Math.abs(targetX-currentX)>.12 || Math.abs(targetY-currentY)>.12) frame=window.requestAnimationFrame(render);
      else frame=0;
    };

    const requestRender=()=>{if(!frame)frame=window.requestAnimationFrame(render)};

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!hasMoved) {
        currentX = targetX;
        currentY = targetY;
        hasMoved = true;
      }

      const cursor = cursorRef.current;
      if (!cursor) return;
      const target = event.target as Element | null;
      cursor.dataset.visible = "true";
      cursor.dataset.active = String(Boolean(target?.closest(interactiveSelector)));
      requestRender();
    };

    const hide = (event: MouseEvent) => {
      if (event.relatedTarget || !cursorRef.current) return;
      cursorRef.current.dataset.visible = "false";
    };

    const press = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      currentX = targetX;
      currentY = targetY;
      if (cursorRef.current) {
        cursorRef.current.dataset.down = "true";
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    };

    const release = () => {
      if (cursorRef.current) cursorRef.current.dataset.down = "false";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("mouseout", hide);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("mouseout", hide);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div
      ref={cursorRef}
      className="quiet-cursor"
      data-visible="false"
      data-active="false"
      data-down="false"
      aria-hidden="true"
    />
  );
}
