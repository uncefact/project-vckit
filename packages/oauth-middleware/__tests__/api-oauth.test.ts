import { Router } from 'express';
import { apiOAuth } from '../src/api-oauth';

describe('apiOAuth', () => {
  it('should create an Express router with OAuth2 authentication middleware', () => {
    const issuerBaseURL = 'https://example.com/oauth2';
    const audience = 'your-audience';

    const router = apiOAuth({ issuerBaseURL, audience });

    expect(typeof router.use).toBe('function');
    expect(typeof router.get).toBe('function');
  });

  it('should throw an error if issuerBaseURL is missing', () => {
    const audience = 'your-audience';

    expect(() => {
      apiOAuth({ issuerBaseURL: '', audience });
    }).toThrow('issuerBaseURL is required');
  });

  it('should throw an error if issuerBaseURL is not a string', () => {
    const issuerBaseURL = 123;
    const audience = 'your-audience';

    expect(() => {
      apiOAuth({ issuerBaseURL, audience } as any);
    }).toThrow('issuerBaseURL is required');
  });

  it('should throw an error if audience is missing', () => {
    const issuerBaseURL = 'https://example.com/oauth2';

    expect(() => {
      apiOAuth({ issuerBaseURL, audience: '' });
    }).toThrow('audience is required');
  });

  it('should throw an error if audience is not a string', () => {
    const issuerBaseURL = 'https://example.com/oauth2';
    const audience = 123;

    expect(() => {
      apiOAuth({ issuerBaseURL, audience } as any);
    }).toThrow('audience is required');
  });
});
