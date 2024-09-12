import { contexts } from '../src';
import contextCredentialV1 from '../src/contexts/www.w3.org_2018_credentials_v1.json';
import contextCredentialV2 from '../src/contexts/www.w3.org_ns_credentials_v2.json';
import contextDidV1 from '../src/contexts/www.w3.org_ns_did_v1.json';
import contextMultikey from '../src/contexts/w3id.org_security_multikey_v1.json';
import contextDataIntegrityV1 from '../src/contexts/w3id.org_security_data-integrity_v1.json';
import contextDataIntegrityV2 from '../src/contexts/w3id.org_security_data-integrity_v2.json';

describe('Contexts Map', () => {
  // Test to verify that the map contains exactly six contexts
  test('should contain the correct number of contexts', () => {
    // Check if the size of the map is 6
    expect(contexts.size).toBe(6);
  });

  // Test to verify the mapping for 'https://www.w3.org/2018/credentials/v1'
  test('should map "https://www.w3.org/2018/credentials/v1" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://www.w3.org/2018/credentials/v1')).toBe(contextCredentialV1);
  });

  // Test to verify the mapping for 'https://www.w3.org/ns/credentials/v2'
  test('should map "https://www.w3.org/ns/credentials/v2" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://www.w3.org/ns/credentials/v2')).toBe(contextCredentialV2);
  });

  // Test to verify the mapping for 'https://www.w3.org/ns/did/v1'
  test('should map "https://www.w3.org/ns/did/v1" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://www.w3.org/ns/did/v1')).toBe(contextDidV1);
  });

  // Test to verify the mapping for 'https://w3id.org/security/multikey/v1'
  test('should map "https://w3id.org/security/multikey/v1" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://w3id.org/security/multikey/v1')).toBe(contextMultikey);
  });

  // Test to verify the mapping for 'https://w3id.org/security/data-integrity/v1'
  test('should map "https://w3id.org/security/data-integrity/v1" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://w3id.org/security/data-integrity/v1')).toBe(contextDataIntegrityV1);
  });

  // Test to verify the mapping for 'https://w3id.org/security/data-integrity/v2'
  test('should map "https://w3id.org/security/data-integrity/v2" to the correct context', () => {
    // Check if the map returns the correct JSON object for the given URL
    expect(contexts.get('https://w3id.org/security/data-integrity/v2')).toBe(contextDataIntegrityV2);
  });
});