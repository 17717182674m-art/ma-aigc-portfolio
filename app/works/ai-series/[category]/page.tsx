import { notFound } from "next/navigation";
import { AiSeriesCategoryPage } from "../../../AiSeriesArchivePages";
import { aiSeriesCategories, getAiSeriesCategory } from "../../../aiSeriesData";

export function generateStaticParams() {
  return aiSeriesCategories.map((category) => ({ category: category.slug }));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getAiSeriesCategory(categorySlug);
  if (!category) notFound();
  return <AiSeriesCategoryPage category={category} />;
}
