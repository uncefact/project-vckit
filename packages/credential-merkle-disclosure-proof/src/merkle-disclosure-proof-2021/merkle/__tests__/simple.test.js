const MerkleTools = require("@settlemint/merkle-tools").default;

it("simple", async () => {
  const merkleTools = new MerkleTools(); // no options, defaults to sha-256 hash type

  const member0 =
    "0009f074d2c3fa193e305bc109892f20760cbbecc218b43394a9356da35a72b3";

  const member1 =
    "1119f074d2c3fa193e305bc109892f20760cbbecc218b43394a9356da35a72b3";

  const member2 =
    "2229f074d2c3fa193e305bc109892f20760cbbecc218b43394a9356da35a72b3";

  merkleTools.addLeaf(member0);
  merkleTools.addLeaf(member1);
  merkleTools.addLeaf(member2);

  merkleTools.makeTree();

  const proof0 = merkleTools.getProof(0);
  const proof1 = merkleTools.getProof(1);
  const proof2 = merkleTools.getProof(2);

  const merkleRoot = merkleTools.getMerkleRoot();

  merkleTools.resetTree();

  const isValid0 = merkleTools.validateProof(proof0, member0, merkleRoot);
  expect(isValid0).toBe(true);
  const isValid1 = merkleTools.validateProof(proof1, member1, merkleRoot);
  expect(isValid1).toBe(true);
  const isValid2 = merkleTools.validateProof(proof2, member2, merkleRoot);
  expect(isValid2).toBe(true);
});
