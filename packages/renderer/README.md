# Renderer Plugin

The Renderer Plugin is a module that provides rendering capabilities for verifiable credentials. It allows you to render verifiable credentials using different render methods, such as HTML templates.

## Implement a Render Provider

To implement a new render provider, follow these steps:

1. Implement the `IRendererProvider` interface, which includes the `renderCredential` method. This method takes two parameters: `template` (a string containing the template to be rendered) and `document` (a JSON object containing the data to be rendered). The method should return a string with the rendered document.

2. Save the provider file in the `packages/renderer/src/providers` folder, using a name that corresponds to the render type. For example, if you want to implement a provider for `WebRenderingTemplate2022`, name the provider file as `web-rendering-template-2022.ts`.

3. Delete  `tsconfig.tsbuildinfo` and run build the plugin by running this command 
```bash
pnpm build
```
To test it locally, you need to restart your vckit server.

4. Add the provider to the agent.yml file, as shown in the following example:

```yaml
renderer:
  $require: '@uncefact/vckit-renderer#Renderer'
  $args:
    - defaultProvider: WebRenderingTemplate2022
      providers:
        WebRenderingTemplate2022:
          $require: '@uncefact/vckit-renderer#WebRenderingTemplate2022'
```

## IRI Usage for Render Methods

When defining or consuming render methods, it's crucial to use correct and valid Internationalized Resource Identifiers (IRIs).

- The primary IRI for identifying render methods within a Verifiable Credential, as defined by the W3C VC Data Model, is `https://www.w3.org/2018/credentials#renderMethod`. This is used in the VC JSON-LD context to denote the `renderMethod` property. (See `RENDER_METHOD` constant in `packages/renderer/src/renderer.ts`).

- For properties within a specific render method implementation, such as `RenderTemplate2024`, IRIs should be constructed carefully. The `vckit` codebase has adopted the following distinct IRIs from the `https://w3id.org/vc/render-method#` namespace for common properties to avoid issues stemming from incorrect IRI construction (like appending to a base IRI fragment, which could lead to multiple `#` characters):

  - For the template string: `https://w3id.org/vc/render-method#template` (see `TEMPLATE_IRI` in `packages/renderer/src/providers/render-template-2024.ts` and `packages/renderer/src/providers/web-rendering-template-2022.ts`)
  - For a URL pointing to a template: `https://w3id.org/vc/render-method#url` (see `URL_IRI` in `packages/renderer/src/providers/render-template-2024.ts`)

- Other properties like `mediaType` (e.g., using `https://schema.org/encodingFormat`), `digestMultibase` (e.g., `https://w3id.org/security#digestMultibase`), and `name` (e.g., `https://schema.org/name`) should use their respective standard IRIs as per their defining specifications.

This approach ensures IRI validity and interoperability. For historical context and further details on the evolution of these IRIs within `vckit` and related discussions, refer to [GitHub issue uncefact/spec-untp#334](https://github.com/uncefact/spec-untp/issues/334).

## Usage

### Standalone

```typescript
import { WebRenderingTemplate2022 } from '@uncefact/vckit-renderer';

const params = {
  credential: {
    // Verifiable credential data...
  },
};

const WebRenderingTemplate2022 = new WebRenderingTemplate2022();
const renderer = new Renderer({
  providers: {
    WebRenderingTemplate2022,
  },
  defaultProvider: 'WebRenderingTemplate2022',
});
const context = {};
const result = await renderer.renderCredential(params, context);
// The result will be the encoded base64 of the rendered HTML string.
```

### With vckit

Using the vckit CLI or API

1. Override the default configuration file to agent.yml.

2. Using CLI:

```bash
pnpm vckit execute -m renderCredential -f test.json
# Provide the input JSON file, test.json, with the credential data.
```

3. Using API:

```bash
pnpm vckit server
```

```bash
curl -X 'POST' \
  'http://localhost:3332/agent/renderCredential' \
  -H 'accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer test123' \
  -H 'Content-Type: application/json' \
  -d '{
  "credential": {
    // Verifiable credential data...
  }
}'
```
