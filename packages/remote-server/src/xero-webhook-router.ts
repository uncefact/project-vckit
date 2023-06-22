import { IAgent } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json, raw } from 'express';
import Debug from 'debug';
import * as crypto from 'crypto';
import { XeroClient } from 'xero-node';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface AgentRouterOptions {
  /**
   * List of exposed methods
   */
  exposedMethods: Array<string>;
}

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
export const XeroWebhookRouter = (options: AgentRouterOptions): Router => {
    const router = Router()
    router.use(raw({ limit: '10mb', type: 'application/json' }))
  
    router.post('/', async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      const agent = req.agent
      if (agent) throw Error('Agent not available');

        const fromXero = verifyWebhookEventSignature(req);
        if (!fromXero) res.status(401).send();
        // TODO: handle parse failure
        const event = JSON.parse(req.body);

        const xero = new XeroClient({
          clientId: process.env.XERO_CLIENT_ID,
          clientSecret: process.env.XERO_CLIENT_SECRET,
          grantType: 'client_credentials'
        });

        const tokenSet = await xero.getClientCredentialsToken();
        
        // TODO: catch me... multiple events?
        const tenantId = event.events[0].tenantId;
        const invoiceId = event.events[0].resourceId;

        const response = await xero.accountingApi.getInvoice(
          tenantId,
          invoiceId
        );

        // TODO: need to refactor mapping function
        // TODO: will xero return multiple invoices per invoiceId? different statuses?
        // const invoice = transform(response.body.invoices[0])
        // const invoiceCredential = agent.routerCreateVerifiableCredential()
        // try agent.dataStoreSaveVerifiableCredential(invoiceCredential)

        // Note: we need to always return 200 to xero if the signature was correct
        // otherwise the webhook delivery will be deactivated.
        res.status(200).send()
  
    })
    return router
};

const verifyWebhookEventSignature = (req: Request)  => {
  const WEBHOOK_KEY = process.env.WEBHOOK_KEY

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
