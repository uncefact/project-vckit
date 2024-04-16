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