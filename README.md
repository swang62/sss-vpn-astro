# SSS-VPN

> Personal VPN SaaS for users in high-censorship regions (China, Iran, Russia).

[![Build & Test](https://github.com/swang62/sss-vpn-astro/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/swang62/sss-vpn-astro/actions/workflows/ci-tests.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

Fully self-contained stack — no external dependencies means I can pack up and move IPs in minutes when the GFW comes knocking. Only external dependencies are Cloudflare and Stripe, so if those are blocked, then there are much bigger problems to be worried about.

---

## Features

### Signup & Accounts

- Free 3 day trial — sign up, verify your email, connect in under a minute
- 3 subscription tiers (Basic 100GB / Pro 300GB / Premium 600GB)
- Data add-ons — buy extra GB without changing your plan
- No contracts — cancel anytime, one-time or monthly billing

### Devices

- Unlimited devices per account — share with your whole household
- Supports iOS, Android, Mac, and PC
- VPN clients have automatic updates, easy to use, and are open source
- Premium tier includes a pre-configured WiFi6 router, shipped within China

### Infrastructure

- Self-hosted analytics — no telemetry, no logging, no tracking
- US-based nodes with Cloudflare protection — ChatGPT, Google, YouTube, all accessible

---

## Tech Stack

| Layer | Stack |
|---|---|
| **Framework** | Astro, React 19, Hono 4 |
| **Auth** | better-auth (email/password, Turnstile, rate-limiting) |
| **Database** | Drizzle ORM + Turso (libSQL), local + remote sync |
| **UI** | Tailwind CSS 4, shadcn/ui, lucide, next-themes |
| **Payments** | Stripe (checkout, webhooks, customer portal) |
| **Infrastructure** | Docker, Single VPS |
| **Tooling** | PNPM 11, TypeScript 5.9, Vitest 3, Biome |

---

## Local Development

You'll need a Stripe sandbox account with test subscriptions tagged `basic`, `pro`, `premium`. Also need to install Hiddify Manager on a server, either local VM or cloud VPS. For Stripe webhooks, use a local tunnel like ngrok.

```bash
pnpm install
cp .env.test .env        # add your API keys
pnpm seed                # seed admin user + product data
pnpm dev                 # http://localhost:4321
```

---

## Deploying

The entire stack runs under Docker Compose. Login with the seeded default account from above. Admin roles and account impersonation is enabled with better-auth.

```bash
docker compose up -d
```

This starts:
- **app** — the Astro SSR app (port 4321)
- **db** — libSQL server with optional S3 replication (port 8888)
- **redis** — rate limiting + caching (port 6379)

Environment variables are loaded from your `.env` file at runtime. See [Environment Variables](#environment-variables) below.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | Auth token signing key |
| `DB_AUTH_TOKEN` | Yes | Basic auth for libSQL |
| `HIDDIFY_API_KEY` | Yes | Hiddify admin API key |
| `SITE_URL` | Yes | Public URL of the deployment |
| `STRIPE_SECRET_KEY` | Yes | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook secret |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret |
| `PUBLIC_TURNSTILE_SITEKEY` | Yes | Turnstile site key (public) |


---

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start dev server with HMR            |
| `pnpm build`        | Production build                     |
| `pnpm check`        | Typecheck all Astro files            |
| `pnpm lint`         | Lint & format check via Biome        |
| `pnpm format`       | Auto-fix lint & format issues        |
| `pnpm test`         | Run changed tests                    |
| `pnpm db:migrate`   | Generate & apply DB migrations       |
| `pnpm seed`         | Seed dev database                    |
| `pnpm start:docker` | Start via Docker Compose             |
| `pnpm gitleaks`     | Scan for leaked secrets              |

---

## Security

| Measure | How |
|---|---|
| **Input validation** | Zod schemas on every API endpoint |
| **Stripe webhooks** | Signature-verified with webhook secret |
| **Bot protection** | Turnstile captcha on signup, Cloudflare WAF protection |
| **Rate limiting** | Redis-backed, per-path per-IP with Cloudflare fallback |
| **Security headers** | CORS, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **SQL injection** | Not possible — Drizzle ORM parameterized queries |

---

## Contributing

PRs are welcome, just message me first if you want to work on a feature. Please run the following commands before submitting a PR:

```bash
pnpm lint       # check formatting + lint rules
pnpm test:all   # full test suite
pnpm gitleaks   # verify no secrets leaked
pnpm check      # typecheck all files
```

---

## Acknowledgements

- **[Hiddify Manager](https://github.com/hiddify/hiddify-manager)** — The VPN that powers everything.

---

## License

[GNU General Public License v3.0](LICENSE)
