import jsonld from '@digitalcredentials/jsonld';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { Buffer } from 'buffer';

import {
  VerifiableCredential,
  RenderMethodPayload,
  IRendererProvider,
  IAgentPlugin,
  IRenderCredentialArgs,
  IRendererContext,
  IRenderResult,
  UnsignedCredential,
  IRenderer,
} from '@vckit/core-types';
import { RenderDefaultContexts } from './render-default-contexts.js';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

export const RENDER_METHOD = 'https://www.w3.org/2018/credentials#renderMethod';

/**
 * Renderer class responsible for rendering verifiable credentials using specified render methods.
 * @public
 */
export class Renderer implements IAgentPlugin {
  readonly methods: IRenderer;
  readonly schema = {
    components: {
      schemas: {
        ...schema.IRenderer.components.schemas,
      },
      methods: {
        ...schema.IRenderer.components.methods,
      },
    },
  };

  private providers: Record<string, IRendererProvider>;
  private defaultProvider: string | undefined;

  constructor(options: {
    providers?: Record<string, IRendererProvider>;
    defaultProvider?: string;
  }) {
    this.providers = options.providers || {};
    this.defaultProvider = options.defaultProvider;

    // Bind the renderCredential method to the instance of Renderer.
    this.methods = {
      renderCredential: this.renderCredential.bind(this),
    };
  }

  private getProvider(name: string): IRendererProvider {
    let provider: IRendererProvider | undefined =
      this.providers[name] ||
      (this.defaultProvider && this.providers[this.defaultProvider]);
    if (!provider) {
      throw new Error(`Renderer provider ${name} not found`);
    }
    return provider;
  }

  /**
   * Renders a verifiable credential using the specified render methods.
   * @param args - The arguments for rendering the credential.
   * @param context - The rendering context.
   * @returns The result of the rendering operation.
   * @throws If the render method is not found in the verifiable credential.
   */
  async renderCredential(
    args: IRenderCredentialArgs,
    context?: IRendererContext,
  ): Promise<IRenderResult> {
    try {
      const [expandedDocument] = await expandVerifiableCredential(
        args.credential,
      );

      if (!expandedDocument) {
        throw new Error('Error expanding the verifiable credential');
      }

      const renderMethods: RenderMethodPayload[] | [] =
        extractRenderMethods(expandedDocument);

      if (!Array.isArray(renderMethods)) {
        throw new Error('Render method not found in the verifiable credential');
      }

      const documents = await Promise.all(
        renderMethods.map(async (renderMethod) => {
          const rendererProvider = this.getProvider(renderMethod.type);
          const document = await rendererProvider.renderCredential({
            data: renderMethod.data,
            context,
            document: args.credential,
          });
          const responseDocument = {
            type: renderMethod.type,
            renderedTemplate: document.renderedTemplate
              ? convertToBase64(document.renderedTemplate)
              : '',
            name: document.name,
            id: document.id
          };
          return responseDocument;
        }),
      );
      return { documents };
    } catch (error) {
      console.error('Error rendering credential:', error);
      throw error;
    }
  }
}

/**
 * Expands a verifiable credential.
 * @param credential - The verifiable credential or unsigned credential.
 * @returns The expanded document.
 */
function expandVerifiableCredential(
  credential: VerifiableCredential | UnsignedCredential,
) {
  // base: null is used to prevent jsonld from resolving relative URLs.
  return jsonld.expand(credential, {
    base: null,
    documentLoader: documentLoader,
  });
}

/**
 * Extracts the render methods from an expanded document.
 * @param expandedDocument - The expanded JSON-LD document.
 * @returns The array of render methods.
 */

function extractRenderMethods(
  expandedDocument: JsonLdObj,
): RenderMethodPayload[] | [] {
  const result: RenderMethodPayload[] = [];
  const renders = (
    (expandedDocument[RENDER_METHOD] as JsonLdObj[]) || []
  ).filter((render) => {
    return render['@type'];
  });

  renders.forEach((renderMethod: Record<string, any>) => {
    let type = Array.isArray(renderMethod['@type'])
      ? renderMethod['@type'][0]
      : renderMethod['@type'];

    type = type?.split('#')[1] // Handle the case where the type is a URL.
      ? type.split('#')[1]
      : type;

    const data = { ...renderMethod };
    delete data['@type'];

    result.push({ type, data });
  });

  return result;
}

/**
 * converts a string to base64
 * @param content - The string to convert to base64.
 * @returns The base64 string.
 */
function convertToBase64(content: string): string {
  return Buffer.from(content).toString('base64');
}

/**
 * Custom document loader to handle default contexts.
 * @param url - The URL of the document.
 * @param options - The options for the document loader.
 * @returns The document.
 */
function documentLoader(url: string, options: any) {
  const documentLoaderFn = jsonld.documentLoaders?.xhr
    ? jsonld.documentLoaders.xhr()
    : jsonld.documentLoaders.node();
  const contextValue = RenderDefaultContexts.get(url);
  if (contextValue) {
    return {
      contextUrl: null,
      document: contextValue,
      documentUrl: url,
    };
  }
  return documentLoaderFn(url);
}
