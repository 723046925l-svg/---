# Architecture Summary

- Backend: FastAPI modular API, SQLAlchemy ORM, JWT auth, RBAC policies.
- DB: PostgreSQL with auditable entities (samples, tests, report versions).
- Frontend: React + TypeScript + Vite with core pages.
- Deployment: Docker Compose for local Ubuntu.

## Workflow State Machine
Received -> In Progress -> Completed -> QA Review -> Released (+ rejected path)

## Revision Model
Released results immutable; revisions create new report versions with reason.
