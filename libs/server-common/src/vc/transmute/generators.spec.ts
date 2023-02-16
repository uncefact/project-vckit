import crypto from 'crypto';
import { generators } from './generators';
describe('generators', () => {
  it('should generate did key', async () => {
    const keys = await generators.didKey('ed25519');
    expect(keys).toBeDefined();
  });

  it('should generate did key using private key passed', async () => {
    const privateKey = crypto.randomBytes(32);
    const keys = await generators.didKey('ed25519', privateKey);

    expect(keys).toBeDefined();
  });
});
