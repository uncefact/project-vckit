import debug from "debug";

export enum ApiLogNamespace {
  StorageApi = "StorageApi",
  ConfigApi = "ConfigApi",
  S3 = "S3",
  Server = "Server",
  Seed = "Seed",
  VCApi = "VCApi",
}

export class Logger {
  debugger;
  constructor(loggerName: string) {
    this.debugger = debug(loggerName);

    if (!process.env.JEST_WORKER_ID) {
      // enable log outputs if not running in jest
      debug.enable("*");
    }
  }
  trace(namespace: ApiLogNamespace, message: string) {
    this.debugger(`trace:${namespace}: ${message}`);
  }
  info(namespace: ApiLogNamespace, message: string) {
    this.debugger(`info:${namespace}: ${message}`);
  }
  debug(namespace: ApiLogNamespace, message: string) {
    this.debugger(`debug:${namespace}: ${message}`);
  }
  warn(namespace: ApiLogNamespace, message: string) {
    this.debugger(`warn:${namespace}: ${message}`);
  }
  error(namespace: ApiLogNamespace, message: string) {
    this.debugger(`error:${namespace}: ${message}`);
  }
}

export const logger = new Logger("vckit-functions");
