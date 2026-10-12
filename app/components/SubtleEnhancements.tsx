"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".portfolio-entry-meta",
  ".skills-group",
  ".experience-main",
  ".contact-methods a",
  ".editorial-shot .tile-meta",
  ".sticky-project-info",
].join(",");

export function SubtleEnhancements() {
  const pathname = usePathname();

  useEffect(() => {
    let scrollTimer = 0;
    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => document.documentElement.classList.remove("is-scrolling"), 110);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const returningHome = pathname === "/" && sessionStorage.getItem("home-intro-seen") === "1";
    document.documentElement.classList.toggle("returning-home", returningHome);
    if (pathname === "/") sessionStorage.setItem("home-intro-seen", "1");
    const imageCleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      image.decoding = "async";
      if (!image.hasAttribute("loading") && !image.closest(".hero,.profile-photo")) image.loading = "lazy";
      image.classList.add("image-reveal");
      const ready = () => image.classList.add("is-ready");
      if (image.complete && image.naturalWidth > 0) ready();
      else {
        image.addEventListener("load", ready, { once: true });
        image.addEventListener("error", ready, { once: true });
        imageCleanups.push(() => {
          image.removeEventListener("load", ready);
          image.removeEventListener("error", ready);
        });
      }
    });

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("subtle-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isAlreadyVisible) {
        element.classList.add("subtle-visible");
        return;
      }

      element.classList.add("subtle-reveal");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      imageCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
      document.documentElement.classList.remove("is-scrolling");
      document.documentElement.classList.remove("returning-home");
    };
  }, [pathname]);

  return (
    <>
      <div className="enhancement-lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </>
  );
}
