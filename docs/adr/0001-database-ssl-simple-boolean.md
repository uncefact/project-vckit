# ADR-0001: DATABASE_SSL as Simple Boolean

## Status

Accepted

## Date

2026-03-25

## Context

VCKit's Docker deployment needs SSL support for managed PostgreSQL providers (DigitalOcean, AWS RDS, GCP Cloud SQL). The `agent.template.yml` has no SSL configuration, forcing operators to post-process the generated `agent.yml` with `awk` to inject `ssl: true`.

TypeORM's SSL option accepts either a boolean (`true`) or an object (`{ ca, key, cert, rejectUnauthorized }`) for custom CA certificates.

## Decision

Support only a simple boolean toggle via `DATABASE_SSL` environment variable.

- `DATABASE_SSL=true` enables SSL
- `DATABASE_SSL=` (empty/unset) disables SSL
- No support for SSL object properties (custom CA certs, client certificates) via environment variables

## Alternatives Considered

### DATABASE_SSL + DATABASE_SSL_CA

Add both `DATABASE_SSL` (boolean) and `DATABASE_SSL_CA` (path to CA certificate bundle) environment variables. This would support AWS RDS with `rds-combined-ca-bundle.pem` and similar setups.

**Rejected because:**
- Speculative — no current user has requested custom CA support
- `envsubst` cannot template complex objects into YAML
- Operators needing custom CA certs are sophisticated enough to edit `agent.yml` directly
- The `NODE_EXTRA_CA_CERTS` environment variable provides an alternative workaround at the Node.js level

## Consequences

- Covers 95%+ of managed PostgreSQL deployments (DigitalOcean, AWS RDS, GCP Cloud SQL all work with `ssl: true`)
- Operators needing custom CA certificates must edit `agent.yml` directly after `envsubst` processing
- If custom CA support is needed frequently in future, a follow-up can add `DATABASE_SSL_CA` without breaking existing deployments

## Related Issues

- #282, #284
