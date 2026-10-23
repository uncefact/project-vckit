FROM node:22 AS builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=16384
COPY . .
RUN npm install -g pnpm@8.14.0 && pnpm install

WORKDIR /app/packages/core-types
RUN pnpm run build
WORKDIR /app/packages/example-documents
RUN pnpm run build
WORKDIR /app/packages/react-components
RUN pnpm run build
WORKDIR /app/packages/renderer
RUN pnpm run build
WORKDIR /app/packages/demo-explorer
RUN pnpm run build

# The unprivileged nginx image runs as uid 101, which cannot bind ports below
# 1024 on every runtime, so nginx listens on 8080 instead of 80.
FROM nginxinc/nginx-unprivileged:1.31.7-alpine3.24
COPY packages/demo-explorer/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/demo-explorer/build/explorer /usr/share/nginx/html
EXPOSE 8080
# Probe 127.0.0.1, not localhost: BusyBox wget tries ::1 first, and nginx may
# listen on IPv4 only.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
