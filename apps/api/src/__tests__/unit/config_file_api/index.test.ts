import * as handlers from "../../../index";

const handlersObject: any = handlers;

describe("test handlers", () => {
  it("should contain a getConfigHandler", () => {
    expect(handlersObject.getConfigHandler).toBeDefined();
  });
  it("should contain a listAllHandler", () => {
    expect(handlersObject.listAllHandler).toBeDefined();
  });
  it("should contain a createConfigHandler", () => {
    expect(handlersObject.createConfigHandler).toBeDefined();
  });
  it("should contain a updateConfigHandler", () => {
    expect(handlersObject.updateConfigHandler).toBeDefined();
  });
  it("should contain a deleteConfigHandler", () => {
    expect(handlersObject.deleteConfigHandler).toBeDefined();
  });
});
