/**
 * Provides a {@link @veramo/credential-w3c#CredentialPlugin | plugin} for the {@link @veramo/core#Agent} that
 * implements
 * {@link @vckit/core-types#ICredentialIssuer} interface.
 *
 * @packageDocumentation
 */
import { CredentialPlugin } from './action-handler.js'

/**
 * @deprecated please use {@link CredentialPlugin} instead
 * @public
 */
const CredentialIssuer = CredentialPlugin
export { CredentialIssuer, CredentialPlugin }

// For backward compatibility, re-export the plugin types that were moved to core in v4
export { ICredentialIssuer, ICredentialVerifier } from '@vckit/core-types'
