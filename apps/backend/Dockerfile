FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --filter backend... --frozen-lockfile=false
COPY . .
WORKDIR /app/apps/backend
CMD sh -c "pnpm prisma:generate && pnpm prisma:migrate && pnpm prisma:seed && pnpm dev"
