const express = require('express')
const path = require('path')
const fs = require('fs/promises')

/**
 * Express router that serves agent explorer
 * @param {array} config - example [{schemaUrl: 'https://example.com/open-api.json', apiKey: 'test123', name: 'Agent' }]
 * @returns express router
 */
const ExplorerRouter = (config) => {
  const router = express.Router()
  router.use('/static', express.static(path.join(__dirname, '../build/static')))

  router.get('/*', async function (req, res) {
    let html = (
      await fs.readFile(path.join(__dirname, '../build', 'index.html'))
    ).toString()
    html = html.replace(
      'window.PRE_CONFIGURED_AGENTS=void 0',
      'window.PRE_CONFIGURED_AGENTS=' + JSON.stringify(config),
    )
    res.send(html)
  })

  return router
}

module.exports = {
  ExplorerRouter,
}
