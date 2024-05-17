import {
  IRendererContext,
  IRendererProvider,
  RenderDocument,
} from '@vckit/core-types';
import handlebars from 'handlebars';
/**
 * @public
 */
export class RenderTemplate2024 implements IRendererProvider {
  private supportedMediaTypes = ['text/html', 'text/plain', 'image/svg+xml', 'text/xml'];
  async renderCredential({
    template,
    document,
    url,
    digestMultibase,
    mediaType,
    context,
  }: {
    template?: string;
    document?: RenderDocument;
    url?: string;
    digestMultibase?: string;
    mediaType: string;
    context?: IRendererContext;
  }): Promise<string> {
    try {
      if(!this.supportedMediaTypes.includes(mediaType)){
        return('<p style="color: red">Error: Unsupported media type</p>')
      }
      if(!template && !url){
        return('<p style="color: red">Error: Failed to fetch template or no template provided</p>');
      }

      let renderTemplate: any;
      //get the template
      if (url) {
        try {
          const response = await fetch(url);
          renderTemplate = await response.text();
        } catch (error) {
          console.error(`Failed to fetch from ${url}:`, error);
          renderTemplate = template;
        }
      }  
      
      // verify the template
      if (
        digestMultibase &&
        context &&
        typeof context.agent.computeHash === 'function'
      ) {
        const hashedTemplate = await context.agent.computeHash(renderTemplate);
        if (hashedTemplate !== digestMultibase) {
          return('<p style="color: red">Error: Template hash does not match the provided digest</p>');
        }
      }
      const compiledTemplate = handlebars.compile(renderTemplate);

      const renderedContent = compiledTemplate(document);

      return renderedContent;
    } catch (error) {
        throw error;
    }
  }
}
