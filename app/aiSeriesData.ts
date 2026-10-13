export type AiSeriesEpisode = {
  title: string;
  label: string;
  duration: string;
  src: string | string[];
  poster: string;
  orientation: "portrait" | "landscape";
  externalUrl?: string;
  externalPlatform?: "bilibili" | "xiaohongshu";
};

export const getAiSeriesPosterSrc = (poster: string) =>
  `${poster}${poster.includes("?") ? "&" : "?"}cover=20261010`;

export type AiSeriesProject = {
  slug: string;
  title: string;
  note: string;
  episodes: AiSeriesEpisode[];
};

export type AiSeriesCategory = {
  slug: string;
  title: string;
  en: string;
  note: string;
  description: string;
  projects: AiSeriesProject[];
};

export const aiSeriesCategories: AiSeriesCategory[] = [
  {
    slug: "short-drama",
    title: "AI短剧",
    en: "AI DRAMA",
    note: "角色表演、连续叙事与剧情节奏",
    description: "按原始剧集文件夹归档，同一作品的多集内容集中在一个项目中呈现。",
    projects: [
      {
        slug: "late-love",
        title: "迟来的爱也很甜",
        note: "都市情感短剧",
        episodes: [
          { title: "迟来的爱也很甜 · 第 08 集", label: "EP.08 · 第八集", duration: "01:16", src: "/ai-series/video/short-drama/01.mp4", poster: "/ai-series/video/short-drama/01.webp", orientation: "portrait", externalPlatform: "xiaohongshu", externalUrl: "https://www.xiaohongshu.com/discovery/item/6acddcc7000000001b02252d?source=webshare&xhsshare=pc_web&xsec_token=ABOlFjGeGV6elcQt77LV6_e04J06YuUYh--C-xZCeDv6w=&xsec_source=pc_share" },
          { title: "迟来的爱也很甜 · 第 09 集", label: "EP.09 · 第九集", duration: "01:12", src: "/ai-series/video/short-drama/02.mp4", poster: "/ai-series/video/short-drama/02.webp", orientation: "portrait" },
        ],
      },
      {
        slug: "fake-love",
        title: "假戏变真爱",
        note: "都市情感连续短剧",
        episodes: [
          { title: "假戏变真爱 · 第 11 集", label: "EP.11 · 第十一集", duration: "00:38", src: "/ai-series/video/short-drama/14.mp4", poster: "/ai-series/video/short-drama/14.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1gEps62Edn" },
          { title: "假戏变真爱 · 第 12 集", label: "EP.12 · 第十二集", duration: "00:38", src: "/ai-series/video/short-drama/15.mp4", poster: "/ai-series/video/short-drama/15.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1gEps62EYJ" },
          { title: "假戏变真爱 · 第 13 集", label: "EP.13 · 第十三集", duration: "00:36", src: "/ai-series/video/short-drama/16.mp4", poster: "/ai-series/video/short-drama/16.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1gEps62EJ3" },
        ],
      },
      {
        slug: "heiress-return",
        title: "真前进归来，我拿着百万退场",
        note: "都市逆袭短剧",
        episodes: [
          { title: "真前进归来，我拿着百万退场 · 第 01 集", label: "EP.01 · 第一集", duration: "04:41", src: "/ai-series/video/short-drama/04.mp4", poster: "/ai-series/video/short-drama/04.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV18Eps62EUn" },
          { title: "真前进归来，我拿着百万退场 · 第 02 集", label: "EP.02 · 第二集", duration: "03:22", src: "/ai-series/video/short-drama/05.mp4", poster: "/ai-series/video/short-drama/05.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1gEps62EW2" },
        ],
      },
      {
        slug: "forbidden-night",
        title: "Forbidden Night",
        note: "海外情感短剧",
        episodes: [
          { title: "Forbidden Night · EP 03", label: "EP.03 · Episode Three", duration: "04:46", src: "/ai-series/video/short-drama/06.mp4", poster: "/ai-series/video/short-drama/06.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1tsps6kEV7" },
          { title: "Forbidden Night · EP 04", label: "EP.04 · Episode Four", duration: "05:03", src: "/ai-series/video/short-drama/07.mp4", poster: "/ai-series/video/short-drama/07.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1Tsps6kE5u" },
        ],
      },
      {
        slug: "little-red-riding-hood",
        title: "Little Red Riding Hood",
        note: "奇幻叙事短剧",
        episodes: [
          { title: "Little Red Riding Hood · EP 06", label: "EP.06 · Episode Six", duration: "01:10", src: "/ai-series/video/short-drama/08.mp4", poster: "/ai-series/video/short-drama/08.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1DEps62En7" },
          { title: "Little Red Riding Hood · EP 07", label: "EP.07 · Episode Seven", duration: "01:03", src: "/ai-series/video/short-drama/09.mp4", poster: "/ai-series/video/short-drama/09.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1Msps6kEc8" },
        ],
      },
      {
        slug: "hot-stepbrother",
        title: "My Hot Stepbrother",
        note: "海外竖屏短剧",
        episodes: [
          { title: "My Hot Stepbrother · EP 10", label: "EP.10 · Episode Ten", duration: "00:59", src: "/ai-series/video/short-drama/10.mp4", poster: "/ai-series/video/short-drama/10.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1Tsps6kEQi" },
          { title: "My Hot Stepbrother · EP 11", label: "EP.11 · Episode Eleven", duration: "01:04", src: "/ai-series/video/short-drama/11.mp4", poster: "/ai-series/video/short-drama/11.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1gEps62EEG" },
        ],
      },
      {
        slug: "office-nobody",
        title: "Office Nobody",
        note: "都市职场短剧",
        episodes: [
          { title: "Office Nobody · EP 01", label: "EP.01 · Episode One", duration: "04:20", src: "/ai-series/video/short-drama/12.mp4", poster: "/ai-series/video/short-drama/12.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1tsps6kEMa" },
          { title: "Office Nobody · EP 02", label: "EP.02 · Episode Two", duration: "04:12", src: "/ai-series/video/short-drama/13.mp4", poster: "/ai-series/video/short-drama/13.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV14sps6kE16" },
        ],
      },
      {
        slug: "time-out-apocalypse",
        title: "Time Out: The Apocalypse",
        note: "末日题材连续短剧",
        episodes: [
          { title: "Time Out: The Apocalypse · EP 20", label: "EP.20 · Episode Twenty", duration: "01:49", src: "/ai-series/video/short-drama/17.mp4", poster: "/ai-series/video/short-drama/17.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1xLpt6jENX" },
          { title: "Time Out: The Apocalypse · EP 21", label: "EP.21 · Episode Twenty-one", duration: "02:19", src: "/ai-series/video/short-drama/18.mp4", poster: "/ai-series/video/short-drama/18.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1gEps62EiY" },
        ],
      },
    ],
  },
  {
    slug: "tvc",
    title: "TVC广告",
    en: "TVC",
    note: "产品氛围、商业叙事与视觉记忆点",
    description: "每支广告作为独立项目呈现，聚焦产品质感、商业节奏与品牌情绪。",
    projects: [
      { slug: "ice-age", title: "冰河时代", note: "概念产品广告", episodes: [{ title: "冰河时代", label: "完整版", duration: "00:37", src: "/ai-series/video/tvc/01.mp4", poster: "/ai-series/video/tvc/01.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1TWps6VEob" }] },
      { slug: "ecommerce", title: "电商广告", note: "电商视觉短片", episodes: [{ title: "电商广告", label: "完整版", duration: "00:17", src: "/ai-series/video/tvc/02.mp4", poster: "/ai-series/video/tvc/02.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1SdHU6yEav" }] },
      { slug: "fashion-a", title: "电商换装 · A", note: "换装视觉实验", episodes: [{ title: "电商换装 · 视觉实验 A", label: "完整版", duration: "00:15", src: "/ai-series/video/tvc/03.mp4", poster: "/ai-series/video/tvc/03.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1MWps6VEsr" }] },
      { slug: "fashion-b", title: "电商换装 · B", note: "换装视觉实验", episodes: [{ title: "电商换装 · 视觉实验 B", label: "完整版", duration: "00:24", src: "/ai-series/video/tvc/04.mp4", poster: "/ai-series/video/tvc/04.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1UWps6VE78" }] },
      { slug: "crazy-water-world", title: "疯狂水世界", note: "概念场景广告", episodes: [{ title: "疯狂水世界", label: "完整版", duration: "00:16", src: "/ai-series/video/tvc/05.mp4", poster: "/ai-series/video/tvc/05.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1MWps6VETF" }] },
      { slug: "blank-fragrance", title: "留白香氛", note: "香氛品牌短片", episodes: [{ title: "留白香氛", label: "完整版", duration: "01:07", src: "/ai-series/video/tvc/06.mp4", poster: "/ai-series/video/tvc/06.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1MWps6VECg" }] },
      { slug: "perfume", title: "香水广告", note: "香水产品广告", episodes: [{ title: "香水广告", label: "完整版", duration: "00:20", src: "/ai-series/video/tvc/07.mp4", poster: "/ai-series/video/tvc/07.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1uHps6yEnM" }] },
    ],
  },
  {
    slug: "ai-short-video",
    title: "AI小视频",
    en: "AI SHORT VIDEO",
    note: "世界观、情绪短片与概念预告",
    description: "每部短片独立成章，从轻量角色故事延伸至科幻世界观与概念预告。",
    projects: [
      { slug: "visual-experiment", title: "外星入侵", note: "科幻世界观影像短片", episodes: [{ title: "外星入侵", label: "完整版", duration: "03:57", src: "/ai-series/video/ai-short-video/01.mp4", poster: "/ai-series/video/ai-short-video/01.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV16Hpx6YEt5" }] },
      { slug: "working-cat", title: "猫咪打工的一天", note: "角色叙事短片", episodes: [{ title: "猫咪打工的一天", label: "完整版", duration: "01:27", src: "/ai-series/video/ai-short-video/02.mp4", poster: "/ai-series/video/ai-short-video/02.webp", orientation: "portrait", externalUrl: "https://www.bilibili.com/video/BV1rnpx6PEwL" }] },
      { slug: "forgotten-bureau", title: "遗忘管理局", note: "都市奇幻概念短片", episodes: [{ title: "遗忘管理局", label: "完整版", duration: "04:19", src: "/ai-series/video/ai-short-video/08.mp4", poster: "/ai-series/video/ai-short-video/08.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1q4px6FEae" }] },
      { slug: "echoes-silent-planet", title: "Echoes of the Silent Planet", note: "科幻叙事短片", episodes: [{ title: "Echoes of the Silent Planet", label: "完整版", duration: "13:02", src: ["/ai-series/video/ai-short-video/03-00.mp4", "/ai-series/video/ai-short-video/03-01.mp4", "/ai-series/video/ai-short-video/03-02.mp4"], poster: "/ai-series/video/ai-short-video/03.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1nnpx6NEZC" }] },
      { slug: "nexus", title: "Nexus", note: "科幻概念预告", episodes: [{ title: "Nexus", label: "完整版", duration: "06:33", src: "/ai-series/video/ai-short-video/04.mp4", poster: "/ai-series/video/ai-short-video/04.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1nnpx6NEy6" }] },
      { slug: "not-normal-island", title: "Not A Normal Island", note: "科幻悬疑短片", episodes: [{ title: "Not A Normal Island", label: "完整版", duration: "04:59", src: "/ai-series/video/ai-short-video/05.mp4", poster: "/ai-series/video/ai-short-video/05.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1rnpx6PEuS" }] },
      { slug: "last-day-before-ai", title: "The Last Day Before AI Took Over the World", note: "末日科幻短片", episodes: [{ title: "The Last Day Before AI Took Over the World", label: "完整版", duration: "03:29", src: "/ai-series/video/ai-short-video/06.mp4", poster: "/ai-series/video/ai-short-video/06.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV1cnpx6NE6P" }] },
      { slug: "slept-thousand-years", title: "They Slept For A Thousand Years", note: "科幻概念短片", episodes: [{ title: "They Slept For A Thousand Years", label: "完整版", duration: "06:10", src: "/ai-series/video/ai-short-video/07.mp4", poster: "/ai-series/video/ai-short-video/07.webp", orientation: "landscape", externalUrl: "https://www.bilibili.com/video/BV16npx6PEQT" }] },
    ],
  },
];

export function getAiSeriesCategory(slug: string) {
  return aiSeriesCategories.find((category) => category.slug === slug);
}

export function getAiSeriesProject(categorySlug: string, projectSlug: string) {
  const category = getAiSeriesCategory(categorySlug);
  const project = category?.projects.find((entry) => entry.slug === projectSlug);
  return category && project ? { category, project } : undefined;
}
