import {
  IRendererContext,
  IRendererProvider,
  RenderDocument,
  IRenderedResult,
} from '@vckit/core-types';
import handlebars from 'handlebars';
import { RENDER_METHOD } from '../renderer.js';
/**
 * @public
 */
export class RenderTemplate2024 implements IRendererProvider {
  private supportedMediaTypes = [
    'text/html',
    'text/plain',
    'image/svg+xml',
    'text/xml',
  ];
  async renderCredential({
    data,
    context,
    document,
  }: {
    data: any;
    context?: IRendererContext;
    document: RenderDocument;
  }): Promise<IRenderedResult> {
    try {
      const { template, url, mediaType, digestMultibase, mediaQuery, name } =
        this.extractData(data);

      if (!mediaType || !this.supportedMediaTypes.includes(mediaType)) {
        return {
          renderedTemplate: 'Error: Unsupported media type',
        };
      }
      if (!template && !url) {
        return {
          renderedTemplate: 'Error: No template or url provided',
        };
      }

      let renderTemplate: any = '';
      //get the template
      if (url) {
        try {
          const response = await fetch(url);
          renderTemplate = await response.text();
        } catch (error) {
          console.error(`Failed to fetch from ${url}:`, error);
        }
      }else if (template) {
        renderTemplate = template;
      }else{
        return {
          renderedTemplate: 'Error: No template or url provided',
        };
      }
    
      // verify the template
      if (digestMultibase){
        if(context && typeof context.agent.computeHash === 'function'){
          const hashedTemplate = await context.agent.computeHash({
            content: renderTemplate,
          });
          if (hashedTemplate !== digestMultibase) {
            return {
              renderedTemplate:
                'Error: Template hash does not match the provided digest',
            };
          }
        }else{
          return {
            renderedTemplate:
              'Error: No hash function provided to verify the template',
          };
        }
      } 

      //insert media query into template for html template only
      if (mediaType === 'text/html' && mediaQuery) {
        renderTemplate = `<style>${mediaQuery}</style>` + renderTemplate;
      }

      const compiledTemplate = handlebars.compile(renderTemplate);

      const renderedContent = compiledTemplate(document);

      return {
        renderedTemplate: renderedContent,
        name: name,
      };
    } catch (error) {
      throw error;
    }
  }

  private extractData(data: any) {
    // const RENDER_METHOD = 'https://www.w3.org/2018/credentials#renderMethod';

    const template = data[`${RENDER_METHOD}#template`]
      ? (data[`${RENDER_METHOD}#template`] as { '@value': string }[])[0][
          '@value'
        ]
      : undefined;

    const url = data[`${RENDER_METHOD}#url`]
      ? (data[`${RENDER_METHOD}#url`] as { '@value': string }[])[0]['@value']
      : undefined;

    const mediaType = data['https://schema.org/encodingFormat']
      ? (
          data['https://schema.org/encodingFormat'] as { '@value': string }[]
        )[0]['@value']
      : undefined;

    const digestMultibase = data['https://w3id.org/security#digestMultibase']
      ? (
          data['https://w3id.org/security#digestMultibase'] as {
            '@value': string;
          }[]
        )[0]['@value']
      : undefined;

    const name = data['https://schema.org/name']
      ? (data['https://schema.org/name'] as { '@value': string }[])[0]['@value']
      : undefined;

    const mediaQuery = data[`${RENDER_METHOD}#mediaQuery`]
      ? (data[`${RENDER_METHOD}#mediaQuery`] as { '@value': string }[])[0][
          '@value'
        ]
      : undefined;
    return { template, url, mediaType, digestMultibase, mediaQuery, name };
  }
}
