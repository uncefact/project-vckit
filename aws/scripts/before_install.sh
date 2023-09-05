#!/bin/bash
if git --version; then
    echo "git already installed"
else
    sudo yum install git -y
fi

if node --version; then
    echo "node already installed"
else
    sudo yum install gcc-c++ make -y
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install 16
    npm install -g pnpm@8.6.0
    npm install pm2 -g
fi