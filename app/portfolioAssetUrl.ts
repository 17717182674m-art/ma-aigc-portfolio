const githubPagesPrefix = "/ma-aigc-portfolio";

/** Keep public-file URLs valid both at the site root and on GitHub Pages. */
export function portfolioAssetUrl(src: string): string {
  if (!src.startsWith("/") || src.startsWith(`${githubPagesPrefix}/`)) return src;
  if (typeof window !== "undefined" && window.location.pathname.startsWith(`${githubPagesPrefix}/`)) {
    return `${githubPagesPrefix}${src}`;
  }
  return src;
}
