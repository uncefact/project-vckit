import { IRendererProvider, RenderDocument } from '@vckit/core-types';
import handlebars from 'handlebars';

/**
 * WebRenderingTemplate2022 class implements the IRendererProvider interface for rendering verifiable credentials using Handlebars templates.
 * @public
 */
export class WebRenderingTemplate2022 implements IRendererProvider {
  async renderCredential(
    {
      template,
      document,
    }: {
      template?: string;
      document?: RenderDocument;
    }
  ): Promise<string> {
    // Check if the template is empty or contains only whitespace
    if (!template?.trim()) {
      return '';
    }
    const compiledTemplate = handlebars.compile(template);

    // Render the template with the document data
    const renderedContent = compiledTemplate(document);

    return renderedContent;
  }
}
