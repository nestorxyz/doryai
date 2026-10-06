# New landing review

The owner accepted the video-first Preview and authorized homepage promotion
on 2026-10-05. Both `/` and `/new-landing` now reuse `LandingPage`; `/` retains
its public metadata and indexing policy. App layout, backend, user library and
billing handlers are unchanged. The review route keeps `noindex,nofollow`,
canonical `/`, and is absent from the six-page sitemap.

## Design and composition

`LandingPage` is route-independent server-rendered content. It contains the
navigation, video-first hero, example library/chat, workflow, capture-scope explanation,
current plan prices, shared visible FAQs/schema, builder and legal links.
The layout uses a warm neutral canvas, the existing DoryAI logo/brand pink,
editorial cover illustrations and scoped CSS tokens. No new dependencies,
remote font, animation library, stock assets or analytics were added.

The revised positioning prioritizes Instagram Reels, YouTube Shorts and TikTok.
Their existing platform icons, portrait illustrated covers and concrete questions
make the save/rediscover use case visible. Articles and other links still appear
as secondary supported content. This does not change ingestion or promise full
video/audio access on every platform.

Only `LandingDemo` is a client component. It selects one of three fictional video
examples or resets the selection. Cards and question buttons agree on the
selected clip. Prepared answers and original CSS illustrations are explicitly
disclosed, with no real post URLs or fabricated creators. The selected example
shows its platform and sample capture scope: caption, transcript excerpt or
metadata only. It is not a playable video or a real extraction. There is no live AI,
network request, account, library write, arbitrary-URL input or owner data in
the demo. All example content is rendered before hydration.

References informed interaction/hierarchy, not copied artwork or claims:
[Almanac](https://usealmanac.com/) for an explorable example workspace,
[Rote](https://tryrote.com/) for problem-to-product storytelling, and
[mymind](https://mymind.com/) for visual content emphasis.

The original article examples were replaced with fictional clips about one-pan
pasta, a focused video opening and shot framing. Their answers demonstrate the
limits of the saved sample context, not claims about real videos or creators.

Plan amounts and paid checkout paths use `PAID_PLAN_COPY`. Signup uses the
existing `/sign-in` route; plan terms and availability remain checkout-owned.
No new claim of payment eligibility, full social extraction or perfect search.

## Checks and review

Run web tests, `npx tsc --noEmit`, build and `npm run check:seo`. Tests cover
sample selection, reset/unknown IDs, disclosure and sitemap exclusion. The
generated-HTML check covers one H1, initial demo content, noindex, canonical,
FAQ/schema parity, image dimensions and public links, alongside all existing
public-page checks. Browser review must exercise all three questions, source
matching, reset, keyboard/FAQ/signup links and narrow-screen overflow. Tests also
guard against fictional examples acquiring fake real-post URLs.

## Homepage promotion and rollback

The promotion is intentionally small: `publicMetadata('/')` stays in
`apps/web/src/app/page.tsx`, which imports `LandingPage` and returns `<LandingPage />`.
Keep the shared product/FAQ schemas in that component; do not duplicate them in
the route. No `/new-landing`-specific links are embedded in the component.
Generated-HTML checks now require the accepted video-first homepage content
and visible FAQ/schema parity, alongside the review-route noindex checks.
Run browser checks on the canonical domain after deploying the authorized commit.
The old homepage remains available at `7555337` for rollback; the isolated review
route can be removed in a separate cleanup after acceptance.
