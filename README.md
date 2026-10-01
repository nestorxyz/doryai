# DoryAI

DoryAI is an open-source link memory app. Save a link, let DoryAI organize the content it can actually read, and find it later through chat or the library.

This is the product source repository. It contains the web app, Convex functions, and the API service. It does **not** contain production data, credentials, or the owner's private project-control notes.

## Repository layout

| Path | Purpose |
| --- | --- |
| `apps/web` | Next.js app, UI, authentication, billing integration, and Convex functions |
| `apps/api` | Node/Express ingestion and chat service |

Both apps currently have independent npm lockfiles. Root scripts coordinate them without changing their dependency graphs. We can introduce shared packages when duplication justifies it; a large build system is not needed for two apps.

## Local development

Use Node.js 22 or newer. Install each app from the repository root:

```sh
npm run install:all
```

Copy the app-specific `.env.example` files to local `.env` files and configure your **own** Clerk, Convex, AI-provider, and optional Firecrawl/Polar credentials. Never commit those files. Start the API and web app in separate terminals:

```sh
npm run dev:api
npm run dev:web
```

Run checks independently or together:

```sh
npm run test
npm run check
```

`apps/web` has more setup detail in its README; `apps/api` documents its API and extraction pipeline. The app's external services require your own accounts and configuration. A local build or CI pass is not proof that those external integrations work in production.

CI runs both apps' tests, web TypeScript checks, and the API build. The canonical repository also runs the web build with a Clerk **test** publishable key configured as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. Forks without that key skip the web build but still run tests and type checks. Do not use production credentials to make CI pass.

## Deployment boundary

The production website is [doryai.xyz](https://www.doryai.xyz). Vercel and Railway deploy from this repository's `main` branch:

| Provider | Root directory | Responsibility |
| --- | --- | --- |
| Vercel | `apps/web` | Next.js and the configured Convex deployment |
| Railway | `/apps/api` | API service in development and production |

The existing domains, authentication, database, and billing settings were preserved during the 2026-10-01 source cutover. No user-data backfill or migration ran. Preview uses the configured `codex/search-v2` branch; do not assume an arbitrary branch has the same isolated environment settings. See [deployment and rollback notes](docs/DEPLOYMENT_CUTOVER.md).

## Source history and licensing

This repository starts from clean snapshots of the two original public repositories at the validated production release: [web/Convex](https://github.com/nestorxyz/clippo-link) and [API](https://github.com/nestorxyz/clippo-backend). Their full commit histories remain there as read-only archives; new work belongs here. DoryAI is licensed under [AGPL-3.0-only](LICENSE); see each app's existing notices and publication review for third-party assets and dependencies.

Contributions are welcome; start with [CONTRIBUTING.md](CONTRIBUTING.md). Please report security issues privately as described in [SECURITY.md](SECURITY.md).
