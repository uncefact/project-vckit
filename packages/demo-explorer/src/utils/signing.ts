import { W3CVerifiableCredential, ProofFormat } from '@veramo/core'

interface ICreateCredentialArgs {
  agent: any
  issuer: string
  credentialSubject: any
  proofFormat: string
  customContext: string | string[]
  type: string | string[]
  [key: string]: any
}

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}

const issueCredential = async (args: ICreateCredentialArgs) => {
  const {
    agent,
    issuer,
    credentialSubject,
    proofFormat,
    customContext,
    type,
    ...additionalProperties
  } = args
  let context: string[] = []
  let credentialStatus
  if (customContext.includes('https://www.w3.org/2018/credentials/v1')) {
    credentialStatus = await issueRevocationStatus(agent, issuer)
    context = ['https://w3id.org/vc-revocation-list-2020/v1']
  }

  if (typeof customContext === 'string') {
    context = [...context, customContext]
  }
  if (Array.isArray(customContext)) {
    context = [...context, ...customContext]
  }

  let typeArr = ['VerifiableCredential']
  if (typeof type === 'string') {
    typeArr = [...typeArr, type]
  }
  if (Array.isArray(type)) {
    typeArr = [...typeArr, ...type]
  }
  let credential = buildCredential(
    {
      issuanceDate: new Date().toISOString(),
      '@context': context,
      type: typeArr,
      credentialSubject,
    },
    proofFormat,
    issuer,
    additionalProperties,
  )

  if (credentialStatus) {
    credential = { ...credential, credentialStatus }
  }

  let credentialObj: any = {
    credential,
    proofFormat,
    save: true,
    fetchRemoteContexts: true,
  }

  return await agent?.routeCreationVerifiableCredential(credentialObj)
}

const signVerifiablePresentation = async (
  agent: any,
  did: string,
  verifier: string[],
  selected: W3CVerifiableCredential[],
  proofFormat: ProofFormat,
) => {
  return await agent?.createVerifiablePresentation({
    presentation: {
      holder: did,
      verifier,
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      verifiableCredential: selected,
    },
    proofFormat,
    save: true,
  })
}

function buildCredential(
  credential: any,
  proofFormat: string,
  issuerDid: string,
  additionalProperties: { [key: string]: any },
): any {
  const _credential = {
    ...credential,
    ...additionalProperties.additionalFieldsFromSchema,
  }

  let issuer = { id: issuerDid }

  if (proofFormat === 'OpenAttestationMerkleProofSignature2018') {
    let {
      openAttestationMetadata,
      issuerProfile,
      version,
      identityProofType,
      identityProofIdentifier,
    } = additionalProperties
    issuer = { ...issuer, ...issuerProfile }

    openAttestationMetadata = {
      ...openAttestationMetadata,
      proof: {
        type: 'OpenAttestationProofMethod',
        method: 'DID',
        value: issuerDid,
        revocation: {
          type: 'NONE',
        },
      },
    }

    if (identityProofType === 'DID') {
      openAttestationMetadata.identityProof = {
        type: identityProofType,
        identifier: issuerDid,
      }
    } else {
      openAttestationMetadata.identityProof = {
        type: identityProofType,
        identifier: identityProofIdentifier,
      }
    }

    return {
      ..._credential,
      version,
      issuer,
      openAttestationMetadata,
    }
  } else {
    return { ..._credential, issuer }
  }
}

const issueBitstringStatus = async (agent: any, issuer: string) => {
  if (typeof agent.issueBitstringStatusList === 'function') {
    const credentialStatus = await agent?.issueBitstringStatusList({
      statusPurpose: 'revocation',
      bitstringStatusIssuer: issuer,
    })

    return credentialStatus
  }
  return null
}

const issueRevocationStatus = async (agent: any, issuer: string) => {
  if (typeof agent.issueRevocationStatusList === 'function') {
    const credentialStatus = await agent?.issueRevocationStatusList({
      revocationVCIssuer: issuer,
    })

    return credentialStatus
  }
  return null
}

export { claimToObject, issueCredential, signVerifiablePresentation }
