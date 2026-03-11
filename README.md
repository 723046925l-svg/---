# Iraq Health MVP Monorepo

Production-ready MVP monorepo for Iraqi market telehealth + clinic bookings.

## Stack
- Backend: NestJS + Prisma + PostgreSQL + Redis/BullMQ + Swagger (`/api/docs`)
- Web: Next.js App Router SSR + PWA + RTL i18n
- Mobile: Flutter (iOS/Android) with deep links
- Infra: Docker Compose

## Implementation decisions
- Local payment adapter: **Deferred for future update** (user decision #1); currently Mock provider works end-to-end and a ZainCash-shaped adapter stub is included.
- Third notification channel: **WhatsApp**.
- Agora: **tokenless mode** per user instruction (#3), backend returns channel payload only.
- Admin surfaces: **web only**.
- Localization: **English + Arabic (MSA)**.

## Monorepo layout
- `apps/backend` NestJS API
- `apps/web` Next.js PWA SSR
- `apps/mobile` Flutter patient app
- `packages/shared-types` shared enums
- `docs` architecture and guides

## Quick start
```bash
pnpm install
docker compose up --build
```

## Backend docs
- Swagger: `http://localhost:3000/api/docs`

## Demo seeded accounts
- SUPER_ADMIN: `admin@demo.iq` / `Passw0rd!`
- DOCTOR: `+9647700000002` / `Passw0rd!`
- PATIENT: `patient@demo.iq` / `Passw0rd!`
- OTP mock code: `123456`

## Useful commands
```bash
pnpm -C apps/backend prisma:migrate
pnpm -C apps/backend prisma:seed
pnpm -C apps/backend test
pnpm -C apps/web dev
```

## Deploy notes
See `docs/deployment.md`.

## TODO: Next steps to reach 100%
- Load testing scripts (k6/Artillery) for 1000+ concurrent users
- E2E flows with Playwright/Cypress
- Full monitoring integrations (Sentry/DataDog/New Relic)
- CI/CD via GitHub Actions (lint/test/build/deploy)
- Automated Postgres backups to S3
