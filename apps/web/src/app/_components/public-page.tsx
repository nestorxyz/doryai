import Link from 'next/link';
import type { ReactNode } from 'react';
import { NavigationHeader } from './sections/navigation';
import { Footer } from './sections/footer';
import { publicPages, type PublicPath } from '@/lib/public-content';
import { breadcrumbSchema, serializeJsonLd } from '@/lib/public-seo';

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function Breadcrumbs({ path }: { path: Exclude<PublicPath, '/'> }) {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-sm text-gray-600 not-prose"
      >
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="underline underline-offset-4">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{publicPages[path].label}</li>
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(path)} />
    </>
  );
}

export function PublicPage({
  path,
  title,
  children,
}: {
  path: '/about' | '/how-it-works';
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white text-black">
      <NavigationHeader />
      <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        <Breadcrumbs path={path} />
        <h1 className="mb-8 text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <div className="space-y-12 text-lg leading-relaxed text-gray-700 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
