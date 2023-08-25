#!/bin/bash
source /home/ec2-user/.bashrc
cd /home/ec2-user/agent_server
pnpm vckit config
# Start server
pm2 start pnpm -- vckit server