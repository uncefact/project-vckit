import { IPluginMethodMap, IAgentContext } from './IAgent';
import { IDIDManager } from './IDIDManager';
import { IDataStore } from './IDataStore';
import { IKeyManager } from './IKeyManager';
import { IResolver } from './IResolver';
import { UnsignedCredential, VerifiableCredential } from './vc-data-model';

/**
 * Arguments for rendering a verifiable credential.
 * @public
 */
export interface IRenderCredentialArgs {
  credential: VerifiableCredential | UnsignedCredential;
}

/**
 * Context required for the renderer plugin.
 * @public
 */
export type IRendererContext = IAgentContext<
  IResolver &
    Pick<IDIDManager, 'didManagerGet' | 'didManagerFind'> &
    Pick<
      IDataStore,
      | 'dataStoreSaveVerifiablePresentation'
      | 'dataStoreSaveVerifiableCredential'
    > &
    Pick<IKeyManager, 'keyManagerGet' | 'keyManagerSign'>
>;

/**
 * Result of rendering a verifiable credential.
 * @beta
 */
export interface IRenderDocument{
  type: string;
  renderedTemplate: string;
  id: string | undefined;
  name: string | undefined;
  mediaType: string | undefined;
  
}
export interface IRenderResult {
  documents: IRenderDocument[];
}

/**
 * Plugin interface for the renderer.
 * @public
 */
export interface IRenderer extends IPluginMethodMap {
  /**
   * Renders a verifiable credential.
   * @param args - The rendering arguments.
   * @param context - The renderer context.
   * @returns A promise that resolves to the rendering result.
   */
  renderCredential(
    args: IRenderCredentialArgs,
    context: IRendererContext
  ): Promise<IRenderResult>;
}
