# Chat polish

## Scope

Presentation-only improvements to the existing save-and-ask flow:

- Compact, right-aligned user messages and a clear DoryAI answer identity.
- Group tool records and the answer into one assistant turn. Show the latest
  actual tool outcome, preserve failures, and keep partial-content disclosures.
- Readable Markdown paragraphs, lists, code and horizontally scrollable tables.
- Keep existing image cards and branded fallbacks. Label results as links in
  the turn, not as proof that every result was cited by the answer.
- Offer Summarize and Show saved text only for an exact selected or confirmed
  saved-link ID. Reuse the existing tenant-authorized focused-query flow.
- Explain saving and asking in a labeled, growing composer. Enter sends,
  Shift+Enter adds a line, and IME composition does not submit prematurely.
- Respect reduced motion and preserve keyboard focus indicators.

No library layout, retrieval/ranking, API, schema, billing, or existing-record
backfill changes. No production deployment is part of this Preview release.

## Verification

Pure turn-assembly tests cover grouping, duplicate saves, retained failures,
selected-link context, legacy history, empty results and grounded follow-up
prompts. Server-rendered component tests cover Markdown structure, safe source
links, input labels, and disabled-send states. These are not browser interaction
tests.

Local visual QA renders the actual components with synthetic records and the
current Tailwind stylesheet. Desktop and 390px mobile layouts were inspected;
mobile content width matched the viewport with no horizontal overflow. The
temporary test page is excluded from the release.

Local release checks on 2026-10-01 passed: 80 tests in 15 files, TypeScript,
and the Next.js 16.3.6 production build with 19 routes. Preview configuration
was checked to use a Clerk test key and Convex/API destinations distinct from
production. CI and deployed Preview readback are separate release gates.

## Preview acceptance

Use the isolated Preview environment, not production:

1. Sign in, save a new public link, and check that tool activity is compact while
   a confirmed saved card and any capture-scope warning remain visible.
2. Ask about the link. Check answer spacing, image cards and source destinations.
3. Use Summarize and Show saved text. Confirm they stay on the selected link and
   disclose unavailable content rather than inventing it.
4. Test Enter, Shift+Enter, a long draft, mobile scrolling and keyboard focus.
5. Confirm duplicates and a failed save remain honest, then check that the
   library layout is unchanged.

Authenticated Preview acceptance remains a separate user-review gate before
any production release.

## Processing-state scroll regression

The first signed-in review exposed an integration gap in the static visual
check: the bottom marker's `scrollIntoView` also scrolled an outer
`overflow-hidden` dashboard container. This displaced the whole chat while
tool records arrived, leaving the composer near the top and hiding answers.

Auto-scroll now targets only the conversation viewport, after the deferred
messages actually render. The chat clips its own contents, the viewport can
shrink, and the composer is a non-shrinking flex footer rather than sticky
inside several scrolling ancestors. Neither save processing nor the library
is changed. Regression tests cover scoped scrolling and reduced motion;
live acceptance must include a long conversation while a request processes.
