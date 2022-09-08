import { assertConfigFile } from "./validate";

import sample from "../../test/fixture/config/v2/sample-config-ropsten.json";

describe("configFileSchema", () => {
  it("validates against sample wallet file", () => {
    expect.assertions(1);
    expect(() => assertConfigFile(sample as any)).not.toThrow();
  });

  it("throws when wallet is malformed", () => {
    expect.assertions(6);
    expect(() => assertConfigFile({ ...sample, wallet: undefined } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, wallet: "" } as any)).toThrow(/not allowed to be empty/);
    expect(() => assertConfigFile({ ...sample, forms: undefined } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, forms: [{ name: undefined, type: "abc" }] } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, forms: [{ name: "abc", type: undefined }] } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, forms: [{ name: "abc", type: "abc" }] } as any)).toThrow(
      /must be one of/
    );
  });

  describe("wallet", () => {
    it("should throw when network is missing", () => {
      expect(() => assertConfigFile({ ...sample, network: undefined } as any)).toThrow(/missing/);
    });
  });

  describe("forms", () => {
    it("should throw when defaults is missing", () => {
      expect(() =>
        assertConfigFile({ ...sample, forms: [{ ...sample.forms[0], defaults: undefined }] } as any)
      ).toThrow(/missing/);
    });
    it("should throw when schema is missing", () => {
      expect(() => assertConfigFile({ ...sample, forms: [{ ...sample.forms[0], schema: undefined }] } as any)).toThrow(
        /missing/
      );
    });
    it("should throw when type is malformed", () => {
      expect(() => assertConfigFile({ ...sample, forms: [{ ...sample.forms[0], type: "FOO_BAR" }] } as any)).toThrow(
        /must be one of/
      );
    });
    it("should throw when name is missing", () => {
      expect(() => assertConfigFile({ ...sample, forms: [{ ...sample.forms[0], name: undefined }] } as any)).toThrow(
        /missing/
      );
    });
  });

  describe("documentStorage", () => {
    it("should not throw when documentStorage is missing", () => {
      expect(() =>
        assertConfigFile({
          ...sample,
          documentStorage: undefined,
        } as any)
      ).not.toThrow(/missing/);
    });

    it("should throw when url is missing", () => {
      expect(() =>
        assertConfigFile({
          ...sample,
          documentStorage: { ...sample.documentStorage, url: undefined },
        } as any)
      ).toThrow(/missing/);
    });
  });
});
