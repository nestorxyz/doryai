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

CI always runs both apps' tests, web TypeScript checks, and the API build. The web build runs in CI only when the new repository has a Clerk test publishable key configured as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; GitHub does not transfer secrets from the old repository. Do not use production credentials to make CI pass.

## Deployment boundary

The production website is [doryai.xyz](https://www.doryai.xyz). During migration, Vercel and Railway remain connected to the original source repositories. This repository is the new source home, **not** a completed hosting cutover. Before changing a provider's Git source, configure its root directory (`apps/web` or `apps/api`), preserve environment variables and domains, deploy Preview/dev, validate save and retrieval end-to-end, and only then switch production. See [the cutover checklist](docs/DEPLOYMENT_CUTOVER.md).

## Source history and licensing

This repository starts from clean snapshots of the two existing public repositories at the validated production release: [web/Convex](https://github.com/nestorxyz/clippo-link) and [API](https://github.com/nestorxyz/clippo-backend). Their full commit histories remain there. Do not archive them until the new repository and deployment cutover have been verified. DoryAI is licensed under [AGPL-3.0-only](LICENSE); see each app's existing notices and publication review for third-party assets and dependencies.

Contributions are welcome; start with [CONTRIBUTING.md](CONTRIBUTING.md). Please report security issues privately as described in [SECURITY.md](SECURITY.md).
