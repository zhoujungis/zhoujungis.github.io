/**
 * Shared HTML post-processing for article bodies.
 *
 * The article title is metadata — the page template renders it as
 * `.article-title` (and the prerendered no-JS snapshot renders its own <h1>).
 * But every article's Markdown also opens with `# <title>`, which the backend
 * turns into an <h1>. Rendered as-is the page shows the title twice and ships
 * two <h1> elements to crawlers.
 *
 * Measured on /article/queueing-theory-capacity-planning/ at 1440px:
 *   h1 #1  .article-title   top=116  32px   "加到 8 台反而更慢：排队论与容量规划"
 *   h1 #2  (no class)       top=708  28.8px "加到 8 台反而更慢：排队论与容量规划"
 * i.e. the same heading again, 592px down, right below the cover image.
 *
 * The leading heading is dropped ONLY when its text equals the title, so an
 * article that legitimately opens with its own <h1> is left untouched.
 */
export function stripLeadingDuplicateTitle(html, title) {
  const src = String(html ?? '')
  const match = src.match(/^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/i)
  if (!match) return src

  // Compare on collapsed text: markdown may wrap the heading, and inline tags
  // (<em>, <code>) inside it would otherwise break a naive string compare.
  const heading = match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const wanted = String(title ?? '').replace(/\s+/g, ' ').trim()
  if (!wanted || heading !== wanted) return src

  return src.slice(match[0].length)
}
