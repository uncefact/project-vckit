# ADR-0003: Hard Fail on DID Seed Error with SEED_DID Opt-Out

## Status

Accepted

## Date

2026-03-25

## Context

The Docker entrypoint runs `did import` to seed a test DID identifier before starting the server. If the import fails (e.g. database not reachable, SSL required but not configured), the entrypoint unconditionally prints "Test identifier seeded." and starts the server anyway.

This caused a production incident where the container appeared healthy but all credential verification failed with `ERR_JWS_SIGNATURE_VERIFICATION_FAILED`. The root cause — a missing DID due to failed seed — was difficult to diagnose because:

1. The entrypoint reported success
2. The server started normally
3. Credential issuance worked (VCKit used whatever key it had)
4. Only verification failed, and the error didn't indicate a key mismatch

Additionally, not all VCKit deployments seed DIDs — some manage keys through other mechanisms.

## Decision

1. **Hard fail (`exit 1`)** when `did import` is attempted and fails — the container will not start
2. **`SEED_DID` environment variable** to opt out of seeding — set to `false` to skip, defaults to `true` (backward compatible)
3. **Distinct log messages** for the three possible outcomes:
   - `SEED_DID=false` → "DID seeding disabled (SEED_DID=false)."
   - Seed file not found → "DID seeding skipped (did-web-identifier.json not found)."
   - Seed attempted and failed → "ERROR: DID seed failed" + `exit 1`

## Alternatives Considered

### Warn and continue

Print a clear error message but start the server anyway, allowing the operator to see the error in logs while keeping the container running for debugging.

**Rejected because:**
- A container without its DID will 500 on every credential operation — it's useless
- The "warn and continue" pattern is what caused the original incident
- Container orchestrators (Docker restart, Kubernetes) handle transient failures via restart
- A running-but-broken container is harder to diagnose than a crash-looping one

### File existence as sole opt-out

Only seed if `did-web-identifier.json` exists — no env var needed. Operators who don't want seeding simply don't include the file.

**Rejected because:**
- The seed file is baked into the Docker image via `COPY development/did-web-identifier.json .`
- Operators using the default image would need to build a custom image to opt out
- An env var is simpler and more flexible than image customisation

## Consequences

- **Breaking change**: Deployments where `did import` was silently failing will now fail at container startup. This is intentional — those deployments were already broken.
- Operators who do not seed DIDs must set `SEED_DID=false` or remove the seed file from their image
- The distinct log messages make it immediately clear why seeding was skipped or failed
- `did import` requires database access — if the DB is not ready, the container exits and the orchestrator retries via crash-loop restart

## Related Issues

- #282, #283
