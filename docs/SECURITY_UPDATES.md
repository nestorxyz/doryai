# Dependency security updates

## 2026-10-01: Next.js and brace-expansion

- Next.js and its matching runtime/compiler packages: `16.3.5` → `16.3.6`.
  This is the patched version for
  [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j).
  No app use of `next/og` or `ImageResponse` was found during the source review;
  that does not replace installing the patched dependency.
- Nested brace-expansion packages: `1.1.18` → `1.1.21` and `2.1.4` → `2.1.7`.
  These compatible updates address the reported recursion/expansion denial of
  service advisories, including
  [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr).
- Regenerated the web lockfile with targeted npm updates, without adding
  overrides or updating unrelated application dependencies. The API lockfile,
  application behavior, schema, and saved-link data are unchanged.

A clean web `npm ci`, all 66 web tests, TypeScript, a 19-route Next.js
production build, and `npm audit` passed locally; the audit reported zero
vulnerabilities at this date. CI,
Preview, production, and authenticated workflow checks are separate release
gates. Re-run the audit: a clean report is time-bound, not a claim that the
product has no security risks.
