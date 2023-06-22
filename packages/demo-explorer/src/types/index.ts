import { IDIDManager, TAgent } from '@vckit/core'
import { ICredentialIssuer } from '@vckit/credential-w3c'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'
import { JSONSchema7 } from 'json-schema'

export type ConfiguredAgent = TAgent<
  ICredentialIssuer & IDIDManager & ISelectiveDisclosure
>

export interface VCJSONSchema {
  id: string
  name: string
  schema: JSONSchema7
}
