# Deployment cutover checklist

This document describes a future cutover; it does not assert that the new repository powers production yet.

1. Verify `main` and CI in `nestorxyz/doryai`, including both apps and a secret scan. Keep `clippo-link` and `clippo-backend` public and unchanged.
2. In Vercel, connect `nestorxyz/doryai` to a **new Preview deployment first** with root directory `apps/web`. Preserve the existing web environment variable names. Confirm its build also deploys the intended Convex **development** functions, not production functions.
3. In Railway, deploy `apps/api` to **dev** from the new repository. Its existing `nixpacks.toml`, `npm ci`, and build/start commands must resolve relative to that root. Preserve the existing dev variables and service integrations.
4. Test sign-in, a fresh save from each supported source, partial-content disclosure, exact saved-link follow-up, search, image cards, quota, and billing in Preview/dev. Check both desktop and mobile widths. Do not copy private user records into a public test fixture.
5. Move the existing production Vercel and Railway projects to the new Git source/root directories one at a time. Verify the deployed commit, Convex deployment, backend health, `www.doryai.xyz`, and an authenticated save/retrieval flow after each switch. Keep rollback to the old Git source available.
6. Only after production has been stable and rollback no longer depends on them, archive the old repositories (read-only). Do not delete their histories or rewrite links blindly.

The current hosting source should be checked in the providers immediately before each cutover step; documentation can become stale.
