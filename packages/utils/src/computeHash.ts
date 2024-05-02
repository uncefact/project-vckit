import crypto from 'crypto';
import multihashes from 'multihashes';

/**
 * Computes a hash of the template.
 * @param content - The template need to hash.
 * @returns The hash of the template as a multibase encoded string.
 */
export const computeHash = (content: string): string => {
  if (!content) {
    throw new Error('Content is required');
  }
  // Create a SHA-256 hash of the template
  const hash = crypto.createHash('sha256').update(content).digest();

  // Create a multihash with SHA-256 algorithm and 256 bits output length
  const multihash = multihashes.encode(hash, 'sha2-256');

  // Encode the multihash using multibase with the prefix 'z'
  const multibaseEncodedHash = multihashes.toB58String(multihash);

  // Add prefix 'z' to the multibase encoded hash
  const multibaseEncodedHashWithPrefix = `z${multibaseEncodedHash}`;
  return multibaseEncodedHashWithPrefix;
};
