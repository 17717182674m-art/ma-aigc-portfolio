export type PortfolioItem={slug:string;title:string;en:string;intro:string;color:string;labels:string[];href?:string;cover?:string};
export const portfolioItems:PortfolioItem[]=[
{slug:"ai-visual-design",title:"AI视觉设计",en:"AI VISUAL DESIGN",intro:"以生成式创作为核心，连接品牌视觉、海报、IP 与动态内容。",color:"#ff795f",labels:["品牌视觉 KV","AIGC 创意海报","IP 视觉体系","动态图像设计"],cover:"/ai-visual/ai-visual-entry-cover.webp"},
{slug:"ai-series",title:"AI剧集",en:"AI SERIES",intro:"覆盖世界观、角色、分镜、图像生成与视频剪辑的 AI 剧集工作流。",color:"#aa82ff",labels:["世界观设定","角色资产生成","分镜与镜头设计","视频制作与剪辑"],cover:"/ai-series/ai-series-entry-cover.webp"},
{slug:"app-design-website",title:"一笔 · APP设计官网",en:"APP & WEB DESIGN",intro:"为个人记账 APP「一笔」打造的产品体验与品牌官网。",color:"#ff8b68",labels:["产品体验策略","移动端界面设计","品牌官网视觉","交互动效系统"],href:"https://yibi-life-ledger.fey-star-4750.chatgpt.site",cover:"/yibi-cover.webp"}];
export const getPortfolio=(slug:string)=>portfolioItems.find(item=>item.slug===slug);
