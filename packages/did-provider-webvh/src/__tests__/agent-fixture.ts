import { createAgent, type IDIDManager, type IKeyManager } from '@veramo/core';
import { DIDManager } from '@veramo/did-manager';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { DIDStore, KeyStore, PrivateKeyStore, Entities as VeramoEntities, migrations as VeramoMigrations } from '@veramo/data-store';
import { DataSource } from 'typeorm';
import { WebvhDIDProvider } from '../webvh-did-provider.js';
import { Entities as WebvhEntities } from '../index.js';
import { WebvhDidLogStore } from '../store/webvh-did-log-store.js';
import { migrations } from '../migrations/index.js';
import type { WebvhDIDProviderOptions } from '../types.js';

export async function agentFixture(options: Partial<WebvhDIDProviderOptions> = {}) {
  const db = await new DataSource({ type: 'sqljs', entities: [...VeramoEntities, ...WebvhEntities], migrations: [...VeramoMigrations, ...migrations], migrationsRun: true }).initialize();
  const keyManager = new KeyManager({
    store: new KeyStore(db),
    kms: { local: new KeyManagementSystem(new PrivateKeyStore(db, new SecretBox('0'.repeat(64)))) },
  });
  const didStore = new DIDStore(db);
  const provider = new WebvhDIDProvider({ defaultKms: 'local', defaultDomain: 'example.com', dbConnection: db, ...options });
  const agent = createAgent<IKeyManager & IDIDManager>({
    plugins: [keyManager, new DIDManager({ store: didStore, defaultProvider: 'did:webvh', providers: { 'did:webvh': provider } })],
  });
  return { agent, provider, db, didStore, context: { agent }, logStore: new WebvhDidLogStore(db) };
}
