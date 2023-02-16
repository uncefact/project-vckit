/**
 * Checks and returns environment variables.
 * If variables are not defined then an error is thrown
 * specifying the missing variables.
 *
 * @param vars
 * @returns Partial<ApiConfigFile>
 */
export const checkEnv = (vars: string[]): { [key: string]: string } => {
  const errs: string[] = [];
  const res: { [key: string]: string } = {};
  vars.forEach((varName) => {
    const val = process.env[varName];
    val ? (res[varName] = val) : errs.push(varName);
  });
  if (errs.length) {
    const missingVars = errs.join(', ');
    throw Error(
      `Missing the following required environment variable(s): ${missingVars}`
    );
  }
  return res;
};
