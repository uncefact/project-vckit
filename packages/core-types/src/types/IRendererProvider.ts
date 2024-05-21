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
   * @param data - The render method data.
   * @param context - The context.
   * @returns A promise that resolves to the rendered document.
   */
  renderCredential({
    data,
    context, 
    document
  }: {
    data: any;
    context?: IRendererContext;
    document: RenderDocument;
  }): Promise<string>;
}

