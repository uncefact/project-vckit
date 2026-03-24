#!/bin/sh

echo "Updating agent.yml with environment variables..."

# Derive basePath port from API_DOMAIN (must be host or host:port only, no path).
# API_DOMAIN carries the external-facing address:
#   - "localhost:3332" for local dev     → BASEPATH_PORT=":3332"
#   - "vckit.example.com" for production → BASEPATH_PORT="" (empty)
# This prevents the internal container port from appearing in
# OpenAPI URLs when deployed behind a reverse proxy.
case "$API_DOMAIN" in
  "["*"]") BASEPATH_PORT="" ;;
  "["*"]:"[0-9]*) BASEPATH_PORT=":${API_DOMAIN##*:}" ;;
  *:[0-9]*) BASEPATH_PORT=":${API_DOMAIN##*:}" ;;
  *) BASEPATH_PORT="" ;;
esac

export BASEPATH_PORT

# Replace variables in the agent.yml file with the exported environment variables
envsubst '${DATABASE_TYPE},${DATABASE_NAME},${DATABASE_HOST},${DATABASE_PORT},${DATABASE_USERNAME},${DATABASE_PASSWORD},${DATABASE_ENCRYPTION_KEY},${DATABASE_SSL},${BASEPATH_PORT},${PORT},${PROTOCOL},${API_DOMAIN},${API_KEY}' < /app/agent.template.yml > /app/agent.yml || { echo "ERROR: Failed to generate agent.yml from template"; exit 1; }

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
  SEED_DATA=$(cat did-web-identifier.json) || { echo "ERROR: Failed to read did-web-identifier.json"; exit 1; }
  printf '%s' "$SEED_DATA" | node packages/cli/build/cli.js did import || { echo "ERROR: DID import failed (exit code $?)"; exit 1; }
  echo "Test identifier seeded."
fi

# Execute the Docker CMD
exec "$@"
