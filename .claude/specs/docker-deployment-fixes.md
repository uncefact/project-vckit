# Docker/Deployment Fixes (#282, #283, #284, #285)

## Overview

Four related issues affecting VCKit's Docker deployment when used with managed PostgreSQL behind a reverse proxy. All stem from gaps in `entrypoint.sh` and `agent.template.yml`.

## Problem Statement

Deploying VCKit with managed PostgreSQL (DigitalOcean, AWS RDS, GCP Cloud SQL) behind a reverse proxy (nginx with SSL termination) requires three manual workarounds:

1. **Custom entrypoint** to gain control over `agent.yml` generation
2. **`sed` to strip the port from basePath** — the internal container port (`:3332`) leaks into OpenAPI URLs, producing `https://vckit.example.com:3332/agent` instead of `https://vckit.example.com/agent`
3. **`awk` to inject SSL** — `ssl: true` must be injected after every `type: postgres` line because there is no env var for it

Additionally, the DID seed unconditionally prints success regardless of whether `did import` succeeded, causing silent failures that manifest as `ERR_JWS_SIGNATURE_VERIFICATION_FAILED` hours later.

## Issues Addressed

| Issue | Title | Root Cause |
|-------|-------|------------|
| #282 | DID seed fails silently when PostgreSQL requires SSL | SSL not available at seed time; no error checking |
| #283 | Seed script does not check exit code of `did import` | Unconditional success message after `did import` |
| #284 | No environment variable to enable SSL on database connections | `agent.template.yml` has no SSL configuration |
| #285 | basePath includes internal port when deployed behind reverse proxy | basePath uses `${PORT}` (Express bind port) instead of deriving from external-facing `API_DOMAIN` |

## Scope

### In scope

- `entrypoint.sh` — error handling, `SEED_DID` guard, `DATABASE_SSL` in envsubst, `BASEPATH_PORT` computation
- `packages/cli/default/agent.template.yml` — `ssl: ${DATABASE_SSL}` on all DB connections, `${BASEPATH_PORT}` in basePaths
- `local.env` — new env var defaults

### Out of scope

- **Router code changes** (`req.hostname` → `req.get('host')`) — filed as separate follow-up issue. Specifically: `web-did-doc-router.ts` already uses `req.get('host')` (correct), but `api-schema-router.ts`, `api-router.ts`, `v1-vc-api/vc-api-schema-router.ts`, and `v2-vc-api/vc-api-schema-router.ts` use `req.hostname` (excludes port). The follow-up should align all routers to use `req.get('host')`.
- `default.yml` and `default-dev.yml` — local dev configs, hardcoded `:3332`, unaffected
- `Dockerfile` — no changes needed
- `docker-compose.yaml` — no changes needed

### Deployment Prerequisites

When deploying behind a reverse proxy (nginx, Traefik, etc.), the proxy must forward the following headers:

- `X-Forwarded-Proto` — required for correct protocol detection in OpenAPI schema URLs
- `Host` — required for correct DID document resolution
- `X-Forwarded-For` — recommended for logging

## Design

### 1. Entrypoint Error Handling and SEED_DID (#282, #283)

**Current behaviour:**
```sh
echo "Seeding test identifier..."
cat did-web-identifier.json | node packages/cli/build/cli.js did import
echo "Test identifier seeded."
```

The seed runs unconditionally and reports success regardless of exit code.

**New behaviour:**
```sh
if [ "${SEED_DID}" = "false" ]; then
  echo "DID seeding disabled (SEED_DID=false)."
elif [ ! -f did-web-identifier.json ]; then
  echo "DID seeding skipped (did-web-identifier.json not found)."
else
  echo "Seeding test identifier..."
  cat did-web-identifier.json | node packages/cli/build/cli.js did import || { echo "ERROR: DID seed failed"; exit 1; }
  echo "Test identifier seeded."
fi
```

**Design decisions:**
- **Hard fail on seed error** — a container without its DID is useless; it will 500 on every credential operation. Better to fail loud at boot than chase signature verification errors through logs.
- **`SEED_DID` env var** — defaults to `true` (backward compatible). Set to `false` to skip seeding even when the seed file is present. Not all deployments seed DIDs.
- **File existence check** — if `did-web-identifier.json` is not present, seeding is skipped. The hard fail only triggers when a seed is attempted and fails.
- **Distinct skip messages** — the log differentiates between "disabled by config" and "file not found" to aid debugging.
- **Database access required** — `did import` initialises a Veramo agent which connects to the database. If the database is not yet ready, the import will fail and the container will exit. The orchestrator (Docker restart policy, Kubernetes) handles this via crash-loop restart.

### 2. DATABASE_SSL Environment Variable (#284)

**Current state:** No SSL configuration in the template. The only way to enable SSL is to post-process `agent.yml` with `awk` after `envsubst`.

**New state:** Add `ssl: ${DATABASE_SSL}` to all four TypeORM DataSource connections in `agent.template.yml`:

- `dbConnection`
- `dbConnectionEncrypted`
- `dbConnectionRevocationList`
- `dbConnectionBitstringStatusList`

Each connection gains:
```yaml
ssl: ${DATABASE_SSL}
```

**Behaviour:**
- `DATABASE_SSL` unset or empty → entrypoint defaults to `false` → `ssl: false` in YAML → TypeORM does not use SSL
- `DATABASE_SSL=true` → `ssl: true` in YAML → TypeORM/pg driver connects with SSL
- `DATABASE_SSL=false` → `ssl: false` in YAML → TypeORM does not use SSL

**Note:** An empty `DATABASE_SSL` renders as `ssl:` in YAML, which TypeORM interprets as truthy (enabling SSL). The entrypoint defaults empty/unset values to `false` to prevent this.

**Safe values for `DATABASE_SSL`:**
- `DATABASE_SSL=true` — enables SSL (YAML boolean `true`)
- `DATABASE_SSL=` (empty) — disables SSL (YAML `null`, falsy in JS)
- `DATABASE_SSL` unset — same as empty, disables SSL
- Note: avoid `DATABASE_SSL=false` — while unquoted `false` works correctly (YAML boolean), empty is the recommended way to disable SSL for clarity.

**Design decisions:**
- **Simple boolean only** — no `DATABASE_SSL_CA` or SSL object support. Managed DB providers (DigitalOcean, AWS RDS, GCP Cloud SQL) only need `ssl: true`. Custom CA cert support (SSL object with `ca`, `key`, `cert` properties) cannot be templated through envsubst. Operators needing custom CA certs should edit `agent.yml` directly.
- **Empty default** — `DATABASE_SSL=` in `local.env`. YAML `null` is falsy, `pg` driver checks `if (options.ssl)`, so this is safe.

### 3. basePath Derived from API_DOMAIN (#285)

**Current state:**
- `basePath: :${PORT}` — uses the Express bind port, which is always the internal container port
- `basePath: :3332/agent` — hardcoded, not even templated
- Behind a reverse proxy, OpenAPI URLs include the wrong port: `https://vckit.example.com:3332/agent`

**Root cause:** `PORT` controls what Express listens on (line 32 of `server.ts`: `app.listen(opts.port || server.port)`). It cannot be empty and always reflects the internal container port, not the external-facing port.

**New state:** Compute `BASEPATH_PORT` from `API_DOMAIN` in `entrypoint.sh`:

```sh
# Derive basePath port from API_DOMAIN.
# API_DOMAIN carries the external-facing address:
#   - "localhost:3332" for local dev     → BASEPATH_PORT=":3332"
#   - "vckit.example.com" for production → BASEPATH_PORT="" (empty)
# This prevents the internal container port from appearing in
# OpenAPI URLs when deployed behind a reverse proxy.
case "$API_DOMAIN" in
  *:[0-9]*) BASEPATH_PORT=":${API_DOMAIN##*:}" ;;
  *) BASEPATH_PORT="" ;;
esac
```

Template changes:

| Location | Current | New |
|----------|---------|-----|
| V1 VC API (line 184) | `basePath: :${PORT}` | `basePath: ${BASEPATH_PORT}` |
| V2 VC API (line 191) | `basePath: :${PORT}` | `basePath: ${BASEPATH_PORT}` |
| Agent API schema (line 233) | `basePath: :3332/agent` | `basePath: ${BASEPATH_PORT}/agent` |

**Design decisions:**
- **Derive from `API_DOMAIN`, not `PORT`** — `API_DOMAIN` already carries the correct external-facing address as seen by clients. `PORT` is the Express bind port and cannot be empty. Set `API_DOMAIN` to the address clients use to reach the service — if behind a proxy on standard ports (80/443), omit the port (e.g. `vckit.example.com`).
- **Rejected `EXTERNAL_PORT` env var** — unnecessary complexity. `API_DOMAIN` already exists and carries the right information. The downstream VCS service uses `EXTERNAL_PORT` but that's because VCS generates URLs differently.
- **POSIX shell, no sed** — the `case`/parameter-expansion approach works in Alpine's `ash` shell without external dependencies.
- **`default.yml` and `default-dev.yml` untouched** — these are standalone local dev configs with hardcoded `:3332` that don't go through `envsubst`. They are unaffected.

**Verification:**

| `API_DOMAIN` value | `BASEPATH_PORT` | basePath result | Correct? |
|-------------------|-----------------|-----------------|----------|
| `localhost:3332` | `:3332` | `:3332`, `:3332/agent` | Yes — same as today for local Docker |
| `vckit.example.com` | (empty) | (empty), `/agent` | Yes — no spurious port for production |
| `vckit.example.com:8080` | `:8080` | `:8080`, `:8080/agent` | Yes — custom port preserved |
| (empty) | (empty) | (empty), `/agent` | Yes — safe fallback |

### 4. Entrypoint.sh — Full Updated Script

```sh
#!/bin/sh

echo "Updating agent.yml with environment variables..."

# Derive basePath port from API_DOMAIN.
# API_DOMAIN carries the external-facing address:
#   - "localhost:3332" for local dev     → BASEPATH_PORT=":3332"
#   - "vckit.example.com" for production → BASEPATH_PORT="" (empty)
# This prevents the internal container port from appearing in
# OpenAPI URLs when deployed behind a reverse proxy.
case "$API_DOMAIN" in
  *:[0-9]*) BASEPATH_PORT=":${API_DOMAIN##*:}" ;;
  *) BASEPATH_PORT="" ;;
esac

export BASEPATH_PORT

# Replace variables in the agent.yml file with the exported environment variables
envsubst '${DATABASE_TYPE},${DATABASE_NAME},${DATABASE_HOST},${DATABASE_PORT},${DATABASE_USERNAME},${DATABASE_PASSWORD},${DATABASE_ENCRYPTION_KEY},${DATABASE_SSL},${BASEPATH_PORT},${PORT},${PROTOCOL},${API_DOMAIN},${API_KEY}' < /app/agent.template.yml > /app/agent.yml

echo "Agent.yml updated."

# Seed test identifier
# - SEED_DID=false explicitly disables seeding
# - Missing seed file skips silently (supports custom images without seed)
# - Failed import exits the container (a DID-less server would 500 on all credential ops)
# Note: did import requires database access — if the DB is not ready, the container
# will exit and the orchestrator (Docker restart policy / Kubernetes) handles retry.
if [ "${SEED_DID}" = "false" ]; then
  echo "DID seeding disabled (SEED_DID=false)."
elif [ ! -f did-web-identifier.json ]; then
  echo "DID seeding skipped (did-web-identifier.json not found)."
else
  echo "Seeding test identifier..."
  cat did-web-identifier.json | node packages/cli/build/cli.js did import || { echo "ERROR: DID seed failed"; exit 1; }
  echo "Test identifier seeded."
fi

# Execute the Docker CMD
exec "$@"
```

### 5. local.env Updates

Add:
```env
DATABASE_SSL=
SEED_DID=true
```

## Files Modified

| File | Changes |
|------|---------|
| `entrypoint.sh` | BASEPATH_PORT computation, DATABASE_SSL in envsubst, SEED_DID guard, hard fail on seed error |
| `packages/cli/default/agent.template.yml` | `ssl: ${DATABASE_SSL}` on 4 DB connections, `${BASEPATH_PORT}` in 3 basePaths |
| `local.env` | Add `DATABASE_SSL=` and `SEED_DID=true` |
| `README.md` | Document `SEED_DID` env var, note breaking change (seed failures now exit container) |
| `documentation/docs/agent-configuration/config-agent-file.md` | Document `DATABASE_SSL` property on DB connections, clarify basePath derivation from `API_DOMAIN` |
| `documentation/docs/get-started/did-web/how-to-create/seed-identifier.md` | Document `SEED_DID` env var, document hard-fail behaviour on seed error |

## Environment Variables

| Variable | Default | When unset | Purpose | New? |
|----------|---------|------------|---------|------|
| `DATABASE_SSL` | (empty) | No SSL (same as empty) | Enable SSL on PostgreSQL connections. Set to `true` for managed PostgreSQL. | Yes |
| `SEED_DID` | `true` | Seeds if file exists (same as `true`) | Enable/disable DID seeding at container start. Set to `false` to skip. | Yes |
| `BASEPATH_PORT` | (computed) | N/A — always computed | Port prefix for OpenAPI basePaths, derived from `API_DOMAIN`. Internal, not user-facing. | Yes |
| `API_DOMAIN` | `localhost:3332` | — | External-facing address as seen by clients. Omit port if behind proxy on standard ports. | Existing (clarified) |

## Backward Compatibility

- **Existing Docker deployments without SSL**: `DATABASE_SSL=` (empty) → same behaviour as today
- **Existing Docker deployments with DID seeding**: `SEED_DID` defaults to `true` → same behaviour, but now fails loud on error instead of silently
- **Existing `local.env` users**: new variables have safe defaults
- **Local dev outside Docker**: `default.yml` and `default-dev.yml` unchanged
- **Breaking**: deployments where `did import` was silently failing will now fail at boot. This is intentional — those deployments were already broken (credentials would fail verification).

## Testing Strategy

- Shell test: verify `BASEPATH_PORT` extraction logic with various `API_DOMAIN` values (localhost:3332, vckit.example.com, vckit.example.com:8080, empty)
- Shell test: verify `SEED_DID` guard logic (disabled, file missing, file present)
- Integration: Docker build and start with `local.env` (local dev path)
- Integration: Docker build and start with production-like env (no port in API_DOMAIN, DATABASE_SSL=true)
- Manual: verify OpenAPI schema URLs are correct in both scenarios
- Manual: verify DID seed failure causes container exit
- Manual: verify `SEED_DID=false` skips seeding

## Migration Notes

**Breaking change**: Deployments where `did import` was silently failing will now fail at container startup (`exit 1`). This is intentional — those deployments were already broken (credentials would fail verification). Operators who do not seed DIDs should set `SEED_DID=false` or remove `did-web-identifier.json` from their image. Flag this in the release announcement.
