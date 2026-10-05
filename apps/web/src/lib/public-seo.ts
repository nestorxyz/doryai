import type { Metadata, MetadataRoute } from 'next';
import {
  builderUrl,
  productFaqs,
  publicPages,
  sourceUrl,
  type PublicPath,
} from './public-content';
import { siteConfig } from './site-config';

export function publicMetadata(path: PublicPath): Metadata {
  const { title, description } = publicPages[path];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'DoryAI',
      title,
      description,
      url: path,
      images: [
        {
          url: '/product.png',
          width: 3014,
          height: 1572,
          alt: 'DoryAI saved-link library and chat',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/product.png'],
    },
  };
}

export function publicSitemap(origin: URL): MetadataRoute.Sitemap {
  return (Object.keys(publicPages) as PublicPath[]).map((path) => ({
    url: new URL(path, origin).href,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/how-it-works' ? 0.8 : 0.3,
  }));
}

export function crawlerRules(
  indexable: boolean,
): MetadataRoute.Robots['rules'] {
  return indexable
    ? {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth',
          '/dashboard',
          '/sign-in',
          '/billing',
          '/share',
          '/api/',
        ],
      }
    : { userAgent: '*', disallow: '/' };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productFaqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function breadcrumbSchema(path: Exclude<PublicPath, '/'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: new URL('/', siteConfig.url).href,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: publicPages[path].label,
        item: new URL(path, siteConfig.url).href,
      },
    ],
  };
}

export function productSchema() {
  const url = new URL('/', siteConfig.url).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        name: 'DoryAI',
        url,
        description: publicPages['/'].description,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'DoryAI',
        url,
        description: publicPages['/'].description,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        license: 'https://www.gnu.org/licenses/agpl-3.0.html',
        creator: { '@id': `${url}about#builder` },
      },
      {
        '@type': 'Person',
        '@id': `${url}about#builder`,
        name: 'Nestor Mamani',
        url: `${url}about`,
        sameAs: [builderUrl],
      },
    ],
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function llmsText(origin: URL): string {
  return [
    '# DoryAI',
    '',
    `> ${productFaqs[0].answer}`,
    '',
    'DoryAI saves content for a personal link library. Capture coverage varies by source. A partial preview is not the full post or video. The public pages below describe the product; private user libraries are not public documentation.',
    '',
    '## Product',
    ...(['/', '/how-it-works', '/about'] as const).map(
      (path) =>
        `- [${publicPages[path].label}](${new URL(path, origin).href}): ${publicPages[path].description}`,
    ),
    `- [Source code](${sourceUrl}): Web app and API, AGPL-3.0-only.`,
    '',
    '## Policies',
    ...(['/privacy', '/security', '/terms'] as const).map(
      (path) =>
        `- [${publicPages[path].label}](${new URL(path, origin).href}): ${publicPages[path].description}`,
    ),
    '',
    '## Common questions',
    ...productFaqs.flatMap(({ question, answer }) => [
      '',
      `### ${question}`,
      answer,
    ]),
    '',
  ].join('\n');
}
