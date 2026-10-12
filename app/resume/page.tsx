import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "../WorkPage";

export const metadata: Metadata = {
  title: "个人简历 — 马仲钰",
  description: "马仲钰的个人简介、专业能力、创作方向与联系方式。",
};

const capabilities = [
  ["01", "生成式视觉", "从创意概念、Prompt 设计到成图优化，建立稳定而有辨识度的视觉表达。"],
  ["02", "品牌与版式", "覆盖品牌视觉、海报、Banner、IP 视觉体系与字体实验。"],
  ["03", "AI 动态影像", "参与世界观、角色、分镜、图像生成与视频剪辑的完整创作流程。"],
];

const tools = ["Midjourney", "Stable Diffusion", "Photoshop", "AI Video Workflow"];

const experience = [
  {
    period: "2025.06 — 2026.10",
    company: "星迹互动科技有限公司",
    role: "AIGC 内容制作",
    location: "北京市朝阳区",
    duties: [
      "主导 AIGC 视觉项目的创意策划与执行，涵盖海报、KV、短视频等多种形式。",
      "负责 IP 形象设计与品牌视觉体系搭建，推动创意落地与视觉风格统一。",
      "负责 AI 漫剧项目的分镜设计、图像生成、视频制作与剪辑，把控整体叙事节奏与视觉风格。",
      "负责 TVC 视觉创意与全流程把控，输出品牌广告片视觉方案与动态图像设计。",
    ],
  },
  {
    period: "2023.11 — 2025.05",
    company: "北京像素绽放科技有限公司",
    role: "内容视觉设计",
    location: "北京市朝阳区",
    duties: [
      "负责 AiPPT 及爱设计产品视觉内容制作，包括 PPT 模板、KV、运营视觉及图表视觉设计。",
      "参与 AIGC 图片生成与设计流程探索。",
      "配合产品及运营完成 AI 办公产品的视觉内容生产。",
    ],
  },
];

export default function ResumePage() {
  return (
    <main className="resume-page route-enter">
      <SiteHeader backHref="/" backLabel="返回首页" />
      <section className="resume-hero">
        <div className="resume-kicker">RESUME / 2026</div>
        <div className="resume-title-row">
          <div>
            <h1>马仲钰</h1>
            <p>AIGC 视觉设计师</p>
          </div>
          <p className="resume-intro">专注生成式视觉、品牌叙事与 AI 影像工作流，把创意概念转化为具有一致性与完成度的视觉作品。</p>
        </div>
      </section>

      <section className="resume-profile" aria-label="个人简介">
        <figure className="resume-portrait">
          <img src="/ma-zhongyu-profile.webp" alt="马仲钰个人照片" />
          <figcaption>MA ZHONGYU / AIGC VISUAL DESIGNER</figcaption>
        </figure>
        <div className="resume-summary">
          <span>PROFILE</span>
          <h2>以生成式创作为核心，连接视觉设计与动态叙事。</h2>
          <p>工作范围涵盖品牌视觉、创意海报、IP 视觉体系、叙事插画与 AI 影像。重视概念、画面语言和最终呈现之间的统一，让技术服务于清晰的创作判断。</p>
          <dl>
            <div><dt>方向</dt><dd>AI 视觉设计 / AI 影像 / 品牌视觉</dd></div>
            <div><dt>角色</dt><dd>创意构思 / 视觉设计 / Prompt 设计 / 成图优化</dd></div>
            <div><dt>工具</dt><dd>{tools.join(" / ")}</dd></div>
          </dl>
        </div>
      </section>

      <section className="resume-experience" aria-labelledby="resume-experience-title">
        <div className="resume-section-head">
          <span>EXPERIENCE</span>
          <h2 id="resume-experience-title">工作经历</h2>
        </div>
        <div className="resume-experience-list">
          {experience.map((item, index) => (
            <article key={item.company}>
              <div className="resume-experience-meta">
                <i>{String(index + 1).padStart(2, "0")}</i>
                <time>{item.period}</time>
                <small>{item.location}</small>
              </div>
              <div className="resume-experience-copy">
                <h3>{item.company}</h3>
                <h4>{item.role}</h4>
                <ul>
                  {item.duties.map((duty) => <li key={duty}>{duty}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-capabilities" aria-labelledby="resume-capability-title">
        <div className="resume-section-head">
          <span>CAPABILITIES</span>
          <h2 id="resume-capability-title">专业能力</h2>
        </div>
        <div className="resume-capability-list">
          {capabilities.map(([number, title, detail]) => (
            <article key={number}>
              <i>{number}</i>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-contact">
        <span>CONTACT</span>
        <h2>一起完成下一个想法。</h2>
        <Link href="/contact">查看联系方式 <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
