# Credential OpenAttestation Plugin

- This plugin is used for issuing and verifying verifiable credential that adhere to OpenAttestation framework
- `uncefact/project-vckit` ’s goals is to support issuing and verifying verifiable credential in both W3C and OpenAtttestation framework right now , so this plugin is packed inside `uncefact/project-vckit` core but it can be plugged into any platform/library that using Veramo architecture.

## Usage

- Add this declaration to `agent.yml` config file

```

///... other declarations
# Agent
agent:
  $require: '@vckit/core#Agent'
  $args:
    - schemaValidation: false
      plugins:
        /// ... other declarations
        **- $require: '@vckit/credential-oa#CredentialPlugin'**
```

- **Signing**
  - To streamline the signing process across signing process between w3c, OpenAttestation and other frameworks in mind , the plugin use private key that managed by Veramo’s keyManager to sign and associate with did document.
  > **NOTE**: OpenAttestation document currently support 2 types of DID which is **did ethereum** and **did web**
- **Using uncefact/project-vckit CLI to create an OpenAttestation verifiable credential**
  - **Prerequisites:** create a new did document if you haven’t create one \*\*\*\*
    - `pnpm run vckit did create`
    - Select **did:ether** or **did:web**
      - If you select **did:web,** it’s your responsibility to put the verification information to standard endpoint so that verifier can resolve and verify your document
      - **Note**: Every did document created has a key associated with it , to add a new key , run `pnpm run vckit did add-key`
    ```jsx
    ? Select identifier provider (Use arrow keys)
    ❯ did:ethr
    ```
    ### **Create OpenAttestation VC**
    - Run: `pnpm run vckit credential create`
      - Select `OpenAttestationMerkleProofSignature2018`
      ```jsx
      ? Credential proofFormat
        jwt
        lds
        EthereumEip712Signature2021
      ❯ OpenAttestationMerkleProofSignature2018
      ```
      - Select a did document you create earlier to identify issuer and sign document
      ```jsx
      Issuer DID
      ❯ did:ethr:0x034bb92d2fffb6ff7ad8fbbefc01a919818017ef3f32c3e1443f44a45ab94f16bb
      ```
      - Select identity proof type
        - **Note**: `DNS-DID` and `DNS-TXT` require you to put the Issuer DID information to the domain specified in Identity Proof Type. Refer to [this](https://www.openattestation.com/docs/integrator-section/verifiable-document/ethereum/dns-proof) for more information. For the `DID` , verification process will skip checking for the issuer information
        ```jsx
        ? Identity Proof Type (Use arrow keys)
        ❯ DNS-DID
          DNS-TXT
          DID
        ```
    ### Verify **OpenAttestation VC**
    - Simple run `pnpm run vckit verify -f vc-file.json` with the result from the create vc to verify the vc
