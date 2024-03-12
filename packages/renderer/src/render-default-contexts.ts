import dev_render_method_context from './contexts/dev-render-method-context.json' assert { type: 'json' };
import www_w3_org_ns_odrl from './contexts/www.w3.org_ns_odrl.json' assert { type: 'json' };

/**
 * @beta
 * Provides default contexts for rendering
 */
// @ts-ignore
export const RenderDefaultContexts = new Map([
  [
    'https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json',
    dev_render_method_context,
  ],
  ['https://www.w3.org/ns/odrl.jsonld', www_w3_org_ns_odrl],
]);
