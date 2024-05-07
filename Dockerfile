# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile && rm -rf /var/cache/apk/*

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test && bun run build

# install with --production (exclude devDependencies)
FROM build as prod
RUN bun install --frozen-lockfile --production && rm -rf /var/cache/apk/*

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prod /usr/src/app/node_modules ./node_modules
COPY --from=build . .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "index.ts"]