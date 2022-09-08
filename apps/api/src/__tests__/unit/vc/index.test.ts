import * as handlers from "../../../vc/index";

const handlersObject: any = handlers;

describe("test handlers", () => {
  it("should contain an verify handler", () => {
    expect(handlersObject.handleVerify).toBeDefined();
  });
  it("should contain an issue handler", () => {
    expect(handlersObject.handleIssue).toBeDefined();
  });
  it("should contain a status handler", () => {
    expect(handlersObject.handleStatus).toBeDefined();
  });
});
