import { validateObject } from "../../../common/utils/validate";

const testSchema = {
  type: "object",
  required: ["prop1", "prop2"],
  properties: {
    prop1: {
      $id: "#root/prop1",
      title: "Prop1",
      type: "string",
      default: "",
      pattern: "^.*$",
    },
    prop2: {
      $id: "#root/prop2",
      title: "Prop2",
      type: "string",
      default: "",
      pattern: "^.*$",
    },
  },
  additionalProperties: false,
};

describe("validate", () => {
  it("should validate an object for a given schema", () => {
    const { isValid, errors } = validateObject(
      { prop1: "test1", prop2: "test2" },
      testSchema
    );
    expect(isValid).toBe(true);
    expect(errors).toBe(null);
  });

  it("should return an error if required property is missing", () => {
    const { isValid, errors } = validateObject(
      { prop1: "test1", prop3: "test3" },
      testSchema
    );
    expect(isValid).toBe(false);
    expect(errors).toStrictEqual([
      {
        instancePath: "",
        keyword: "required",
        message: "must have required property 'prop2'",
        params: { missingProperty: "prop2" },
        schemaPath: "#/required",
      },
    ]);
  });

  it("should return an error if additional property exists", () => {
    const { isValid, errors } = validateObject(
      { prop1: "test1", prop2: "test2", prop3: "test3" },
      testSchema
    );
    expect(isValid).toBe(false);
    expect(errors).toStrictEqual([
      {
        instancePath: "",
        keyword: "additionalProperties",
        message: "must NOT have additional properties",
        params: { additionalProperty: "prop3" },
        schemaPath: "#/additionalProperties",
      },
    ]);
  });
});
