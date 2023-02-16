import { getKeysForMnemonic } from './keys';

describe('getKeysForMnemonic', () => {
  it('should generate keys for the mnemonic code', async () => {
    const mnemonic =
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact';
    const keys = await getKeysForMnemonic('ed25519', mnemonic);
    expect(keys).toBeDefined();
  });
});
