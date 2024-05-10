import { agent } from './vckit/setup.js'

async function main() {
  const result = await agent.verifyCredential({
    credential: {
      credentialSubject: {
        you: 'Rock!!!',
        id: 'did:web:example.com',
      },
      issuer: {
        id: 'did:ethr:goerli:0x034bf915061b8c5de11b5333522a66da8da7fe83d8f68b7ec74d9a2d3c200a6e20',
      },
      type: ['VerifiableCredential'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2024-04-02T04:34:06.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2shISEifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE3MTIwMzI0NDYsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzNGJmOTE1MDYxYjhjNWRlMTFiNTMzMzUyMmE2NmRhOGRhN2ZlODNkOGY2OGI3ZWM3NGQ5YTJkM2MyMDBhNmUyMCJ9.LrqC0TR0e7tDL81oF9aPRdY8JcfNQUI6UVFthO71LWlsNX9zjpI65axgi0p9rK8Wg41_86-dyBUDHt4-8fqQaA',
      },
    },
  })
  console.log(result);
  console.log(`Credential verified`, result.verified)
}

main().catch(console.log)