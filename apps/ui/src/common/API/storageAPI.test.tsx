import { validate } from "uuid";
import { generateIdAndKey } from "./storageAPI";

describe("storageAPI", () => {
  describe("generateIdAndKey", () => {
    it("should return a valid uuid and encryption key", () => {
      const queueData = generateIdAndKey();

      //   Validate uuid
      expect(validate(queueData.data.id)).toBe(true);

      // Validate encryption key
      // Should be 64 hex string
      const pattern = /[0-9A-Fa-f]{64}/g;
      const result = queueData.data.key.match(pattern);
      expect(result?.length).toBe(1);
    });
  });
});
