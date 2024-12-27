export const updateSwagger = (
  swaggerJson: Record<string, any>,
  options: { version: string; url: string },
) => {
  const swagger = { ...swaggerJson };
  swagger.info = swagger.info || {};
  swagger.info.version = options.version;
  swagger.servers = [{ url: options.url }];
  return swagger;
};
