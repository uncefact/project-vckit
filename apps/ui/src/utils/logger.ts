import debug from "debug";

const creator = debug("tradetrust-website");

const trace = creator.extend("trace");
const error = creator.extend("error");

export const stack =
  (namespace: string) =>
  (err: Error): void => {
    error.extend(namespace)(err.message);
    error.extend(namespace)(err.stack);
  };

export const getLogger = (
  namespace: string
): { trace: debug.Debugger; error: debug.Debugger; stack: (error: Error) => void } => ({
  trace: trace.extend(namespace),
  error: error.extend(namespace),
  stack: stack(namespace),
});
