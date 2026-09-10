# Build from an isolated context containing the root manifests, shared TS settings,
# core-types, and did-provider-webvh. Exclude node_modules, build, and generated data.
FROM node:20.12.2-bookworm-slim
RUN npm install --global pnpm@8.14.0
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig.settings.json packages/tsconfig.settings.json
COPY packages/core-types packages/core-types
COPY packages/did-provider-webvh packages/did-provider-webvh
RUN pnpm install --filter @uncefact/vckit-did-provider-webvh... --frozen-lockfile --ignore-scripts \
    && pnpm exec tsc -b packages/did-provider-webvh \
    && chown -R node:node /workspace
USER node
CMD ["node", "packages/did-provider-webvh/conformance/run.mjs", "/suite", "--fresh", "--output=/output"]
