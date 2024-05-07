import { IRendererContext } from "./IRender";

/**
 * The document to render.
 * @public
 */
export type RenderDocument = {
  [k: string]: any;
};

/**
 * Plugin interface for the renderer.
 * @public
 */
export interface IRendererProvider {
  /**
   * Render a verifiable credential using the specified render methods.
   * @param template - The template to render.
   * @param document - The document to render.
   * @param url - The url to the svg template to render.
   * @param digestMultibase - The digest multibase of the svg template to verify.
   * @returns A promise that resolves to the rendered document.
   */
  renderCredential({
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
  }): Promise<string>;
}

