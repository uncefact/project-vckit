#!/bin/bash

set -e

config_file=$(cat ./infrastructure/api/databaseSeed/configFile.json)
vc_api="https://${VC_API_DOMAIN}"

# cURL to confirm the endpoint.  Retry mechanism is exponential, doubling each time
echo "Making sure API endpoint is up and running.  Delays can occur on this step due to API gateway permissions being actioned"
timeout 300 bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' '${vc_api}')" != "404" ]]; do sleep 30; done' || false

if [ $1 = "seed" ]; then
  # Replace or create the config file
  put_payload='{"configFile": '${config_file}'}'
  curl -f -X PUT -H "Content-Type: application/json" -d "${put_payload}" "${vc_api}/seed/config-files/${SEED_CONFIG_FILE_ID}"

elif [ $1 = "delete" ]; then
  # Delete config file
  curl -f -X DELETE "${vc_api}/config-file/${SEED_CONFIG_FILE_ID}"
else
  echo "Invalid input arg. Must be one of: ['seed', 'delete']"
fi

