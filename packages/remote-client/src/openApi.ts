import { OpenAPIV3 } from 'openapi-types'
import { IAgent, IAgentPluginSchema } from '@vckit/core-types'

type XBadges = {
  color: string,
  label: string
}


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
      };
      case 'createVerifiableCredential':
      return {
        path: 'credentials/issue',
        pathItem: {
          post: {
                summary: "Create",
                operationId: method,
                description: agentSchema.components.methods[method].description,
                tags: [
                  "Credentials"
                ],
                // security: [
                //   {
                //     OAuth2: [
                //       "issue:credentials"
                //     ]
                //   }
                // ],
                requestBody: {
                  description: "Parameters for issuing the credential.",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        required: [
                          "credential",
                          "options"
                        ],
                        properties: {
                          credential: {
                            type: "object",
                            required: [
                              "@context",
                              "type",
                              "issuer",
                              "issuanceDate",
                              "credentialSubject"
                            ],
                            properties: {
                              "@context": {
                                description: "The JSON-LD Context defining all terms in the Credential. This array\nSHOULD contain \"https://w3id.org/traceability/v1\".\n",
                                type: "array",
                                items: {
                                  type: "string"
                                }
                              },
                              id: {
                                description: "The IRI identifying the Credential",
                                type: "string"
                              },
                              type: {
                                description: "The Type of the Credential",
                                type: "array",
                                items: {
                                  type: "string"
                                },
                                minItems: 1
                              },
                              issuer: {
                                description: "This value MUST match the assertionMethod used to create the Verifiable Credential.",
                                oneOf: [
                                  {
                                    type: "string"
                                  },
                                  {
                                    type: "object",
                                    required: [
                                      "id"
                                    ],
                                    properties: {
                                      id: {
                                        description: "The IRI identifying the Issuer",
                                        type: "string"
                                      }
                                    }
                                  }
                                ]
                              },
                              issuanceDate: {
                                description: "This value MUST be an XML Date Time String",
                                type: "string"
                              },
                              credentialSubject: {
                                type: "object",
                                properties: {
                                  id: {
                                    description: "The IRI identifying the Subject",
                                    type: "string"
                                  }
                                }
                              }
                            },
                            example: {
                              credential: {
                                "@context": [
                                  "https://www.w3.org/2018/credentials/v1",
                                  "https://w3id.org/traceability/v1"
                                ],
                                id: "urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded",
                                type: [
                                  "VerifiableCredential"
                                ],
                                issuer: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
                                issuanceDate: "2010-01-01T19:23:24Z",
                                credentialSubject: {
                                  id: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
                                }
                              },
                              options: {
                                type: "JsonWebSignature2020",
                                created: "2020-04-02T18:28:08Z",
                                credentialStatus: {
                                  type: "RevocationList2020Status"
                                }
                              }
                            }
                          },
                          options: {
                            title: "Issue Credential Options",
                            type: "object",
                            description: "Options for issuing a verifiable credential",
                            required: [
                              "type"
                            ],
                            properties: {
                              type: {
                                type: "string",
                                description: "Linked Data Signature Suite or signal to use JWT.",
                                enum: [
                                  "Ed25519Signature2018",
                                  // "JsonWebSignature2020",
                                  "jwt_vc",
                                  "OpenAttestationMerkleProofSignature2018"
                                ]
                              },
                              created: {
                                type: "string",
                                description: "Date the proof was created. This value MUST be an XML Date Time String."
                              },
                              credentialStatus: {
                                type: "object",
                                description: "The method of credential status.",
                                required: [
                                  "type"
                                ],
                                properties: {
                                  type: {
                                    type: "string",
                                    description: "The type of credential status.",
                                    enum: [
                                      "RevocationList2020Status"
                                    ]
                                  }
                                }
                              }
                            },
                            example: {
                              type: "JsonWebSignature2020",
                              created: "2020-04-02T18:28:08Z",
                              credentialStatus: {
                                type: "RevocationList2020Status"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
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

  // FIXME: include legacy veramo rest api methods for now
  // progressivly migrate to more RESTy strcuture
  for (const method of exposedMethods) {
    const pathItemObject: OpenAPIV3.PathItemObject<{'x-badges': Array<XBadges>}> = {
      post: {
        operationId: method,
        description: agentSchema.components.methods[method].description,
        tags: [
          "Veramo Default"
        ],
        'x-badges': [
          {
          color: 'red',
          label: 'Legacy'
        }
      ],
        requestBody: {
          content: {
            'application/json': {
              schema: agentSchema.components.methods[method].arguments,
            },
          },
        },
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
    paths[basePath + '/' + method] = pathItemObject
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
      },
      {
        name: "Veramo Default"
      }
    ],
    paths,
  }

  openApi['x-methods'] = xMethods

  return openApi
}
