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
} from '@vckit/core-types';
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
        renderedTemplate:
          'PGRpdiBzdHlsZT0id2lkdGg6MzAwcHg7IGhlaWdodDozMDBweDsgYm9yZGVyOiAycHggc29saWQgYmxhY2s7IHRleHQtYWxpZ246Y2VudGVyIj4gIAoJPGgyPkNlcnRpZmljYXRlPC9oMj4KICAgIDxwPk9mIENvbXBsZXRpb248L3A+CiAgPGRpdj4gICAgVGhpcyBpcyB0byBjZXJ0aWZ5IHRoYXQgIDwvZGl2PiAgCiAgPHN0cm9uZyBzdHlsZT0iZm9udC1zaXplOiAxNnB4Ij4gICBKb2huIERvZSAgPC9zdHJvbmc+CiAgPGRpdj5oYXMgY29tcGxldGVkIHRoZSBCYWNoZWxvciBvZiBDb21wdXRlciBTY2llbmNlPC9kaXY+CiAgPGRpdj4gICAgYnkgRXhhbXBsZSBVbml2ZXJzaXR5LiAgPC9kaXY+CjwvZGl2Pg==',
        type: 'RenderTemplate2024',
      },
    ]);
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
      rendererNoDefault.renderCredential(args, context as IRendererContext),
    ).rejects.toThrow('Renderer provider invalid-render-type not found');
  });

  it('should render a verifiable credential with no render methods', async () => {
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

  it('should render a verifiable credential with an empty credential object', async () => {
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
        renderedTemplate:
          'RXJyb3I6IE5vIGhhc2ggZnVuY3Rpb24gcHJvdmlkZWQgdG8gdmVyaWZ5IHRoZSB0ZW1wbGF0ZQ==',
        type: 'RenderTemplate2024',
      },
    ]);
  });

  it('should render a verifiable credential with multiple render methods', async () => {
    // Mock data
    const args: IRenderCredentialArgs = {
      credential: {
        ...universityDegreeCredential,
        render: [
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
        '@context': [
          'https://www.w3.org/ns/credentials/v2',
          'https://www.w3.org/ns/credentials/examples/v2',
          'https://dev-render-method-context.s3.ap-southeast-1.amazonaws.com/dev-render-method-context.json',
        ],
        type: 'EnvelopedVerifiableCredential',
        id: 'data:application/vc-ld+jwt,eyJhbGciOiJFZERTQSIsImlzcyI6ImRpZDp3ZWI6ZDVmNi0xMTYtMTA2LTE5Mi0yMTUubmdyb2stZnJlZS5hcHAiLCJ0eXAiOiJ2Yy1sZCtqd3QifQ.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiLCJodHRwczovL2Rldi1yZW5kZXItbWV0aG9kLWNvbnRleHQuczMuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbS9kZXYtcmVuZGVyLW1ldGhvZC1jb250ZXh0Lmpzb24iXSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwiaXNzdWVyIjoiZGlkOndlYjpkNWY2LTExNi0xMDYtMTkyLTIxNS5uZ3Jvay1mcmVlLmFwcCIsInZhbGlkRnJvbSI6IjIwMTAtMDEtMDFUMTk6MjM6MjRaIiwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZXhhbXBsZS5vcmcvZXhhbXBsZXMvZGVncmVlLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYSJ9LCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDpleGFtcGxlOjEyMyIsImRlZ3JlZSI6eyJ0eXBlIjoiQmFjaGVsb3JEZWdyZWUiLCJuYW1lIjoiQmFjaGVsb3Igb2YgU2NpZW5jZSBhbmQgQXJ0cyJ9fSwicmVuZGVyIjpbeyJ0ZW1wbGF0ZSI6IlBHUnBkaUJ6ZEhsc1pUMGlkMmxrZEdnNk16QXdjSGc3SUdobGFXZG9kRG94TURCd2VEc2dZbTl5WkdWeU9pQXljSGdnYzI5c2FXUWdZbXhoWTJzN0lIUmxlSFF0WVd4cFoyNDZZMlZ1ZEdWeUlqNEtJQ0E4WkdsMlBnb2dJQ0FnVkdocGN5QkNZV05vWld4dmNpQnZaaUJUWTJsbGJtTmxJR0Z1WkNCQmNuUnpJR2x6SUdOdmJtWmxjbkpsWkNCMGJ3b2dJRHd2WkdsMlBnb2dJRHh6ZEhKdmJtY2djM1I1YkdVOUltWnZiblF0YzJsNlpUb2dNVFp3ZUNJK0NpQWdJQ0JLWVc1bElGTnRhWFJvQ2lBZ1BDOXpkSEp2Ym1jK0NpQWdQR1JwZGo0S0lDQWdJR0o1SUVWNFlXMXdiR1VnVlc1cGRtVnljMmwwZVM0S0lDQThMMlJwZGo0S1BDOWthWFkrIiwiQHR5cGUiOiJXZWJSZW5kZXJpbmdUZW1wbGF0ZTIwMjIifV0sImlzc3VhbmNlRGF0ZSI6IjIwMjQtMDktMzBUMDg6MzE6MTYuODg4WiJ9.UFC7Zxk3sAqef5Rs7oJxDwv304TTNPQHV1xBr2sgWg-xpZBAfmFpXcxoYvxEf80I__c3TwI95GnFH9C7qJzIAg',
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
