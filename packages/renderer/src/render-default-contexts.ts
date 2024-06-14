import dev_render_method_context from './contexts/dev-render-method-context.json' assert { type: 'json' };
import www_w3_org_ns_odrl from './contexts/www.w3.org_ns_odrl.json' assert { type: 'json' };
import render_template_context_2024 from './contexts/render-template-context-2024.json' assert { type: 'json' };
import contextCredentialV1 from './contexts/www.w3.org_2018_credentials_v1.json' assert { type: 'json' }
import contextCredentialV2 from './contexts/www.w3.org_ns_credentials_v2.json' assert { type: 'json' }
import contextCredentialExamplesV1 from './contexts/www.w3.org_2018_credentials_examples_v1.json' assert { type: 'json' }
import contextCredentialExamplesV2 from './contexts/www.w3.org_ns_credentials_examples_v2.json' assert { type: 'json' }

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
  ['https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/render-template-context-2024.json', render_template_context_2024],
  ['https://www.w3.org/2018/credentials/v1', contextCredentialV1],
  ['https://www.w3.org/ns/credentials/v2', contextCredentialV2],
  ['https://www.w3.org/2018/credentials/examples/v1', contextCredentialExamplesV1],
  ['https://www.w3.org/ns/credentials/examples/v2', contextCredentialExamplesV2],
]);
