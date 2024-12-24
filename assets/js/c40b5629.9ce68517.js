"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[9398],{2056:(e,n,t)=>{t.d(n,{Ay:()=>a});var r=t(4848),i=t(8453);function o(e){const n={admonition:"admonition",p:"p",...(0,i.R)(),...e.components};return(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function a(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},7901:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>a,metadata:()=>d,toc:()=>c});var r=t(4848),i=t(8453),o=t(2056);const a={sidebar_label:"Set Up",sidebar_position:2},s="Set up Agent",d={id:"get-started/library-get-started/setup",title:"Set up Agent",description:"To start using VCkit, we need to initialize an agent.",source:"@site/docs/get-started/library-get-started/setup.md",sourceDirName:"get-started/library-get-started",slug:"/get-started/library-get-started/setup",permalink:"/project-vckit/docs/next/get-started/library-get-started/setup",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/docs/get-started/library-get-started/setup.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_label:"Set Up",sidebar_position:2},sidebar:"getStartedSideBar",previous:{title:"Installation",permalink:"/project-vckit/docs/next/get-started/library-get-started/installation"},next:{title:"Basic Operations",permalink:"/project-vckit/docs/next/get-started/library-get-started/basic-operations"}},l={},c=[{value:"Copy database file",id:"copy-database-file",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Variables",id:"variables",level:2},{value:"Initialize the agent",id:"initialize-the-agent",level:2}];function p(e){const n={admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"set-up-agent",children:"Set up Agent"}),"\n",(0,r.jsx)(o.Ay,{}),"\n",(0,r.jsx)(n.p,{children:"To start using VCkit, we need to initialize an agent."}),"\n",(0,r.jsx)(n.h2,{id:"copy-database-file",children:"Copy database file"}),"\n",(0,r.jsxs)(n.p,{children:["This tutorial will use the ",(0,r.jsxs)(n.strong,{children:["did",":web"]})," method and we will need an available did",":web"," identifier. To do that, we need to use the same database as the ",(0,r.jsx)(n.strong,{children:"VCkit API server"})," responsible for hosting the ",(0,r.jsxs)(n.strong,{children:["did",":web"]}),"."]}),"\n",(0,r.jsx)(n.p,{children:"Please follow these steps below:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Copy the ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"database.sqlite"})})," from ",(0,r.jsx)(n.strong,{children:"PROJECT_VCKIT"})," folder at ",(0,r.jsx)(n.code,{children:"/project_vckit/project-vckit/database.sqlite"})," to your root folder of this tutorial, in this case it's ",(0,r.jsx)(n.code,{children:"/vckit/database.sqlite"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Copy the value of ",(0,r.jsx)(n.code,{children:"dbEncryptionKey"})," in ",(0,r.jsx)(n.code,{children:"/project_vckit/project-vckit/agent.yml"})," file and paste it as the value of ",(0,r.jsx)(n.strong,{children:"DB_SECRET_KEY"})," variable will be mentioned in the next step."]}),"\n"]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["Create a set up file in ",(0,r.jsx)(n.strong,{children:(0,r.jsx)(n.code,{children:"src/vckit/setup.ts"})}),", and add the following code."]})}),"\n",(0,r.jsx)(n.h2,{id:"dependencies",children:"Dependencies"}),"\n",(0,r.jsx)(n.p,{children:"Copy and paste this into your set up file."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"//VCkit interfaces and plugins\nimport {\n    ICredentialPlugin,\n    IDataStore,\n    IDataStoreORM,\n    IDIDManager,\n    IKeyManager,\n    IMessageHandler,\n    IResolver,\n    TAgent,\n    IRenderer\n} from '@vckit/core-types';\n\nimport { Renderer, WebRenderingTemplate2022 } from '@vckit/renderer';\n\n//Veramo core and plugins\nimport { createAgent } from '@veramo/core';\nimport { CredentialPlugin } from '@veramo/credential-w3c';\nimport {\n   CredentialIssuerLD,\n    LdDefaultContexts,\n    VeramoEcdsaSecp256k1RecoverySignature2020,\n    VeramoEd25519Signature2018,\n    VeramoJsonWebSignature2020,\n} from '@veramo/credential-ld';\n\nimport { DIDResolverPlugin } from '@veramo/did-resolver';\nimport { KeyManager } from '@veramo/key-manager';\nimport { DIDManager } from '@veramo/did-manager';\nimport { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key';\nimport { getDidPkhResolver, PkhDIDProvider } from '@veramo/did-provider-pkh';\nimport { getDidJwkResolver, JwkDIDProvider } from '@veramo/did-provider-jwk';\nimport { EthrDIDProvider } from '@veramo/did-provider-ethr';\nimport { WebDIDProvider } from '@veramo/did-provider-web';\nimport { KeyManagementSystem, SecretBox } from '@veramo/kms-local';\nimport { Web3KeyManagementSystem } from '@veramo/kms-web3';\n\n//custom resolvers\nimport { Resolver } from 'did-resolver';\nimport { getResolver as ethrDidResolver } from 'ethr-did-resolver';\nimport { getResolver as webDidResolver } from 'web-did-resolver';\n\n//veramo data store\nimport { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'\n\n//typeorm\nimport { DataSource } from 'typeorm'\n"})}),"\n",(0,r.jsx)(n.h2,{id:"variables",children:"Variables"}),"\n",(0,r.jsx)(n.p,{children:"Create some variables in your set up file, remember to replace their value by yours."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"const DB_SECRET_KEY ='<The key you copied previously>';\n\nconst DATABASE_FILE = 'database.sqlite'\n"})}),"\n",(0,r.jsx)(n.h2,{id:"initialize-the-agent",children:"Initialize the agent"}),"\n",(0,r.jsx)(n.p,{children:"This is how an agent is initialized in your set up file, copy and paste into your file."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"type InstalledPlugins = IResolver &\n    IKeyManager &\n    IDIDManager &\n    ICredentialPlugin &\n    IDataStoreORM &\n    IDataStore &\n    IMessageHandler&\n    IRenderer;\n\nconst dbConnection = new DataSource({\n    type: 'sqlite',\n    database: DATABASE_FILE,\n    synchronize: false,\n    migrations,\n    migrationsRun: true,\n    logging: ['error', 'info', 'warn'],\n    entities: Entities,\n}).initialize()\n\nexport const agent: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({\n    plugins: [\n        new DIDResolverPlugin({\n            resolver: new Resolver({\n                ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),\n                ...webDidResolver(),\n                ...getDidKeyResolver(),\n                ...getDidPkhResolver(),\n                ...getDidJwkResolver(),\n            }),\n        }),\n        new KeyManager({\n            store: new KeyStore(dbConnection),\n            kms: {\n                local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_SECRET_KEY))),\n                web3: new Web3KeyManagementSystem({}),\n            },\n        }),\n        new DIDManager({\n            store: new DIDStore(dbConnection),\n            defaultProvider: 'did:web',\n            providers: {\n                'did:web': new WebDIDProvider({\n                    defaultKms: 'local',\n                }),\n                'did:key': new KeyDIDProvider({\n                    defaultKms: 'local',\n                }),\n                'did:pkh': new PkhDIDProvider({\n                    defaultKms: 'local',\n                }),\n                'did:jwk': new JwkDIDProvider({\n                    defaultKms: 'local',\n                }),\n            },\n        }),\n        new CredentialPlugin(),\n        new CredentialIssuerLD({\n            contextMaps: [LdDefaultContexts],\n            suites: [\n                new VeramoEcdsaSecp256k1RecoverySignature2020(),\n                new VeramoJsonWebSignature2020(),\n                new VeramoEd25519Signature2018(),\n            ],\n        }),\n        new Renderer({\n            providers: {\n                WebRenderingTemplate2022: new WebRenderingTemplate2022(),\n                SvgRenderingHint2022: new WebRenderingTemplate2022(),\n            },\n            defaultProvider: 'WebRenderingTemplate2022',\n        })\n    ],\n});\n"})})]})}function m(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>s});var r=t(6540);const i={},o=r.createContext(i);function a(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);