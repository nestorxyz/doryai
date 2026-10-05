# Public SEO and AI-search discovery

## Scope

This release changes public product pages, not retrieval, saved links, billing,
or private data. It starts from production `93021b5` on `codex/seo-ai-discovery`.
Preview review and production promotion are separate gates. Do not merge the
unaccepted chat/category Preview branch into this release.

## Baseline verified on 2026-10-04

- The canonical homepage already returns server-rendered HTML, HTTP 200,
  a description, one H1, an index/follow policy and a canonical URL.
- The apex domain redirects once to `https://www.doryai.xyz/`.
- Existing legal pages and the sitemap return 200; a nonexistent public route
  returns 404. No broken public page or redirect chain was demonstrated.
- The owner verified the domain in Google Search Console. URL inspection
  reports the homepage is indexed. The existing sitemap was submitted.
  Its first report said it could not be fetched, but Google's live URL test
  subsequently reported crawl allowed and a successful fetch. The sitemap
  report still needs processing; submission does not prove all pages indexed.
- PageSpeed's public API returned 429 (daily quota). There is no verified
  sub-two-second load or field Core Web Vitals result from this audit.

## Implementation

`public-content.ts` is the six-page registry: home, how it works, about,
privacy, security and terms. `public-seo.ts` generates matching title,
description, canonical, Open Graph and Twitter metadata, sitemap entries,
breadcrumbs, FAQ/product identity JSON-LD and optional `llms.txt` content.

Public pages are prerendered. Visible FAQs and their schema share the same
data. The builder page links the real GitHub profile and public AGPL source;
it does not invent credentials, customer counts, reviews or endorsements.
The homepage uses a real product screenshot and explains capture limits,
replacing the simulated "Live demo" and broad marketing claims.

Navigation and footer link every public page. Five public images were converted
to WebP at their original dimensions (lossless for the logo and product UI).
Feature illustrations use quality 85 and Next.js responsive optimization. PNG
originals remain available, including the existing compatible social card.
Deployed rendering and performance still need separate checks; a smaller image
file does not prove a sub-two-second load or passing field Core Web Vitals.

The five original PNGs total 516,447 bytes; their WebP versions total 146,376
bytes (about 72% smaller). The product screenshot is 42% smaller losslessly;
feature illustrations are 81–87% smaller. These are source-file measurements,
not browser transfer totals or load-time measurements.

Production wildcard crawl rules allow public pages and exclude private auth,
dashboard, sign-in, billing, sharing and API prefixes. Preview/local pages
retain noindex and block crawling. Authentication remains the privacy boundary;
robots.txt is not an access control. Saved libraries never enter the sitemap.

## AI discovery: what this does and does not do

- Google's [AI-search guidance](https://developers.google.com/search/docs/appearance/ai-features)
  calls for the normal crawlable, helpful search baseline; no special AI schema
  or guaranteed recommendation exists.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
  distinguishes OAI-SearchBot from GPTBot and user-initiated fetches. This release
  does not change the site's existing training permission or add agent-only
  content. Public crawl access is not proof of a future ChatGPT recommendation.
- `llms.txt` is an optional [community proposal](https://llmstxt.org/), not
  a ranking mechanism. Google's [search updates](https://developers.google.com/search/updates)
  explicitly say it is unnecessary for Google search as of June 2026.
- FAQ schema is included because the visible FAQ is useful and was requested.
  Google removed FAQ rich results in May 2026; this is not a rich-result promise.
  Product schema has no fabricated ratings, prices or paid-availability claims.

## Verification and release sequence

1. Run `npm run test`, `npx tsc --noEmit`, `npm run build`, then `npm run check:seo`
   in `apps/web`. The final check inspects the generated initial HTML for six
   pages, H1s, unique metadata, canonicals, image attributes, valid JSON-LD,
   visible FAQ questions, breadcrumbs and internal links.
2. Deploy a web-only isolated Preview with development Clerk/Convex/API settings.
   Do not run a production Convex deployment or change provider-wide settings.
3. Verify desktop and mobile public pages, FAQ/menu keyboard interaction,
   image responses, HTTP statuses, noindex, robots and sitemap. Review the
   author copy and source limits with the owner.
4. Obtain production authorization. Promote only the reviewed commit, verify
   the exact deployed SHA and canonical origin, and recheck crawl policy.
5. Recheck the submitted sitemap report after Google processes it. New pages
   cannot be submitted for production indexing before they exist there.

### First Preview verification on 2026-10-04

The first SEO revision `69b8f31` passed all 79 web tests, TypeScript, the
23-route build, generated-HTML checks, secret scanning and full two-app CI
`37260297699`. Web-only Preview `dpl_E5pHz3oMDZPz6iWdrguim1wKuej8` reached
Ready. Desktop 1280px and mobile 390px checks found no horizontal overflow;
all six public pages rendered correct metadata and one H1. Mobile navigation
and a native FAQ disclosure worked with keyboard input. The image-format
follow-up adds the measured WebP files and needs its own final Preview readback.

Provider inspection confirms production remains `93021b5` and its general
Convex build command is unchanged. An initial Preview attempt used that
general command and failed; the successful attempt explicitly used
`npm run build` and branch-scoped development public configuration. Raw
Preview crawl endpoints return a Vercel authentication redirect/noindex to
anonymous requests, so their deployed bodies were not independently fetched.
Generated crawl artifacts and rendered page noindex were verified instead;
recheck anonymous public endpoints after an approved production release.

## Follow-up work and success measures

- Run a mobile performance report when quota permits. Fix the measured largest
  bottleneck, then compare LCP, INP and CLS; use real-user field data when it
  becomes available. A fast HTML response is not a complete load-time test.
- Observe indexed public pages, impressions, relevant non-brand queries,
  sign-ups and first successful save-and-retrieval. Do not confuse impressions
  or model mentions with activated users.
- Publish a concrete save-and-find walkthrough using consented or public
  examples after owner review. Avoid mass-generated SEO pages and copied posts.
- Earn relevant links through the real repository README, a useful product
  walkthrough and genuine communities. Outreach, public posts, paid listings
  and backlink submissions require their own approval; none were performed.
- Ranking #1 by a fixed date and AI recommendations cannot be guaranteed.
