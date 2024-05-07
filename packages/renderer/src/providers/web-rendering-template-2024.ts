import {
  IRendererContext,
  IRendererProvider,
  RenderDocument,
} from '@vckit/core-types';
import handlebars from 'handlebars';
/**
 * @public
 */
export class WebRenderingTemplate2024 implements IRendererProvider {
  async renderCredential({
    template,
    document,
    url,
    digestMultibase,
    context,
  }: {
    template?: string;
    document?: RenderDocument;
    url?: string;
    digestMultibase?: string;
    context?: IRendererContext;
  }): Promise<string> {
    try {
      let svgTemplate: string | any = '';
      //get the template
      if (url) {
        try {
          const response = await fetch(url);
          svgTemplate = await response.text();
        } catch (error) {
          console.error(`Failed to fetch from ${url}:`, error);
        }
      }  
      if (template && svgTemplate === '') {
        svgTemplate = template;
      } else {
        return('<p style="color: red">Error: Failed to fetch template or no template provided</p>');
      }
      // verify the template
      if (
        digestMultibase &&
        context &&
        typeof context.agent.createVerifiableCredentialOA === 'function'
      ) {
        const hashedTemplate = await context.agent.computeHash(svgTemplate);
        if (hashedTemplate !== digestMultibase) {
          return('<p style="color: red">Error: Template hash does not match the provided digest</p>');
        }
      }
      const compiledTemplate = handlebars.compile(svgTemplate);

      const renderedContent = compiledTemplate(document);

      return renderedContent;
    } catch (error) {
        throw error;
    }
  }
}
