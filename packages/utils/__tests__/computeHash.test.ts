import { computeHash } from '../src/computeHash';

describe('compute hash', () => {
  it('should compute the hash of the content', () => {
    const content = '<p>Hello, world!</p>';
    expect(computeHash(content)).not.toBeNull();
    expect(computeHash(content)).toBe(
      'zQmW6CePCb3i7BB1tWYKT8jxsNWXdv6meoLSpY1E2622ph4',
    );
  });

  it('should throw error when content is empty', () => {
    expect(() => computeHash('')).toThrow('Content is required');
  });
});
