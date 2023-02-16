/* eslint-disable no-console */
import pinoExpressLogger from 'express-pino-logger';
import pino from 'pino';
import { RequestInvocationContext } from '../context';

export const logger: pino.Logger = pino({
  name: process.env['API'],
  level: process.env['LOG_LEVEL'] || 'debug',
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['authorization', 'accessToken', 'invocationContext'],
});

const DEBUG_USE_CONSOLE = process.env['DEBUG_USE_CONSOLE'] === 'true';

export const expressLogger = pinoExpressLogger();

interface LogFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (msg: string, ...args: any[]): void;
}

export class Logger {
  /** pino logger instance  */
  private logger: pino.Logger;

  /**
   * Constructs a new Logger.
   * This has been made private to ensure that logger instances may only be constructed using the
   * static factory methods provided in this class.
   *
   * @param invocationContext The invocation context for the logger. If this is provided, then its
   *        field values will be used as defaults for any log entries. Note, however, that these
   *        defaults may still be overridden by providing specific values for fields when
   *        invoking a log method.
   */
  private constructor(invocationContext?: RequestInvocationContext) {
    this.logger = invocationContext
      ? logger.child(invocationContext as pino.Bindings)
      : logger;
  }

  /**
   * A factory method that obtains a Logger instance without an initial context.
   *
   * @return The Logger instance.
   */
  public static get(): Logger {
    return new Logger();
  }

  /**
   * A factory method that obtains a Logger instance with the specified initial context.
   *
   * @param invocationContext The invocation context for the logger.
   * @return The Logger instance.
   */
  public static from(invocationContext?: RequestInvocationContext): Logger {
    return new Logger(invocationContext);
  }

  info: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.info(...args);
      return;
    }
    this.logger.info(...args);
  };

  debug: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.debug(...args);
      return;
    }
    this.logger.debug(...args);
  };

  trace: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.trace(...args);
      return;
    }
    this.logger.trace(...args);
  };

  error: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.error(...args);
      return;
    }
    this.logger.error(...args);
  };

  fatal: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.error(...args);
      return;
    }
    this.logger.fatal(...args);
  };

  warn: LogFn = (...args) => {
    if (DEBUG_USE_CONSOLE) {
      console.warn(...args);
      return;
    }
    this.logger.warn(...args);
  };
}
