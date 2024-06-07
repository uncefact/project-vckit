import { Renderer } from '../src/renderer';
import { WebRenderingTemplate2022 } from '../src/providers/web-rendering-template-2022';
import {
  IRendererProvider,
  IRenderCredentialArgs,
  IRendererContext,
  IRenderResult,
  RenderDocument,
  IRenderedResult
} from '@vckit/core-types';
import universityDegreeCredential from '../fixtures/university-degree-credential.json';
import universityDegreeCredentialTemplate2024 from '../fixtures/univerisity-degree-credential-template-2024.json';
import { RenderTemplate2024 } from '../src/providers/render-template-2024';
// import { extractRenderMethods } from '../src/renderer';

describe('Renderer', () => {
  // Mock renderer provider
  const MockWebRenderingTemplate2022: IRendererProvider = {
    async renderCredential({data: any, document: RenderDocument}): Promise<IRenderedResult> {
      // Mock implementation
      return {
        renderedTemplate: 'Rendered credential successfully'
      };
    },
  };

  const MockRenderTemplate2024: IRendererProvider = {
    async renderCredential({data: any, document: RenderDocument}): Promise<IRenderedResult> {
      // Mock implementation
      return {
        renderedTemplate: 'Rendered credential successfully'
      };
    },
  };

  // Create an instance of Renderer
  const renderer = new Renderer({
    providers: {
      WebRenderingTemplate2022: new WebRenderingTemplate2022(),
    },
    defaultProvider: 'WebRenderingTemplate2022',
  });

  // Create an instance of Renderer with mock provider
  const rendererMockProvider = new Renderer({
    providers: {
      WebRenderingTemplate2022: MockWebRenderingTemplate2022,
      RenderTemplate2024: MockRenderTemplate2024
    },
    defaultProvider: 'WebRenderingTemplate2022',
  });

  const renderer2024Provider = new Renderer({
    providers: {
      RenderTemplate2024: MockRenderTemplate2024
    },
    defaultProvider: 'RenderTemplate2024',
  });
  // Create an instance of Renderer with no default provider
  const rendererNoDefault = new Renderer({
    providers: {
      WebRenderingTemplate2022: MockWebRenderingTemplate2022,
    },
  });

  it('should render a verifiable credential using the specified render methods', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: universityDegreeCredential,
    };
    const context = {};

    // Call the renderCredential method
    const result: IRenderResult = await renderer.renderCredential(
      args,
      context as IRendererContext
    );

    // Verify the result
    expect(result.documents).toEqual([{
      "renderedTemplate": "RXJyb3I6IGludmFsaWQgdGVtcGxhdGUgcHJvdmlkZWQ=",
      "type": "WebRenderingTemplate2022",
    }]);
  });

  it('should render a verifiable credential using the default render method', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        ...universityDegreeCredential,
        render: [
          {
            template:
              '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">\n  <rect width="100%" height="100%" style="fill:rgb(0,0,255);stroke-width:2;stroke:rgb(0,0,0)" />\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font-size:16px">Jane Smith</text>\n</svg>',
            '@type': 'SvgRenderingHint2022',
          },
        ],
      },
    };
    const context = {};

    // Call the renderCredential method
    const result: IRenderResult = await rendererMockProvider.renderCredential(
      args,
      context as IRendererContext
    );

    // Verify the result
    expect(result.documents).toEqual([
      {
        "renderedTemplate": "UmVuZGVyZWQgY3JlZGVudGlhbCBzdWNjZXNzZnVsbHk=",
        "type": "SvgRenderingHint2022"
      }
    ]);
  });

  it('should throw an error if the verifiable credential does not contain a render method', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
          {
            render: 'https://www.w3.org/2018/credentials#renderMethod',
          },
        ],
        id: 'http://example.edu/credentials/3732',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: 'https://example.edu/issuers/565049',
        issuanceDate: '2010-01-01T00:00:00Z',
        credentialSubject: {
          id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
        },
      },
    };
    const context = {};

    // Call the renderCredential method
    await expect(
      rendererMockProvider.renderCredential(args, context as IRendererContext)
    ).rejects.toThrow('Render method not found in the verifiable credential');
  });

  it('should throw an error with invalid @type and non-default provider', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
          {
            render: 'https://www.w3.org/2018/credentials#renderMethod',
          },
        ],
        id: 'http://example.edu/credentials/3732',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: 'https://example.edu/issuers/565049',
        issuanceDate: '2010-01-01T00:00:00Z',
        credentialSubject: {},
        render: [
          {
            template: 'random-template',
            '@type': 'invalid-render-type',
          },
        ],
      },
    };
    const context = {};

    // Call the renderCredential method
    await expect(
      rendererNoDefault.renderCredential(args, context as IRendererContext)
    ).rejects.toThrow('Renderer provider invalid-render-type not found');
  });

  it('should render a verifiable credential using the RenderTemplate2024 render method', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        ...universityDegreeCredentialTemplate2024,
      },
    };
    const context = {};
    // Call the renderCredential method
    const result: IRenderResult = await renderer2024Provider.renderCredential(
      args,
      context as IRendererContext
    );
    // Verify the result
    expect(result.documents).toEqual([
      {
        "renderedTemplate": "UmVuZGVyZWQgY3JlZGVudGlhbCBzdWNjZXNzZnVsbHk=",
        "type": "RenderTemplate2024"
      }
    ]);
  });
  
  
  
});
