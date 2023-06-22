import { IAgentContext, IDIDManager } from '@vckit/core-types'
import {
  AbstractDidDiscoveryProvider,
  IDIDDiscoverMatch,
  IDIDDiscoveryProviderResult,
  IDIDDiscoveryDiscoverDidArgs,
} from '@veramo/did-discovery'

/**
 * A DID discovery provider that can filter DIDs by the `alias` used internally in
 * {@link @veramo/did-manager#DIDManager | DIDManager}
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class AliasDiscoveryProvider implements AbstractDidDiscoveryProvider {
  readonly name = 'alias'

  async discoverDid(
    args: IDIDDiscoveryDiscoverDidArgs,
    context: IAgentContext<IDIDManager>,
  ): Promise<IDIDDiscoveryProviderResult> {
    let matches: IDIDDiscoverMatch[] = []
    try {
      const identifiers = await context.agent.didManagerFind({
        alias: args.query,
      })
      matches = identifiers.map((identifier) => ({
        did: identifier.did,
        metaData: {
          alias: identifier.alias,
        },
      }))
    } catch (e) {}

    return {
      provider: this.name,
      matches,
    }
  }
}
