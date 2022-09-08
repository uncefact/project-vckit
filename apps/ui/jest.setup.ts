import debug from "debug";
import "jest-canvas-mock";
// Jest swallows stderr from debug, so if process is called with DEBUG then redirect debug to console.log
if (process.env.DEBUG) {
  debug.log = console.log.bind(console);
}

// polyfill (https://stackoverflow.com/questions/42213522/mocking-document-createrange-for-jest)
const createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: "BODY",
    ownerDocument: document,
  },
});
window.alert = jest.fn();
window.fetch = jest.fn();

Object.defineProperty(document, "createRange", createRange);

process.env.CONFIG_FILE_ID = "62e8b48a9bc5f5c72410b98a";
