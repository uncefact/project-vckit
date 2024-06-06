import { RenderTemplate2024 } from '../../src/providers/render-template-2024';

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

  // Add more tests here for different scenarios
});
