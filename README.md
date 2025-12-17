# Personal Portfolio & Services Website

A static-exported Next.js 16 site that showcases Chen Kai's work, achievements, and contact options. The project is configured to deploy automatically to GitHub Pages via GitHub Actions.

## Local development

```bash
pnpm install
pnpm dev
```

## Build & preview static export

```bash
pnpm build
pnpm export
npx serve out
```

## Contact form configuration

The in-page contact form posts to `process.env.NEXT_PUBLIC_CONTACT_ENDPOINT`. Configure it with any HTTPS endpoint that accepts a JSON payload such as Formspree, Basin, or a serverless worker.

If the variable is **not** provided, submissions fall back to opening the user's email client with a prefilled `mailto:` link.

### Example: Formspree

1. Create a form endpoint at https://formspree.io/
2. Copy the endpoint URL (e.g. `https://formspree.io/f/abcdwxyz`).
3. Set it in GitHub repository **variables** (recommended)

   ```
   NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

   or create a `.env.local` for local testing:

   ```env
   NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and on manual triggers.

### What the workflow does

1. Installs pnpm & Node 20.
2. Installs dependencies with `pnpm install --frozen-lockfile`.
3. Builds + exports static assets via `pnpm build && pnpm export`.
4. Uploads the `out/` directory as a Pages artifact and deploys it using `actions/deploy-pages`.

### Required repository settings

1. **Pages** → Source: `GitHub Actions`.
2. (Optional) Repository variable `GITHUB_PAGES_BASE_PATH` if the repo name is **different** from the published path.
   - Defaults to `${{ github.event.repository.name }}` which works for the common `username.github.io/<repo>` pattern.
3. (Optional) Repository variable/secret `NEXT_PUBLIC_CONTACT_ENDPOINT` for the contact form endpoint.

Once the workflow completes, GitHub Pages will host the site at the URL shown in the `deploy` job output.
# ppportfolio
