import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { crawlerRules } from '@/lib/public-seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlerRules(siteConfig.indexable),
    sitemap: new URL('/sitemap.xml', siteConfig.url).href,
  };
}
