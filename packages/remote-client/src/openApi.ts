import { OpenAPIV3 } from 'openapi-types'
import { IAgent, IAgentPluginSchema } from '@vckit/core-types'

const getInteropApiPathItem = (method: string, agentSchema: IAgentPluginSchema): {path: string, pathItem: OpenAPIV3.PathItemObject} => {
  switch(method) {
    case "resolveDid":
      return {
        path: 'identifiers/{did}',
        pathItem: {
          get: {
                summary: "Resolve",
                operationId: method,
                description: agentSchema.components.methods[method].description,
                tags: [
                  "Identifiers"
                ],
                parameters: [
                  {
                    name: "did",
                    in: "path",
                    required: true,
                    description: "A decentralized identifier",
                    schema: {
                      type: "string"
                    },
                    example: "did:web:vckit-holder-demo.herokuapp.com"
                  }
                ],
                responses: {
                  200: {
                    // TODO returnType description
                    description: agentSchema.components.methods[method].description,
                    content: {
                      'application/json; charset=utf-8': {
                        schema: agentSchema.components.methods[method].returnType,
                      },
                    },
                  },
                  400: {
                    description: 'Validation error',
                    content: {
                      'application/json; charset=utf-8': {
                        schema: agentSchema.components.schemas.ValidationError,
                      },
                    },
                  },
                },
              },
          
        }
      };
      case "dataStoreORMGetVerifiableCredentials":
      return {
        path: 'credentials',
        pathItem: {
          get: {
                summary: "List credentials",
                operationId: method,
                description: agentSchema.components.methods[method].description,
                // security: [
                //   {
                //     "OAuth2": [
                //       "resolve:dids"
                //     ]
                //   }
                // ],
                tags: [
                  "Credentials"
                ],
                responses: {
                  200: {
                    // TODO returnType description
                    description: agentSchema.components.methods[method].description,
                    content: {
                      'application/json; charset=utf-8': {
                        schema: agentSchema.components.methods[method].returnType,
                      },
                    },
                  },
                  400: {
                    description: 'Validation error',
                    content: {
                      'application/json; charset=utf-8': {
                        schema: agentSchema.components.schemas.ValidationError,
                      },
                    },
                  },
                },
              },
          
        }
      }    
    default:
      return {path:'', pathItem:{}}
  }
}


/**
 * This method can be used to generate an OpenAPIv3 schema to describe how the methods of a Veramo agent can be called
 * remotely.
 *
 * @param agent - The agent whose schema needs to be interpreted.
 * @param basePath - The base URL
 * @param exposedMethods - The list of method names available through this schema
 * @param name - The name of the agent
 * @param version - The version of the agent
 *
 * @public
 */
export const getOpenApiSchema = (
  agent: IAgent,
  basePath: string,
  exposedMethods: Array<string>,
  name?: string,
  version?: string,
): OpenAPIV3.Document => {
  const agentSchema = agent.getSchema()

  const paths: OpenAPIV3.PathsObject = {}

  const schemas = {}
  const xMethods: Record<string, any> = {}
  
  for (const method of exposedMethods) {
    let pathItemObject: OpenAPIV3.PathItemObject;
      const resource = getInteropApiPathItem(method, agentSchema);
      pathItemObject = resource.pathItem;
      paths[basePath + '/' + resource.path] = pathItemObject
      xMethods[method] = agentSchema.components.methods[method]
  }

  const openApi: OpenAPIV3.Document & { 'x-methods'?: Record<string, any> } = {
    openapi: '3.0.0',
    info: {
      title: name || 'DID Agent',
      version: version || '',
    },
    security: [{ "auth": [] }],
    components: {
      schemas: agent.getSchema().components.schemas,
      securitySchemes: { auth: { type: "http", scheme: "bearer" } }
    },
    tags: [
      {
        name: "Discovery"
      },
      {
        name: "Identifiers"
      },
      {
        name: "Credentials"
      },
      {
        name: "Presentations"
      }
    ],
    paths,
  }

  openApi['x-methods'] = xMethods

  return openApi
}
