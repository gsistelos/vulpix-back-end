FROM node:slim AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml .
COPY tsconfig.json tsconfig.build.json .
COPY nest-cli.json .

COPY src src
COPY prisma prisma

FROM base AS build

RUN pnpm install

RUN pnpm build

FROM base AS prod

RUN pnpm install --prod

FROM base

COPY --from=build /app/dist dist
COPY --from=prod /app/node_modules node_modules

COPY .env .

ENTRYPOINT [ "node", "--env-file=.env", "dist/main.js" ]
