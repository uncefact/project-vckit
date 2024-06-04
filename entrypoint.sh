#!/bin/sh

echo "Updating agent.yml with environment variables..."

# Replace variables in the agent.yml file with the exported environment variables
envsubst '${DATABASE_TYPE},${DATABASE_NAME},${DATABASE_HOST},${DATABASE_PORT},${DATABASE_USERNAME},${DATABASE_PASSWORD},${DATABASE_ENCRYPTION_KEY},${PORT},${PROTOCOL},${API_DOMAIN}' < /app/agent.template.yml > /app/agent.yml

echo "Agent.yml updated."

# Execute the Docker CMD
exec "$@"