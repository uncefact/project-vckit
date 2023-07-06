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
    context?: IRendererContext
  ): Promise<IRenderResult> {
    try {
      const [expandedDocument] = await expandVerifiableCredential(
        args.credential
      );
      const renderMethods: RenderMethodPayload[] | [] =
        extractRenderMethods(expandedDocument);
      if (!renderMethods.length) {
        throw new Error('Render method not found in the verifiable credential');
      }

      const documents = await Promise.all(
        renderMethods.map(async (renderMethod) => {
          const rendererProvider = this.getProvider(renderMethod['@type']);
          const document = await rendererProvider.renderCredential(
            renderMethod['@id'],
            args.credential
          );
          return convertToBase64(document);
        })
      );
      return { documents };
    } catch (error) {
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
  credential: VerifiableCredential | UnsignedCredential
) {
  // base: null is used to prevent jsonld from resolving relative URLs.
  return jsonld.expand(credential, { base: null });
}

/**
 * Extracts the render methods from an expanded document.
 * @param expandedDocument - The expanded JSON-LD document.
 * @returns The array of render methods.
 */
function extractRenderMethods(
  expandedDocument: JsonLdObj
): RenderMethodPayload[] | [] {
  const renders = ((expandedDocument[RENDER_METHOD] as JsonLdObj[]) || [])
    .filter((render) => {
      return render['@id'] && render['@type'];
    })
    .map((render) => {
      // TODO: Handle @type as an array of strings with more than one element.
      const type = Array.isArray(render['@type'])
        ? render['@type'][0]
        : render['@type'];

      return { ...render, '@type': type } as RenderMethodPayload;
    });

  return renders;
}

/**
 * converts a string to base64
 * @param content - The string to convert to base64.
 * @returns The base64 string.
 */
function convertToBase64(content: string): string {
  return Buffer.from(content).toString('base64');
}
