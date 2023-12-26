import jsonld from 'jsonld';

const LOG_VERBOSE = false;

const expansionMap = (info: any) => {
  if (info.unmappedProperty) {
    throw new Error('Undefined term: ' + info.unmappedProperty);
  }
};

const getMessages = async (obj: any, documentLoader: any) => {
  let nquads: string = '';

  if (!documentLoader) {
    throw new Error(
      'URDNA2015 requires a documentLoader to normalize objects.'
    );
  }
  try {
    nquads = await jsonld.canonize(obj, {
      algorithm: 'URDNA2015',
      format: 'application/n-quads',
      documentLoader,
      expansionMap,
    });
  } catch (e) {
    if (LOG_VERBOSE) {
      console.error(e);
    }
    throw e;
  }
  return nquads
    .split('\n')
    .filter((_: any) => _.length > 0)
    .map((element: any) => {
      if (element.includes('<urn:bnid:')) {
        return element;
      }
      const newElement = element.replace(/(_:c14n[0-9]+)/g, `<urn:bnid:$1>`);
      return newElement;
    });
};

const getObject = async (
  messages: string[],
  context: any,
  documentLoader: any
) => {
  const obj1 = await jsonld.fromRDF(messages.join('\n'), {
    format: 'application/n-quads',
  });
  const obj2 = await jsonld.compact(obj1, context, { documentLoader });
  const obj3 = await jsonld.frame(
    obj2,
    { '@context': context, '@embed': '@always', type: {} },
    { documentLoader }
  );
  return obj3;
};

const objectToMessages = async (obj: any, { documentLoader }: any) => {
  const { proof, ...document } = obj;
  const documentMessages = await getMessages(document, documentLoader);
  const proofMessages = await getMessages(
    {
      '@context': document['@context'],
      ...proof,
      '@id': 'urn:merkle-dislosure-proof:ephemeral-blank-node-id',
    },
    documentLoader
  );

  return [...documentMessages, ...proofMessages];
};

const messagesToObject = async (
  messages: string[],
  { context, documentLoader }: any
) => {
  const proofMessages = messages.filter((m: string) => {
    return m.startsWith('<urn:merkle-dislosure-proof:ephemeral-blank-node-id>');
  });
  const documentMessages = messages.filter((m: string) => {
    return !m.startsWith(
      '<urn:merkle-dislosure-proof:ephemeral-blank-node-id>'
    );
  });
  const proof = await getObject(proofMessages, context, documentLoader);
  const document = await getObject(documentMessages, context, documentLoader);

  const combined = {
    ...document,
    proof,
  };
  delete combined.proof['@context'];
  delete combined.proof['@id'];
  delete combined.proof.id;

  return combined;
};

export { objectToMessages, messagesToObject };
