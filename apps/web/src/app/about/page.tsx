import Link from 'next/link';
import { PublicPage, JsonLd } from '../_components/public-page';
import { publicMetadata, productSchema } from '@/lib/public-seo';
import { builderUrl, sourceUrl } from '@/lib/public-content';

export const metadata = publicMetadata('/about');

export default function About() {
  return (
    <PublicPage path="/about" title="A memory for the links you save.">
      <p>
        DoryAI is an AI bookmark manager built around two actions: save a useful
        link, then ask about it later. It combines a visual library with chat so
        you do not have to remember the exact title or maintain a folder system
        by hand.
      </p>
      <section id="builder">
        <h2>Built by Nestor Mamani</h2>
        <p>
          Nestor builds and maintains DoryAI’s web app and API in a public
          monorepo. You can <a href={builderUrl}>find him on GitHub</a>, read
          the implementation, or report a problem in the repository.
        </p>
        <p>
          DoryAI is still being improved. The source makes the tradeoffs
          visible: content extraction is not equally complete across platforms,
          and a search result is not a guarantee that every relevant link was
          found.
        </p>
      </section>
      <section>
        <h2>Open source, not a public library</h2>
        <p>
          The <a href={sourceUrl}>DoryAI source code</a> is available under
          AGPL-3.0-only. Public code does not make your saved links public. Read
          the <Link href="/privacy">privacy policy</Link> and{' '}
          <Link href="/security">security boundaries</Link> before choosing what
          to save.
        </p>
      </section>
      <section>
        <h2>Useful answers need useful evidence</h2>
        <p>
          DoryAI can answer from the text it captured. A partial LinkedIn
          preview is not the full post; a thumbnail is not an analysis of a
          video. The interface should tell you when capture is incomplete
          instead of filling the gap with a confident guess.
        </p>
        <p>
          <Link href="/how-it-works">See how saving and retrieval work</Link>,
          or <a href={`${sourceUrl}/issues`}>report a reproducible issue</a>.
        </p>
      </section>
      <JsonLd data={productSchema()} />
    </PublicPage>
  );
}
