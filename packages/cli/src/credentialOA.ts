import { getAgent } from './setup.js';
import { Command } from 'commander';
import inquirer from 'inquirer';
import qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as json5 from 'json5';
import { readStdin } from './util.js';
import { CredentialPayload } from '@vckit/core-types';

import fuzzy from 'fuzzy';

const credentialOA = new Command('credentialOA').description(
  'Open Attestation Verifiable Credential'
);

credentialOA
  .command('create', { isDefault: true })
  .description('Create Open Attestation Verifiable Credential')
  .option('-s, --send', 'Send')
  .option('-j, --json', 'Output in JSON')
  .option('-q, --qrcode', 'Show qrcode')
  .action(
    async (
      opts: { send: boolean; qrcode: boolean; json: boolean },
      cmd: Command
    ) => {
      const agent = await getAgent(cmd.optsWithGlobals().config);
      const identifiers = await agent.didManagerFind({ provider: 'did:ethr' });

      const knownDids = await agent.dataStoreORMGetIdentifiers();
      const subjects = [...knownDids.map((id) => id.did)];
      const proofFormat = 'OpenAttestationMerkleProofSignature2018';

      if (identifiers.length === 0) {
        console.error('No did ethrs');
        process.exit();
      }
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'iss',
          choices: identifiers.map((item) => ({
            name: `${item.did} ${item.alias}`,
            value: item.did,
          })),
          message: 'Issuer DID',
        },
        {
          type: 'list',
          name: 'identityProofType',
          choices: ['DNS-DID', 'DNS-TXT', 'DID'],
          message: 'Identity Proof Type',
          default: 'DNS',
        },
        {
          type: 'input',
          name: 'identityProofIdentifier',
          message: 'Identity Proof Identifier',
          when: (answers) => answers.identityProofType !== 'DID',
        },
        {
          type: 'autocomplete',
          name: 'sub',
          pageSize: 15,
          source: async (answers: any, input: string) => {
            const res = fuzzy
              .filter(input, subjects)
              .map((el: any) => (typeof el === 'string' ? el : el.original));
            return res;
          },
          message: 'Subject DID',
        },
        {
          type: 'input',
          name: 'type',
          message: 'Credential Type',
          default: 'OpenAttestationCredential,DrivingLicenceCredential',
        },
        {
          type: 'input',
          name: 'claimType',
          message: 'Claim Type',
          default: 'name',
        },
        {
          type: 'input',
          name: 'claimValue',
          message: 'Claim Value',
          default: 'Alice',
        },
      ]);

      const credentialSubject: any = {};
      credentialSubject.id = answers.sub;
      const type: string = answers.claimType;
      credentialSubject[type] = answers.claimValue;
      const context = [
        'https://www.w3.org/2018/credentials/v1',
        'https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json',
        'https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json',
      ];

      const credential: CredentialPayload = {
        issuer: {
          id: answers.iss,
          name: 'GoSource Pty Ltd',
          type: 'OpenAttestationIssuer',
        },
        '@context': context,
        type: answers.type.split(','),
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      const identifier =
        answers.identityProofType === 'DID'
          ? answers.iss
          : answers.identityProofIdentifier;
      credential['openAttestationMetadata'] = {
        proof: {
          type: 'OpenAttestationProofMethod',
          method: 'DID',
          value: answers.iss,
          revocation: {
            type: 'NONE',
          },
        },
        identityProof: {
          type: answers.identityProofType,
          identifier: identifier,
        },
      };

      const verifiableCredential = await agent.createVerifiableCredentialOA({
        save: true,
        credential,
        proofFormat,
      });

      if (opts.qrcode) {
        qrcode.generate(verifiableCredential.proof.jwt);
      } else {
        if (opts.json) {
          console.log(JSON.stringify(verifiableCredential, null, 2));
        } else {
          console.dir(verifiableCredential, { depth: 10 });
        }
      }
    }
  );

export { credentialOA };
