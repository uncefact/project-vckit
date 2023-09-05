#!/bin/bash
source /home/ec2-user/.bashrc
cd /home/ec2-user/agent_server

if [ ! -f /home/ec2-user/agent.yml ]; then
  pnpm vckit config --filename /home/ec2-user/agent.yml
fi
# Start server
pm2 start pnpm -- vckit server --config /home/ec2-user/agent.yml