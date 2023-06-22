import { useEffect, useState } from 'react'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { createAgent, IAgentPlugin, IResolver, TAgent } from '@vckit/core'
import { ConnectorInfo, createWeb3Agent } from './web3Agent'
import { hooks as metamaskHooks, metaMask } from './metaMask'
import { AgentRestClient } from '@vckit/remote-client'
import { IdentifierProfilePlugin } from '../plugins/IdentifierProfile'

export const VeramoWeb3Provider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  //@ts-ignore
  const config = window.PRE_CONFIGURED_AGENTS

  const [isLoading, setIsLoading] = useState(true)
  const [web3agent, setWeb3Agent] = useState<TAgent<IResolver>>()
  const [preConfiguredAgents, setPreConfiguredAgents] =
    useState<Array<TAgent<IResolver>>>()

  const metaMaskIsActive = metamaskHooks.useIsActive()
  const metaMaskChainId = metamaskHooks.useChainId()
  const metaMaskAccounts = metamaskHooks.useAccounts()
  const metaMaskProvider = metamaskHooks.useProvider()

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  useEffect(() => {
    const connectors: ConnectorInfo[] = []
    if (
      metaMaskProvider &&
      metaMaskChainId &&
      metaMaskAccounts &&
      metaMaskIsActive
    ) {
      connectors.push({
        chainId: metaMaskChainId,
        accounts: metaMaskAccounts,
        provider: metaMaskProvider,
        isActive: metaMaskIsActive,
        name: 'metamask',
      })
    }
    void createWeb3Agent({ connectors }).then(setWeb3Agent)

    return () => {
      setWeb3Agent(undefined)
    }
  }, [metaMaskIsActive, metaMaskChainId, metaMaskAccounts, metaMaskProvider])

  useEffect(() => {
    if (config && Array.isArray(config)) {
      const createAgents = async (
        config: Array<{ schemaUrl: string; apiKey?: string }>,
      ): Promise<Array<TAgent<IResolver>>> => {
        const agents = config.map(
          async (c: { schemaUrl: string; apiKey?: string; name?: string }) => {
            const response = await fetch(c.schemaUrl)
            const schema = await response.json()
            return createAgent<IResolver>({
              context: {
                name: c.name || 'Default',
              },
              plugins: [
                new AgentRestClient({
                  url: schema.servers[0].url,
                  headers: c.apiKey
                    ? { Authorization: 'Bearer ' + c.apiKey }
                    : undefined,
                  enabledMethods: Object.keys(schema['x-methods']),
                  schema: schema,
                }),
                new IdentifierProfilePlugin(),
              ],
            })
          },
        )
        return Promise.all(agents)
      }

      createAgents(config)
        .then(setPreConfiguredAgents)
        .then(() => setIsLoading(false))
        .catch((e) => {
          console.log(e)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      setPreConfiguredAgents([])
      setIsLoading(true)
    }
  }, [config])

  const plugins: IAgentPlugin[] = [new IdentifierProfilePlugin()]
  let allAgents = []
  if (web3agent) {
    allAgents.push(web3agent)
  }
  if (preConfiguredAgents) {
    allAgents = allAgents.concat(preConfiguredAgents)
  }

  return (
    <VeramoProvider agents={allAgents} plugins={plugins}>
      {!isLoading && children}
      {isLoading && <div>Loading...</div>}
    </VeramoProvider>
  )
}
