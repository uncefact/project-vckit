export type Resource = keyof typeof queryMap;
export type Method = keyof typeof queryMap.identifiers;

export const queryMap = {
  identifiers: {
    getList: () => {
      return {
        resource: resourceMap.identifiers,
        query: {}
      }
    },
    getOne: (did: string) => {
      return {
        resource: resourceMap.identifiers,
        query: {"where":[{"column":"did","value":[did]}]}
      }
    } 
  },
  credentials: {
    getList: () => {
      return {
        resource: resourceMap.credentials,
        query: {}
      }
    },
    getOne: (hash: string) => {
      return {
        resource: resourceMap.credentials,
        query: {"where":[{"column":"hash","value":[hash]}]}
      }
    } 
  },
  messages: {
    getList: () => {
      return {
        resource: resourceMap.messages,
        query: {}
      }
    },
    getOne: (id: string) => {
      return {
        resource: resourceMap.messages,
        query: {"where":[{"column":"id","value":[id]}]}
      }
    } 
  }
}  

export interface VerifiableCredential {
  hash?:                 string;
  verifiableCredential: VerifiableCredentialClass;
  id:                   string | undefined;
}

export interface VerifiableCredentialClass {
  credentialSubject: CredentialSubject;
  issuer:            Issuer;
  type:              string[];
  "@context":        string[];
  issuanceDate:      Date;
  proof:             Proof;
}

export interface CredentialSubject {
  emailAddress: string;
  id:           string;
}

export interface Issuer {
  id: string;
}

export interface Proof {
  type: string;
  jwt:  string;
}

export const responseMap = {
  identifiers: {
    getList: () => {
      return {}
    },
    getOne: (did: string) => {
      return {}
    } 
  },
  credentials: {
    getList: (credentials: Array<VerifiableCredential>): Array<any> => {
      const result = credentials.map((credential) => {
        const c: VerifiableCredential = {
          id: credential.hash,
          verifiableCredential: credential.verifiableCredential
        }
        return c;
      })
      return result;
    },
    getOne: (hash: string) => {
      return {}
    } 
  },
  messages: {
    getList: () => {
      return {}
    },
    getOne: (id: string) => {
      return {}
    } 
  }
}

export const resourceMap = {
  identifiers: 'dataStoreORMGetIdentifiers', 
  credentials: 'dataStoreORMGetVerifiableCredentials',
  messages: 'dataStoreORMGetMessages',
  credentialsCount: 'dataStoreORMGetVerifiableCredentialsCount',
  identifiersCount: 'dataStoreORMGetIdentifiersCount'
}


export const veramoResponse = (resource: Resource, method: Method) => {
  return queryMap[resource][method]
}

export const veramoQuery = (resource: Resource, method: Method) => {
  return queryMap[resource][method]
}