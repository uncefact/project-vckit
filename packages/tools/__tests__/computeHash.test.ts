import { jest } from '@jest/globals';
import { computeHash } from '../src/hash/computeHash';

describe('compute hash', () => {
  it('should compute hash', async () => {
    const hash = await computeHash('hello world');
    expect(hash).toBe('zQmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4');
  });

  it('should throw error when value is empty', async () => {
    await expect(computeHash('')).rejects.toThrow('Value is invalid');
  });

  it('should throw error when value is not a string', async () => {
    // @ts-expect-error
    await expect(computeHash(123)).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash(true)).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash(NaN)).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash(null)).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash(undefined)).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash({})).rejects.toThrow('Value is invalid');

    // @ts-expect-error
    await expect(computeHash([])).rejects.toThrow('Value is invalid');
  });
});
