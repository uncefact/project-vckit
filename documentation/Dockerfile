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
# Use a stable nginx image that runs as uid 101 and listens on 8080, so nginx
# needs no root
FROM nginxinc/nginx-unprivileged:1.30.6-alpine3.24 as deploy

# Set the working directory
WORKDIR /usr/share/nginx/html/

# Copy what we've built from production
COPY --from=production /home/node/app/build ./

# Redirects stay relative, so a request for a directory without its trailing
# slash keeps the host and port the browser used rather than nginx's own 8080.
COPY nginx-redirects.conf /etc/nginx/conf.d/redirects.conf

EXPOSE 8080

# Probe 127.0.0.1, not localhost: BusyBox wget tries ::1 first, and nginx may
# listen on IPv4 only.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
