import { getProofs, verifyProofs, deriveProofs } from '../merkle.js';

const createProof = async (document: any, options: any) => {
  const { objectToMessages } = options;
  const messages = await objectToMessages(document, options);

  const proofs = getProofs(messages, options.rootNonce);

  return {
    type: 'MerkleDisclosureProof2021',
    proofs,
  };
};

const deriveProof = async (
  outputDocument: any,
  inputDocument: any,
  proof: any,
  options: any
) => {
  const { objectToMessages, messagesToObject } = options;
  const inputMessages = await objectToMessages(inputDocument, options);
  const outputMessages = await objectToMessages(outputDocument, options);

  const outputDocumentFromMessages = await messagesToObject(outputMessages, {
    ...options,
    context: outputDocument['@context'],
  });

  const disclosedProofs = deriveProofs(
    inputMessages,
    outputMessages,
    proof.proofs
  );
  const derivedProof = {
    ...proof,
    proofs: disclosedProofs,
  };

  delete outputDocumentFromMessages.proof;
  return { document: outputDocumentFromMessages, proof: derivedProof };
};

const verifyProof = async (document: any, proof: any, options: any) => {
  const { objectToMessages } = options;
  const messages = await objectToMessages(document, options);
  return { verified: verifyProofs(messages, proof.proofs) };
};

export { createProof, deriveProof, verifyProof };
