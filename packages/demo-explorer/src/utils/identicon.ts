import md5 from 'md5'

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

export const identiconUri = (id: string) => {
  return GRAVATAR_URI + md5(id) + '?s=200&d=retro'
}
