import { getUuId } from './uuid';

describe('uuid', () => {
  it('should return uuid', () => {
    expect(getUuId()).toBeDefined();
  });
});
