# Deployment Notes

- Build images per app with Dockerfiles.
- Set production env vars (JWT, DB, Redis, payment/notification credentials).
- Terminate TLS at reverse proxy.
- Enable Sentry by setting `SENTRY_DSN`.
