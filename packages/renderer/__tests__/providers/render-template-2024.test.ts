import { RenderTemplate2024 } from '../../src/providers/render-template-2024';
import universityDegreeCredentialTemplate2024 from '../../fixtures/univerisity-degree-credential-template-2024.json';

describe('RenderTemplate2024', () => {
  let renderer: RenderTemplate2024;

  beforeEach(() => {
    renderer = new RenderTemplate2024();
  });

  it('should return an error message if the template is not provided', async () => {
    const data = {
      'https://w3id.org/security#digestMultibase': [
        {
          '@type': 'https://w3id.org/security#multibase',
          '@value': '',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaQuery': [
        {
          '@value':
            '',
        },
      ],
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    const result = await renderer.renderCredential({ data, document: {} });

    expect(result).toStrictEqual(
      {"renderedTemplate": "Error: No template or url provided"}
    );
  });

  it('should render the template with the credential data', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '<p>{{name}}</p>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };

    const renderedContent = await renderer.renderCredential({
      data,
      document,
    });

    expect(renderedContent).toEqual({"renderedTemplate": "<p>John Doe</p>"});
  });

  it('should return an error message if the template and the digestMultibase are not the same', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://w3id.org/security#digestMultibase': [
        {
          '@type': 'https://w3id.org/security#multibase',
          '@value': 'abc123',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaQuery': [
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
          '@value':
            '<p>{{name}}</p>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    const result = await renderer.renderCredential({
      data,
      document,
    });

    expect(result).toStrictEqual(
      {"renderedTemplate": "Error: No hash function provided to verify the template"}
    );
  });

  it('should throw an error if the template is not a valid handlebars template', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '<p>{{name}</p>', // Invalid handlebars template missing closing curly brace
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    await expect(async () => {
      await renderer.renderCredential({
        data,
        document,
      });
    }).rejects.toThrow();
  });

  it('should return an error message if the template is not a string', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value': 123, // Invalid template value, should be a string
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    await expect(async () => {
      await renderer.renderCredential({
        data,
        document,
      });
    }).rejects.toThrow();
  });
  
  it('should return an error message if the template is not provided and there is no default template', async () => {
    const data = {
      'https://w3id.org/security#digestMultibase': [
        {
          '@type': 'https://w3id.org/security#multibase',
          '@value': '',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaQuery': [
        {
          '@value':
            '',
        },
      ],
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    const rendererWithoutDefaultTemplate = new RenderTemplate2024();
    const result = await rendererWithoutDefaultTemplate.renderCredential({ data, document: {} });
    expect(result).toStrictEqual(
      {"renderedTemplate": "Error: No template or url provided"}
    );
  });

  it('should render the template with the credential data and media query', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '<p>{{name}}</p>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaQuery': [
        {
          '@value':
            '@media (min-width: 1024px) {\n  .title {\n    font-weight: bold;\n    color: #223675;\n  }\n}',
        },
      ],
    };

    const renderedContent = await renderer.renderCredential({
      data,
      document,
    });

    expect(renderedContent).toEqual({"renderedTemplate": "<style>@media (min-width: 1024px) {\n  .title {\n    font-weight: bold;\n    color: #223675;\n  }\n}</style><p>John Doe</p>"});
  });

  it('should return an error message if the mediaType is unsupported', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'application/json',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '<p>{{name}}</p>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaType': [
        {
          '@value': 'application/json', // Unsupported mediaType
        },
      ],
    };
    const result = await renderer.renderCredential({
      data,
      document,
    });
    expect(result).toStrictEqual(
      {"renderedTemplate": "Error: Unsupported media type"}
    );
  });

  it('should return the template if it failed to fetch template from url', async () => {
    const document = { name: 'John Doe' };
    const data = {
      'https://schema.org/encodingFormat': [
        {
          '@value': 'text/html',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#template': [
        {
          '@value':
            '<p>{{name}}</p>',
        },
      ]
    };
    const renderedContent = await renderer.renderCredential({
      data,
      document,
    });
    expect(renderedContent).toEqual({"renderedTemplate": "<p>John Doe</p>"});
  });

  it('should return error if the digestMultibase is provided but there is no context', async () => {
    const document = universityDegreeCredentialTemplate2024;
    const data = {
      'https://w3id.org/security#digestMultibase': [
        {
          '@type': 'https://w3id.org/security#multibase',
          '@value': 'abc123', // Replace with the actual hashed template value
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#mediaQuery': [
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
          '@value':
            '<p>{{name}}</p>',
        },
      ],
      'https://www.w3.org/2018/credentials#renderMethod#url': [
        {
          '@value': '',
        },
      ],
    };
    const result = await renderer.renderCredential({
      data,
      document,
    });
    expect(result).toEqual({"renderedTemplate": 'Error: No hash function provided to verify the template'});
  });

  it('should return error for unsupported media type', async () => {
    const data = {
      'https://schema.org/encodingFormat': [{ '@value': 'unsupported/type' }],
    };
    const result = await renderer.renderCredential({
      data,
      context: undefined,
      document: {},
    });
    expect(result.renderedTemplate).toBe('Error: Unsupported media type');
  });
  

});
