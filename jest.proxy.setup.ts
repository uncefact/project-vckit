import nodeProxy from 'node-global-proxy';

if (
  process.env['HTTP_PROXY'] &&
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] === '0'
) {
  nodeProxy.setConfig(process.env['HTTP_PROXY']);
  nodeProxy.start();
}
