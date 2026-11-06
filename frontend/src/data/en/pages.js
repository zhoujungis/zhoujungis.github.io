/**
 * en/pages.js — English editions of the About / Privacy / Disclaimer pages.
 *
 * Same shape as data/sitePages.js: `sections` of headings, paragraphs and
 * optional link items. The Chinese pages remain the authoritative legal text;
 * these are a faithful translation so the English mirror does not fall back to
 * Chinese chrome. Contact address is shared with the Chinese side.
 */
import { CONTACT_EMAIL, SITE_AUTHOR, SITE_NAME, SITE_ORIGIN } from '../../utils/siteConfig.js'

const UPDATED = '2026-11-06'

export const EN_PAGES = [
  {
    key: 'about',
    path: '/en/about/',
    title: 'About',
    subtitle: 'A personal technical blog, and the trade-offs behind it.',
    description: `${SITE_NAME} is a personal technical blog by ${SITE_AUTHOR} — engineering notes, AI, and the occasional everyday record.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'What this is',
        paragraphs: [
          `${SITE_NAME} (${SITE_ORIGIN}) is ${SITE_AUTHOR}'s personal blog. It is mostly about programming and engineering: algorithms and data structures, backend and frontend work, performance, AI applications, and now and then reading or life notes. Nothing here is scraped or aggregated — articles come from projects actually built, bugs actually hit, and source actually read.`,
          'The site is deliberately lightweight: no accounts for reading, no tracking, and every article is available as static HTML with JavaScript disabled.',
        ],
      },
      {
        heading: 'How it is built',
        paragraphs: [
          'The frontend is a Vue 3 single-page app served from GitHub Pages. Articles, comments and the newsletter are served by a Django backend on PythonAnywhere. The build pre-renders every article and section page into static HTML so search engines and non-JavaScript crawlers can read the full text.',
          'Algorithm visualisations in articles are loaded on demand: only the ones an article actually contains are fetched, so they never slow down any other page.',
        ],
      },
      {
        heading: 'English edition',
        paragraphs: [
          'Selected posts are rewritten for an English audience rather than machine-translated; the full archive stays in Chinese. Both editions declare each other with hreflang so they are treated as translations, not duplicates.',
        ],
      },
      {
        heading: 'Content and copyright',
        paragraphs: [
          'Unless stated otherwise, articles are original work and the copyright belongs to the author. Reposting is welcome with attribution and a link back to the original; commercial use without permission is not. See the disclaimer for details.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about an article, corrections, or anything else worth a conversation:',
        ],
        items: [
          { text: `Email: ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
          { text: 'GitHub: github.com/zhoujungis', href: 'https://github.com/zhoujungis' },
          { text: `RSS: ${SITE_ORIGIN}/rss.xml`, href: `${SITE_ORIGIN}/rss.xml` },
        ],
      },
    ],
  },
  {
    key: 'privacy',
    path: '/en/privacy/',
    title: 'Privacy Policy',
    subtitle: 'What this site collects, why, and how you can control it.',
    description: `Privacy policy for ${SITE_NAME} — what is collected, how cookies and third-party services (Google AdSense, Google Analytics) are used, and your rights.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'Scope',
        paragraphs: [
          `This policy covers ${SITE_NAME} (${SITE_ORIGIN}) and all of its sections. It explains how visitor information is collected, used and protected. Continuing to use the site means you are aware of this policy.`,
        ],
      },
      {
        heading: 'What is collected',
        paragraphs: [
          'Reading requires no account and no personal information. Information is submitted only when you actively use an interactive feature:',
        ],
        items: [
          { text: 'Comments: the nickname, email, content and timestamp you submit. The nickname is shown publicly; the email is used only for identification and replies.' },
          { text: 'Newsletter: the email address you provide, used solely to send new-post notifications and cancellable at any time from those emails.' },
          { text: 'Server logs: GitHub Pages and PythonAnywhere record routine access logs, which may include IP address, browser identifier and request time, used for troubleshooting and abuse prevention.' },
        ],
      },
      {
        heading: 'Cookies and local storage',
        paragraphs: [
          'The site itself sets no tracking cookies. To speed up loading, browser local storage caches the article list and interface preferences such as the light/dark theme. That data stays on your device and is never uploaded.',
          'A service worker caches static assets for offline or slow-network reading. It does not involve personal information.',
        ],
      },
      {
        heading: 'Third-party services and advertising cookies',
        paragraphs: [
          'The site may use the following third-party services, each of which may set cookies or read device information in your browser:',
        ],
        items: [
          { text: 'Google AdSense: used to display ads. Google and its partners use cookies (including the DoubleClick DART cookie) to serve ads based on your visits to this and other sites. You can manage personalised advertising in Google Ad Settings, or learn about opting out at aboutads.info.', href: 'https://www.google.com/settings/ads' },
          { text: 'How Google uses information: Google explains how data is collected and used on partner sites, including this one.', href: 'https://policies.google.com/technologies/partner-sites' },
          { text: 'Google Analytics: used for page-view statistics such as views, referral source and device type. It sets analytics cookies; results are aggregated and never tied to an individual.' },
          { text: 'Content delivery and images: pages load formula-rendering scripts from jsdelivr and images from Unsplash. Those requests expose your IP address and browser identifier to those providers.' },
        ],
      },
      {
        heading: 'Why it is used',
        paragraphs: [
          'Collected information is used only to display and reply to comments, send updates you subscribed to, prevent spam and abuse, measure site traffic, and display ads that cover running costs. Personal information is never sold or rented.',
        ],
      },
      {
        heading: 'Sharing and disclosure',
        paragraphs: [
          'Apart from the third-party services above processing data under their own policies, information is disclosed only when required by law or by a legally valid request from a competent authority.',
        ],
      },
      {
        heading: 'Retention and security',
        paragraphs: [
          'Comments and newsletter addresses are kept until you ask for deletion or the feature is retired. Data is protected with HTTPS, minimal collection and access control — but no internet transmission or storage can be guaranteed absolutely secure.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can request access to, correction of, or deletion of your comments and subscription at any time, and ask us to stop processing them. If you are in the EEA, the UK or California, your rights under GDPR or CCPA apply as well.',
        ],
      },
      {
        heading: "Children's privacy",
        paragraphs: [
          'The site is written for readers capable of independent judgement. It is not designed for children and does not knowingly collect their information; guardians can contact us for deletion.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'This policy may change as features change (for example, when advertising or analytics are enabled). Updated versions are published on this page with a new date at the top.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [`Questions about this policy: ${CONTACT_EMAIL}.`],
        items: [{ text: `Email: ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` }],
      },
    ],
  },
  {
    key: 'disclaimer',
    path: '/en/disclaimer/',
    title: 'Disclaimer',
    subtitle: 'Accuracy, code samples, advertising and copyright.',
    description: `Disclaimer for ${SITE_NAME} — accuracy of content, risk in using sample code, advertising and external links, copyright and reposting rules.`,
    updated: UPDATED,
    sections: [
      {
        heading: 'For reference only',
        paragraphs: [
          'Everything here is a record of the author\'s understanding at the time of writing and may become outdated as technology or practice moves on. No guarantee of completeness or accuracy is made, and nothing constitutes professional advice — legal, financial, medical or security. Decisions made from this content are your own responsibility.',
        ],
      },
      {
        heading: 'Sample code',
        paragraphs: [
          'Code in articles is provided "as is", to illustrate an idea, and is not verified for production use. Evaluate, test and harden it before using it in a real system; no liability is accepted for losses arising from its use.',
        ],
      },
      {
        heading: 'External links',
        paragraphs: [
          'The site links to third-party destinations whose content, availability and privacy practices are outside our control. A link is not an endorsement, and visiting is at your own risk.',
        ],
      },
      {
        heading: 'Advertising',
        paragraphs: [
          'Advertisements may be served through Google AdSense to cover hosting and domain costs. Ad content is chosen by the platform, not by this site, and does not represent a recommendation. Any purchase through an ad is a transaction between you and the advertiser.',
        ],
      },
      {
        heading: 'Comments',
        paragraphs: [
          'Comments are published by readers and represent their own views. Spam, advertising, illegal or inappropriate content may be removed without notice, and accounts may be restricted.',
        ],
      },
      {
        heading: 'Copyright and reposting',
        paragraphs: [
          'Unless stated otherwise, original articles are copyrighted by the author. Quoting or reposting is welcome with attribution, source and a link to the original; unauthorised commercial use, whole-site mirroring and rewriting are not. If you believe content here infringes your rights, contact the address below and it will be reviewed promptly.',
        ],
      },
      {
        heading: 'Views',
        paragraphs: [
          'All views are the author\'s own and do not represent any organisation the author works or has worked for.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [`Questions about this disclaimer: ${CONTACT_EMAIL}.`],
        items: [{ text: `Email: ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` }],
      },
    ],
  },
]

export const EN_PAGE_BY_KEY = new Map(EN_PAGES.map((p) => [p.key, p]))
