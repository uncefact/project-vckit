#!/bin/bash
# Install dependencies
source /home/ec2-user/.bashrc
cd /home/ec2-user/agent_server
pnpm install
pnpm build
