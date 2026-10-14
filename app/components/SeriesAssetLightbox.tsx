"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ExternalLink, ZoomIn, ZoomOut, X } from "lucide-react";
import type { SeriesAsset } from "../aiSeriesAssetCatalog";
import { portfolioAssetUrl } from "../portfolioAssetUrl";

export function SeriesAssetLightbox({ assets, selectedIndex, onClose, onSelect }: {
  assets: SeriesAsset[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const isOpen = selectedIndex !== null && assets.length > 0;

  useEffect(() => setZoomed(false), [selectedIndex]);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key === "ArrowLeft") onSelect((selectedIndex! - 1 + assets.length) % assets.length);
      if (event.key === "ArrowRight") onSelect((selectedIndex! + 1) % assets.length);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [assets.length, isOpen, onClose, onSelect, selectedIndex]);

  if (!isOpen || typeof document === "undefined") return null;
  const asset = assets[selectedIndex];
  const src = portfolioAssetUrl(asset.src);
  return createPortal(
    <div className="series-asset-lightbox" onClick={onClose}>
      <section className="series-asset-lightbox-dialog" role="dialog" aria-modal="true" aria-label={`${asset.label}大图预览`} onClick={(event) => event.stopPropagation()}>
        <header>
          <div><span>PRODUCTION ASSET · {String(selectedIndex + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}</span><h2>{asset.label}</h2></div>
          <button type="button" onClick={onClose} aria-label="关闭图片预览"><X aria-hidden="true" /></button>
        </header>
        <div className={`series-asset-lightbox-media${zoomed ? " is-zoomed" : ""}`}>
          <img src={src} alt={asset.label} />
        </div>
        <footer>
          <div className="series-asset-lightbox-paging">
            <button type="button" onClick={() => onSelect((selectedIndex - 1 + assets.length) % assets.length)} aria-label="上一张图片"><ArrowLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => onSelect((selectedIndex + 1) % assets.length)} aria-label="下一张图片"><ArrowRight aria-hidden="true" /></button>
          </div>
          <div className="series-asset-lightbox-actions">
            <button type="button" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "缩小图片" : "放大图片"}>{zoomed ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}<span>{zoomed ? "适应屏幕" : "放大查看"}</span></button>
            <a href={src} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" /><span>查看原图</span></a>
          </div>
        </footer>
      </section>
    </div>, document.body,
  );
}
