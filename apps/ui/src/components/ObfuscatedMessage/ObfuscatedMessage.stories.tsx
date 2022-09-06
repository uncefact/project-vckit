import React from "react";
import { ObfuscatedMessage } from "./ObfuscatedMessage";
import { WrappedOrSignedOpenAttestationDocument } from "../../utils/shared";

export default {
  title: "UI/ObfuscatedMessage",
  component: ObfuscatedMessage,
};

const document = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    $template: {
      name: "fdb9d37a-ac86-4956-887c-d221c8e0cd62:string:main",
      type: "31f7607f-54b9-46e7-8c1d-9c013c2ecd88:string:EMBEDDED_RENDERER",
      url: "744f3009-426f-4ab7-91be-72abc02332e1:string:https://tutorial-renderer.openattestation.com",
    },
    recipient: {},
    issuers: [
      {
        name: "d722d892-03c5-479d-af14-e4e7c6a4b822:string:Demo Issuer",
        documentStore: "0aaf2824-6679-4bda-a669-b94ce50ef590:string:0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: "af17ca30-0e7f-4fd9-848e-815f12badd6f:string:DNS-TXT",
          location: "39c6d282-3061-492c-ae56-85745cc3edb7:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
    proof: [],
    merkleRoot: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
  },
  privacy: {
    obfuscatedData: ["45c49a0e6efbde83c602cf6bbe4aa356d495feaf78a9a309cc1bad101f5c52f4"],
  },
} as WrappedOrSignedOpenAttestationDocument;

export const Default = () => {
  return <ObfuscatedMessage document={document} />;
};
