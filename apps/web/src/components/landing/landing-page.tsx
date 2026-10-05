import Image from "next/image";
import Link from "next/link";
import { PAID_PLAN_COPY } from "@/lib/billing-copy";
import { builderUrl, productFaqs, sourceUrl } from "@/lib/public-content";
import { faqSchema, productSchema } from "@/lib/public-seo";
import { JsonLd } from "@/app/_components/public-page";
import { LandingDemo } from "./landing-demo";
import styles from "./landing.module.css";

const workflow = [
  {
    number: "01",
    title: "Keep what catches your eye.",
    text: "An article. A video. A post you want to come back to. Paste the link into DoryAI’s chat.",
  },
  {
    number: "02",
    title: "Let it find a home.",
    text: "DoryAI organizes the available content with categories and tags. Your library stays browsable, too.",
  },
  {
    number: "03",
    title: "Come back with a question.",
    text: "Ask using the details you remember, or select a link to explore its saved content. The source stays within reach.",
  },
];

const sourceTypes = [
  {
    label: "Webpages",
    mark: "↗",
    detail:
      "Articles, references and useful pages. Readable text and metadata when available.",
  },
  {
    label: "YouTube",
    mark: "▶",
    detail:
      "Videos and Shorts. Captured content may include a transcript, depending on the video.",
  },
  {
    label: "Social links",
    mark: "@",
    detail:
      "Public text or a partial preview when accessible. Media, threads and private posts aren’t guaranteed.",
  },
];

function StartLink({
  children,
  secondary = false,
}: {
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href="/sign-in"
      className={secondary ? styles.secondaryButton : styles.primaryButton}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

// Route-independent content: the homepage can render this same component once
// accepted. Review-route metadata/noindex live in the route, not this component.
export function LandingPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link href="/" aria-label="DoryAI home" className={styles.logo}>
          <Image
            src="/isologo-black.webp"
            alt="DoryAI"
            width={599}
            height={167}
            sizes="132px"
            priority
          />
        </Link>
        <nav aria-label="Main navigation" className={styles.navigation}>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            Open source ↗
          </a>
        </nav>
        <Link href="/sign-in" className={styles.login}>
          Log in <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />A little less searching. A little more
            finding.
          </p>
          <h1 id="hero-title">
            Good links deserve
            <br />a <span className={styles.highlight}>second look.</span>
          </h1>
          <p className={styles.heroDescription}>
            Save what interests you. Find it later by asking.
            <br className={styles.desktopBreak} /> Your own corner of the
            internet, with a better memory.
          </p>
          <div className={styles.heroActions}>
            <StartLink>Start your library</StartLink>
            <a href="#try-demo" className={styles.textButton}>
              Explore the example <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className={styles.ctaNote}>
            Free for your first 20 links. No card needed for the free plan.
          </p>
        </section>
        <div className={styles.demoWrap}>
          <LandingDemo />
        </div>
        <section className={styles.manifesto} aria-labelledby="manifesto-title">
          <p className={styles.eyebrow}>
            For the things you don’t want to lose
          </p>
          <h2 id="manifesto-title">
            Not another tab you’ll forget.
            <br />A thought you can <em>come back to.</em>
          </h2>
          <p>
            The essay that changed your mind. The tutorial for your next
            project. The idea you’re not ready to use yet. Give them somewhere
            to live—and a way back.
          </p>
        </section>
        <section
          className={styles.workflow}
          id="how-it-works"
          aria-labelledby="workflow-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>A small habit. A useful memory.</p>
            <h2 id="workflow-title">Save. Settle. Rediscover.</h2>
            <Link href="/how-it-works" className={styles.inlineLink}>
              The details behind the demo <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ol className={styles.workflowSteps}>
            {workflow.map((step) => (
              <li key={step.number}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.sources} aria-labelledby="sources-title">
          <div className={styles.sourceHeading}>
            <p className={styles.eyebrow}>
              A link is not always the whole story
            </p>
            <h2 id="sources-title">
              Keep the context.
              <br />
              Know what was captured.
            </h2>
            <p>
              DoryAI answers from what it could save. If a site only offers a
              preview, that’s what you get—not an invented version of the full
              content.
            </p>
            <Link href="/security" className={styles.inlineLink}>
              Our boundaries, in plain language ↗
            </Link>
          </div>
          <div className={styles.sourceList}>
            {sourceTypes.map((source) => (
              <div key={source.label} className={styles.sourceRow}>
                <span className={styles.sourceMark} aria-hidden="true">
                  {source.mark}
                </span>
                <div>
                  <h3>{source.label}</h3>
                  <p>{source.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          className={styles.pricing}
          id="pricing"
          aria-labelledby="pricing-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Room for your curiosity</p>
            <h2 id="pricing-title">Start small. Keep more.</h2>
            <p>Try the save-and-find habit before choosing an upgrade.</p>
          </div>
          <div className={styles.plans}>
            <article className={styles.freePlan}>
              <span className={styles.planLabel}>Free</span>
              <h3>$0</h3>
              <p className={styles.planPeriod}>No payment required</p>
              <ul>
                <li>Save up to 20 links</li>
                <li>Organize your personal library</li>
                <li>Find and ask about saved content</li>
              </ul>
              <StartLink secondary>Try DoryAI free</StartLink>
            </article>
            <article className={styles.premiumPlan}>
              <span className={styles.planLabel}>Premium</span>
              <h3>
                More room.
                <br />
                Same simple habit.
              </h3>
              <p className={styles.premiumDetail}>
                Save up to 500 links each month. Manage or cancel your
                subscription.
              </p>
              <div className={styles.paidOptions}>
                {PAID_PLAN_COPY.map((plan) => (
                  <a
                    key={plan.key}
                    className={styles.paidOption}
                    href={`/auth/after?plan=${plan.key}&intent=checkout`}
                  >
                    <span>
                      <strong>{plan.price}</strong>
                      <small>
                        {plan.key === "annual" ? "per year" : "per month"}
                      </small>
                    </span>
                    <span>
                      {plan.title}
                      <span aria-hidden="true"> ↗</span>
                    </span>
                  </a>
                ))}
              </div>
              <p className={styles.checkoutNote}>
                Availability, trial and renewal terms are shown at checkout.
              </p>
            </article>
          </div>
        </section>
        <section className={styles.faq} aria-labelledby="faq-title">
          <div>
            <p className={styles.eyebrow}>Before you jump in</p>
            <h2 id="faq-title">
              A few good
              <br />
              questions.
            </h2>
            <Link href="/how-it-works" className={styles.inlineLink}>
              More about DoryAI ↗
            </Link>
          </div>
          <div className={styles.faqList}>
            {productFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span className={styles.disclosureIcon} aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.lastCall} aria-labelledby="last-call-title">
          <p className={styles.eyebrow}>Leave a trail for your future self</p>
          <h2 id="last-call-title">
            Your next good find
            <br />
            doesn’t have to get lost.
          </h2>
          <StartLink>Save your first link</StartLink>
        </section>
        <JsonLd data={productSchema()} />
        <JsonLd data={faqSchema()} />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" aria-label="DoryAI home" className={styles.logo}>
            <Image
              src="/isologo-black.webp"
              alt="DoryAI"
              width={599}
              height={167}
              sizes="132px"
            />
          </Link>
          <p>For your curious side.</p>
        </div>
        <div className={styles.footerBottom}>
          <p>
            Built by{" "}
            <a href={builderUrl} target="_blank" rel="noopener noreferrer">
              Nestor Mamani
            </a>
            . Open source,{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              AGPL-3.0 ↗
            </a>
          </p>
          <nav aria-label="Footer navigation">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/security">Security</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
