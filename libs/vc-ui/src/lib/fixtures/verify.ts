export const validResults = {
  issuer: { id: 'did:key:123' },
  checks: ['proof', 'status'],
  errors: [],
  warnings: [],
};

export const invalidResults = {
  issuer: { id: 'did:key:123' },
  checks: ['proof'],
  errors: ['proof'],
  warnings: [],
};
