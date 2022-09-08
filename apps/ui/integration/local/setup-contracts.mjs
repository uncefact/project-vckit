import shell from "shelljs";

const ACCOUNT_KEY = "0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7";
const TOKEN_REGISTRY_ADDRESS = "0x9eb613a88534e2939518f4ffbfe65f5969b491ff";
const TITLE_ESCROW_CREATOR = "0x4bf7e4777a8d1b6edd5f2d9b8582e2817f0b0953";
const ADDRESS_EXAMPLE_1 = "0xe0a71284ef59483795053266cb796b65e48b5124";
const ADDRESS_EXAMPLE_2 = "0xcdfacbb428dd30ddf6d99875dcad04cbefcd6e60";

// ------------------------------
// Setup
// ------------------------------

// Deploy document store to 0x63A223E025256790E88778a01f480eBA77731D04
shell.exec(`oa deploy document-store "My Document Store" -n local -k ${ACCOUNT_KEY}`);

// Deploy token registry to 0x9Eb613a88534E2939518f4ffBFE65F5969b491FF
shell.exec(`oa deploy token-registry "My Token Registry" MTR -n local -k ${ACCOUNT_KEY}`);

// Deploy title escrow creator to 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953
shell.exec(`oa deploy title-escrow-creator "test" -n local -k ${ACCOUNT_KEY}`);

// ------------------------------
// For transfer holder case
// ------------------------------

// Deploy title escrow to 0xfE442b75786c67E1e7a7146DAeD8943F0f2c23d2
shell.exec(
  `oa deploy title-escrow -b ${ADDRESS_EXAMPLE_1} -h ${ADDRESS_EXAMPLE_1} -r ${TOKEN_REGISTRY_ADDRESS} -c ${TITLE_ESCROW_CREATOR} -n local -k ${ACCOUNT_KEY}`
);

shell.exec(
  `oa token-registry issue -a ${TOKEN_REGISTRY_ADDRESS} --tokenId 0x3c4b6dada4856e82f9c1e931079f261311c72ef6092c51a4ab1dc1085c46b380 --to 0xfE442b75786c67E1e7a7146DAeD8943F0f2c23d2 -n local -k ${ACCOUNT_KEY}`
);

// ------------------------------
// For endorse owner case
// ------------------------------

// Deploy title escrow to 0x547Ca63C8fB3Ccb856DEb7040D327dBfe4e7d20F
shell.exec(
  `oa deploy title-escrow -b ${ADDRESS_EXAMPLE_1} -h ${ADDRESS_EXAMPLE_1} -r ${TOKEN_REGISTRY_ADDRESS} -c ${TITLE_ESCROW_CREATOR} -n local -k ${ACCOUNT_KEY}
    `
);

shell.exec(
  `oa token-registry issue -a ${TOKEN_REGISTRY_ADDRESS} --tokenId 0xeda903b58689a72247350961bb62fc3a1d5f98caf6633ecbc75208ebb3eb273f --to 0x547Ca63C8fB3Ccb856DEb7040D327dBfe4e7d20F -n local -k ${ACCOUNT_KEY}`
);

// ------------------------------
// For nominate owner + accept nomination case
// ------------------------------

// Deploy title escrow to 0xe42668c14DCd9b0494F64ED528DC3789C69bF9b6
shell.exec(
  `oa deploy title-escrow -b ${ADDRESS_EXAMPLE_1} -h ${ADDRESS_EXAMPLE_2} -r ${TOKEN_REGISTRY_ADDRESS} -c ${TITLE_ESCROW_CREATOR} -n local -k ${ACCOUNT_KEY}
    `
);

shell.exec(
  `oa token-registry issue -a ${TOKEN_REGISTRY_ADDRESS} --tokenId 0x3e7418c37f878fd8585950210aca250a11002bb121d5624ef985a43a31381302 --to 0xe42668c14DCd9b0494F64ED528DC3789C69bF9b6 -n local -k ${ACCOUNT_KEY}`
);

// ------------------------------
// For surrender case
// ------------------------------

// Deploy title escrow to 0x82524C1C34F52a2c42eA41daF08B27cB7711c9EE
shell.exec(
  `oa deploy title-escrow -b ${ADDRESS_EXAMPLE_1} -h ${ADDRESS_EXAMPLE_1} -r ${TOKEN_REGISTRY_ADDRESS} -c ${TITLE_ESCROW_CREATOR} -n local -k ${ACCOUNT_KEY}
    `
);

shell.exec(
  `oa token-registry issue -a ${TOKEN_REGISTRY_ADDRESS} --tokenId 0x877a638bdd8d09f415efc2ce1fc1adc41e979e50739145939f0be2a478a340b9 --to 0x82524C1C34F52a2c42eA41daF08B27cB7711c9EE -n local -k ${ACCOUNT_KEY}`
);
