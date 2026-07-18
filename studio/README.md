# SirKatchaz Signaturez — Sanity Studio

This folder is a standalone Sanity Studio used to manage products shown on
the live site. It is deployed separately from the website and is only used
by people who add/edit products.

## One-time setup (you, the site owner)

```bash
cd studio
npm install
npx sanity login          # opens a browser, log in / create a free Sanity account
npx sanity init --env     # links this folder to a new (or existing) Sanity project
```

`sanity init` will ask you to either create a new project or pick an
existing one, and to choose a dataset name (use `production`). It writes
the projectId/dataset into `sanity.cli.ts`. Copy that same projectId and
dataset into `sanity.config.ts` (replace the `YOUR_PROJECT_ID` placeholders)
and into `/config.js` at the repo root.

Then deploy the Studio itself so your partner can use it from a browser,
no install required:

```bash
npx sanity deploy
```

It will ask you to choose a studio hostname, e.g. `sirkatchaz`, which makes
the Studio available at `https://sirkatchaz.sanity.studio`.

## CORS

So the live website (running in a browser) is allowed to read data from
this project, add these origins in https://sanity.io/manage → your project
→ API → CORS Origins (no credentials needed, since reads are public):

- `https://www.sirkatchaz.com`
- `https://<your-github-username>.github.io`

## Day-to-day use (your partner)

Your partner just visits the deployed Studio URL
(`https://sirkatchaz.sanity.studio`), logs in with an account you've
invited (Project → Members in sanity.io/manage), and adds/edits Product
documents. Changes go live on the website immediately — no rebuild, no
redeploy, nothing for you to do.
