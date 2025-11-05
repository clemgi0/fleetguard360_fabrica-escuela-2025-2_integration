## Repo backend
https://github.com/Camilo-Marsel/FabricaEscuela-2025-2.git
## Repo frontend
https://github.com/juanfes517/FleetGuard360_FE20252

# FleetGuard360 — Integration Monorepo

This repository is the integration monorepo for the FleetGuard360 project. Its primary purpose is to host, in the future, copies of the frontend and backend applications, and to manage their deployment on Vercel.

This README explains:

- the expected monorepo structure;
- how to add the frontend and backend projects;
- recommendations for Vercel configuration (front & back deployments);
- best practices for environment variables and local development.

## Expected structure

In the long run, this monorepo will contain at least two subprojects at the repository root:

- `front/` — the frontend application (already present in this repository);
- `back/` — the API / backend (to be added later).

Other useful directories might include `docs/`, `infra/`, and `scripts/`.

Currently, the `front/` folder contains the UI and client sources (see `front/package.json`). The `back/` folder is not yet added; when it is, it should include its own `README.md` and run/build scripts.

## Purpose and deployment workflow

Goal: host two separate projects on Vercel (frontend and backend) while keeping the code in a single monorepo.

Recommended approach with Vercel:

1. Create two separate Vercel projects (or two deployments under the same account):

   - one Vercel project pointing to the `front/` directory (suggested name: `fleetguard360-front`),
   - one Vercel project pointing to the `back/` directory (suggested name: `fleetguard360-back`).

2. For each Vercel project, set the Build Root / Root Directory:

   - Frontend: Root Directory = `front`
   - Backend: Root Directory = `back`

3. Configure environment variables (Preview & Production) in each Vercel project settings — never commit secrets to the repo.

4. Link the repository to Vercel so that each push/PR triggers an automatic deployment.

Note: you can also use a single Vercel project with multiple functions or routes, but separating the front and back projects simplifies permissions and environment management.

## Adding the backend (recommended steps)

1. Create a `back/` directory at the repository root.
2. Add the backend code there (Express, Fastify, Next API routes, Spring Boot, etc.).
3. Add a `back/README.md` that documents installation and run scripts.
4. Test the backend locally and push it on a feature branch (e.g. `feature/add-backend`).
5. Create the `fleetguard360-back` project on Vercel and point it to `back/`.

Minimal example for `back/package.json` (Node.js):

```json
{
  "scripts": {
    "dev": "node index.js",
    "start": "node index.js"
  }
}
```

Adapt the commands to the stack you choose (Java, Python, etc.).

## Local development

Frontend (existing):

1. Open a terminal at the repository root.
2. Change into the `front` directory:

```powershell
cd front
```

3. Install dependencies:

```powershell
# npm
npm install
# or pnpm
pnpm install
# or bun
bun install
```

4. Start the development server (use the script defined in `front/package.json`):

```powershell
npm run dev
# or pnpm dev
```

Backend (once present):

- follow the commands described in `back/README.md` (for example: `cd back && npm install && npm run dev` for a Node.js backend).

## Environment variables

- Use `.env.local` / `.env` files for local development (do not commit these files).
- Configure sensitive values (API keys, DB_URL, JWT secrets) in each Vercel project's Environment Variables for Preview and Production.

Examples of variables to consider:

- `FRONTEND_API_URL` — the public URL of the deployed backend;
- `DATABASE_URL` — database connection string (for the backend);
- `NEXT_PUBLIC_*` — public client-side variables (if using Next.js, prefix client vars with `NEXT_PUBLIC_`).

## Branching strategy (recommended)

- `main` — production-ready code;
- `feature/*` branches for development;
- use PRs/MRs for code review before merging.

Vercel will automatically create preview deployments for PRs if the repository is linked.

## Best practices

- Never commit secrets (.env files, key files).
- Document each subproject (`front/README.md`, `back/README.md`).
- Pin dependencies and keep build scripts up to date.
- Add checks (lint, tests) in CI pipelines when possible.

## Useful files / configs

- `vercel.json` (optional): customize routes and function settings for Vercel. Place at the repository root or inside each project folder as needed.
- `.vercelignore`: exclude files from Vercel deployments.

## Next steps / suggestions

1. Add the `back/` folder and document its run/build scripts.
2. Create two Vercel projects (front and back) and configure the root directories (`front`, `back`).
3. Add a short guide `docs/deploy-vercel.md` with screenshots and step-by-step instructions for linking the repo and setting environment variables.

## Contact

If you have questions about deployment or the repository structure, contact the project team or open an issue in this repository.

---

Thank you — this README can be updated with `vercel.json` examples, GitHub Actions workflows, or automated deployment commands if desired.
