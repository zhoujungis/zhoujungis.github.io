/**
 * en/site.js — English site chrome: navigation labels, home copy, topic blurbs.
 *
 * The English side is a full mirror of the Chinese site's structure (home,
 * articles, topics), so its labels and blurbs live here rather than being
 * scattered through templates. Topic text is a translation of data/topics.js —
 * slugs match, so /en/topics/<slug>/ pairs with /topics/<slug>/.
 */
import { TOPICS } from '../topics.js'
import { CONTACT_EMAIL } from '../../utils/siteConfig.js'

/**
 * Contact channels. Shared with the Chinese site (same address, same account),
 * so the English edition never drifts into a second inbox nobody reads.
 */
export const EN_CONTACT = {
  email: CONTACT_EMAIL,
  github: 'https://github.com/zhoujungis',
  repos: 'https://github.com/zhoujungis?tab=repositories',
  rss: '/rss.xml',
}

/** Homepage sections the Chinese home carries and the English one was missing. */
export const EN_HOME = {
  summaryTitle: 'What this site covers',
  summary: [
    'Stack Frame is a personal engineering blog by ZhouJun. Five threads run through it: algorithms and data structures, Django and backend architecture, database internals (B+ trees, WAL, MVCC), AI agent engineering, and open-source projects built from scratch.',
    'Most posts come from work actually done and bugs actually hit. Each one tries to state the context, the trade-off and the conclusion instead of restating documentation. Start from a topic below, or open the full post list.',
  ],
  projectsTitle: 'Projects',
  projectsNote: 'Every project below is open source, and each one has a full teardown on this site.',
  contactTitle: 'Contact',
  contactNote: 'Corrections, questions about an article, or anything else worth a conversation:',
  latestNote: (shown, total) =>
    total > shown
      ? `Showing the newest ${shown} of ${total} English posts.`
      : `All ${total} English posts.`,
}


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
      'Code is black and white. Life is not.',
      'Most of my working hours go into projects: reading the source, arguing with the compiler, deleting the abstraction I was proud of last month. The rest go into the ordinary things — a cup going cold, the light at seven in the evening, a walk with no destination.',
      'This is where I keep both. No grand narrative, just lines of code growing and notes from an ordinary life.',
    ],
    topicsTitle: 'Topics',
    postsTitle: 'Latest',
    postsNote: 'English editions, written for this audience rather than machine-translated.',
    emptyNote:
      'English editions are being added one at a time. The full archive is in Chinese.',
    more: 'Chinese edition',
  },
  topics: {
    title: 'Topics',
    lead:
      'Five curated clusters. Each one groups posts that belong together and puts them in a sensible reading order.',
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
      'Write-ups organized by pattern: greedy, dynamic programming, graphs and union-find, sliding windows, linked lists, trees, heaps and binary search. Each one starts from the brute-force solution, works step by step to the best time and space bounds, and ends with runnable code and a complexity analysis.',
  },
  {
    slug: 'aiagent',
    name: 'AI Agent',
    tagline: 'Multi-agent systems, prompt-injection defense, context engineering',
    intro:
      'What it actually takes to put a language model into production. How multi-agent setups divide responsibility, how sub-agents talk to each other, how task boards and rate gates stop cascading failures, and where the trust boundary sits when text from a web page tries to become an instruction.',
  },
  {
    slug: 'backend',
    name: 'Backend',
    tagline: 'Django, concurrency, rate limiting, canary releases',
    intro:
      'The whole chain, from interface design to running the thing: Django and DRF practice, rate limiting, circuit breakers, idempotency, caching and queues — plus the domain, TLS, CDN and hosting decisions that only show up once a service ships.',
  },
  {
    slug: 'database',
    name: 'Database Internals',
    tagline: 'B+ trees, WAL, MVCC and the details inside a storage engine',
    intro:
      'One question: how do bytes actually get written down, and how do they come back? B+ tree page splits and back-to-root writes, the write-ahead ordering of a WAL, the version chain behind MVCC, and the LSM-versus-B-tree trade-off — taken down to specific pages and fields.',
  },
  {
    slug: 'projects',
    name: 'Projects',
    tagline: 'Built from scratch: desktop tools, data pipelines, local agents',
    intro:
      'Full teardowns of the open-source projects behind this site: a browser with an in-process CDP implementation, a zero-runtime Rust agent, a 13 MB Windows SSH client, a single-file Markdown reader, a local-first assistant, and a 30k-row interview pipeline. The interesting part is never what got built — it is which trade-offs were made and what broke on the way.',
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
  about: '/en/about/',
  privacy: '/en/privacy/',
  disclaimer: '/en/disclaimer/',
  topic: (slug) => `/en/topics/${slug}/`,
  article: (slug) => `/en/article/${slug}/`,
}
