# ADR-0002: Derive basePath Port from API_DOMAIN

## Status

Accepted

## Date

2026-03-25

## Context

When VCKit is deployed behind a reverse proxy with SSL termination, the OpenAPI schema URLs include the internal container port (e.g. `https://vckit.example.com:3332/agent`). This happens because `basePath` in `agent.template.yml` uses `${PORT}`, which is the Express bind port — always the internal container port.

The `PORT` variable controls what Express listens on (`app.listen(opts.port || server.port)`) and cannot be empty or set to the external port without breaking the server.

## Decision

Derive the basePath port from `API_DOMAIN` rather than `PORT` or a new `EXTERNAL_PORT` variable.

`API_DOMAIN` already carries the external-facing address as seen by clients:
- `localhost:3332` for local dev (includes port)
- `vckit.example.com` for production behind proxy (no port)

The entrypoint computes `BASEPATH_PORT` using POSIX shell parameter expansion:
```sh
case "$API_DOMAIN" in
  *:[0-9]*) BASEPATH_PORT=":${API_DOMAIN##*:}" ;;
  *) BASEPATH_PORT="" ;;
esac
```

## Alternatives Considered

### EXTERNAL_PORT environment variable

Add a dedicated `EXTERNAL_PORT` variable (e.g. `EXTERNAL_PORT=443`) and conditionally omit the port from basePath when it matches the protocol default.

**Rejected because:**
- Unnecessary complexity — `API_DOMAIN` already carries host+port information
- Introduces a new user-facing variable for something already derivable
- The downstream VCS service uses `EXTERNAL_PORT` but that's because VCS generates URLs differently

### Derive from PORT (BASEPATH_PORT=:${PORT})

Compute `BASEPATH_PORT` from `PORT` and allow operators to leave `PORT` empty for production.

**Rejected because:**
- `PORT` controls Express binding — it cannot be empty
- Setting `PORT` to the external port would break the internal listener

### Fix router code to use req.get('host')

Change all schema routers from `req.hostname` to `req.get('host')` so they include the port naturally.

**Deferred because:**
- Touches 4 router files across 2 packages
- `web-did-doc-router.ts` uses `req.get('host')` for DID alias resolution — changing other routers requires verifying no regression in DID resolution
- Template-only fix is lower risk and eliminates the immediate problem
- Filed as separate follow-up issue

## Consequences

- Local Docker dev (`API_DOMAIN=localhost:3332`): basePath includes `:3332` — same as today
- Production behind proxy (`API_DOMAIN=vckit.example.com`): basePath has no port — correct
- Custom port (`API_DOMAIN=vckit.example.com:8080`): basePath includes `:8080` — correct
- `default.yml` and `default-dev.yml` (local dev outside Docker) are unaffected — they have hardcoded `:3332`
- Router code still uses `req.hostname` (excludes port) — a separate follow-up is needed to fully fix dynamic URL construction in schema routers

## Related Issues

- #285
