"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { demoDisclosure, demoLinks, findDemoLink } from "./demo-content";
import styles from "./landing.module.css";

export function LandingDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = findDemoLink(selectedId);

  return (
    <section className={styles.demo} id="try-demo" aria-labelledby="demo-title">
      <div className={styles.demoToolbar}>
        <div className={styles.demoBrand}>
          <span className={styles.miniMark} aria-hidden="true">
            d.
          </span>
          <h2 id="demo-title">Your example video library</h2>
          <span className={styles.exampleBadge}>3 clips</span>
        </div>
        <button
          type="button"
          className={styles.reset}
          disabled={selectedId === null}
          onClick={() => setSelectedId(null)}
        >
          Reset demo
        </button>
      </div>
      <div className={styles.demoBody}>
        <div className={styles.libraryPane}>
          <div className={styles.paneLabel}>
            <span>Scrolled past. Saved for later.</span>
            <span aria-hidden="true">↙</span>
          </div>
          <div className={styles.demoGrid}>
            {demoLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`${styles.demoCard} ${selectedId === link.id ? styles.selectedCard : ""}`}
                aria-label={`Explore ${link.title}`}
                aria-pressed={selectedId === link.id}
                aria-controls="demo-answer"
                onClick={() => setSelectedId(link.id)}
              >
                <span
                  className={`${styles.cover} ${styles[link.artwork]}`}
                  aria-hidden="true"
                >
                  <span className={styles.coverPlatform}>
                    {
                      SOCIAL_PLATFORMS.find(
                        (platform) => platform.name === link.platform,
                      )?.icon
                    }
                    <span>{link.format}</span>
                  </span>
                  <span className={styles.videoArt}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.coverTitle}>{link.coverTitle}</span>
                  <span className={styles.coverEyebrow}>Illustrative clip</span>
                </span>
                <span className={styles.cardDetails}>
                  <span className={styles.cardCategory}>{link.category}</span>
                  <span className={styles.cardTitle}>{link.title}</span>
                  <span className={styles.cardDomain}>{link.format}</span>
                  <span className={styles.matchLabel}>
                    {selectedId === link.id
                      ? "✓ Selected source"
                      : "Explore this clip ↗"}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className={styles.demoFootnote}>{demoDisclosure}</p>
        </div>
        <div className={styles.chatPane}>
          <div className={styles.chatHeading}>
            <span className={styles.chatDot} aria-hidden="true" />
            <span>Ask your library</span>
            <span className={styles.sampleLabel}>Sample</span>
          </div>
          <p className={styles.chatIntro}>
            Remember the idea, not the creator’s handle.
          </p>
          <div className={styles.questions} aria-label="Example questions">
            {demoLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                aria-pressed={selectedId === link.id}
                aria-controls="demo-answer"
                onClick={() => setSelectedId(link.id)}
              >
                <span>{link.question}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div
            className={styles.answer}
            id="demo-answer"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {selected ? (
              <>
                <span className={styles.answerLabel}>
                  DoryAI · example answer
                </span>
                <p>{selected.answer}</p>
                <div className={styles.sourceReference}>
                  <span className={styles.sourceNumber}>1</span>
                  <span>
                    <strong>{selected.title}</strong>
                    <small>{selected.format} · illustrative clip</small>
                    <small>{selected.capture}</small>
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.answerEmpty}>
                <span aria-hidden="true">↖</span>
                <p>
                  Pick a question.
                  <br />
                  <strong>See the link come back.</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
