import Link from 'next/link';
import { NavigationHeader } from './_components/sections/navigation';
import { HeroSection } from './_components/sections/hero';
import { FeaturesDemo } from './_components/sections/features-demos';
import { PricingSection } from './_components/sections/pricing';
import { Footer } from './_components/sections/footer';
import { JsonLd } from './_components/public-page';
import { productSchema, publicMetadata } from '@/lib/public-seo';

export const metadata = publicMetadata('/');

export default function Home() {
  return (
    <div className="bg-white text-black ">
      <NavigationHeader />
      <main>
        <HeroSection />
        <FeaturesDemo />
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 text-3xl font-medium md:text-4xl">
            From “save this” to “where was that?”
          </h2>
          <ol className="grid gap-8 md:grid-cols-3">
            <li>
              <h3 className="mb-3 text-xl font-semibold">1. Send a link</h3>
              <p className="leading-relaxed text-gray-600">
                Paste a webpage, video, or social post into chat. DoryAI saves
                what the source makes available.
              </p>
            </li>
            <li>
              <h3 className="mb-3 text-xl font-semibold">
                2. Keep the context
              </h3>
              <p className="leading-relaxed text-gray-600">
                Browse your library by category and tags. Check whether a save
                includes content or only a partial preview.
              </p>
            </li>
            <li>
              <h3 className="mb-3 text-xl font-semibold">
                3. Ask about it later
              </h3>
              <p className="leading-relaxed text-gray-600">
                Search using the details you remember, or select one link and
                ask what it says.
              </p>
            </li>
          </ol>
          <Link
            href="/how-it-works"
            className="mt-8 inline-block underline underline-offset-4"
          >
            How saving and retrieval work →
          </Link>
        </section>
        <PricingSection />
        <JsonLd data={productSchema()} />
      </main>
      <Footer />
    </div>
  );
}
