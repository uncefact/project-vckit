# Renderer Plugin

The Renderer Plugin is a module that provides rendering capabilities for verifiable credentials. It allows you to render verifiable credentials using different render methods, such as HTML templates.

## Implement a Render Provider

To implement a new render provider, follow these steps:

1. Implement the `IRendererProvider` interface, which includes the `renderCredential` method. This method takes two parameters: `template` (a string containing the template to be rendered) and `document` (a JSON object containing the data to be rendered). The method should return a string with the rendered document.

2. Save the provider file in the `packages/renderer/src/providers` folder, using a name that corresponds to the render type. For example, if you want to implement a provider for `WebRenderingTemplate2022`, name the provider file as `web-rendering-template-2022.ts`.

3. Add the provider to the agent.yml file, as shown in the following example:

```yaml
renderer:
  $require: '@vckit/renderer#Renderer'
  $args:
    - defaultProvider: WebRenderingTemplate2022
      providers:
        WebRenderingTemplate2022:
          $require: '@vckit/renderer#WebRenderingTemplate2022'
```

## Usage

### Standalone

```typescript
import { WebRenderingTemplate2022 } from '@vckit/renderer';

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
