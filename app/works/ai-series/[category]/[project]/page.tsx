import { notFound } from "next/navigation";
import { AiSeriesProjectPage } from "../../../../AiSeriesArchivePages";
import { aiSeriesCategories, getAiSeriesProject } from "../../../../aiSeriesData";

export function generateStaticParams() {
  return aiSeriesCategories.flatMap((category) => category.projects.map((project) => ({ category: category.slug, project: project.slug })));
}

export default async function Page({ params }: { params: Promise<{ category: string; project: string }> }) {
  const { category, project } = await params;
  const result = getAiSeriesProject(category, project);
  if (!result) notFound();
  return <AiSeriesProjectPage category={result.category} project={result.project} />;
}
