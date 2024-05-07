import { WebRenderingTemplate2022 } from '../../src/providers/web-rendering-template-2022';

describe('WebRenderingTemplate2022', () => {
  let renderer: WebRenderingTemplate2022;

  beforeEach(() => {
    renderer = new WebRenderingTemplate2022();
  });

  describe('renderCredential', () => {
    it('should render the template with the credential data', async () => {
      const template = '<p>{{name}}</p>';
      const document = { name: 'John Doe' };

      const renderedContent = await renderer.renderCredential({
        template,
        document,
      });

      expect(renderedContent).toBe('<p>John Doe</p>');
    });

    it('should return an empty string if the template is empty', async () => {
      const template = '';
      const document = { name: 'John Doe' };

      const renderedContent = await renderer.renderCredential({
        template,
        document,
      });

      expect(renderedContent).toBe('');
    });

    it('should return the template content if the template is random text', async () => {
      const template = 'Some random text';
      const document = { name: 'John Doe' };

      const renderedContent = await renderer.renderCredential({
        template,
        document,
      });

      expect(renderedContent).toBe(template);
    });

    it('should return an empty string if the template contains only whitespace', async () => {
      const template = '    \t\n   ';
      const document = { name: 'John Doe' };

      const renderedContent = await renderer.renderCredential({
        template,
        document,
      });

      expect(renderedContent).toBe('');
    });
  });
});
