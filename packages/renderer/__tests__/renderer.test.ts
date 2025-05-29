import { Renderer } from '../src/renderer';
import { WebRenderingTemplate2022 } from '../src/providers/web-rendering-template-2022';
import { RenderTemplate2024 } from '../src/providers/render-template-2024';
import {
  IRendererProvider,
  IRenderCredentialArgs,
  IRendererContext,
  IRenderResult,
  RenderDocument,
  IRenderedResult,
} from '@uncefact/vckit-core-types';
import universityDegreeCredential from '../fixtures/university-degree-credential.json';
import universityDegreeCredentialTemplate2024 from '../fixtures/univerisity-degree-credential-template-2024.json';

describe('Renderer', () => {
  // Mock renderer provider
  const MockWebRenderingTemplate2022: IRendererProvider = {
    async renderCredential({
      data: any,
      document: RenderDocument,
    }): Promise<IRenderedResult> {
      // Mock implementation
      return {
        renderedTemplate: 'Rendered credential successfully',
      };
    },

    extractData(data: any): { [k: string]: any } {
      return { template: 'Rendered credential successfully' };
    },
  };

  const MockRenderTemplate2024: IRendererProvider = {
    async renderCredential({
      data: any,
      document: RenderDocument,
    }): Promise<IRenderedResult> {
      // Mock implementation
      return {
        renderedTemplate: 'Rendered credential successfully',
      };
    },

    extractData(data: any): { [k: string]: any } {
      return { template: 'Rendered credential successfully' };
    },
  };

  // Create an instance of Renderer
  const renderer = new Renderer({
    providers: {
      WebRenderingTemplate2022: new WebRenderingTemplate2022(),
      RenderTemplate2024: new RenderTemplate2024(),
    },
    defaultProvider: 'WebRenderingTemplate2022',
  });

  // Create an instance of Renderer with mock provider
  const rendererMockProvider = new Renderer({
    providers: {
      WebRenderingTemplate2022: MockWebRenderingTemplate2022,
      RenderTemplate2024: MockRenderTemplate2024,
    },
    defaultProvider: 'WebRenderingTemplate2022',
  });

  const renderer2024Provider = new Renderer({
    providers: {
      RenderTemplate2024: MockRenderTemplate2024,
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
    const context: any = {
      agent: {
        computeHash: () => {
          return 'zQmXPqSNrf6ZR2R5VVdYRpPxQREDCW1i3h98NAHLdAwLBxx';
        },
      },
    };
    // Mock data using WebRenderingTemplate2022
    const webRenderingTemplate2022Args: IRenderCredentialArgs = {
      credential: universityDegreeCredential,
    };

    // Mock data using RenderTemplate2024
    const renderTemplate2024Args: IRenderCredentialArgs = {
      credential: universityDegreeCredentialTemplate2024,
    };

    // Call the renderCredential method
    const webRenderingTemplate2022Result: IRenderResult =
      await renderer.renderCredential(
        webRenderingTemplate2022Args,
        context as IRendererContext,
      );

    const renderTemplate2024Result: IRenderResult =
      await renderer.renderCredential(
        renderTemplate2024Args,
        context as IRendererContext,
      );

    // Verify the result
    expect(webRenderingTemplate2022Result.documents).toEqual([
      {
        renderedTemplate:
          'PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDoxMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4KICA8ZGl2PgogICAgVGhpcyBCYWNoZWxvciBvZiBTY2llbmNlIGFuZCBBcnRzIGlzIGNvbmZlcnJlZCB0bwogIDwvZGl2PgogIDxzdHJvbmcgc3R5bGU9ImZvbnQtc2l6ZTogMTZweCI+CiAgICBKYW5lIFNtaXRoCiAgPC9zdHJvbmc+CiAgPGRpdj4KICAgIGJ5IEV4YW1wbGUgVW5pdmVyc2l0eS4KICA8L2Rpdj4KPC9kaXY+',
        type: 'WebRenderingTemplate2022',
      },
    ]);

    expect(renderTemplate2024Result.documents).toEqual([
      {
        renderedTemplate: 'PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDozMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4gIAoJPGgyPkNlcnRpZmljYXRlPC9oMj4KICAgIDxwPk9mIENvbXBsZXRpb248L3A+CiAgPGRpdj4gICAgVGhpcyBpcyB0byBjZXJ0aWZ5IHRoYXQgIDwvZGl2PiAgCiAgPHN0cm9uZyBzdHlsZT0iZm9udC1zaXplOiAxNnB4Ij4gICBKb2huIERvZSAgPC9zdHJvbmc+CiAgPGRpdj5oYXMgY29tcGxldGVkIHRoZSBCYWNoZWxvciBvZiBDb21wdXRlciBTY2llbmNlPC9kaXY+CiAgPGRpdj4gICAgYnkgRXhhbXBsZSBVbml2ZXJzaXR5LiAgPC9kaXY+CjwvZGl2Pg==',
        type: 'RenderTemplate2024',
        id: undefined,
        name: undefined,
      },
    ]);
  });

  it('should render a verifiable credential using the default render method', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        ...universityDegreeCredential,
        renderMethod: [
          {
            template:
              '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">\n  <rect width="100%" height="100%" style="fill:rgb(0,0,255);stroke-width:2;stroke:rgb(0,0,0)" />\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font-size:16px">Jane Smith</text>\n</svg>',
            'type': 'SvgRenderingHint2022',
          },
        ],
      },
    };
    const context = {};

    // Call the renderCredential method
    const result: IRenderResult = await rendererMockProvider.renderCredential(
      args,
      context as IRendererContext,
    );

    // Verify the result
    expect(result.documents).toEqual([
      {
        renderedTemplate: 'UmVuZGVyZWQgY3JlZGVudGlhbCBzdWNjZXNzZnVsbHk=',
        type: 'SvgRenderingHint2022',
      },
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
            renderMethod: 'https://www.w3.org/2018/credentials#renderMethod',
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
      rendererMockProvider.renderCredential(args, context as IRendererContext),
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
            renderMethod: 'https://www.w3.org/2018/credentials#renderMethod',
          },
        ],
        id: 'http://example.edu/credentials/3732',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: 'https://example.edu/issuers/565049',
        issuanceDate: '2010-01-01T00:00:00Z',
        credentialSubject: {},
        renderMethod: [
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
      rendererNoDefault.renderCredential(args, context as IRendererContext),
    ).rejects.toThrow('Renderer provider invalid-render-type not found');
  });

  it('should throw an error if the verifiable credential does not contain a render method', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        id: 'http://example.edu/credentials/3732',
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuer: 'https://example.edu/issuers/565049',
        issuanceDate: '2010-01-01T00:00:00Z',
        credentialSubject: {},
        render: [
          {
            template: 'random-template',
            '@type': 'WebRenderingTemplate2022',
          },
        ],
      },
    };
    const context = {};
    // Call the renderCredential method
    await expect(
      renderer.renderCredential(args, context as IRendererContext),
    ).rejects.toThrow('Render method not found in the verifiable credential');
  });

  it('should throw an error if the verifiable credential is not valid', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {} as any,
    };
    const context = {};

    await expect(
      renderer.renderCredential(args, context as IRendererContext),
    ).rejects.toThrow('Error expanding the verifiable credential');
  });

  it('should render a verifiable credential with an empty context object', async () => {
    const context: any = {};
    // Mock data using WebRenderingTemplate2022
    const webRenderingTemplate2022Args: IRenderCredentialArgs = {
      credential: universityDegreeCredential,
    };

    // Mock data using RenderTemplate2024
    const renderTemplate2024Args: IRenderCredentialArgs = {
      credential: universityDegreeCredentialTemplate2024,
    };

    // Call the renderCredential method
    const webRenderingTemplate2022Result: IRenderResult =
      await renderer.renderCredential(
        webRenderingTemplate2022Args,
        context as IRendererContext,
      );

    const renderTemplate2024Result: IRenderResult =
      await renderer.renderCredential(
        renderTemplate2024Args,
        context as IRendererContext,
      );

    // Verify the result
    expect(webRenderingTemplate2022Result.documents).toEqual([
      {
        renderedTemplate:
          'PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDoxMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4KICA8ZGl2PgogICAgVGhpcyBCYWNoZWxvciBvZiBTY2llbmNlIGFuZCBBcnRzIGlzIGNvbmZlcnJlZCB0bwogIDwvZGl2PgogIDxzdHJvbmcgc3R5bGU9ImZvbnQtc2l6ZTogMTZweCI+CiAgICBKYW5lIFNtaXRoCiAgPC9zdHJvbmc+CiAgPGRpdj4KICAgIGJ5IEV4YW1wbGUgVW5pdmVyc2l0eS4KICA8L2Rpdj4KPC9kaXY+',
        type: 'WebRenderingTemplate2022',
      },
    ]);

    expect(renderTemplate2024Result.documents).toEqual([
      {
        renderedTemplate: 'PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDozMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4gIAoJPGgyPkNlcnRpZmljYXRlPC9oMj4KICAgIDxwPk9mIENvbXBsZXRpb248L3A+CiAgPGRpdj4gICAgVGhpcyBpcyB0byBjZXJ0aWZ5IHRoYXQgIDwvZGl2PiAgCiAgPHN0cm9uZyBzdHlsZT0iZm9udC1zaXplOiAxNnB4Ij4gICBKb2huIERvZSAgPC9zdHJvbmc+CiAgPGRpdj5oYXMgY29tcGxldGVkIHRoZSBCYWNoZWxvciBvZiBDb21wdXRlciBTY2llbmNlPC9kaXY+CiAgPGRpdj4gICAgYnkgRXhhbXBsZSBVbml2ZXJzaXR5LiAgPC9kaXY+CjwvZGl2Pg==',
        type: 'RenderTemplate2024',
        id: undefined,
        name: undefined,
      },
    ]);
  });

  it('should render a verifiable credential with multiple render methods', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        ...universityDegreeCredential,
        renderMethod: [
          {
            template: 'template1',
            '@type': 'WebRenderingTemplate2022',
          },
          {
            template: 'template2',
            '@type': 'WebRenderingTemplate2022',
          },
        ],
      },
    };
    const context = {};
    // Call the renderCredential method
    const result: IRenderResult = await renderer.renderCredential(
      args,
      context as IRendererContext,
    );
    // Verify the result
    expect(result.documents).toEqual([
      {
        renderedTemplate: 'dGVtcGxhdGUx',
        type: 'WebRenderingTemplate2022',
      },
      {
        renderedTemplate: 'dGVtcGxhdGUy',
        type: 'WebRenderingTemplate2022',
      },
    ]);
  });

  it('should render a verifiable credential with JWT - Enveloping Proof Jose', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/examples/v2",
            {
                "@context": {
                    "renderMethodPrefix": "https://w3id.org/vc/render-method#",
                    "xsd": "http://www.w3.org/2001/XMLSchema#",
                    "@protected": true,
                    "@version": 1.1,
                    "WebRenderingTemplate2022": {
                        "@protected": true,
                        "@id": "renderMethodPrefix:WebRenderingTemplate2022",
                        "@context": {
                            "@protected": true,
                            "template": {
                                "@id": "renderMethodPrefix:template",
                                "@type": "xsd:string"
                            }
                        }
                    }
                }
            }
        ],
        "type": "EnvelopedVerifiableCredential",
        "id": "data:application/vc+jwt,eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDp3ZWI6dW5jZWZhY3QuZ2l0aHViLmlvOnByb2plY3QtdmNraXQ6dGVzdC1hbmQtZGV2ZWxvcG1lbnQjN2FmMTM2YThlZmExMWE0ZGYyZTkwMTBiOTcyYmRiOTJhMDAxMzcyNGI1MGU1ZWZhNDU0MDdhMmRkZWExODRlNi1Kc29uV2ViS2V5LWtleS0wIiwiY3R5IjoidmMiLCJ0eXAiOiJ2Yytqd3QifQ.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiLHsiQGNvbnRleHQiOnsicmVuZGVyTWV0aG9kUHJlZml4IjoiaHR0cHM6Ly93M2lkLm9yZy92Yy9yZW5kZXItbWV0aG9kIyIsInhzZCI6Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIyIsIkBwcm90ZWN0ZWQiOnRydWUsIkB2ZXJzaW9uIjoxLjEsIldlYlJlbmRlcmluZ1RlbXBsYXRlMjAyMiI6eyJAcHJvdGVjdGVkIjp0cnVlLCJAaWQiOiJyZW5kZXJNZXRob2RQcmVmaXg6V2ViUmVuZGVyaW5nVGVtcGxhdGUyMDIyIiwiQGNvbnRleHQiOnsiQHByb3RlY3RlZCI6dHJ1ZSwidGVtcGxhdGUiOnsiQGlkIjoicmVuZGVyTWV0aG9kUHJlZml4OnRlbXBsYXRlIiwiQHR5cGUiOiJ4c2Q6c3RyaW5nIn19fX19XSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwiaXNzdWVyIjoiZGlkOndlYjp1bmNlZmFjdC5naXRodWIuaW86cHJvamVjdC12Y2tpdDp0ZXN0LWFuZC1kZXZlbG9wbWVudCIsInZhbGlkRnJvbSI6IjIwMTAtMDEtMDFUMTk6MjM6MjRaIiwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZXhhbXBsZS5vcmcvZXhhbXBsZXMvZGVncmVlLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYSJ9LCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDpleGFtcGxlOjEyMyIsImRlZ3JlZSI6eyJ0eXBlIjoiQmFjaGVsb3JEZWdyZWUiLCJuYW1lIjoiQmFjaGVsb3Igb2YgU2NpZW5jZSBhbmQgQXJ0cyJ9fSwicmVuZGVyTWV0aG9kIjpbeyJ0ZW1wbGF0ZSI6IlBHUnBkaUJ6ZEhsc1pUMGlkMmxrZEdnNk16QXdjSGc3SUdobGFXZG9kRG94TURCd2VEc2dZbTl5WkdWeU9pQXljSGdnYzI5c2FXUWdZbXhoWTJzN0lIUmxlSFF0WVd4cFoyNDZZMlZ1ZEdWeUlqNEtJQ0E4WkdsMlBnb2dJQ0FnVkdocGN5QkNZV05vWld4dmNpQnZaaUJUWTJsbGJtTmxJR0Z1WkNCQmNuUnpJR2x6SUdOdmJtWmxjbkpsWkNCMGJ3b2dJRHd2WkdsMlBnb2dJRHh6ZEhKdmJtY2djM1I1YkdVOUltWnZiblF0YzJsNlpUb2dNVFp3ZUNJK0NpQWdJQ0JLWVc1bElGTnRhWFJvQ2lBZ1BDOXpkSEp2Ym1jK0NpQWdQR1JwZGo0S0lDQWdJR0o1SUVWNFlXMXdiR1VnVlc1cGRtVnljMmwwZVM0S0lDQThMMlJwZGo0S1BDOWthWFkrIiwidHlwZSI6IldlYlJlbmRlcmluZ1RlbXBsYXRlMjAyMiJ9XSwiaXNzdWFuY2VEYXRlIjoiMjAyNC0wOS0zMFQwODozMToxNi44ODhaIn0.CCWSfHZ4sDl5HNXX4rHFaXky3MxFIjaILcxPdN5w4LTLhRHo-aTxwQ3FvafwvS6oPXw-JkQgXbZdHiy2qsuqBw"
    },
    };

    const context = {};

    // Call the renderCredential method
    const result: IRenderResult = await renderer.renderCredential(
      args,
      context as IRendererContext,
    );

    // Verify the result
    expect(result.documents).toEqual([
      {
        renderedTemplate:
          'UEdScGRpQnpkSGxzWlQwaWQybGtkR2c2TXpBd2NIZzdJR2hsYVdkb2REb3hNREJ3ZURzZ1ltOXlaR1Z5T2lBeWNIZ2djMjlzYVdRZ1lteGhZMnM3SUhSbGVIUXRZV3hwWjI0NlkyVnVkR1Z5SWo0S0lDQThaR2wyUGdvZ0lDQWdWR2hwY3lCQ1lXTm9aV3h2Y2lCdlppQlRZMmxsYm1ObElHRnVaQ0JCY25SeklHbHpJR052Ym1abGNuSmxaQ0IwYndvZ0lEd3ZaR2wyUGdvZ0lEeHpkSEp2Ym1jZ2MzUjViR1U5SW1admJuUXRjMmw2WlRvZ01UWndlQ0krQ2lBZ0lDQktZVzVsSUZOdGFYUm9DaUFnUEM5emRISnZibWMrQ2lBZ1BHUnBkajRLSUNBZ0lHSjVJRVY0WVcxd2JHVWdWVzVwZG1WeWMybDBlUzRLSUNBOEwyUnBkajRLUEM5a2FYWSs=',
        type: 'WebRenderingTemplate2022',
      },
    ]);
  });
});
