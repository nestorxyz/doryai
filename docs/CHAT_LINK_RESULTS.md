# Chat link-result presentation

## Contract

Search answers use a bounded, tool-driven UI contract instead of a text link
catalogue. The final Gemini call must invoke `render_link_results` with an
`answer` and up to 20 ordered `linkIds` from this turn's tenant-scoped search.
It cannot supply card URLs, titles, images, HTML, or React code. The server
validates the arguments, filters unknown/duplicate IDs, and resolves metadata
only from those search results. A wholly invalid selection or malformed output
fails with a retryable error, never raw JSON. An intentional empty selection is
allowed when none of the candidates fit.

The final model message persists `{ text, linkResults: { version: 1, links } }`
in the existing Convex `parts` field. UI payloads are removed before assembling
Gemini history. No schema change, backfill, new provider, or extra model round
is required. Intermediate search records are marked `presentation: pending` so
new clients do not show preliminary candidates as final recommendations. Search
failures still render their error. Old messages and old clients retain their
existing tool-result compatibility.

The frontend reuses the existing thumbnail card, branded fallback, two-line
title, source hostname, and partial/metadata labels. It shows three cards, with
keyboard-accessible Show more / Show fewer controls for the rest of the selected
matches. It deduplicates social post identities without rewriting navigation
URLs or modifying library records. Assistant Markdown has paragraph/list styles;
raw HTTP(S)/www URLs are not displayed, and generated image Markdown cannot make
remote requests. User messages retain their original text. The exact saved-link
CTA continues to show its existing selected card and answer without a URL.

## Verification and release boundary

2026-10-15: implemented on `codex/chat-link-results`, based on production source
`4f69385`. All 90 web tests and 121 API tests, both builds, and web TypeScript
checks passed. Automated checks cover candidate authorization, ordering, malformed
payloads, current-turn tool routing, persisted-history compatibility, duplicate
posts, card expansion markup, capture labels, and URL-free Markdown.

Actual React components were reviewed locally with synthetic data at desktop
and 390px mobile widths. Three cards expanded to eight through both click and
keyboard; collapse worked; no horizontal overflow or raw URL text appeared.
This fixture is not the authenticated product and does not prove live Gemini
output quality, deployment, or user acceptance. No production data was read or
changed. The library layout, ingestion, ranking, auth, billing, and current
unaccepted chat/category experiments were not changed.

Before release, test against isolated Preview/dev services with a signed-in
account: broad-topic search, exact-link detail, no results, many matches, partial
captures, and retry after a failed presentation. Verify that selected cards match
the answer and images load from existing stored metadata. Production needs
separate owner authorization. This implementation has not been deployed.
