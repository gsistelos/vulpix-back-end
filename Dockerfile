FROM node:slim AS base

# Install everything as early as possible to avoid reinstalling when rebuilding
# OpenSSL is required for Prisma, and needs to be installed before `prisma generate`
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Prisma stuff
COPY prisma prisma
RUN pnpx prisma generate

COPY package.json pnpm-lock.yaml ./

FROM base AS build

RUN pnpm install

# Configuration build files
COPY tsconfig.json tsconfig.build.json ./
COPY nest-cli.json .

COPY src src

RUN pnpm build

FROM base AS prod

RUN pnpm install --prod

COPY --from=build /app/dist dist

COPY secrets secrets

ENTRYPOINT [ "node", "dist/main.js" ]
