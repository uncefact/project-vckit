import { TAgent, IQRCodeEndpoint } from '@vckit/core-types'
import { Request, Router } from 'express'

interface RequestWithAgent extends Request {
  agent?: TAgent<IQRCodeEndpoint>
}

/**
 * Creates a router that serves credentials from unauthenticated endpoint given the credential hash
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const QRCodeRouter = (options: RequestWithAgent): Router => {
  const router = Router()


  router.get('/:hash', async (req: RequestWithAgent, res) => {
    if (req.agent) {
      try {
        const credential = await req.agent.dataStoreGetVerifiableCredential({
          hash: req.params.hash
        })
        res.json(credential)
      } catch (e) {
        res.status(404).send(e)
      }
    }
  })
  return router
}
