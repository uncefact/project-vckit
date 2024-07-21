import { jest } from '@jest/globals';
import {
  IKey,
  IAgentContext,
  IResolver,
  IKeyManager,
} from '@veramo/core-types';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { VCkitEddsaRdfc2022 } from '../src/suites/VCkitEddsaRdfc2022';

describe('VCkitEddsaRdfc2022', () => {
  // Define the variables used in the tests
  let vckitEddsa: VCkitEddsaRdfc2022;
  let mockKey: IKey;
  let mockContext: IAgentContext<IResolver & Pick<IKeyManager, 'keyManagerSign'>>;
  const verificationMethodId = 'verMethod1';
  const issuerDid = 'did:example:123';

  beforeEach(() => {
    // Initialize the variables
    vckitEddsa = new VCkitEddsaRdfc2022();
    mockKey = {
      kid: '7188cf919750448c0d90f4a95dd19fb55cacb06187cb89a651f074fe9e4d4680',
      kms: 'local',
      type: 'Ed25519',
      publicKeyHex: '7188cf919750448c0d90f4a95dd19fb55cacb06187cb89a651f074fe9e4d4680',
    };
    mockContext = {
      agent: {
        keyManagerSign: jest.fn(() => Promise.resolve('c2lnbmVkTWVzc2FnZQ==')),
        getDIDComponentById: jest.fn(),
      },
    } as any;
  });

  test('should return supported verification type', () => {
    const supportedVerificationType = vckitEddsa.getSupportedVerificationType();

    // Check the supported verification type
    expect(supportedVerificationType).toBe('Multikey');
  });

  test('should return supported Veramo key type', () => {
    const supportedVeramoKeyType = vckitEddsa.getSupportedVeramoKeyType();

    // Check the supported Veramo key type
    expect(supportedVeramoKeyType).toBe('Ed25519');
  });

  test('should create a signing suite with the correct properties', async () => {
    const suite = await vckitEddsa.getSuiteForSigning(mockKey, issuerDid, verificationMethodId, mockContext);

    // Check the properties of the suite
    expect(suite instanceof DataIntegrityProof).toBeTruthy();
    expect(suite.contextUrl).toBe('https://w3id.org/security/data-integrity/v2');
    expect(suite.canonize).toBeDefined();
    expect(suite.createVerifier).toBeDefined();
    expect(suite.cryptosuite).toBe('eddsa-rdfc-2022');
    expect(suite.requiredAlgorithm).toBe('Ed25519');
    expect(suite.verificationMethod).toBe(verificationMethodId);
    expect(suite.signer).toBeDefined();
    expect(suite.ensureSuiteContext).toBeDefined();
  });

  test('should correctly call keyManagerSign with Uint8Array data', async () => {
    const suite = await vckitEddsa.getSuiteForSigning(mockKey, issuerDid, verificationMethodId, mockContext);
    // Call the signer function
    const signature = await suite.signer.sign({ data: new Uint8Array([13, 22, 36, 22, 212, 158, 219, 7, 140, 218, 113, 184]) });

    // Check the signature in bytes format (Uint8Array)
    expect(signature).toEqual(new Uint8Array([115, 105, 103, 110, 101, 100, 77, 101, 115, 115, 97, 103, 101]));
  });

  test('should throw an error if the key manager signing fails', async () => {
    // Mock the keyManagerSign function to throw an error
    mockContext.agent.keyManagerSign = jest.fn(() => Promise.reject(new Error('Signing failed')));

    const suite = await vckitEddsa.getSuiteForSigning(mockKey, issuerDid, verificationMethodId, mockContext);

    // Call the signer function and check for the error
    await expect(suite.signer.sign({ data: new Uint8Array([13, 22, 36, 22, 212]) })).rejects.toThrow('Signing failed');
  });

  test('should include necessary context URLs in the suite context', async () => {
    const suite = await vckitEddsa.getSuiteForSigning(mockKey, issuerDid, verificationMethodId, mockContext);
    const document = { '@context': 'https://w3id.org/security/multikey/v1'};

    // Expect the function will be called without throwing an error
    expect(() => {
      suite.ensureSuiteContext({ document, addSuiteContext: true });
    }).not.toThrow();
  });

  test('should throw an error when the document does not contain the required @context', async () => {
    const suite = await vckitEddsa.getSuiteForSigning(mockKey, issuerDid, verificationMethodId, mockContext);
    // Create a document with an invalid context
    const invalidContextDocument = { '@context': 'invalid-context' };

    // Expect the function to throw an error when the document does not contain the required context
    expect(() => {
      suite.ensureSuiteContext({ document: invalidContextDocument, addSuiteContext: true });
    }).toThrow(new TypeError('The document to be signed must contain this suite\'s @context, "invalid-context".'));
  });

  test('should return a fully functional Data Integrity Proof suite', async () => {
    const suite = await vckitEddsa.getSuiteForVerification();

    // Check the properties of the suite
    expect(suite.type).toBe('DataIntegrityProof');
    expect(suite.contextUrl).toBe('https://w3id.org/security/data-integrity/v2');
    expect(suite.cryptosuite).toBe('eddsa-rdfc-2022');
    expect(suite.requiredAlgorithm).toBe('Ed25519');
  });

  test('should return the original DID Document when didUrl does not contain controllerKeyID', async () => {
    // Mock the DID component to return the original DID Document
    const mockDidDoc = { id: 'did:example:123', '@context': 'https://www.w3.org/ns/did/v1' };
    const result = await vckitEddsa.preDidResolutionModification(issuerDid, mockDidDoc, mockContext);
  
    expect(result).toBe(mockDidDoc);
  });

  test('should return the DID component when didUrl contains controllerKeyID', async () => {
    // Mock the DID component to return the original DID Document
    const mockDidUrl = 'did:example:123#123';
    const mockDidDoc = { id: 'did:example:123', '@context': 'https://www.w3.org/ns/did/v1' };
    const mockDidComponent = { id: 'did:example:123', type: 'Multikey', controller: 'did:example:123#123' };
    // Mock the getDIDComponentById to return mockDidComponent
    const mockContext = { agent: { getDIDComponentById: jest.fn(() => mockDidComponent)} } as any;

    // Expect the function to return the DID component when the didUrl contains controllerKeyID
    const result = await vckitEddsa.preDidResolutionModification(mockDidUrl, mockDidDoc, mockContext);
  
    // Check the result of the function call to match the expected DID component
    expect(result).toEqual(mockDidComponent);
  });

  test('should throw an error if the DID component is not found for a specified controllerKeyID', async () => {
    const mockDidUrl = 'did:example:123#controllerKeyID';
    const mockDidDoc = { id: 'did:example:123', '@context': 'https://www.w3.org/ns/did/v1' };
    // Mock the getDIDComponentById to return null
    const mockContext = { 
      agent: { getDIDComponentById: jest.fn(() => null) } 
    } as any;
  
    // Expect the function to throw an error when the DID component is not found for the specified controllerKeyID
    await expect(vckitEddsa.preDidResolutionModification(mockDidUrl, mockDidDoc, mockContext))
      .rejects.toThrow('DID component not found. The document loader could not locate DID component by fragment: did:example:123#controllerKeyID');
  });
});
