FROM node:slim AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# openssl is required for prisma
# netcat-openbsd is required for the wait-for-ip.sh script
RUN apt-get update && apt-get install -y \
    openssl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json ./
COPY nest-cli.json .

COPY src src
COPY prisma prisma

COPY scripts/wait-for-ip.sh /wait-for-ip.sh

FROM base AS build

RUN pnpm install
RUN pnpm build

FROM base AS prod

RUN pnpm install --prod

FROM base

COPY --from=build /app/dist dist
COPY --from=prod /app/node_modules node_modules

COPY .env .

ENTRYPOINT [ "/wait-for-ip.sh", "postgres", "5432", "node --env-file=.env dist/main.js" ]
