FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter web... --frozen-lockfile=false
COPY . .
WORKDIR /app/apps/web
CMD ["pnpm","dev"]
