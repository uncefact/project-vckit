import { sample, setActive, reset } from "./sample";

describe("demoDocument", () => {
  it("should set state to true when setActive", () => {
    const initialState = { isSampleDocument: false };
    const finalState = { isSampleDocument: true };
    const state = sample(initialState, setActive());

    expect(state).toStrictEqual(finalState);
  });

  it("should set state to false when reset", () => {
    const initialState = { isSampleDocument: true };
    const finalState = { isSampleDocument: false };
    const state = sample(initialState, reset());

    expect(state).toStrictEqual(finalState);
  });
});
