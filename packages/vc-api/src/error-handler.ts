/**
 * Defines the structure of a VC API error.
 */
interface VCApiError {
  code: number;
  message: string;
  data?: any;
}

/**
 * Handles and transforms an error into a VCApiError object.
 * @param {Error} error - The error to be handled.
 * @returns {VCApiError} The transformed VCApiError object.
 */
export const errorHandler = (error: Error): VCApiError => {
  let vcApiError: VCApiError;
  const errorType = error.message.split(':')[0];
  const errorMessage = error.message.split(':')[1];
  switch (errorType) {
    case 'not_found':
      return (vcApiError = {
        code: 404,
        message: errorMessage,
      });
    case 'not_implemented':
      return (vcApiError = {
        code: 501,
        message: errorMessage,
      });
    default:
      return (vcApiError = {
        code: 500,
        message: error.message,
      });
  }
};
