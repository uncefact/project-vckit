import { Buffer } from 'buffer'

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
