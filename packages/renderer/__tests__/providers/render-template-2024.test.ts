import { RenderTemplate2024 } from '../../src/providers/render-template-2024';
import { jest } from '@jest/globals';

describe('RenderTemplate2024', () => {
  let renderer: RenderTemplate2024;
  let context: any;

  let data: any;

  beforeEach(() => {
    renderer = new RenderTemplate2024();
    context = {
      agent: {
        computeHash: () => {
          return 'zQmWkr8ZchZN5DgimHcW3pFYnjEk5CdyRm4w5kccemQJotn';
        },
      },
    };

    data = {
      'https://w3id.org/security#digestMultibase': [
        {
          '@type': 'https://w3id.org/security#multibase',
          '@value': 'zQmWkr8ZchZN5DgimHcW3pFYnjEk5CdyRm4w5kccemQJotn',
        },
      ],
      'https://www.w3.org/ns/credentials/examples#mediaQuery': [
        {
          '@value':
            '@media (min-width: 1024px) {\n  .title {\n    font-weight: bold;\n    color: #223675;\n  }\n}',
        },
      ],
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value': '<div>{{name}}</div>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': 'https://example.com',
        },
      ],
    };
  });

  it('should render successfully with valid data and document', async () => {
    // Mock fetch function
    global.fetch = jest.fn() as typeof fetch;
    const mockTemplate = '<div>{{name}}</div>';
    (global.fetch as jest.Mock).mockReturnValue({
      ok: true,
      text: async () => mockTemplate,
    });

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual('<div>John Doe</div>');
  });

  it('should render successfully by inline template, when fetching url error', async () => {
    // Mock fetch function
    global.fetch = jest.fn() as typeof fetch;
    (global.fetch as jest.Mock).mockReturnValue({
      ok: false,
    });

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual('<div>John Doe</div>');
  });

  it('should render successfully by inline template, when no url', async () => {
    // Mock data without url
    delete data['https://www.w3.org/2018/credentials#renderMethod#url'];

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual('<div>John Doe</div>');
  });

  it('should render successfully, when having mediaQuery', async () => {
    // Mock data without url
    delete data['https://www.w3.org/2018/credentials#renderMethod#url'];
    // Mock mediaQuery
    data['https://www.w3.org/2018/credentials#renderMethod#mediaQuery'] = [
      {
        '@value':
          '@media (min-width: 1024px) {\n  .title {\n    font-weight: bold;\n    color: #223675;\n  }\n}',
      },
    ];

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual(
      '<style>@media (min-width: 1024px) {\n  .title {\n    font-weight: bold;\n    color: #223675;\n  }\n}</style><div>John Doe</div>',
    );
  });

  it('should return "Error: Unsupported media type", when using invalit mediaType', async () => {
    // Mock data without url
    delete data['https://www.w3.org/2018/credentials#renderMethod#url'];
    // Mock invalid mediaType
    data['https://schema.org/encodingFormat'] = [
      { '@value': 'application/json' },
    ];

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual('Error: Unsupported media type');
  });

  it('should return "Error: No template or url provided", when no url and template', async () => {
    // Mock data without url and template
    delete data['https://www.w3.org/2018/credentials#renderMethod#url'];
    delete data['https://www.w3.org/2018/credentials#renderMethod#template'];

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual(
      'Error: No template or url provided',
    );
  });

  it('should return "Error: No hash function provided to verify the template", when context empty object', async () => {
    // Mock data without url
    data['https://www.w3.org/2018/credentials#renderMethod#url'] = [
      { '@value': '' },
    ];
    // Mock context empty object
    context = {};

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual(
      'Error: No hash function provided to verify the template',
    );
  });

  it('should return "Error: Template hash does not match the provided digest", when invalid hash', async () => {
    // Mock data without url
    data['https://www.w3.org/2018/credentials#renderMethod#url'] = [
      { '@value': '' },
    ];

    // Mock context empty object
    data['https://w3id.org/security#digestMultibase'] = [
      {
        '@type': 'https://w3id.org/security#multibase',
        '@value': 'abc123',
      },
    ];

    const document = { name: 'John Doe' };

    const result = await renderer.renderCredential({ data, document, context });

    expect(result.renderedTemplate).toEqual(
      'Error: Template hash does not match the provided digest',
    );
  });
});
