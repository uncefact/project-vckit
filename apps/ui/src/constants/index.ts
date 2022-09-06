export enum URLS {
  CREATOR = "https://creator.tradetrust.io/",
  GITHUB = "https://github.com/TradeTrust/tradetrust-website",
  DOCS = "https://docs.tradetrust.io/",
}

// as per @govtechsg/open-attestation/dist/types/__generated__/schema.2.0 and schema.3.0 , but omit `Did = "DID"`
export enum IdentityProofType {
  DNSDid = "DNS-DID",
  DNSTxt = "DNS-TXT",
}
