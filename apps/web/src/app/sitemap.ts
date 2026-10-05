import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { publicSitemap } from '@/lib/public-seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemap(siteConfig.url);
}
