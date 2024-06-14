import {
  IRendererProvider,
  RenderDocument,
  IRenderedResult,
} from '@vckit/core-types';
import handlebars from 'handlebars';
import { RENDER_METHOD } from '../renderer.js';

/**
 * WebRenderingTemplate2022 class implements the IRendererProvider interface for rendering verifiable credentials using Handlebars templates.
 * @public
 */
export class WebRenderingTemplate2022 implements IRendererProvider {
  async renderCredential({
    data,
    document,
  }: {
    data: any;
    document: RenderDocument;
  }): Promise<IRenderedResult> {
    const { template } = this.extractData(data);

    // Check if the template is empty or contains only whitespace
    if (!template?.trim()) {
      return {
        renderedTemplate: '',
      };
    }
    const compiledTemplate = handlebars.compile(template);

    // Render the template with the document data
    const renderedContent = compiledTemplate(document);

    return {
      renderedTemplate: renderedContent,
    };
  }

  extractData(data: any) {
    const template = data[`${RENDER_METHOD}#template`]
      ? (data[`${RENDER_METHOD}#template`] as { '@value': string }[])[0][
          '@value'
        ]
      : undefined;
    return { template };
  }
}
