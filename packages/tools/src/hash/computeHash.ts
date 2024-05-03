import { sha256 } from 'multiformats/hashes/sha2';
import { base58btc } from 'multiformats/bases/base58';

export const computeHash = async (value: string): Promise<string> => {
  if (!value || typeof value !== 'string') {
    throw new Error('Value is invalid');
  }

  const bytes = new TextEncoder().encode(value);
  const hash = await sha256.digest(bytes);
  const multibasedHash = base58btc.encode(hash.bytes);
  return multibasedHash;
};
