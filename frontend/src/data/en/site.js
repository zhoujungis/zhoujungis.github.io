/**
 * en/site.js — English site chrome: navigation labels, home copy, topic blurbs.
 *
 * The English side is a full mirror of the Chinese site's structure (home,
 * articles, topics), so its labels and blurbs live here rather than being
 * scattered through templates. Topic text is a translation of data/topics.js —
 * slugs match, so /en/topics/<slug>/ pairs with /topics/<slug>/.
 */
import { TOPICS } from '../topics.js'

export const EN_UI = {
  brand: 'Stack Frame',
  tagline: 'Code & Life · Journal',
  nav: {
    home: 'Home',
    articles: 'Articles',
    topics: 'Topics',
    about: 'About',
    rss: 'RSS',
    zh: '中文',
  },
  footer: {
    built: 'Built with Vue 3 on GitHub Pages; content served by Django.',
    rights: '© Stack Frame',
  },
  home: {
    kicker: 'CODE & LIFE · JOURNAL',
    title: 'Code & Life',
    sub: 'Writing, code, and the everyday.',
    lede: [
      'The world of code is black and white; the canvas of life is mottled and colourful.',
      'I like to push a project forward in the gaps between logic and syntax, letting cold characters come alive in compilation until they grow bones and a soul. I also like to dredge the small, poetic moments out of ordinary days — pinning the fleeting ones into the warmth of a coffee cup and the folds of an evening sky.',
      'The world is large and the tides come and go. This is where I keep what I have made and what has moved me. No grand narrative here — just lines of code growing, and the traces of an ordinary person living deliberately.',
    ],
    topicsTitle: 'Topics',
    postsTitle: 'Latest posts',
    postsNote: 'English editions of selected posts.',
    emptyNote:
      'English editions are being added one by one. The full archive is in Chinese.',
    more: 'Chinese edition',
  },
  topics: {
    title: 'Topics',
    lead:
      'Editorially curated clusters. Each topic collects the posts that belong together, in reading order.',
    count: (n) => `${n} post${n === 1 ? '' : 's'}`,
    empty: 'No English edition in this topic yet.',
  },
  articles: {
    title: 'Articles',
    lead: 'Every post that has an English edition.',
  },
}

/**
 * English blurbs for the five topics. `slug` matches data/topics.js so the two
 * language editions of a topic share one URL segment.
 */
export const EN_TOPICS = [
  {
    slug: 'leetcode',
    name: 'Algorithms',
    tagline: 'From brute force to the optimal solution, with the reasoning in between',
    intro:
      'Algorithm write-ups organised by pattern: greedy, dynamic programming, graphs and union-find, sliding windows, linked lists and binary trees, heaps and binary search. Every post starts from the brute-force solution, walks step by step to the best time and space bounds, and ends with runnable code and a complexity analysis.',
  },
  {
    slug: 'aiagent',
    name: 'AI Agent',
    tagline: 'Multi-agent systems, prompt-injection defence, context engineering',
    intro:
      'What it actually takes to put a language model into production: how multi-agent systems split responsibility, how sub-agents talk to each other, how task boards and rate gates prevent cascading failures, and where the trust boundary sits when text from a web page tries to become an instruction.',
  },
  {
    slug: 'backend',
    name: 'Backend',
    tagline: 'Django, concurrency, rate limiting, canary releases',
    intro:
      'The full chain from interface design to production operations: Django and DRF practice, rate limiting and circuit breaking, idempotency, caching and message queues, plus the domain, TLS, CDN and host choices that come up when a service actually ships.',
  },
  {
    slug: 'database',
    name: 'Database Internals',
    tagline: 'B+ trees, WAL, MVCC and the details inside a storage engine',
    intro:
      'This topic cares about one thing: how bytes actually get written down and read back. Page splits and back-to-root writes in a B+ tree, the write-ahead ordering of a WAL, the version chain behind MVCC, and the trade-offs between LSM and B-trees — all taken down to specific pages and fields.',
  },
  {
    slug: 'projects',
    name: 'Projects',
    tagline: 'Built from scratch: desktop tools, data pipelines, local agents',
    intro:
      'Complete teardowns of open-source projects: a browser with an in-process CDP implementation, a zero-runtime Rust agent, a 13 MB Windows SSH client, a single-file Markdown reader, a local-first personal assistant, and a 30k-row interview-experience pipeline. The point is never "what I built" but which trade-offs were made and what broke along the way.',
  },
]

export const EN_TOPIC_BY_SLUG = new Map(EN_TOPICS.map((t) => [t.slug, t]))

/** Chinese topics without an English blurb fall back to the Chinese text. */
export function enTopic(slug) {
  return EN_TOPIC_BY_SLUG.get(slug) || TOPICS.find((t) => t.slug === slug) || null
}

/** Path helpers for the English edition (trailing slash, like the zh side). */
export const enPath = {
  home: '/en/',
  articles: '/en/articles/',
  topics: '/en/topics/',
  topic: (slug) => `/en/topics/${slug}/`,
  article: (slug) => `/en/article/${slug}/`,
}
