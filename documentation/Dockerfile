## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:lts as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app

# Copy the source code over
COPY --chown=node:node . /home/node/app/

## Production ##################################################################
# Define a production target which doesn't use devDeps
FROM base as production

# Install dependencies
RUN npm install

# Build the Docusaurus app
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:stable-alpine as deploy

# Set the working directory
WORKDIR /usr/share/nginx/html/

# Copy what we've built from production
COPY --from=production /home/node/app/build ./
