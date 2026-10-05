export const publicPages = {
  '/': {
    label: 'Home',
    title: 'DoryAI — AI bookmark manager for saved links',
    description:
      'Save webpages, videos, and social links in DoryAI. Organize your bookmarks with AI and find saved content later by asking in your own words.',
  },
  '/how-it-works': {
    label: 'How it works',
    title: 'How DoryAI saves and finds your links',
    description:
      'Learn how to save a link, understand what DoryAI captured, and ask questions about your saved webpages, YouTube videos, and social posts.',
  },
  '/about': {
    label: 'About',
    title: 'About DoryAI and its builder, Nestor Mamani',
    description:
      'DoryAI is an open-source AI bookmark manager built by Nestor Mamani. Explore its source code, product approach, and content-capture limitations.',
  },
  '/privacy': {
    label: 'Privacy',
    title: 'Privacy Policy • DoryAI',
    description:
      'What data the current DoryAI product processes and the controls available to users.',
  },
  '/security': {
    label: 'Security',
    title: 'Security • DoryAI',
    description:
      'The current security boundaries and known limitations of the DoryAI link assistant.',
  },
  '/terms': {
    label: 'Terms',
    title: 'Terms of Service • DoryAI',
    description:
      'DoryAI Terms of Service — the legal terms governing your use of our AI-powered link assistant.',
  },
} as const;

export type PublicPath = keyof typeof publicPages;
export const sourceUrl = 'https://github.com/nestorxyz/doryai';
export const builderUrl = 'https://github.com/nestorxyz';

export const productFaqs = [
  {
    question: 'What is DoryAI?',
    answer:
      'DoryAI is an AI bookmark manager. You save links through chat, keep them in a personal library, and ask questions to find and explain the content you saved.',
  },
  {
    question: 'Which links can I save?',
    answer:
      'You can save webpages, YouTube videos and Shorts, and social links. Capture depends on the source: YouTube can include a transcript, while social sites may provide only public text or a partial preview. Private, blocked, or unavailable content may not be readable.',
  },
  {
    question: 'Does DoryAI read the full content of every link?',
    answer:
      'No. Some sources expose only metadata or a partial preview. DoryAI distinguishes that from fuller captured content. Saving a social post does not mean its video, images, thread, or quoted posts were analyzed.',
  },
  {
    question: 'How do I find something I saved?',
    answer:
      'Ask about the topic, title, or details you remember. You can also select a saved link and ask about that specific item. Answers use the content DoryAI could save; missing content cannot be recovered from a title alone.',
  },
  {
    question: 'Can I try DoryAI for free?',
    answer:
      'Yes. The free plan lets you save up to 20 links. You can review paid-plan pricing and checkout terms on the homepage before choosing an upgrade.',
  },
  {
    question: 'Is DoryAI open source?',
    answer:
      'Yes. The web app and API are in the public nestorxyz/doryai repository under AGPL-3.0-only. The source code is public; your saved library is not a public collection.',
  },
] as const;
