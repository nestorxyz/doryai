"use client";

import { useState } from "react";
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
          <h2 id="demo-title">Your example library</h2>
          <span className={styles.exampleBadge}>3 links</span>
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
            <span>A few things worth keeping</span>
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
                  {link.artwork === "schedule" ? (
                    <>
                      <span className={styles.coverEyebrow}>
                        An essay on time
                      </span>
                      <span className={styles.scheduleArt}>
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.coverTitle}>
                        Make room
                        <br />
                        to make.
                      </span>
                    </>
                  ) : link.artwork === "components" ? (
                    <>
                      <span className={styles.coverEyebrow}>
                        A builder’s reference
                      </span>
                      <span className={styles.componentArt}>
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.coverTitle}>
                        Small pieces.
                        <br />
                        Clear thinking.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles.coverEyebrow}>
                        The shape of a page
                      </span>
                      <span className={styles.gridArt}>
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.coverTitle}>
                        Everything
                        <br />
                        in its place.
                      </span>
                    </>
                  )}
                </span>
                <span className={styles.cardDetails}>
                  <span className={styles.cardCategory}>{link.category}</span>
                  <span className={styles.cardTitle}>{link.title}</span>
                  <span className={styles.cardDomain}>{link.domain}</span>
                  <span className={styles.matchLabel}>
                    {selectedId === link.id
                      ? "✓ Selected source"
                      : "Explore this link ↗"}
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
            You don’t need to remember the title.
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
                <a
                  className={styles.sourceReference}
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.sourceNumber}>1</span>
                  <span>
                    <strong>{selected.title}</strong>
                    <small>{selected.author} · public article</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
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
