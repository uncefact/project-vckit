# OAuth middleware

OAuth middleware is a package that provides OAuth2 JWT bearer token authentication middleware for Express applications.

## Usage

1. Add the configuration for OAuth middleware to the agent.yml file in the root of your project.

   ```yaml
   - $require: '@uncefact/vckit-oauth-middleware?t=function#apiOAuth'
        $args:
          - issuerBaseURL: <your_issuer_base_url>
            audience: <your_audience>
   ```

   Make sure to replace <your_issuer_base_url> with the base URL of your issuer, and <your_audience> with the audience.

   You can obtain these values from your OAuth provider, such as Auth0 (https://auth0.com/docs).

2. To test the middleware:

- Start the server by running the command `pnpm vckit server`.
- Obtain a JWT token from your OAuth provider, such as Auth0, you can read more about it here: https://auth0.com/docs/secure/tokens/access-tokens/get-access-tokens#example-post-to-token-url.
- Set the obtained JWT token as the value of the `Authorization` header in your requests to the server.
- Make requests to the server, and the OAuth middleware will handle the authentication based on the JWT token provided.
