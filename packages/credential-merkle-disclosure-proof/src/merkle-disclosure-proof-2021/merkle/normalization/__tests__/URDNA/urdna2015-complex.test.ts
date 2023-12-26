import { documentLoader } from '../../../../__fixtures__';

import { objectToMessages, messagesToObject } from '../../urdna2015';

it('complex', async () => {
  const context = [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/suites/merkle-jws-2021/v1',
    {
      alsoKnownAs: 'https://www.w3.org/ns/activitystreams#alsoKnownAs',
      nickName: 'https://www.w3.org/ns/activitystreams#nickName',
    },
  ];
  const obj1 = {
    '@context': context,
    id: 'http://example.edu/credentials/3732',
    type: ['VerifiableCredential'],
    issuer: 'https://example.edu/issuers/14',
    issuanceDate: '2010-01-01T19:23:24Z',
    credentialSubject: {
      alsoKnownAs: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      nickName: 'Bob',
    },
    proof: {
      type: 'MerkleDisclosureProof2021',
      created: '2021-08-22T19:36:43Z',
      verificationMethod:
        'did:key:z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD#z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD',
      proofPurpose: 'assertionMethod',
      normalization: 'urdna2015',
      // proofs:
      // 'eJzN0keOq1gAQNG91JSWyBiGD0wyyWRDqwcmh0fOXv2vXsIflFQ7OLq6/34BV4CMvFtFF/he7U9WrMly396mh8TfHVporyV/WhaMnwcFUgNDPixijVFvSdrJRasRGV5mObGzeTV5fOyKW/x3ycc9cGW2uo9x+n4h6EPc1Nhvp/O+VYxyaSAxD/iKN4xwKMddgQO9FxVNM37ZNu9QdAwSMPds+HgvfcmtJxOK+QA9Pa2dr3++gKRSL0vzpjNnpqTnmSnoJCyQeCqb1q6ctCJZEq5WRtKBv4WcEJk0DSkbGRtrcNOJ9DpuKkmPQS9kCG5al2QQCMwgAgkoiYw86RMLge6dMMRVJe88Ak2zXkKyXNaNiplOxkNJf/5JspWPmbZQ113zyUoeUPvN7XiYKZtPav6IwQfWXDbaq+8r+y3kXP/eQYu1ay91ihwD3CazT6p2AAMjPsuV7kYCa/UmagYgN+eHVIY8yUlLJTtn4R7NJitZ0FySOayw4SLHt1KvVEPAr6sePBcYzi1d0hiwoyYJd3Azu8VhkGDo6n6UIjYd2/qvK9s3i2hITGYVh8Z3Yqu3F2bguRksT2lJruZZHgPcCl1ifwv5TYtCteVEV7FIanUGux05t9HnPfaWPMIElnGUqaFn7l0BU8BYO6sjFfmeZIgfWNTt9GMfkM9lzF3XBiBuE+sGEar+SbJp10dlZoHB268Gse9XSXLbZct10LEzqrsrauRN3aMvbf4t5CRHPJGcsywaosxepJsaeJNVBxWERZw3Jh3H9SYUqqyawCHXtLlzq3ZUl6xvyhuL2a15HRCJNgpFhHfOIVPV7kbAAL4xmI8YMjAlRUuEVUWKn5QfCGZUJzSafZhKJkJRrqeR/zOMx9O+smIbtqILObn43ssENgdAoERuyoOb3z3vi46YGvqTjKwV5huZSzC5l8MegpdP+caOAyAyNH40Jp+cqEm6GFFAIMBEFolwXONLmfJae3QHWvSNA/uOLOrZLUbSS8FsLtz2twyzJcJjFUve0Y6hjQ1u9Oo+QfbSOEQZw90Hi85lYXUiaH+M8d8fDYCNnA==',
      jws:
        'eyJhbGciOiJFZERTQSJ9.ImRidXZCQUlVaTdyU3RvSWNlQXViRUphTnZ4WmFFUi8vYkxDRmVSdGtuUGs9Ig.ZXlKaGJHY2lPaUpGWkVSVFFTSXNJbUkyTkNJNlptRnNjMlVzSW1OeWFYUWlPbHNpWWpZMElsMTkuLlVGbHVBSHktaktmSW1veEdiNXFtRmRycHd1bTZ3RTdwc1NFb3YwWGtjUk9sZ254SHMtbnFzUDFGcDdUWWt2WWlPVHZBMFY0MFNwdDB3UTNUV0NKa0NB',
    },
  };
  const messages1 = await objectToMessages(obj1, { documentLoader });

  expect(messages1).toEqual([
    '<http://example.edu/credentials/3732> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#credentialSubject> <urn:bnid:_:c14n0> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#issuer> <https://example.edu/issuers/14> .',
    '<urn:bnid:_:c14n0> <https://www.w3.org/ns/activitystreams#alsoKnownAs> "did:example:ebfeb1f712ebc6f1c276e12ec21" .',
    '<urn:bnid:_:c14n0> <https://www.w3.org/ns/activitystreams#nickName> "Bob" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <http://purl.org/dc/terms/created> "2021-08-22T19:36:43Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#MerkleDisclosureProof2021> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#jws> "eyJhbGciOiJFZERTQSJ9.ImRidXZCQUlVaTdyU3RvSWNlQXViRUphTnZ4WmFFUi8vYkxDRmVSdGtuUGs9Ig.ZXlKaGJHY2lPaUpGWkVSVFFTSXNJbUkyTkNJNlptRnNjMlVzSW1OeWFYUWlPbHNpWWpZMElsMTkuLlVGbHVBSHktaktmSW1veEdiNXFtRmRycHd1bTZ3RTdwc1NFb3YwWGtjUk9sZ254SHMtbnFzUDFGcDdUWWt2WWlPVHZBMFY0MFNwdDB3UTNUV0NKa0NB" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#normalization> "urdna2015" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#proofPurpose> <https://w3id.org/security#assertionMethod> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#verificationMethod> <did:key:z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD#z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD> .',
  ]);
  const obj2 = await messagesToObject(messages1, { context, documentLoader });
  expect(obj2).toEqual({
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/merkle-jws-2021/v1',
      {
        alsoKnownAs: 'https://www.w3.org/ns/activitystreams#alsoKnownAs',
        nickName: 'https://www.w3.org/ns/activitystreams#nickName',
      },
    ],
    id: 'http://example.edu/credentials/3732',
    type: 'VerifiableCredential',
    credentialSubject: {
      id: 'urn:bnid:_:c14n0',
      alsoKnownAs: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      nickName: 'Bob',
    },
    issuanceDate: '2010-01-01T19:23:24Z',
    issuer: 'https://example.edu/issuers/14',
    proof: {
      type: 'MerkleDisclosureProof2021',
      created: '2021-08-22T19:36:43Z',
      jws:
        'eyJhbGciOiJFZERTQSJ9.ImRidXZCQUlVaTdyU3RvSWNlQXViRUphTnZ4WmFFUi8vYkxDRmVSdGtuUGs9Ig.ZXlKaGJHY2lPaUpGWkVSVFFTSXNJbUkyTkNJNlptRnNjMlVzSW1OeWFYUWlPbHNpWWpZMElsMTkuLlVGbHVBSHktaktmSW1veEdiNXFtRmRycHd1bTZ3RTdwc1NFb3YwWGtjUk9sZ254SHMtbnFzUDFGcDdUWWt2WWlPVHZBMFY0MFNwdDB3UTNUV0NKa0NB',
      normalization: 'urdna2015',
      proofPurpose: 'assertionMethod',
      verificationMethod:
        'did:key:z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD#z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD',
    },
  });
  const messages2 = await objectToMessages(obj2, { documentLoader });
  // stability after normalization
  expect(messages2).toEqual(messages1);
  const obj3 = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/merkle-jws-2021/v1',
      {
        alsoKnownAs: 'https://www.w3.org/ns/activitystreams#alsoKnownAs',
        nickName: 'https://www.w3.org/ns/activitystreams#nickName',
      },
    ],
    id: 'http://example.edu/credentials/3732',
    type: 'VerifiableCredential',
    credentialSubject: {
      id: 'urn:bnid:_:c14n0',
      alsoKnownAs: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      // nickName: 'Bob',
    },
    issuanceDate: '2010-01-01T19:23:24Z',
    issuer: 'https://example.edu/issuers/14',
    proof: {
      type: 'MerkleDisclosureProof2021',
      created: '2021-08-22T19:36:43Z',
      jws:
        'eyJhbGciOiJFZERTQSJ9.ImRidXZCQUlVaTdyU3RvSWNlQXViRUphTnZ4WmFFUi8vYkxDRmVSdGtuUGs9Ig.ZXlKaGJHY2lPaUpGWkVSVFFTSXNJbUkyTkNJNlptRnNjMlVzSW1OeWFYUWlPbHNpWWpZMElsMTkuLlVGbHVBSHktaktmSW1veEdiNXFtRmRycHd1bTZ3RTdwc1NFb3YwWGtjUk9sZ254SHMtbnFzUDFGcDdUWWt2WWlPVHZBMFY0MFNwdDB3UTNUV0NKa0NB',
      normalization: 'urdna2015',
      proofPurpose: 'assertionMethod',
      verificationMethod:
        'did:key:z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD#z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD',
    },
  };
  const messages3 = await objectToMessages(obj3, { documentLoader });
  expect(messages3).toEqual([
    '<http://example.edu/credentials/3732> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#credentialSubject> <urn:bnid:_:c14n0> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .',
    '<http://example.edu/credentials/3732> <https://www.w3.org/2018/credentials#issuer> <https://example.edu/issuers/14> .',
    '<urn:bnid:_:c14n0> <https://www.w3.org/ns/activitystreams#alsoKnownAs> "did:example:ebfeb1f712ebc6f1c276e12ec21" .',
    // '<urn:bnid:_:c14n0> <https://www.w3.org/ns/activitystreams#nickName> "Bob" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <http://purl.org/dc/terms/created> "2021-08-22T19:36:43Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#MerkleDisclosureProof2021> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#jws> "eyJhbGciOiJFZERTQSJ9.ImRidXZCQUlVaTdyU3RvSWNlQXViRUphTnZ4WmFFUi8vYkxDRmVSdGtuUGs9Ig.ZXlKaGJHY2lPaUpGWkVSVFFTSXNJbUkyTkNJNlptRnNjMlVzSW1OeWFYUWlPbHNpWWpZMElsMTkuLlVGbHVBSHktaktmSW1veEdiNXFtRmRycHd1bTZ3RTdwc1NFb3YwWGtjUk9sZ254SHMtbnFzUDFGcDdUWWt2WWlPVHZBMFY0MFNwdDB3UTNUV0NKa0NB" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#normalization> "urdna2015" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#proofPurpose> <https://w3id.org/security#assertionMethod> .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://w3id.org/security#verificationMethod> <did:key:z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD#z6MktxqTMmhYnpEmAWztj18MjKcX4pmKpiuJAoWCtiL4WjbD> .',
  ]);
});
