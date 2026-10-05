import Image from "next/image";
import Link from "next/link";
import { PAID_PLAN_COPY } from "@/lib/billing-copy";
import { builderUrl, productFaqs, sourceUrl } from "@/lib/public-content";
import { faqSchema, productSchema } from "@/lib/public-seo";
import { JsonLd } from "@/app/_components/public-page";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { LandingDemo } from "./landing-demo";
import styles from "./landing.module.css";

const workflow = [
  {
    number: "01",
    title: "Copy the video’s link.",
    text: "Found a Reel, Short or TikTok worth keeping? Copy its link and paste it into DoryAI’s chat. No more sending it to yourself and losing it.",
  },
  {
    number: "02",
    title: "Give the idea a home.",
    text: "DoryAI organizes the available content with categories and tags. Your library stays browsable, too.",
  },
  {
    number: "03",
    title: "Find it without the scrolling.",
    text: "“That Reel with the pasta.” “The Short about video hooks.” Ask using what you remember, then open the original link or explore what DoryAI could save.",
  },
];

const sourceTypes = [
  {
    label: "Instagram Reels",
    mark: "Instagram",
    detail:
      "Keep the Reel’s link and available context. Captured text may be a caption, a preview or richer content when accessible.",
  },
  {
    label: "YouTube Shorts & videos",
    mark: "YouTube",
    detail:
      "Videos and Shorts. Captured content may include a transcript, depending on the video.",
  },
  {
    label: "TikTok",
    mark: "TikTok",
    detail:
      "Save the link and accessible context. A saved TikTok doesn’t always include its audio, on-screen text or complete video.",
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
      <main id="main-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            For the videos worth coming back to
          </p>
          <h1 id="hero-title">
            Save the video.
            <br />
            Find <span className={styles.highlight}>the idea.</span>
          </h1>
          <p className={styles.heroDescription}>
            Keep the Reel, Short or TikTok that made you stop scrolling.
            <br className={styles.desktopBreak} /> Find it later with the
            details you remember.
          </p>
          <ul className={styles.videoPlatforms} aria-label="Video platforms">
            {sourceTypes.map((source) => (
              <li key={source.mark}>
                <span aria-hidden="true">
                  {
                    SOCIAL_PLATFORMS.find(
                      (platform) => platform.name === source.mark,
                    )?.icon
                  }
                </span>
                {source.mark === "Instagram"
                  ? "Instagram Reels"
                  : source.mark === "YouTube"
                    ? "YouTube Shorts"
                    : "TikTok"}
              </li>
            ))}
          </ul>
          <div className={styles.heroActions}>
            <StartLink>Save your first video</StartLink>
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
          <p className={styles.eyebrow}>Less “I know I saved it somewhere”</p>
          <h2 id="manifesto-title">
            More than a saved video.
            <br />
            An idea you can <em>use later.</em>
          </h2>
          <p>
            The recipe you want to try. The editing tip for your next video. The
            advice that clicked in thirty seconds. Keep those finds in one
            library, instead of hunting through three different feeds.
          </p>
        </section>
        <section
          className={styles.workflow}
          id="how-it-works"
          aria-labelledby="workflow-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>A small habit. A useful memory.</p>
            <h2 id="workflow-title">Scroll. Save. Rediscover.</h2>
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
              Your favorite feeds. One place to find them.
            </p>
            <h2 id="sources-title">
              Keep the link.
              <br />
              Know what came with it.
            </h2>
            <p>
              Finding a video and understanding every second are different
              things. DoryAI answers from what it could capture: metadata, a
              preview or fuller content when available. It won’t invent the
              missing parts.
            </p>
            <Link href="/security" className={styles.inlineLink}>
              Our boundaries, in plain language ↗
            </Link>
          </div>
          <div className={styles.sourceList}>
            {sourceTypes.map((source) => (
              <div key={source.label} className={styles.sourceRow}>
                <span className={styles.sourceMark} aria-hidden="true">
                  {
                    SOCIAL_PLATFORMS.find(
                      (platform) => platform.name === source.mark,
                    )?.icon
                  }
                </span>
                <div>
                  <h3>{source.label}</h3>
                  <p>{source.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <p className={styles.alsoLinks}>
          Articles, webpages, X and LinkedIn links still have a home here, too.
        </p>
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
            That video you’ll want later?
            <br />
            Give it a place to live.
          </h2>
          <StartLink>Save your first video</StartLink>
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
