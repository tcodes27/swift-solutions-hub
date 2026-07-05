import { createFileRoute } from "@tanstack/react-router";
import { getCategory, parseImportedArticle } from "@/data/articles";
import { sampleImportedRow } from "@/data/sample-imported-article";
import { ArticleView, ArticlePreviewBanner } from "./articles.$slug";

/**
 * Admin preview mode.
 *
 * Renders a mock imported article through the same ArticleView used on the
 * public /articles/$slug route. Lets editors verify how content imported
 * from Google Sheets / Docs / CSV / Zendesk will look before publishing.
 */
export const Route = createFileRoute("/admin-preview")({
  head: () => ({
    meta: [
      { title: "Article preview — Sprinter IT Hub Admin" },
      { name: "description", content: "Preview imported documentation before publishing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPreviewPage,
});

function AdminPreviewPage() {
  const article = parseImportedArticle(sampleImportedRow);
  const category = getCategory(article.category);
  return (
    <ArticleView
      article={article}
      category={category}
      previewBanner={
        <ArticlePreviewBanner
          sourceLabel={`${article.sourceType ?? "imported"} sample`}
        />
      }
    />
  );
}
