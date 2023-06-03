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
   * @returns A promise that resolves to the rendered document.
   */
  renderCredential(template: string, document: RenderDocument): Promise<string>;
}
