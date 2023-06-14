import { TAgent, ICredentialIssuer } from '@vckit/core-types'
import { Request, Router, json, raw} from 'express'
import * as crypto from 'crypto';

interface RequestWithAgent extends Request {
  agent?: TAgent<ICredentialIssuer>
}

const verifyWebhookEventSignature = (req: Request)  => {
  const WEBHOOK_KEY= process.env.WEBHOOK_KEY

  let computedSignature = crypto.createHmac('sha256', WEBHOOK_KEY).update(req.body.toString()).digest('base64');
  let xeroSignature = req.headers['x-xero-signature'];

  if (xeroSignature === computedSignature) {
    console.log('Signature passed! This is from Xero!');
    return true;
  } else {
    // If this happens someone who is not Xero is sending you a webhook
    console.log('Signature failed. Webhook might not be from Xero or you have misconfigured something...');
    console.log(`Got {${computedSignature}} when we were expecting {${xeroSignature}}`);
    return false;
  }
};

/**
 * Creates a router for handling incoming webhooks from xero.
 *
 * Messages posted to this router get sent to the `createVerifiableCredential` method of the associated agent where this is used.
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const XeroWebhookRouter = (): Router => {
  const router = Router()
  router.use(raw({ limit: '10mb', type: 'application/json' }))

  router.post('/', async (req: RequestWithAgent, res) => {
    console.log(req.body);
    console.log("webhook event received!", req.headers, req.body);
      const fromXero = verifyWebhookEventSignature(req);
      if (!fromXero) res.status(401).send();
      // const event = JSON.parse(req.body);
      // console.log(event);
      if (fromXero) res.status(200).send()

  })
  return router
}
