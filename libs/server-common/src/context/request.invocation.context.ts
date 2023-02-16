import { Request } from 'express';
import { generate } from 'shortid';
import { decode } from 'jsonwebtoken';
import { UserProfile } from '@dvp/api-interfaces';

/**
 * An interface for a context that can be used to provide contextual information about the current
 * runtime environment.
 *
 * The [[InvocationContext]] is closely associated to the [[Logger]], and as such it exposes all fields
 * that the logger supports. In addition, it provides the ability to store custom metadata in the
 * [[InvocationContext]]. Custom metadata will be formatted into a dedicated section of each log message
 * that is reserved for this content.
 *
 * The [[InvocationContext]] provides the ability to include contextual information when sending output
 * to the [[Logger]], where this contextual information is not easily able to be gleaned at the time
 * the [[Logger]] is invoked.
 *
 * For example, if the [[Logger]] is invoked inside a utility module, it may be difficult to provide
 * information about the current user (since this information would normally not be provided when
 * invoking the utility functionality). The [[InvocationContext]] provides a means to encapsulate
 * contextual information that is important for logging, and to pass it between application layers.
 *
 * Note that the [[InvocationContext]] may also be used by applications during processing, to perform
 * other application-specific processing that requires information about the current runtime context.
 */
export interface InvocationContext {
  /** The OpenID Connect access token for this context. This is not directly used for logging,
   *  but may be used for chaining invocations through multiple services. */
  accessToken?: string;

  /** The correlation ID for log messages that use this context. */
  correlationId?: string;

  /** The transaction ID for this context. This is not directly used for logging, but may be used
   *  for chaining invocations through multiple services. */
  transactionId?: string;

  /** The request ID for this context. This is not directly used for logging, but may be used for
   *  chaining invocations through multiple services. */
  requestId?: string;

  /** The users ID for this context. This is not directly used for logging, but may be used
   *  for chaining invocations through multiple services. */
  userId: string | null;

  /** The ABN for this context. This is not directly used for logging, but may be used
   *  for chaining invocations through multiple services. */
  userAbn: string | null;

  /** The IP address for log messages that use this context. */
  ipAddress?: string;

  /** The operation name for log messages that use this context. */
  operationId: string;

  /** The operation outcome for log messages that use this context. */
  operationOutcome?: string;

  /** A dictionary of key / value pairs, for additional metadata for log messages that use this
   *  context. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: { [key: string]: any };
}

export class RequestInvocationContext implements InvocationContext {
  public readonly accessToken?: string;

  /** The ID of the user making the request. */
  public readonly userId: string | null;

  /** The ABN associated with the user making the request. */
  public readonly userAbn: string | null;

  /** The correlation ID. */
  public readonly correlationId?: string;

  /** The IP address. */
  public readonly ipAddress: string;

  /** A dictionary of key / value pairs for additional metadata. */
  public readonly metadata?: { [key: string]: string };

  /** The operation name. */
  public readonly operationId: string;

  /** The request id name. */
  public readonly requestId: string | undefined;

  /** The operation outcome. */
  public readonly operationOutcome?: string;

  /** The transaction id for log messages wrapped in the same transaction that use this context */
  public transactionId?: string;

  /**
   * Constructs a new RequestInvocationContext.
   *
   * @param request The HTTP request from which to populate the data for the invocation context.
   */
  public constructor(request: Request, generateTransactionId?: boolean) {
    const authHeader = request.header('Authorization');

    this.accessToken = authHeader?.split(' ')?.[1];

    this.userId = null;
    this.userAbn = null;

    this.correlationId =
      (request.headers['Correlation-ID'] as string) || generate();
    this.transactionId = request.headers['Transaction-ID'] as string;

    this.ipAddress = this.extractRemoteIpAddress(request);
    this.operationId =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (request as any)?.openapi?.schema?.operationId ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (request as any)['operationId'];

    if (generateTransactionId && !this.transactionId) {
      this.transactionId = generate();
    }

    this.requestId = request.header('Request-ID');

    try {
      if (this.accessToken) {
        const accessTokenPayload = {
          abn: '41161080146', // TODO: Remove hard coded abn.
          ...(decode(this.accessToken) as UserProfile),
        };

        const { sub, abn } = accessTokenPayload;

        if (sub && abn) {
          this.userId = sub;
          this.userAbn = abn;
        }
      }
    } catch {
      return;
    }
  }

  /**
   * Extracts the remote IP address from the HTTP request and populates it into this object.
   *
   * @param request The HTTP request from which to extract the remote IP address.
   */
  private extractRemoteIpAddress(request: Request): string {
    const forwarderChain = request.headers['X-Forwarded-For'] as string;
    if (forwarderChain) {
      const commaPos = forwarderChain.indexOf(',');
      return commaPos > -1
        ? forwarderChain.substring(0, commaPos)
        : forwarderChain;
    }

    return request?.socket?.remoteAddress || '';
  }
}
