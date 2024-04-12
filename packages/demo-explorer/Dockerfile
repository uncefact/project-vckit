FROM node:18 AS builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=16384
COPY ../../pnpm-workspace.yaml .
COPY package.json .
RUN npm install -g pnpm@8.14.0 && pnpm install

COPY . .
WORKDIR /app/packages/example-documents
RUN pnpm run build
WORKDIR /app/packages/react-components
RUN pnpm run build
WORKDIR /app/packages/renderer
RUN pnpm run build
WORKDIR /app/packages/demo-explorer
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/packages/demo-explorer/build/explorer /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
