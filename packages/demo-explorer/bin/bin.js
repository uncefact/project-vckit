#!/usr/bin/env node

const express = require('express')
const favicon = require('express-favicon')
const commander = require('commander')
const path = require('path')
const { ExplorerRouter } = require('../lib/express-router')

commander
  .command('serve')
  .description('Launch agent explorer dashboard')
  .option('-p, --port <number>', 'Set port to serve on')
  .option('-s, --schemaUrl <string>', 'Set default agent schema url')
  .option('-n, --name <string>', 'Set default agent name', 'Default')
  .option('-k, --apiKey <string>', 'Set default agent api key')
  .action(async (cmd) => {
    const PORT = process.env.PORT || cmd.port || 5000
    const app = express()

    app.use(favicon(path.join(__dirname, '../build', 'favicon.ico')))

    const config = []

    if (cmd.schemaUrl) {
      config.push({
        schemaUrl: cmd.schemaUrl,
        name: cmd.name,
        apiKey: cmd.apiKey,
      })
    }
    app.use(ExplorerRouter(config))

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
  })

if (!process.argv.slice(2).length) {
  commander.outputHelp()
} else {
  commander.parse(process.argv)
}
