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
    },
    defaultProvider: 'WebRenderingTemplate2022',
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

  //these 2 cases below are out of date, the logic of extracting data from the credential has been moved to the provider

  // it('should throw an error if the verifiable credential contains an invalid render method', async () => {
  //   // Mock data
  //   const args: IRenderCredentialArgs = {
  //     credential: {
  //       '@context': [
  //         'https://www.w3.org/2018/credentials/v1',
  //         'https://www.w3.org/2018/credentials/examples/v1',
  //         {
  //           render: 'https://www.w3.org/2018/credentials#invalidRenderMethod',
  //         },
  //       ],
  //       id: 'http://example.edu/credentials/3732',
  //       type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  //       issuer: 'https://example.edu/issuers/565049',
  //       issuanceDate: '2010-01-01T00:00:00Z',
  //       credentialSubject: {
  //         id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
  //       },
  //       render: [
  //         {
  //           '@id':
  //             '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">\n  <rect width="100%" height="100%" style="fill:rgb(0,0,255);stroke-width:2;stroke:rgb(0,0,0)" />\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font-size:16px">Jane Smith</text>\n</svg>',
  //           '@type': 'SvgRenderingHint2022',
  //         },
  //       ],
  //     },
  //   };
  //   const context = {};

  //   // Call the renderCredential method
  //   await expect(
  //     rendererMockProvider.renderCredential(args, context as IRendererContext),
  //   ).rejects.toThrow('Render method must have template and @type.');
  // });

  // it('should skip render methods without @type or template', async () => {
  //   // Mock data
  //   const args: IRenderCredentialArgs = {
  //     credential: {
  //       ...universityDegreeCredential,
  //       render: [
  //         {
  //           template:
  //             '<div style="width:300px; height:100px; border: 2px solid black; text-align:center">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style="font-size: 16px">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.institution}}.\n  </div>\n</div>',
  //           '@type': 'SvgRenderingHint2022',
  //         },
  //         {
  //           template:
  //             '<div style="width:300px; height:100px; border: 2px solid black; text-align:center">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style="font-size: 16px">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.institution}}.\n  </div>\n</div>',
  //         },
  //         {
  //           '@type': 'SvgRenderingHint2022',
  //         },
  //       ],
  //     },
  //   };
  //   const context = {};

  //   // Call the renderCredential method
  //   const result: IRenderResult = await rendererMockProvider.renderCredential(
  //     args,
  //     context as IRendererContext
  //   );
  //   expect(result.documents.length).toBe(1);
  //   expect(result.documents[0]).toEqual(
  //     'UmVuZGVyZWQgY3JlZGVudGlhbCBzdWNjZXNzZnVsbHk='
  //   );
  // });

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
});
