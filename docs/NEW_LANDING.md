# New landing review

The finished alternative lives at `/new-landing`. The existing `/` page, app
layout, backend, user library and billing handlers are unchanged. This route
has `noindex,nofollow`, canonical `/`, and is absent from the six-page sitemap.
No production release is part of this change.

## Design and composition

`LandingPage` is route-independent server-rendered content. It contains the
navigation, hero, example library/chat, workflow, capture-scope explanation,
current plan prices, shared visible FAQs/schema, builder and legal links.
The layout uses a warm neutral canvas, the existing DoryAI logo/brand pink,
editorial cover illustrations and scoped CSS tokens. No new dependencies,
remote font, animation library, stock assets or analytics were added.

Only `LandingDemo` is a client component. It selects one of three curated public
examples or resets the selection. Cards and question buttons agree on the
selected source and the answer links directly to that source. Prepared answers
and original CSS illustrations are explicitly disclosed. There is no live AI,
network request, account, library write, arbitrary-URL input or owner data in
the demo. All example content is rendered before hydration.

References informed interaction/hierarchy, not copied artwork or claims:
[Almanac](https://usealmanac.com/) for an explorable example workspace,
[Rote](https://tryrote.com/) for problem-to-product storytelling, and
[mymind](https://mymind.com/) for visual content emphasis.

Public sample sources (short paraphrases, not full reproductions):

- [Paul Graham: Maker's Schedule, Manager's Schedule](https://paulgraham.com/makersschedule.html)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [MDN: CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)

Plan amounts and paid checkout paths use `PAID_PLAN_COPY`. Signup uses the
existing `/sign-in` route; plan terms and availability remain checkout-owned.
No new claim of payment eligibility, full social extraction or perfect search.

## Checks and review

Run web tests, `npx tsc --noEmit`, build and `npm run check:seo`. Tests cover
sample selection, reset/unknown IDs, disclosure and sitemap exclusion. The
generated-HTML check covers one H1, initial demo content, noindex, canonical,
FAQ/schema parity, image dimensions and public links, alongside all existing
public-page checks. Browser review must exercise all three questions, source
matching, reset, keyboard/FAQ/signup links and narrow-screen overflow.

## Homepage promotion after acceptance

The promotion is intentionally small: keep `publicMetadata('/')` in
`apps/web/src/app/page.tsx`, import `LandingPage` and return `<LandingPage />`.
Keep the shared product/FAQ schemas in that component; do not duplicate them in
the route. No `/new-landing`-specific links are embedded in the component.
Re-run generated-HTML and browser checks, then obtain production authorization.
The old homepage remains available in Git for rollback; the isolated review
route can be removed in a separate cleanup after acceptance.
