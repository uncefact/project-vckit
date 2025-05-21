import {
  IRendererContext,
  IRendererProvider,
  RenderDocument,
  IRenderedResult,
} from '@uncefact/vckit-core-types';
import handlebars from 'handlebars';
import { RENDER_METHOD } from '../renderer.js';

const TEMPLATE_IRI = 'https://w3id.org/vc/render-method#template'; // See issue https://github.com/uncefact/spec-untp/issues/334
const URL_IRI = 'https://w3id.org/vc/render-method#url'; // See issue https://github.com/uncefact/spec-untp/issues/334

/**
 * RenderTemplate2024 class implements the IRendererProvider interface for rendering verifiable credentials using Handlebars templates.
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
    document,
    context,
  }: {
    data: any;
    document: RenderDocument;
    context?: IRendererContext;
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
      // Fetch the template from the url if provided
      if (url) {
        try {
          const response = await fetch(url);
          renderTemplate = await response.text();
        } catch (error) {
          renderTemplate = template;
          console.log(
            `Failed to fetch from ${url}, trying to use the inline template instead`,
          );
        }
      } else {
        renderTemplate = template;
      }

      // Verify the template hash if provided
      if (digestMultibase) {
        if (context && typeof context.agent?.computeHash === 'function') {
          const hashedTemplate = await context.agent.computeHash({
            content: renderTemplate,
          });
          if (hashedTemplate !== digestMultibase) {
            return {
              renderedTemplate:
                'Error: Template hash does not match the provided digest',
            };
          }
        } else {
          return {
            renderedTemplate:
              'Error: No hash function provided to verify the template',
          };
        }
      }

      // Add media query to the template if it is html
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

  extractData(data: any) {
    const template = data[TEMPLATE_IRI]
      ? (data[TEMPLATE_IRI] as { '@value': string }[])[0]['@value']
      : undefined;

    const url = data[URL_IRI]
      ? (data[URL_IRI] as { '@value': string }[])[0]['@value']
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
