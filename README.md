# Poultry LIMS SaaS (On-Prem)

Full-stack Poultry LIMS built with FastAPI + PostgreSQL + React/Vite for local Ubuntu server deployment.

## Project Structure

- `backend/` FastAPI API, SQLAlchemy models, auth/RBAC, workflow, templates, PDF generation, tests.
- `frontend/` React TypeScript UI and smoke tests.
- `docker-compose.yml` Local on-prem stack.
- `.env.example` Environment values.

## Core Features Implemented

- Sample registration (client, submission, sample metadata, multiple tests).
- Mandatory sample workflow with strict transitions:
  - `Received -> In Progress -> Completed -> QA Review -> Released`.
- QR code generation and reprint endpoint.
- Chain-of-custody/audit log table and event logging.
- Test catalog with ISO reference, SLA, pricing, units, positivity rule.
- Result entry, released immutability, report revisioning.
- Bulk CSV import preview + validation errors.
- Dynamic template storage for CoA/TDS.
- CoA PDF generation endpoint.
- Dashboard KPI endpoint.
- Seed endpoint with demo users and test catalog.
- Operational health endpoint.

## Roles (Configured)

- `admin`: all access.
- `analyst`: create submissions/samples, assign tests.
- `head_unit`: enter results, release reports.
- `qc_manager`: QA approval/revision and template editing.
- `head_lab`: revenue/dashboard viewing (read access).

## Run Locally

```bash
docker compose up --build
```

Backend: `http://localhost:8000/docs`
Frontend: `http://localhost:5173`

## Initial Seed Data

Seed API:
```bash
curl -X POST http://localhost:8000/api/seed
```

Default users:
- admin / admin123
- analyst / analyst123
- headunit / head123
- qcmanager / qc123
- headlab / lab123

## Backup Strategy

Daily backup command:
```bash
docker exec -t $(docker ps -qf name=db) pg_dump -U postgres lims > backup_$(date +%F).sql
```

Restore drill:
```bash
cat backup_YYYY-MM-DD.sql | docker exec -i $(docker ps -qf name=db) psql -U postgres -d lims
```

## E2E Test Plan

1. Login as analyst.
2. Register client, submission, sample.
3. Assign tests and analyst.
4. Login as head unit and enter results.
5. Move sample to completed/QA review.
6. Login as QC manager for review and revision if required.
7. Head unit releases sample report.
8. Generate CoA PDF and verify version ID.
9. Verify dashboard counters update (total, released, positive, overdue, revenue).

## Nice-to-have Roadmap Included

- Smart SLA alerts + notifications.
- Work queue by role.
- Batch result entry templates.
- Instrument file ingestion (phase 2).
- Client report portal.
- Template preview sandbox.
- Exception dashboard.
- Data retention and archival automation.
- Restore drill script automation.
- Operational health page enhancements.
