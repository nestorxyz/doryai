import { llmsText } from '@/lib/public-seo';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsText(siteConfig.url), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
}
