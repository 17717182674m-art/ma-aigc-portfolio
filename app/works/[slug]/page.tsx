import { notFound, redirect } from "next/navigation";
import { getPortfolio, portfolioItems } from "../../portfolioData";
import { WorkPage } from "../../WorkPage";
import { AiVisualDesignPage } from "../../AiVisualDesignPage";
import { AiSeriesPage } from "../../AiSeriesPage";
export function generateStaticParams(){return portfolioItems.map(({slug})=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=getPortfolio(slug);if(!item)notFound();if(item.href)redirect(item.href);if(slug==="ai-visual-design")return <AiVisualDesignPage item={item}/>;if(slug==="ai-series")return <AiSeriesPage item={item}/>;return <WorkPage item={item}/>}
