# Deployment and source cutover

## Current configuration

As of 2026-10-01, `nestorxyz/doryai` is the production source repository.

- Vercel project `slinky-link`: branch `main`, root `apps/web`, build command `npx convex deploy --cmd 'npm run build'`. This command deploys the Convex functions selected by that environment's deploy key as well as the web app.
- Railway project `doryai`, service `clippo-backend`: repository `nestorxyz/doryai`, branch `main`, root `/apps/api` in both `dev` and `production`. The existing `nixpacks.toml` supplies npm install/build/start plus Python, FFmpeg, and yt-dlp.
- Vercel Preview branch `codex/search-v2` retains its development Clerk, Convex, and API overrides. Use that branch for the configured isolated Preview. Other branches need an explicit environment review before deploying.
- Existing domains and provider variables remain unchanged. Never commit provider credentials, local environment files, or private saved-link records.
- Canonical GitHub CI has a Clerk test publishable key and runs the web build without production secrets. API CI runs tests and compilation.

## Cutover evidence

The app source snapshot is `bfc598bd70090ce9814194bc3d29d88186275a18`, equivalent to the previously accepted production release: web/Convex `0a786c8` and API `d7be982`. The separate broad-search experiment was not imported.

| Check | Result |
| --- | --- |
| GitHub CI `36895402206`, rerun with test public key | Both jobs passed, including web build |
| Vercel Preview `dpl_yv2cEaxbb938v2EsTpQGpsj1sCpD` | Ready from the monorepo |
| Railway dev `4cb59788-5266-4e62-9fff-140cb0f802c6` | Success from the monorepo |
| Railway production `85bd8666-9dea-467a-a958-3ba58439673f` | Success from the monorepo |
| Vercel production `dpl_8zhMJ7nZfFrVJS8aLWZBE1X36U2c` | Ready, Convex deployed, canonical domains aliased |

The initial Railway repository reconnect also triggered builds before the API root was configured. Those builds failed; the prior healthy production deployment continued serving. Configuring `/apps/api` and redeploying resolved the failure. Set roots before reconnecting future sources, and verify provider readback rather than relying on a configuration command's success message.

After production cutover, the authenticated dashboard reloaded successfully. An existing saved link's "Ask about this link" action returned one selected-link card and a grounded answer explicitly labeling its partial-preview coverage. Public API health passed in both environments. The owner had also accepted the unchanged production onboarding flow before this source cutover.

No production data migration or search backfill ran. This migration did not re-test every source's fresh-save extraction, billing, or mobile behavior; those and broad-search quality remain separate product checks.

## Normal release and rollback

1. Work in this monorepo and run the affected app's tests/build. Review the diff and scan for secrets.
2. Test behavioral changes against the intended Preview/dev services. Check the provider environment and deployed commit; never point Preview at production data just to make a test pass.
3. Release reviewed changes to `main` only with production authorization. Verify both provider deployments and the live authenticated workflow, not only GitHub CI.
4. For a web rollback, select a previously successful production deployment in Vercel. A web-only rollback does **not** roll back Convex functions; compatible schema/function recovery is a separate step.
5. For an API rollback, select a previously successful Railway deployment. Check health and compatibility with the active web/Convex version.

The original repositories preserve full histories as archives. Do not delete them. Routine rollback should use retained provider deployments; unarchiving/reconnecting an old source is a separate recovery action, not the normal workflow.
