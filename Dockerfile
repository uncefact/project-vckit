FROM node:18 as build

WORKDIR /app

COPY packages/cli/default/default-docker.yml ./agent.yml

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY lerna.json .

COPY packages/tsconfig.json packages/
COPY packages/tsconfig.settings.json packages/

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
COPY packages/utils/package.json packages/utils/
COPY packages/vc-api/package.json packages/vc-api/

RUN npm install -g pnpm@8.14.0
RUN pnpm install

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
COPY packages/utils/ packages/utils/
COPY packages/vc-api/ packages/vc-api/

RUN pnpm build


FROM node:18-alpine as vckit-api

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/agent.yml ./agent.yml

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

COPY --from=build /app/packages/utils/build/ packages/utils/build/
COPY --from=build /app/packages/utils/node_modules/ packages/utils/node_modules/
COPY --from=build /app/packages/utils/package.json packages/utils/package.json

COPY --from=build /app/packages/vc-api/build/ packages/vc-api/build/
COPY --from=build /app/packages/vc-api/node_modules/ packages/vc-api/node_modules/
COPY --from=build /app/packages/vc-api/package.json packages/vc-api/package.json
COPY --from=build /app/packages/vc-api/src/vc-api-schemas/vc-api.yaml packages/vc-api/src/vc-api-schemas/vc-api.yaml

EXPOSE 3332

CMD [ "node", "packages/cli/build/cli.js", "server" ]
