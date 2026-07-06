# SSS-VPN

Personal VPN SaaS for users in China. Uses Hiddify for the VPN backend and Stripe for billing. Self-contained stack minimizes external dependencies for portability and reliability (outages and IP bans are common in China/GFW).

## Tech Stack

**Framework:** Astro (SSR), React 19, Hono 4  
**Auth:** better-auth (email/password, Turnstile captcha, Redis rate-limiting)  
**DB:** Drizzle ORM + Turso (libSQL), local + remote sync  
**UI:** Tailwind CSS 4, shadcn/ui, lucide-react, next-themes  
**Payments:** Stripe (checkout, webhooks, customer portal)  
**Infra:** Docker (libsql-server, Redis 8), Sentry, Postmark
**Tooling:** PNPM 11, TypeScript 5.9, Vitest 3, ESLint, Prettier

## Local Development

You will need a local tunnel (ex. ngrok.io) to test any stripe webhooks. Besides that, you will need a stripe sandbox account with test subscriptions for each of the 3 tiers (tagged with `basic/pro/premium`), and 1 fixed price router tagged with `router`.

```bash
pnpm install
cp .env.test .env   # edit as needed
pnpm seed           # add admin and test users, seed product data
pnpm dev
```

Visit the dev server at `http://localhost:4321`. HMR is built-in so all local changes will be reflected instantly.

## Commands

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `pnpm dev`          | Start dev server               |
| `pnpm build`        | Production build               |
| `pnpm check`        | Typecheck Astro files          |
| `pnpm lint`         | Run ESLint                     |
| `pnpm test`         | Run changed tests              |
| `pnpm db:migrate`   | Generate & apply DB migrations |
| `pnpm seed`         | Seed dev database              |
| `pnpm start:docker` | Start via Docker compose       |

## Acknowledgements

- **[Hiddify Manager](https://github.com/hiddify/hiddify-manager)** — The VPN management panel that powers the backend infrastructure.

## License

[GNU General Public License v3.0](LICENSE)
