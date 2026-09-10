import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import express from 'express';
import { once } from 'node:events';
import { get, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { WebvhDidDocRouter } from '../webvh-did-doc-router.js';
import { agentFixture } from './agent-fixture.js';

let fixture: Awaited<ReturnType<typeof agentFixture>>;
let server: Server;
let base: string;
beforeEach(async () => {
  fixture = await agentFixture();
  const app = express();
  app.use(WebvhDidDocRouter({ dbConnection: fixture.db }));
  app.use((_req, res) => res.status(418).json({ fallback: true }));
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterEach(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await fixture.db.destroy();
});
const request = (path: string, host = 'example.com') => new Promise<{ status: number; json: () => any; text: () => string }>((resolve, reject) => {
  get(base + path, { headers: { Host: host } }, response => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', chunk => { body += chunk; });
    response.on('end', () => resolve({ status: response.statusCode!, json: () => JSON.parse(body), text: () => body }));
    response.on('error', reject);
  }).on('error', reject);
});

describe('parallel DID publication', () => {
  it.each([{ segments: [] }, { segments: ['issuers', 'one'] }])('publishes converted documents for $segments with implicit services', async ({ segments }) => {
    const identifier = await fixture.agent.didManagerCreate({ options: { paths: segments } });
    const path = segments.length ? '/' + segments.join('/') : '/.well-known';
    const response = await request(path + '/did.json');
    expect(response.status).toBe(200);
    const doc = await response.json();
    const webDid = 'did:web:example.com' + (segments.length ? ':' + segments.join(':') : '');
    expect(doc.id).toBe(webDid);
    expect(doc.controller).toBe(webDid);
    expect(doc.alsoKnownAs).toEqual([identifier.did]);
    expect(doc.verificationMethod[0].id).toContain(webDid);
    const serviceBase = 'https://example.com' + (segments.length ? '/' + segments.join('/') : '');
    expect(doc.service).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: '#files', type: 'relativeRef', serviceEndpoint: serviceBase }),
      expect.objectContaining({ id: '#whois', type: 'LinkedVerifiablePresentation', serviceEndpoint: serviceBase + '/whois.vp' }),
    ]));
    const logResponse = await request(path + '/did.jsonl');
    const log = (await logResponse.text()).trim().split('\n').map(line => JSON.parse(line));
    expect(log[0].state.id).toBe(identifier.did);
    expect(log).toEqual(await fixture.logStore.getLogForDid(identifier.did));
  });

  it('preserves explicit services and deduplicates aliases', async () => {
    const identifier = await fixture.agent.didManagerCreate({});
    await fixture.agent.didManagerUpdate({ did: identifier.did, document: {
      service: [{ id: identifier.did + '#files', type: 'relativeRef', serviceEndpoint: 'https://files.example/' }],
      alsoKnownAs: ['did:web:example.com', 'did:web:example.com', identifier.did],
    } });
    const doc = await (await request('/.well-known/did.json')).json();
    expect(doc.service.filter((service: any) => service.id.endsWith('#files'))).toEqual([
      { id: 'did:web:example.com#files', type: 'relativeRef', serviceEndpoint: 'https://files.example/' },
    ]);
    expect(doc.alsoKnownAs).toEqual([identifier.did]);
  });

  it('serves a moved history at the old URL and falls through only for unknown did:web DIDs', async () => {
    const identifier = await fixture.agent.didManagerCreate({});
    await fixture.agent.didManagerUpdate({ did: identifier.did, document: {}, options: { portToDomain: 'new.example' } });
    expect((await request('/.well-known/did.jsonl')).status).toBe(200);
    expect(await (await request('/.well-known/did.jsonl')).text()).toBe(await (await request('/.well-known/did.jsonl', 'new.example')).text());
    expect((await request('/.well-known/did.json', 'unknown.example')).status).toBe(418);
  });
});
