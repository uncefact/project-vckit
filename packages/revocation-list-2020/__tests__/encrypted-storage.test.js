'use strict';

const encryptedStorage = require('..');
const assert = require('assert').strict;

assert.strictEqual(encryptedStorage(), 'Hello from encryptedStorage');
console.info("encryptedStorage tests passed");
