export type AiVisualTheme = {
  slug: string;
  title: string;
  en: string;
  count: number;
  mode: "carousel" | "banner";
  cardWidth: number;
  cardHeight: number;
  spread: number;
  tiltDirection: "left" | "right";
  positioning: string;
  role: string;
  tools: string;
  groups?: AiVisualGroup[];
};

export type AiVisualImage = { image: string; alt: string };

export type AiVisualGroup = {
  slug: string;
  title: string;
  description: string;
  images: AiVisualImage[];
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const createGroupImages = (
  slug: string,
  title: string,
  description: string,
  count: number,
): AiVisualGroup => ({
  slug,
  title,
  description,
  images: Array.from({ length: count }, (_, index) => ({
    image: `${publicBasePath}/ai-visual/ip-vi/${slug}/${String(index + 1).padStart(2, "0")}.webp`,
    alt: `${title} IP 形象设计 ${String(index + 1).padStart(2, "0")}`,
  })),
});

const ipViGroups: AiVisualGroup[] = [
  createGroupImages("momoqi", "MOMOQI", "情绪陪伴型原创 IP", 6),
  createGroupImages("pachi", "PACHI", "修补日常主题 IP", 7),
  createGroupImages("momo", "MOMO", "城市失物保管员 IP", 5),
];

const createImages = (theme: AiVisualTheme) =>
  Array.from({ length: theme.count }, (_, index) => ({
    image: `${publicBasePath}/ai-visual/${theme.slug}/${String(index + 1).padStart(2, "0")}.webp`,
    alt: `${theme.title}作品 ${String(index + 1).padStart(2, "0")}`,
  }));

const themeDefinitions: AiVisualTheme[] = [
  { slug: "posters", title: "海报设计", en: "POSTER DESIGN", count: 10, mode: "carousel", cardWidth: 310, cardHeight: 550, spread: 60, tiltDirection: "right", positioning: "生成式视觉海报与主题概念表达", role: "创意构思、画面生成与版式设计", tools: "Midjourney / Photoshop" },
  { slug: "banners", title: "Banner 设计", en: "BANNER DESIGN", count: 11, mode: "banner", cardWidth: 0, cardHeight: 0, spread: 0, tiltDirection: "left", positioning: "品牌传播与活动场景横幅视觉", role: "视觉概念、图像生成与信息编排", tools: "AIGC / Photoshop" },
  { slug: "ip-vi", title: "IP 与 VI 延展", en: "IP & VISUAL IDENTITY", count: 18, mode: "carousel", cardWidth: 470, cardHeight: 264, spread: 36, tiltDirection: "left", positioning: "角色设定与系列化视觉资产延展", role: "IP 概念、角色生成与视觉体系", tools: "AIGC / Photoshop / Figma", groups: ipViGroups },
  { slug: "app-splash", title: "APP 启动页设计", en: "APP SPLASH DESIGN", count: 6, mode: "carousel", cardWidth: 258, cardHeight: 550, spread: 50, tiltDirection: "right", positioning: "面向移动产品的首屏视觉实验", role: "画面生成、构图与界面适配", tools: "AIGC / Photoshop / Figma" },
  { slug: "typography", title: "字体设计", en: "TYPOGRAPHY DESIGN", count: 11, mode: "carousel", cardWidth: 430, cardHeight: 430, spread: 40, tiltDirection: "left", positioning: "以字形为核心的风格化视觉表达", role: "字形方向、图像生成与视觉整合", tools: "AIGC / Photoshop" },
  { slug: "illustrations", title: "插画设计", en: "ILLUSTRATION DESIGN", count: 17, mode: "carousel", cardWidth: 310, cardHeight: 550, spread: 60, tiltDirection: "right", positioning: "多风格人物与叙事插画探索", role: "风格设定、Prompt 设计与成图优化", tools: "Midjourney / Stable Diffusion / Photoshop" },
];

export type AiVisualThemeWithImages = AiVisualTheme & {
  images: AiVisualImage[];
  previewImages: AiVisualImage[];
};

export const aiVisualThemes: AiVisualThemeWithImages[] = themeDefinitions.map(
  (theme) => {
    const images = theme.groups?.flatMap((group) => group.images) ?? createImages(theme);
    return {
      ...theme,
      images,
      previewImages: theme.groups?.map((group) => group.images[0]) ?? images,
    };
  },
);
export const getAiVisualTheme = (slug: string) =>
  aiVisualThemes.find((theme) => theme.slug === slug);
