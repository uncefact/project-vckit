import crypto from 'crypto';

const messages = ['0', '1', '2'];

const sha256 = (data: any) => {
  const v = crypto.createHash('sha256').update(data, 'utf8');
  return v.digest('hex');
};

it('nonce generation is deterministic', () => {
  //   const rootNonce = crypto.randomBytes(32).toString('hex');
  const rootNonce =
    '98dd61bc4176ba0b734fe3e476849cfc64576a54932c26142674fb1b455f6305';
  const messagesWithNonces = messages.map((m, i) => {
    return { message: m, nonce: sha256(m + i + rootNonce) };
  });
  expect({
    rootNonce:
      '98dd61bc4176ba0b734fe3e476849cfc64576a54932c26142674fb1b455f6305',
    messagesWithNonces: [
      {
        message: '0',
        nonce:
          'b565e99498dfa37e549dd79ddc66676706d92ccf3148bc454145b75763417f82',
      },
      {
        message: '1',
        nonce:
          '6fb3b299799ec02480328dbf4ed18fed3663ab52558b7fed300bcac5530f58db',
      },
      {
        message: '2',
        nonce:
          'f9acd62e7feb0f14b8e30e0502fdbc092268eb4db67c61ddf7d48ab8743c88bb',
      },
    ],
  }).toEqual({ rootNonce, messagesWithNonces });
});
