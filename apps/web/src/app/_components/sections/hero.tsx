import Image from 'next/image';
import Link from 'next/link';

export const HeroSection = () => (
  <section className="bg-gradient-to-b from-gray-100 to-gray-50 px-6 py-16 md:py-20">
    <div className="container mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-600">
          AI bookmark manager
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
          Save a link.
          <br />
          Find it when you need it.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-600">
          Keep webpages, videos, and social posts in one library. DoryAI helps
          organize them, then finds saved content when you ask in your own
          words.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex rounded-md bg-black px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-800"
        >
          Save your first link
        </Link>
        <p className="mt-3 text-sm text-gray-600">
          Free plan: up to 20 saved links.
        </p>
      </div>
      <figure>
        <Image
          src="/product.png"
          alt="DoryAI dashboard with a visual saved-link library beside the chat"
          width={3014}
          height={1572}
          sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
          priority
          className="h-auto w-full rounded-2xl shadow-lg"
        />
        <figcaption className="mt-4 text-center text-sm text-gray-600">
          Your saved links and the chat that helps you revisit them.
        </figcaption>
      </figure>
    </div>
  </section>
);
