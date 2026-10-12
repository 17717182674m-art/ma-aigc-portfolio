import { notFound } from "next/navigation";
import { AiVisualThemePage } from "../../../AiVisualThemePage";
import { aiVisualThemes, getAiVisualTheme } from "../../../aiVisualData";

export function generateStaticParams() {
  return aiVisualThemes.map(({ slug }) => ({ theme: slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: themeSlug } = await params;
  const theme = getAiVisualTheme(themeSlug);
  if (!theme) notFound();
  return <AiVisualThemePage theme={theme} />;
}
