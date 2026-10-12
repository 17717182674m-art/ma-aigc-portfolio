import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/ma-aigc-portfolio";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: githubPagesBasePath,
      assetPrefix: githubPagesBasePath,
      env: {
        NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
      },
    }
  : {};

export default nextConfig;
