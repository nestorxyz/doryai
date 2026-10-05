import Image from 'next/image';
import Link from 'next/link';
import {
  builderUrl,
  publicPages,
  sourceUrl,
  type PublicPath,
} from '@/lib/public-content';

const footerPaths: PublicPath[] = [
  '/how-it-works',
  '/about',
  '/privacy',
  '/security',
  '/terms',
];

export const Footer = () => (
  <footer className="border-t border-gray-200 bg-white text-black">
    <div className="container mx-auto grid gap-8 px-6 py-12 md:grid-cols-2">
      <div>
        <Image
          src="/isologo-black.webp"
          alt="DoryAI"
          width={599}
          height={167}
          sizes="200px"
          className="mb-4 h-auto w-[200px]"
        />
        <p className="max-w-md leading-relaxed text-gray-600">
          Save useful links through chat, then find and revisit the content you
          saved.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Built by{' '}
          <a href={builderUrl} className="underline underline-offset-4">
            Nestor Mamani
          </a>
          .{' '}
          <a href={sourceUrl} className="underline underline-offset-4">
            Open source under AGPL-3.0-only
          </a>
          .
        </p>
      </div>
      <nav aria-label="Footer" className="md:justify-self-end">
        <ul className="space-y-3">
          {footerPaths.map((path) => (
            <li key={path}>
              <Link
                href={path}
                className="text-gray-600 underline-offset-4 hover:underline"
              >
                {publicPages[path].label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:nmamanipantoja@gmail.com"
              className="text-gray-600 underline-offset-4 hover:underline"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);
