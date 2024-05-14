import { RenderTemplate2024 } from '/Users/ducpm/GoSource/projects/project_vckit/project-vckit/packages/renderer/src/providers/web-rendering-template-2024';

describe('RenderTemplate2024', () => {
  let renderer: RenderTemplate2024;

  beforeEach(() => {
    renderer = new RenderTemplate2024();
  });

  it('should return an p tag with error message if the template is not provided', async () => {
    const result = await renderer.renderCredential({});

    expect(result).toBe(
      '<p style="color: red">Error: Failed to fetch template or no template provided</p>',
    );
  });

  it('should render the template with the credential data', async () => {
    const template = '<p>{{name}}</p>';
    const document = { name: 'John Doe' };

    const renderedContent = await renderer.renderCredential({
      template,
      document,
    });

    expect(renderedContent).toBe('<p>John Doe</p>');
  });

  it('should return an p tag with error message if the template and the digestMultibase are not the same', async () => {
    const template = '<p>{{name}}</p>';
    const document = { name: 'John Doe' };
    const digestMultibase = '123';
    const result = await renderer.renderCredential({
        template,
        document,
        digestMultibase,
    });

    expect(result).toBe(
      '<p style="color: red">Error: Template hash does not match the provided digest</p>',
    );
  });

  // Add more tests here for different scenarios
});
