import assert from 'node:assert/strict';

// Check protocol state independently of implementation-specific envelope and
// implicit-service formatting. Keep the raw JSON comparison in the report.
export function assertResolution(actual, log, filename, nativeDocumentPresent) {
  assert.ok(log.length, 'Missing history');
  const number = /^resolutionResult\.(\d+)\.json$/.exec(filename)?.[1];
  const index = number ? Number(number) - 1 : log.length - 1;
  const selected = log[index];
  assert.ok(selected, 'Requested version is missing');
  const parameters = Object.assign({}, ...log.slice(0, index + 1).map(entry => entry.parameters));
  const metadata = actual.didDocumentMetadata ?? {};
  assert.ok(!actual.didResolutionMetadata?.error, JSON.stringify(actual.didResolutionMetadata));
  assert.equal(metadata.versionId, selected.versionId, 'Wrong selected version');
  assert.equal(metadata.scid, log[0].parameters.scid, 'Wrong SCID');
  assert.equal(Boolean(metadata.deactivated), Boolean(parameters.deactivated), 'Wrong deactivation state');
  if (parameters.deactivated) return;
  assert.notEqual(nativeDocumentPresent, false, 'Native resolver returned no document');
  assert.ok(actual.didDocument, 'Missing DID document');
  for (const [key, value] of Object.entries(selected.state)) {
    if (key === 'service') {
      // Resolvers may append implicit services; explicit services must survive.
      for (const service of value) {
        assert.deepEqual(actual.didDocument.service?.find(item => item.id === service.id), service, 'Changed explicit service');
      }
    } else {
      assert.deepEqual(actual.didDocument[key], value, `Changed document property: ${key}`);
    }
  }
}
