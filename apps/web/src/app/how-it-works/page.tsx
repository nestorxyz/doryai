import Link from 'next/link';
import { PublicPage, JsonLd } from '../_components/public-page';
import { faqSchema, publicMetadata } from '@/lib/public-seo';
import { productFaqs } from '@/lib/public-content';

export const metadata = publicMetadata('/how-it-works');

export default function HowItWorks() {
  return (
    <PublicPage
      path="/how-it-works"
      title="Save a link. Find it when you need it."
    >
      <p>
        DoryAI is for the article, video, or post you want to come back to—but
        cannot remember where you put it. Save it in chat, then search your own
        library using the details you remember.
      </p>
      <section>
        <h2>1. Paste a useful link</h2>
        <p>
          Open <Link href="/sign-in">DoryAI</Link> and send a URL. You can paste
          a full URL or a domain without typing https://. DoryAI analyzes what
          the source makes available and saves the link with a title, category,
          and tags.
        </p>
      </section>
      <section>
        <h2>2. Check what was captured</h2>
        <p>
          A webpage may include extracted text. A YouTube video or Short may
          include a transcript. Social links may contain only public text or a
          partial preview. Access restrictions and unavailable content can limit
          extraction.
        </p>
        <p>
          Look at the save confirmation before relying on an answer. A saved URL
          is not proof that every part of its destination was read. Social
          images and videos can appear as previews without their contents being
          analyzed.
        </p>
      </section>
      <section>
        <h2>3. Ask in your own words</h2>
        <p>
          Try a topic such as “Find the videos I saved about starting a
          business.” If you already know which link you want, select it in your
          library and ask about that item. This avoids mixing several similar
          sources.
        </p>
        <p>
          DoryAI shows matching links and uses their saved content to answer.
          Search can miss a match; try a more specific title or select the link
          directly. If only a preview was saved, the answer should say so.
        </p>
      </section>
      <section>
        <h2>When to use DoryAI</h2>
        <p>
          Keep tutorials and tools for your next project, collect articles for
          research, or remember useful advice from videos. Unlike a public
          search engine, DoryAI is designed to help you revisit links in your
          own saved library.
        </p>
      </section>
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions before you save</h2>
        <div className="divide-y divide-gray-200">
          {productFaqs.map(({ question, answer }) => (
            <details key={question} className="py-4">
              <summary className="cursor-pointer font-medium text-black">
                {question}
              </summary>
              <p className="mt-3">{answer}</p>
            </details>
          ))}
        </div>
        <JsonLd data={faqSchema()} />
      </section>
      <p>
        <Link href="/sign-in">Save your first link</Link> ·{' '}
        <Link href="/about">Meet the builder</Link>
      </p>
    </PublicPage>
  );
}
