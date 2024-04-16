---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---

# Basic Operations

## Create Identifier

Create a new file in **`src/create-identifier.ts`**, and add the following code.
**Note**: in this guide we use did:ethr as the did method, you can use other method by declaring the provider as the parameter of didManagerCreate function

```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const identifier = await agent.didManagerCreate({ alias: 'default' })
  console.log(`New identifier created`)
  console.log(JSON.stringify(identifier, null, 2))
}

main().catch(console.log)
```
Run this command to create identifier
```bash
node --loader ts-node/esm ./src/create-identifier.ts  
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

## Create a VC 
Create a new file in **`src/create-credential.ts`**, add the following code.
```typescript
import { agent } from './vckit/setup.js'

async function main() {
  const identifier = await agent.didManagerGetByAlias({ alias: 'default' })
  console.log(identifier);
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
        id: 'did:ethr:goerli:0x034bf915061b8c5de11b5333522a66da8da7fe83d8f68b7ec74d9a2d3c200a6e20', //id of issuer you created
      },
      type: ['VerifiableCredential'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2024-04-02T04:34:06.000Z', //replace this by the issuanceDate of the VC that you just issued
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTIwMzI0NDYsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzNGJmOTE1MDYxYjhjNWRlMTFiNTMzMzUyMmE2NmRhOGRhN2ZlODNkOGY2OGI3ZWM3NGQ5YTJkM2MyMDBhNmUyMCJ9.LrqC0TR0e7tDL81oF9aPRdY8JcfNQUI6UVFthO71LWlsNX9zjpI65axgi0p9rK8Wg41_86-dyBUDHt4-8fqQaA', //replace this by the jwt in the proof of the VC that you just issued
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
            id: 'did:ethr:goerli:0x034bf915061b8c5de11b5333522a66da8da7fe83d8f68b7ec74d9a2d3c200a6e20',
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
            jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTIwMzI0NDYsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzNGJmOTE1MDYxYjhjNWRlMTFiNTMzMzUyMmE2NmRhOGRhN2ZlODNkOGY2OGI3ZWM3NGQ5YTJkM2MyMDBhNmUyMCJ9.LrqC0TR0e7tDL81oF9aPRdY8JcfNQUI6UVFthO71LWlsNX9zjpI65axgi0p9rK8Wg41_86-dyBUDHt4-8fqQaA',
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