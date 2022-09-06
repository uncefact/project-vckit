import { decryptionKeyMatcher } from "../../../common/utils/matchers";

describe("matcher tests", () => {
  it("should validate a valid decryption key with 63 bytes", () => {
    expect(
      decryptionKeyMatcher.test(
        "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f511"
      )
    ).toBe(true);
  });
  it("should validate a valid decryption key with 64 bytes", () => {
    expect(
      decryptionKeyMatcher.test(
        "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5111"
      )
    ).toBe(true);
  });
  it("should fail when the provided decryption key has an invalid length", () => {
    expect(
      decryptionKeyMatcher.test(
        "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f51"
      )
    ).toBe(false);
  });
  it("should fail when the provided decryption key is not hex", () => {
    expect(
      decryptionKeyMatcher.test(
        "z0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f511j"
      )
    ).toBe(false);
  });
});
