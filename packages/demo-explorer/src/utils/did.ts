import { VerifiableCredential } from '@veramo/core'

export function shortId(id: string) {
  if (!id) return ''

  function shortDotSeparatedString(str: string) {
    const parts = str.split('.')
    if (parts.length === 1) {
      return str
    }
    return parts
      .map((part) => {
        if (part.length > 10) {
          return part.substring(0, 1) + '.' + part.substring(part.length - 1)
        } else {
          return part
        }
      })
      .join('.')
  }

  const parts = id.split(':')
  return parts
    .map((part) => {
      if (part.length > 41) {
        const str = shortDotSeparatedString(part)
        if (part !== str) return str
        return str.substring(0, 7) + '...' + str.substring(str.length - 5)
      } else {
        return part
      }
    })
    .join(':')
}

export function getIssuerDID(credential: VerifiableCredential): string {
  if (typeof credential.issuer === 'string') {
    return credential.issuer
  } else {
    return credential.issuer.id
  }
}
