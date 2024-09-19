#!/bin/bash
# Restart codedeploy agent
sudo service codedeploy-agent stop
sudo rm -rf /opt/codedeploy-agent/deployment-root/*
sudo service codedeploy-agent start

# Stop server
pm2 stop all

# Delete old source
if [ -d /home/ec2-user/agent_server ]; then
  sudo rm -rf /home/ec2-user/agent_server
fi

sudo mkdir -vp /home/ec2-user/agent_server