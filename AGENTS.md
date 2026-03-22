# Project Notes

## Vercel Publishing

- Canonical production URL: `https://word-constructor.vercel.app/`
- Treat temporary `*.vercel.app` deployment URLs as raw deploy previews unless explicitly confirming the production alias.
- Preferred publish path: push the desired commit to `main`. This triggers [`.github/workflows/vercel-production.yml`](/Users/tatyanakudryavtseva/LocalWork/P101/.github/workflows/vercel-production.yml), which deploys production on Vercel.
- Manual fallback from this machine: `mkdir -p /tmp/p101-node-gyp && npm_config_devdir=/tmp/p101-node-gyp pnpm dlx vercel@28.20.0 --prod --yes`
- After a manual fallback deploy, verify the production alias still points at the latest deployment. If needed, repoint it with: `mkdir -p /tmp/p101-node-gyp && npm_config_devdir=/tmp/p101-node-gyp pnpm dlx vercel@28.20.0 alias set <deployment-url> word-constructor.vercel.app`
- Reason for the fallback command: the machine's default Node version is too old for the latest Vercel CLI, so use the pinned CLI version above if a manual deploy is needed.
