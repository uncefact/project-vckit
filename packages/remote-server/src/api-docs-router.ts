import { Router } from 'express'
import { RequestWithAgent } from './request-agent-router.js'

/**
 * Creates a router that exposes {@link @vckit/core#Agent} open api documentation browser
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const ApiDocsRouter = (): Router => {
  const router = Router()
  const rapidoc = `<!doctype html>
  <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes'>
      <script src="https://cdn.jsdelivr.net/npm/rapidoc@9.3.4/dist/rapidoc-min.min.js"></script>
    </head>
    <body>
      <rapi-doc
          spec-url="../open-api.json"
          theme="light"
          primary-color="#006ba4"
          render-style="read"
          show-method-in-nav-bar="as-colored-text"
          show-header="false"
          show-info="true"></rapi-doc>
      </rapi-doc>
    </body>
  </html>
  `
  router.get('/', (req: RequestWithAgent, res) => {
    res.status(200)
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(rapidoc));
  })

  return router
}
