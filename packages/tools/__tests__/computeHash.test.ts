import { jest } from '@jest/globals';
import { MultibaseEncodedSHA256 } from '../src/hash/multibase-encoded-256';

describe('compute hash', () => {
  let computeHash: any;

  beforeEach(() => {
    const plugin = new MultibaseEncodedSHA256();
    computeHash = plugin.methods.computeHash;
  });

  it('should compute hash', async () => {
    const hash = await computeHash('hello world');
    expect(hash).toBe('zQmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4');
  });

  it('should throw error when value is empty', async () => {
    await expect(computeHash('')).rejects.toThrow('Value is invalid');
  });

  it('should throw error when value is not a string', async () => {
    await expect(computeHash(123)).rejects.toThrow('Value is invalid');

    await expect(computeHash(true)).rejects.toThrow('Value is invalid');

    await expect(computeHash(NaN)).rejects.toThrow('Value is invalid');

    await expect(computeHash(null)).rejects.toThrow('Value is invalid');

    await expect(computeHash(undefined)).rejects.toThrow('Value is invalid');

    await expect(computeHash({})).rejects.toThrow('Value is invalid');

    await expect(computeHash([])).rejects.toThrow('Value is invalid');
  });
});
