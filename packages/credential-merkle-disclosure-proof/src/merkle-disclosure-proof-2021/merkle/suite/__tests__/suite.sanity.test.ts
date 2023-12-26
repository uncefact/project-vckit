import { createProof, deriveProof, verifyProof } from '..';
import { naive } from '../../normalization';

const { objectToMessages, messagesToObject } = naive;

const options = {
  objectToMessages,
  messagesToObject,
  rootNonce: 'urn:uuid:d84cd789-4626-488d-834b-ceb075250d50',
};

describe('disclosure', () => {
  describe('full', () => {
    // trivial still needs at least 2 members...
    it('trivial', async () => {
      const inputDocument = { a: '123', b: [] };
      const proof = await createProof(inputDocument, options);
      const outputDocument = { a: '123', b: [] };
      const derived = await deriveProof(
        outputDocument,
        inputDocument,
        proof,
        options
      );
      const { verified } = await verifyProof(
        derived.document,
        derived.proof,
        options
      );
      expect(verified).toBe(true);
    });

    it('complex', async () => {
      const inputDocument = { a: [1, 2, 3], b: { c: { d: true } } };
      const proof = await createProof(inputDocument, options);
      const outputDocument = { a: [1, 2, 3], b: { c: { d: true } } };
      const derived = await deriveProof(
        outputDocument,
        inputDocument,
        proof,
        options
      );
      const { verified } = await verifyProof(
        derived.document,
        derived.proof,
        options
      );
      expect(verified).toBe(true);
    });
  });

  describe('selective', () => {
    it('trivial', async () => {
      const inputDocument = { a: '123', b: [] };
      const proof = await createProof(inputDocument, options);
      const outputDocument = {
        a: '123',
        // b: []
      };
      const derived = await deriveProof(
        outputDocument,
        inputDocument,
        proof,
        options
      );
      const { verified } = await verifyProof(
        derived.document,
        derived.proof,
        options
      );
      expect(verified).toBe(true);
    });

    it('complex 0', async () => {
      const inputDocument = { a: [1, 2, 3], b: { c: { d: true } } };
      const proof = await createProof(inputDocument, options);
      const outputDocument = {
        a: [1, 2, 3],
        // b: { c: { d: true } }
      };
      const derived = await deriveProof(
        outputDocument,
        inputDocument,
        proof,
        options
      );
      const { verified } = await verifyProof(
        derived.document,
        derived.proof,
        options
      );
      expect(verified).toBe(true);
    });

    it('complex 1', async () => {
      const inputDocument = {
        credentialSubject: {
          type: ['MillTestReport'],
          manufacturer: {
            type: ['Organization'],
            name: 'Harris, Nader and Daugherty',
            description: 'Sharable real-time alliance',
            address: {
              type: ['PostalAddress'],
              streetAddress: '6728 Russel Grove',
              addressLocality: 'Hansenmouth',
              addressRegion: 'Illinois',
              postalCode: '19721',
              addressCountry: 'El Salvador',
            },
            email: 'Elenora95@example.net',
            phoneNumber: '555-508-7950',
            faxNumber: '555-556-4911',
          },
        },
      };
      const proof = await createProof(inputDocument, options);
      const outputDocument = {
        credentialSubject: {
          type: ['MillTestReport'],
          manufacturer: {
            type: ['Organization'],
            name: 'Harris, Nader and Daugherty',
            description: 'Sharable real-time alliance',
            // address: {
            //   type: ['PostalAddress'],
            //   streetAddress: '6728 Russel Grove',
            //   addressLocality: 'Hansenmouth',
            //   addressRegion: 'Illinois',
            //   postalCode: '19721',
            //   addressCountry: 'El Salvador',
            // },
            email: 'Elenora95@example.net',
            phoneNumber: '555-508-7950',
            faxNumber: '555-556-4911',
          },
        },
      };
      const derived = await deriveProof(
        outputDocument,
        inputDocument,
        proof,
        options
      );
      const { verified } = await verifyProof(
        derived.document,
        derived.proof,
        options
      );
      expect(verified).toBe(true);
    });
  });
});
