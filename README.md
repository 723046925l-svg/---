# Iraq Clinic Monorepo MVP

## Prerequisites
- Node.js 20 LTS
- pnpm 9+
- Docker + Docker Compose

## One workflow
1. `pnpm install`
2. `docker compose up -d`
3. `pnpm dev`

Backend: http://localhost:3001 (Swagger: `/api/docs`)  
Web: http://localhost:3000

## Demo accounts
All passwords: `Password123!`
- super@demo.iq (SUPER_ADMIN)
- admin@demo.iq (CLINIC_ADMIN)
- doctor@demo.iq (DOCTOR)
- reception@demo.iq (RECEPTIONIST)
- patient@demo.iq (PATIENT)

Demo OTP: `000000` (`DEMO_MODE=true`)

## Environment
Copy from `.env.example`. Defaults are demo-safe and mock-first.

## Platforms
Works on Windows/macOS/Linux with Docker Desktop + Node 20.

## Mobile
Flutter app is in `apps/mobile` and runs separately via `flutter run`.
