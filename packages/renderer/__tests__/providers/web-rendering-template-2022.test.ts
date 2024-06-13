import { WebRenderingTemplate2022 } from '../../src/providers/web-rendering-template-2022';

describe('WebRenderingTemplate2022', () => {
  let renderer: WebRenderingTemplate2022;

  beforeEach(() => {
    renderer = new WebRenderingTemplate2022();
  });

  describe('renderCredential', () => {
    it('should render the template with the credential data', async () => {
      const document = { name: 'John Doe' };

      const data = {
        'https://www.w3.org/2018/credentials#renderMethod#template': [
          {
            '@value': '<p>{{name}}</p>',
          },
        ],
      };

      const renderedContent = await renderer.renderCredential({
        data,
        document,
      });

      expect(renderedContent).toEqual({ renderedTemplate: '<p>John Doe</p>' });
    });

    it('should return an empty string if the template is empty', async () => {
      const document = { name: 'John Doe' };

      const data = {
        'https://www.w3.org/2018/credentials#renderMethod#template': [
          {
            '@value': '',
          },
        ],
      };

      const renderedContent = await renderer.renderCredential({
        data,
        document,
      });

      expect(renderedContent).toEqual({ renderedTemplate: '' });
    });

    it('should return the template content if the template is random text', async () => {
      const document = { name: 'John Doe' };
      const data = {
        'https://www.w3.org/2018/credentials#renderMethod#template': [
          {
            '@value': 'Some random text',
          },
        ],
      };

      const renderedContent = await renderer.renderCredential({
        data,
        document,
      });

      expect(renderedContent).toEqual({
        renderedTemplate: 'Some random text',
      });
    });

    it('should return an empty string if the template contains only whitespace', async () => {
      const template = '    \t\n   ';
      const document = { name: 'John Doe' };
      const data = {
        'https://www.w3.org/2018/credentials#renderMethod#template': [
          {
            '@value': '    \t\n   ',
          },
        ],
      };

      const renderedContent = await renderer.renderCredential({
        data,
        document,
      });

      expect(renderedContent).toEqual({ renderedTemplate: '' });
    });

    it('should throw an error if the template is not a valid handlebars template', async () => {
      const document = { name: 'John Doe' };

      const data = {
        'https://www.w3.org/2018/credentials#renderMethod#template': [
          {
            '@value': '<p>{{name}</p>',
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
  });
});
