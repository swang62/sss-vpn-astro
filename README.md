# SSS-VPN

> Personal VPN SaaS for users in high-censorship regions (China, Iran, Russia).

[![Build & Test](https://github.com/swang62/sss-vpn-astro/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/swang62/sss-vpn-astro/actions/workflows/ci-tests.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

Fully self-contained stack — no external dependencies means I can pack up and move IPs in minutes when the GFW comes knocking. Only external dependencies are Cloudflare and Stripe, so if those are blocked, then there are bigger problems to be worried about.

---

## Features

### Signup & Accounts

- Auto-provisioned — sign up, verify your email, connected in under a minute
- Turnstile captcha blocks bots on signup
- 3 subscription tiers (basic / pro / premium) via Stripe
- Data add-on packs — buy extra GB without changing your plan

### Devices

- Unlimited devices per account — share with your whole household
- Supports iOS, Android, Mac, and PC via [Hiddify](https://github.com/hiddify/hiddify-manager)
- Premium tier includes a pre-configured WiFi6 router, shipped within China

### Infrastructure

- Redis-backed rate limiting (50 req / 30s per IP)
- Self-hosted Umami analytics — no Google
- One `docker compose up` to deploy everything

---

## How It Works

User signs up → Turnstile captcha verified → Email verification sent → better-auth creates session → Hiddify provisions VPN user → Stripe handles billing → Config is pushed to user's device.

All services run in Docker. The Astro SSR app serves both the frontend (React) and API routes (Hono). A local libSQL database syncs to a remote replica for redundancy.

---

## Tech Stack

| Layer | Stack |
|---|---|
| **Framework** | Astro (SSR), React 19, Hono 4 |
| **Auth** | better-auth (email/password, Turnstile, Redis rate-limiting) |
| **Database** | Drizzle ORM + Turso (libSQL), local + remote sync |
| **UI** | Tailwind CSS 4, shadcn/ui, lucide-react, next-themes |
| **Payments** | Stripe (checkout, webhooks, customer portal) |
| **Infrastructure** | Docker (libsql-server, Redis 8), Sentry, Postmark |
| **Tooling** | PNPM 11, TypeScript 5.9, Vitest 3, Biome |

---

## Quick Start

You'll need a Stripe sandbox account with test subscriptions tagged `basic`, `pro`, `premium`, and a one-time price tagged `router`. For Stripe webhook testing, use a local tunnel (ngrok, bore, etc.).

```bash
pnpm install
cp .env.test .env        # add your API keys
pnpm seed                # seed admin user + product data
pnpm dev                 # http://localhost:4321
```

---

## Deploying

The entire stack runs under Docker Compose:

```bash
docker compose up -d
```

This starts:
- **sssvpn** — the Astro SSR app (port 4321)
- **db** — libSQL server with optional S3 backup (port 8888)
- **redis** — rate limiting + caching (port 6379)

Environment variables are loaded from your `.env` file at runtime. See [Environment Variables](#environment-variables) below.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | Auth token signing key |
| `DB_AUTH_TOKEN` | Yes | Basic auth for libSQL (format: `user:pass`) |
| `SITE_URL` | Yes | Public URL of the deployment |
| `STRIPE_SECRET_KEY` | For payments | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook signing secret |
| `HIDDIFY_API_KEY` | Yes | Hiddify admin API key |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret |
| `POSTMARK_TOKEN` | For emails | Postmark server token |
| `PUBLIC_TURNSTILE_SITEKEY` | Yes | Turnstile site key (public) |
| `PUBLIC_SENTRY_DSN` | Optional | Sentry DSN for error tracking |
| `SENTRY_TOKEN` | Optional | Sentry auth token (build-time) |
| `REDIS_URL` | Optional | Redis connection (defaults to internal) |
| `REDIS_PASS` | Optional | Redis password |

A full template is available in `.env.test`.

---

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start dev server with HMR            |
| `pnpm build`        | Production build                     |
| `pnpm check`        | Typecheck all Astro files            |
| `pnpm lint`         | Lint & format check via Biome        |
| `pnpm format`       | Auto-fix lint & format issues        |
| `pnpm format:astro` | Format `.astro` files via Prettier   |
| `pnpm test`         | Run changed tests (Vitest)           |
| `pnpm test:all`     | Run full test suite                  |
| `pnpm db:migrate`   | Generate & apply DB migrations       |
| `pnpm seed`         | Seed dev database                    |
| `pnpm start:docker` | Start via Docker Compose             |
| `pnpm gitleaks`     | Scan git history for leaked secrets  |

---

## Security

| Measure | How |
|---|---|
| **Git history** | Confirmed clean via Gitleaks across all 150 commits |
| **Input validation** | Zod schemas on every API endpoint |
| **Stripe webhooks** | Signature-verified with webhook secret |
| **Bot protection** | Turnstile captcha on signup |
| **Rate limiting** | Redis-backed, per-path per-IP with Cloudflare fallback |
| **Security headers** | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **SQL injection** | Not possible — Drizzle ORM parameterized queries |

---

## Contributing

PRs are welcome. The pre-commit hook runs lint-staged, tests, and a Gitleaks secret scan. Make sure all three pass before opening a PR.

```bash
pnpm lint       # check formatting + lint rules
pnpm test:all   # full test suite
pnpm gitleaks   # verify no secrets leaked
```

---

## Acknowledgements

- **[Hiddify Manager](https://github.com/hiddify/hiddify-manager)** — The VPN management panel that powers the backend infrastructure.

---

## License

[GNU General Public License v3.0](LICENSE)
