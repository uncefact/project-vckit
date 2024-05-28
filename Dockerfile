# Stage 1: Build
FROM node:21 as build

WORKDIR /app

# Default arguments for environment variables
ARG DATABASE_TYPE=postgres
ARG DATABASE_USERNAME=postgres
ARG DATABASE_PASSWORD=postgres
ARG DATABASE_NAME=vckit
ARG DATABASE_HOST=localhost
ARG DATABASE_PORT=5432
ARG DATABASE_ENCRYPTION_KEY=29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c
ARG PORT=3332
ARG PROTOCOL=http
ARG API_DOMAIN=localhost:3332

# Set environment variables
ENV DATABASE_TYPE=${DATABASE_TYPE}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_ENCRYPTION_KEY=${DATABASE_ENCRYPTION_KEY}
ENV PORT=${PORT}
ENV PROTOCOL=${PROTOCOL}
ENV API_DOMAIN=${API_DOMAIN}

# Copy necessary files
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY lerna.json .
COPY packages/cli/default/agent.template.yml ./agent.template.yml

COPY packages/tsconfig.json packages/
COPY packages/tsconfig.settings.json packages/

# Install gettext for envsubst command
RUN apt-get update && apt-get install gettext -y

# Substitute environment variables in agent template file
RUN envsubst '${DATABASE_TYPE},${DATABASE_NAME},${DATABASE_HOST},${DATABASE_PORT},${DATABASE_USERNAME},${DATABASE_PASSWORD},${DATABASE_ENCRYPTION_KEY},${PORT},${PROTOCOL},${API_DOMAIN}' \
< ./agent.template.yml \
> ./agent.yml

# Copy package.json for each package
COPY packages/bitstringStatusList/package.json packages/bitstringStatusList/
COPY packages/cli/package.json packages/cli/
COPY packages/core-types/package.json packages/core-types/
COPY packages/credential-merkle-disclosure-proof/package.json packages/credential-merkle-disclosure-proof/
COPY packages/credential-oa/package.json packages/credential-oa/
COPY packages/credential-router/package.json packages/credential-router/
COPY packages/encrypted-storage/package.json packages/encrypted-storage/
COPY packages/example-documents/package.json packages/example-documents/
COPY packages/oauth-middleware/package.json packages/oauth-middleware/
COPY packages/remote-server/package.json packages/remote-server/
COPY packages/renderer/package.json packages/renderer/
COPY packages/revocation-list-2020/package.json packages/revocation-list-2020/
COPY packages/tools/package.json packages/tools/
COPY packages/utils/package.json packages/utils/
COPY packages/vc-api/package.json packages/vc-api/

# Install dependencies
RUN npm install -g pnpm@8.14.0
RUN pnpm install

# Copy the source code of each package
COPY packages/bitstringStatusList/ packages/bitstringStatusList/
COPY packages/cli/ packages/cli/
COPY packages/core-types/ packages/core-types/
COPY packages/credential-merkle-disclosure-proof/ packages/credential-merkle-disclosure-proof/
COPY packages/credential-oa/ packages/credential-oa/
COPY packages/credential-router/ packages/credential-router/
COPY packages/encrypted-storage/ packages/encrypted-storage/
COPY packages/example-documents/ packages/example-documents/
COPY packages/oauth-middleware/ packages/oauth-middleware/
COPY packages/remote-server/ packages/remote-server/
COPY packages/renderer/ packages/renderer/
COPY packages/revocation-list-2020/ packages/revocation-list-2020/
COPY packages/tools/ packages/tools/
COPY packages/utils/ packages/utils/
COPY packages/vc-api/ packages/vc-api/

# Build the project
RUN pnpm build

# Stage 2: Run
FROM node:21-alpine as vckit-api

WORKDIR /app

# Copy the agent config file
COPY --from=build /app/agent.yml ./agent.yml

# Copy built artifacts and node_modules from the build stage
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/packages/bitstringStatusList/build/ packages/bitstringStatusList/build/
COPY --from=build /app/packages/bitstringStatusList/node_modules/ packages/bitstringStatusList/node_modules/
COPY --from=build /app/packages/bitstringStatusList/package.json packages/bitstringStatusList/package.json

COPY --from=build /app/packages/cli/build/ packages/cli/build/
COPY --from=build /app/packages/cli/node_modules/ packages/cli/node_modules/
COPY --from=build /app/packages/cli/package.json packages/cli/package.json

COPY --from=build /app/packages/core-types/build/ packages/core-types/build/

COPY --from=build /app/packages/credential-merkle-disclosure-proof/build/ packages/credential-merkle-disclosure-proof/build/

COPY --from=build /app/packages/credential-router/build/ packages/credential-router/build/
COPY --from=build /app/packages/credential-router/node_modules/ packages/credential-router/node_modules/
COPY --from=build /app/packages/credential-router/package.json packages/credential-router/package.json

COPY --from=build /app/packages/encrypted-storage/build/ packages/encrypted-storage/build/
COPY --from=build /app/packages/encrypted-storage/node_modules/ packages/encrypted-storage/node_modules/
COPY --from=build /app/packages/encrypted-storage/package.json packages/encrypted-storage/package.json

COPY --from=build /app/packages/example-documents/build/ packages/example-documents/build

COPY --from=build /app/packages/remote-server/build/ packages/remote-server/build/
COPY --from=build /app/packages/remote-server/node_modules/ packages/remote-server/node_modules/
COPY --from=build /app/packages/remote-server/package.json packages/remote-server/package.json

COPY --from=build /app/packages/renderer/build/ packages/renderer/build/
COPY --from=build /app/packages/renderer/node_modules/ packages/renderer/node_modules/
COPY --from=build /app/packages/renderer/package.json packages/renderer/package.json

COPY --from=build /app/packages/revocation-list-2020/build/ packages/revocation-list-2020/build/
COPY --from=build /app/packages/revocation-list-2020/node_modules/ packages/revocation-list-2020/node_modules/
COPY --from=build /app/packages/revocation-list-2020/package.json packages/revocation-list-2020/package.json

COPY --from=build /app/packages/tools/build/ packages/tools/build/
COPY --from=build /app/packages/tools/node_modules/ packages/tools/node_modules/
COPY --from=build /app/packages/tools/package.json packages/tools/package.json

COPY --from=build /app/packages/utils/build/ packages/utils/build/
COPY --from=build /app/packages/utils/node_modules/ packages/utils/node_modules/
COPY --from=build /app/packages/utils/package.json packages/utils/package.json

COPY --from=build /app/packages/vc-api/build/ packages/vc-api/build/
COPY --from=build /app/packages/vc-api/node_modules/ packages/vc-api/node_modules/
COPY --from=build /app/packages/vc-api/package.json packages/vc-api/package.json
COPY --from=build /app/packages/vc-api/src/vc-api-schemas/vc-api.yaml packages/vc-api/src/vc-api-schemas/vc-api.yaml

# Expose the port
EXPOSE ${PORT}

# Command to run the application
CMD [ "node", "packages/cli/build/cli.js", "server" ]
