import * as handlers from "../../../index";

const handlersObject: any = handlers;

describe("test handlers", () => {
  it("should contain a seedConfigHandler", () => {
    expect(handlersObject.seedConfigHandler).toBeDefined();
  });
});
