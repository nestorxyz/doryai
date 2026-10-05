import { describe, expect, it } from 'vitest';
import { productFaqs, publicPages, type PublicPath } from './public-content';
import {
  breadcrumbSchema,
  crawlerRules,
  faqSchema,
  llmsText,
  productSchema,
  publicMetadata,
  publicSitemap,
  serializeJsonLd,
} from './public-seo';

describe('public discovery', () => {
  it('gives every public page unique metadata and a matching canonical', () => {
    const paths = Object.keys(publicPages) as PublicPath[];
    expect(new Set(paths.map((path) => publicMetadata(path).title)).size).toBe(
      paths.length,
    );
    expect(
      new Set(paths.map((path) => publicMetadata(path).description)).size,
    ).toBe(paths.length);
    for (const path of paths) {
      const metadata = publicMetadata(path);
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.openGraph?.title).toBe(metadata.title);
      expect(metadata.twitter?.description).toBe(metadata.description);
      expect(metadata.description.length).toBeLessThanOrEqual(170);
    }
  });

  it('lists only public routes, without inventing last-modified dates', () => {
    const sitemap = publicSitemap(new URL('https://www.doryai.xyz'));
    expect(sitemap.map((entry) => new URL(entry.url).pathname)).toEqual(
      Object.keys(publicPages),
    );
    expect(
      sitemap.every((entry) => entry.url.startsWith('https://www.doryai.xyz/')),
    ).toBe(true);
    expect(sitemap.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });

  it('allows search crawlers on public production pages and blocks private prefixes', () => {
    expect(crawlerRules(true)).toEqual({
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
    });
    expect(crawlerRules(false)).toEqual({ userAgent: '*', disallow: '/' });
  });

  it('uses the exact visible FAQ content as its structured data', () => {
    expect(
      faqSchema().mainEntity.map((item) => [
        item.name,
        item.acceptedAnswer.text,
      ]),
    ).toEqual(productFaqs.map((item) => [item.question, item.answer]));
  });

  it('describes real breadcrumbs and product identity without fake reviews or offers', () => {
    expect(
      breadcrumbSchema('/about').itemListElement.map((item) => item.name),
    ).toEqual(['Home', 'About']);
    const schema = JSON.stringify(productSchema());
    expect(schema).toContain('Nestor Mamani');
    expect(schema).not.toContain('aggregateRating');
    expect(schema).not.toContain('offers');
  });

  it('escapes script delimiters while preserving JSON data', () => {
    const payload = { description: '</script><script>alert(1)</script>' };
    const encoded = serializeJsonLd(payload);
    expect(encoded).not.toContain('<');
    expect(JSON.parse(encoded)).toEqual(payload);
  });

  it('provides an optional text index of public information, not private app routes', () => {
    const text = llmsText(new URL('https://www.doryai.xyz'));
    for (const path of Object.keys(publicPages))
      expect(text).toContain(new URL(path, 'https://www.doryai.xyz').href);
    for (const privatePath of ['/dashboard', '/auth', '/billing'])
      expect(text).not.toContain(privatePath);
    expect(text).toContain('partial preview');
  });
});
