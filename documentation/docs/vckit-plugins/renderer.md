import Disclaimer from './../\_disclaimer.mdx';

# Renderer Plugin

<Disclaimer />

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

#### Verifiable credential data that uses the proof type 'lds'

```typescript
import { WebRenderingTemplate2022 } from '@vckit/renderer';

// Example credential data
const params = {
  credential: {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/examples/v2', 'https://dev-render-method-context.s3.ap-southeast-1.amazonaws.com/dev-render-method-context.json'],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential', 'ExampleDegreeCredential'],
    issuer: 'did:example:6fb1f712ebe12c27cc26eebfe11',
    validFrom: '2010-01-01T19:23:24Z',
    credentialSubject: {
      id: 'https://subject.example/subject/3921',
      degree: {
        type: 'ExampleBachelorDegree',
        name: 'Bachelor of Science and Arts',
      },
    },
    render: [
      {
        template: '<div>Template</div>',
      },
    ],
    proof: {
      type: 'DataIntegrityProof',
      cryptosuite: 'eddsa-rdfc-2022',
      created: '2021-11-13T18:19:39Z',
      verificationMethod: 'did:web:example.com#key',
      proofPurpose: 'assertionMethod',
      proofValue: 'z58DAdFfa9SkqZMVPxAQp...jQCrfFPP2oumHKtz',
    },
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

#### Verifiable credential data with EnvelopedVerifiableCredential

```typescript
import { WebRenderingTemplate2022 } from '@vckit/renderer';

const params = {
  credential: {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/examples/v2'],
    id: 'data:application/vc-ld+jwt,eyJhbGciOiJFZERTQSIsIm...', // The JWT should contain render field with the template.
    type: 'EnvelopedVerifiableCredential',
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

### With VCkit

Using the VCkit CLI or API

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

### With VCkit Library

You can try VCkit Renderer plugin by follow this get started guide.

- [VCkit Library Get Started](/docs/get-started/library-get-started/installation).
