---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---

# Basic Operations

## Create Identifier

Create a new file in **`src/create-identifier.ts`**, and add the following code.
:::note
In this guide we use **did:web** as the did method, you can use other method by declaring the provider as the parameter of didManagerCreate function
:::

:::tip
To have your own a **did:web**, you can follow this [instruction](/docs/get-started/demo-explorer-get-started/basic-operations#create-an-identifier) 
:::
<!-- Todo: add creating did:web intruction -->

```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const identifier = await agent.didManagerCreate({ alias: 'epic-lionfish-distinctly.ngrok-free.app', provider: 'did:web', options:{keyType:'Ed25519'}})
  console.log(`New identifier created`)
  console.log(JSON.stringify(identifier, null, 2))
}

main().catch(console.log)
```
Run this command to create identifier
```bash
node --loader ts-node/esm ./src/create-identifier.ts  
```

Expected result
```bash
New identifier created
{
  "did": "did:web:epic-lionfish-distinctly.ngrok-free.app",
  "controllerKeyId": "d71a03cc1d38afa68487f69245d1943c484b83fd642f810431b40a13a3566e96",
  "keys": [
    {
      "type": "Ed25519",
      "kid": "d71a03cc1d38afa68487f69245d1943c484b83fd642f810431b40a13a3566e96",
      "publicKeyHex": "d71a03cc1d38afa68487f69245d1943c484b83fd642f810431b40a13a3566e96",
      "meta": {
        "algorithms": [
          "EdDSA",
          "Ed25519"
        ]
      },
      "kms": "local"
    }
  ],
  "services": [],
  "provider": "did:web",
  "alias": "epic-lionfish-distinctly.ngrok-free.app"
}
```
## Get the list of indentifiers

Create a new file in **`src/list-indentifiers.ts`**, and add the following code.

```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const identifiers = await agent.didManagerFind()

  console.log(`There are ${identifiers.length} identifiers`)

  if (identifiers.length > 0) {
    identifiers.map((id) => {
      console.log(id)
      console.log('..................')
    })
  }
}

main().catch(console.log)
```

Run this command to get list of identifiers
```bash
node --loader ts-node/esm ./src/list-identifiers.ts  
```
Expected result
```bash
There are 1 identifiers
Identifier {
  did: 'did:web:epic-lionfish-distinctly.ngrok-free.app',
  provider: 'did:web',
  alias: 'epic-lionfish-distinctly.ngrok-free.app',
  saveDate: undefined,
  updateDate: undefined,
  controllerKeyId: '3e051abb181225f85f7f81fb28d8de1f6272f4a8e16af38ce2c6ccafdf6b5a27',
  keys: [
    Key {
      kid: '3e051abb181225f85f7f81fb28d8de1f6272f4a8e16af38ce2c6ccafdf6b5a27',
      kms: 'local',
      type: 'Ed25519',
      publicKeyHex: '3e051abb181225f85f7f81fb28d8de1f6272f4a8e16af38ce2c6ccafdf6b5a27',
      meta: [Object],
      identifier: undefined
    }
  ],
  services: [],
  sentMessages: undefined,
  receivedMessages: undefined,
  issuedPresentations: undefined,
  receivedPresentations: undefined,
  issuedCredentials: undefined,
  receivedCredentials: undefined,
  issuedClaims: undefined,
  receivedClaims: undefined
}
..................
```

## Create a VC 
Create a new file in **`src/create-credential.ts`**, add the following code.
```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const identifier = await agent.didManagerGetByAlias({ alias: 'epic-lionfish-distinctly.ngrok-free.app' })
  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: identifier.did },
      credentialSubject: {
        id: 'did:web:example.com',
        you: 'Rock!!!',
      },
    },
    proofFormat: 'jwt',
  })
  
  console.log(JSON.stringify(verifiableCredential, null, 2))
}

main().catch(console.log)
```
Run this command to create VC
```bash
node --loader ts-node/esm ./src/create-credential.ts  
```
Expected result

```bash
{
  "credentialSubject": {
    "you": "Rock!!!",
    "id": "did:web:example.com"
  },
  "issuer": {
    "id": "did:web:epic-lionfish-distinctly.ngrok-free.app"
  },
  "type": [
    "VerifiableCredential"
  ],
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "issuanceDate": "2024-04-23T06:04:03.000Z",
  "proof": {
    "type": "JwtProof2020",
    "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTM4NTIyNDMsImlzcyI6ImRpZDp3ZWI6ZXBpYy1saW9uZmlzaC1kaXN0aW5jdGx5Lm5ncm9rLWZyZWUuYXBwIn0.xBcTTeHbIHgq3r-2BPSP3UdtI4lw37Su54Z1TPxV4rRG775wfRa2kLltrFbsZClDvcrnvQRwqv7pOFnfxj5vCg"
  }
}
```
## Verify a VC
Create a new file in **`src/verify-credential.ts`**, and add the following code.
```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const result = await agent.verifyCredential({
    credential: {
        //the content of the credential you just issued
      credentialSubject: {
        you: 'Rock!!!',
        id: 'did:web:example.com',
      },
      issuer: {
        id: 'did:web:epic-lionfish-distinctly.ngrok-free.app', //id of issuer you created
      },
      type: ['VerifiableCredential'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2024-04-23T06:04:03.000Z', //replace this by the issuanceDate of the VC that you just issued
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTM4NTIyNDMsImlzcyI6ImRpZDp3ZWI6ZXBpYy1saW9uZmlzaC1kaXN0aW5jdGx5Lm5ncm9rLWZyZWUuYXBwIn0.xBcTTeHbIHgq3r-2BPSP3UdtI4lw37Su54Z1TPxV4rRG775wfRa2kLltrFbsZClDvcrnvQRwqv7pOFnfxj5vCg', //replace this by the jwt in the proof of the VC that you just issued
      },
    },
  })
  console.log(`Credential verified`, result.verified)
}

main().catch(console.log)
```
Run this command to verify VC
```bash
node --loader ts-node/esm ./src/verify-credential.ts  
```

## Using VCKit renderer
Create a new file in **`src/render-credential.ts`**, and add the following code.
```typescript
import { agent } from './vckit/setup.js'
import { Buffer } from 'buffer'
async function main() {
    const params = {
        credential: {
          credentialSubject: {
            you: 'Rock!!!',
            id: 'did:web:example.com',
          },
          issuer: {
            id: 'did:web:epic-lionfish-distinctly.ngrok-free.app',
          },
          type: ['VerifiableCredential'],
          '@context': ['https://www.w3.org/2018/credentials/v1','https://vckit-contexts.s3.ap-southeast-2.amazonaws.com/dev-render-method-context.json'],
          issuanceDate: '2024-04-02T04:34:06.000Z',
          render: [
            {
              "template": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.degreeSchool}}.\n  </div>\n</div>",
              "@type": "WebRenderingTemplate2022"
            }
          ],
          proof: {
            type: 'JwtProof2020',
            jwt: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTM4NTIyNDMsImlzcyI6ImRpZDp3ZWI6ZXBpYy1saW9uZmlzaC1kaXN0aW5jdGx5Lm5ncm9rLWZyZWUuYXBwIn0.xBcTTeHbIHgq3r-2BPSP3UdtI4lw37Su54Z1TPxV4rRG775wfRa2kLltrFbsZClDvcrnvQRwqv7pOFnfxj5vCg',
          },
        },
      }
    const result = await agent.renderCredential(params)
    const htmlResult = Buffer.from(result.documents[0], 'base64').toString('utf8')
    console.log(htmlResult);

}
main().catch(console.log)
```
Run this command to render VC
```bash
node --loader ts-node/esm ./src/render-credential.ts 
```