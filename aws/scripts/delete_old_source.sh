#!/bin/bash
# Delete old source
if [ -d /usr/local/agent_server ]; then
  rm -rf /usr/local/agent_server
fi

mkdir -vp /usr/local/agent_server