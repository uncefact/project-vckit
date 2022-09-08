#!/bin/bash

set -e

# Set AWS credentials as environment variables
OUT=$(aws sts assume-role --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_ROLENAME} --role-session-name cicd_automation_session);\
export AWS_ACCESS_KEY_ID=$(echo ${OUT} | jq -r '.Credentials''.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo ${OUT} | jq -r '.Credentials''.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo ${OUT} | jq -r '.Credentials''.SessionToken')

# Login to self-hosted backend
pulumi login ${PULUMI_STATE_URL} -C infrastructure/;

pulumi stack select ${APP_NAME}-${ENV} --create -C infrastructure/;

# Run pulumi command
if [ $1 = "preview" ]; then
    pulumi preview -s ${APP_NAME}-${ENV} --non-interactive -C infrastructure/;
elif [ $1 = "up" ]; then
    pulumi up -s ${APP_NAME}-${ENV} --yes --non-interactive -C infrastructure/;
elif [ $1 = "destroy" ]; then
    pulumi destroy -s ${APP_NAME}-${ENV} --yes --non-interactive -C infrastructure/;
else
  echo "Invalid input arg. Must be one of: ['preview', 'up', 'destroy']"
fi
