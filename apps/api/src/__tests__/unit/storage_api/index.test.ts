import * as handlers from "../../../index";

const handlersObject: any = handlers;

describe("test handlers", () => {
  it("should contain a createHandler", () => {
    expect(handlersObject.createHandler).toBeDefined();
  });
  it("should contain a getHandler", () => {
    expect(handlersObject.getHandler).toBeDefined();
  });
});
