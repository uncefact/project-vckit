import { removePropertyFromObject } from "../../../common/utils/formatDocument";

describe("format document", () => {
  it("should remove the specified property from an object", () => {
    expect(
      removePropertyFromObject(
        {
          __id: "testid",
          test: "data",
        },
        "__id"
      )
    ).toStrictEqual({ test: "data" });
  });
  it("should return object if property doesn't exist", () => {
    expect(
      removePropertyFromObject(
        {
          test: "data",
        },
        "__id"
      )
    ).toStrictEqual({ test: "data" });
  });
});
