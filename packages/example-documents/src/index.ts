/**
 * Provides a {@link @veramo/credential-ld#CredentialIssuerLD | plugin} for the {@link @veramo/core#Agent} that
 * implements
 * {@link @veramo/credential-ld#ICredentialIssuerLD} interface.
 *
 * This plugin adds support for working with JSON-LD credentials.
 * When installed, this plugin will be automatically used by
 * {@link @veramo/credential-w3c#CredentialPlugin | CredentialPlugin} if the user requests the credential to be signed
 * by one of the installed signature suites.
 *
 * @packageDocumentation
 */
export { credentialsIssueExamples } from './examples/index.js'
