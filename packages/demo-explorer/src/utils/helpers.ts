import { Buffer } from 'buffer'
import { VerifiableCredential, UnsignedCredential } from '@veramo/core'

export function dropFields(data: any, fields: string[]) {
  const _data = { ...data }
  if (!fields) return _data

  fields.forEach((field) => {
    delete _data[field]
  })

  return _data
}

export function convertBase64ToString(base64: string) {
  return Buffer.from(base64, 'base64').toString('utf8')
}
export enum DocumentFormat {
  JWT,
  JSONLD,
  EIP712,
  OA,
}

export function detectDocumentType(document: any): DocumentFormat {
  if (typeof document === 'string' || document?.proof?.jwt)
    return DocumentFormat.JWT
  if (document?.proof?.type === 'EthereumEip712Signature2021')
    return DocumentFormat.EIP712
  if (document?.proof?.type === 'OpenAttestationMerkleProofSignature2018')
    return DocumentFormat.OA
  return DocumentFormat.JSONLD
}

export function getCredentialDate(
  credential: VerifiableCredential | UnsignedCredential,
): Date {
  const dateString = credential.issuanceDate ?? credential.validFrom
  return dateString ? new Date(dateString) : new Date()
}
