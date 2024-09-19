declare module '@digitalcredentials/jsonld';
declare module '@digitalcredentials/jsonld-signatures';
declare module '@digitalcredentials/vc';
declare module 'pako';
declare module 'flat';
declare module 'jsonld';
declare module 'json-pointer';
declare module 'uuid';

declare module '*.json' {
  const content: any;
  export default content;
}
