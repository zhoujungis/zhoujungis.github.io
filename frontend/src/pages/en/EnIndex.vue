<template>
  <EnShell>
    <section class="hero">
      <p class="hero__kicker">{{ ui.home.kicker }}</p>
      <h1>{{ ui.home.title }}</h1>
      <p class="hero__sub">{{ ui.home.sub }}</p>
      <div class="hero__lede">
        <p v-for="(text, i) in ui.home.lede" :key="i" :class="{ 'hero__lead': i === 0 }">
          {{ text }}
        </p>
      </div>
      <p class="hero__meta">
        {{ EN_ARTICLES.length }} English post(s) · the full archive is in Chinese
      </p>
    </section>

    <section class="block">
      <header class="block__head">
        <h2>{{ home.summaryTitle }}</h2>
      </header>
      <div class="summary">
        <p v-for="(text, i) in home.summary" :key="i">{{ text }}</p>
      </div>
    </section>

    <section class="block">
      <header class="block__head">
        <h2>{{ ui.home.topicsTitle }}</h2>
        <a :href="path.topics">All topics →</a>
      </header>
      <div class="topics">
        <a v-for="(topic, i) in topics" :key="topic.slug" :href="path.topic(topic.slug)" class="topic">
          <span class="topic__no">{{ String(i + 1).padStart(2, '0') }}</span>
          <strong class="topic__name">{{ topic.name }}</strong>
          <span class="topic__tagline">{{ topic.tagline }}</span>
        </a>
      </div>
    </section>

    <section class="block">
      <header class="block__head">
        <h2>{{ ui.home.postsTitle }}</h2>
        <a :href="path.articles">All posts →</a>
      </header>
      <p class="note">{{ home.latestNote(latest.length, EN_ARTICLES.length) }}</p>
      <ul class="posts">
        <li v-for="article in latest" :key="article.slug">
          <a :href="path.article(article.slug)">{{ article.title }}</a>
          <span class="posts__meta">{{ article.date }} · {{ article.readingTime }} min</span>
          <p class="posts__excerpt">{{ article.excerpt }}</p>
        </li>
      </ul>
      <p v-if="!EN_ARTICLES.length" class="empty">{{ ui.home.emptyNote }}</p>
    </section>

    <section class="block">
      <header class="block__head">
        <h2>{{ home.projectsTitle }}</h2>
        <a :href="contact.repos">All repositories →</a>
      </header>
      <p class="note">{{ home.projectsNote }}</p>
      <ul class="projects">
        <li v-for="project in projects" :key="project.name" class="project">
          <a class="project__name" :href="project.url">{{ project.name }}</a>
          <span class="project__meta">{{ project.meta }}</span>
          <p class="project__blurb">{{ project.blurb }}</p>
          <a v-if="project.post" class="project__post" :href="project.post">Read the teardown →</a>
        </li>
      </ul>
    </section>

    <section class="block">
      <header class="block__head">
        <h2>{{ home.contactTitle }}</h2>
      </header>
      <p class="note">{{ home.contactNote }}</p>
      <ul class="contact">
        <li><span class="contact__k">Email</span><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
        <li><span class="contact__k">GitHub</span><a :href="contact.github">{{ contact.github.replace('https://', '') }}</a></li>
        <li><span class="contact__k">RSS</span><a :href="contact.rss">rss.xml</a></li>
      </ul>
    </section>
  </EnShell>
</template>

<script setup>
import EnShell from '@/components/en/EnShell.vue'
import { EN_ARTICLES } from '@/data/en/articles'
import { EN_CONTACT, EN_HOME, EN_PROJECTS, EN_TOPICS, EN_UI, enPath } from '@/data/en/site'

const ui = EN_UI
const home = EN_HOME
const contact = EN_CONTACT
const projects = EN_PROJECTS
const topics = EN_TOPICS
const path = enPath
const latest = EN_ARTICLES.slice(0, 6)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.hero {
  margin-top: 36px;

  &__kicker {
    margin: 0 0 10px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.3em;
  }

  h1 {
    margin: 0;
    font-family: $serif;
    font-size: clamp(1.9rem, 4vw, 2.6rem);
    font-weight: 900;
    line-height: 1.15;
  }

  &__sub {
    margin: 8px 0 0;
    color: var(--accent-secondary);
    font-family: $serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.16em;
  }

  &__lede {
    max-width: 44em;
    margin-top: 18px;
    padding-left: 16px;
    border-left: 3px solid var(--accent-secondary);
    color: var(--text-secondary);
    font-size: 0.88rem;

    p { margin: 0; }
    p + p { margin-top: 8px; }
  }

  &__lead {
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1.02rem;
    font-weight: 700;
  }

  &__meta {
    margin-top: 14px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
  }
}

.block {
  margin-top: 48px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding-bottom: 8px;
    border-bottom: 3px solid var(--text-primary);

    h2 {
      margin: 0;
      font-family: $serif;
      font-size: 1.25rem;
      font-weight: 900;
    }

    a {
      color: var(--accent);
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
    }
  }
}

.topics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  border-top: 1px solid var(--glass-border);
}

.topic {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--glass-border);

  &:hover .topic__name { color: var(--accent); }

  &__no {
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
  }

  &__name {
    font-family: $serif;
    font-size: 1rem;
    font-weight: 800;
    transition: color $transition-fast;
  }

  &__tagline {
    color: var(--text-secondary);
    font-size: 0.76rem;
    line-height: 1.45;
  }
}

.posts {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding: 18px 0;
    border-top: 1px solid var(--glass-border);
  }

  a {
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1.02rem;
    font-weight: 800;
    text-decoration: none;

    &:hover { color: var(--accent); }
  }

  &__meta {
    display: block;
    margin-top: 4px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
  }

  &__excerpt {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
}

.summary {
  max-width: 46em;
  color: var(--text-secondary);
  font-size: 0.88rem;

  p { margin: 0; }
  p + p { margin-top: 10px; }
}

.note {
  margin: 12px 0 0;
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.7rem;
}

.projects {
  list-style: none;
  margin: 0;
  padding: 0;
}

.project {
  padding: 16px 0;
  border-top: 1px solid var(--glass-border);

  &__name {
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1rem;
    font-weight: 800;
    text-decoration: none;

    &:hover { color: var(--accent); }
  }

  &__meta {
    margin-left: 10px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.68rem;
  }

  &__blurb {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.6;
  }

  &__post {
    display: inline-block;
    margin-top: 6px;
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
  }
}

.contact {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  font-size: 0.85rem;

  li {
    display: flex;
    gap: 12px;
    padding: 6px 0;
    border-top: 1px solid var(--glass-border);
    align-items: baseline;
  }

  &__k {
    min-width: 64px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    word-break: break-all;

    &:hover { text-decoration: underline; }
  }
}

.empty {
  margin-top: 16px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>
