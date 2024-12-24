"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[5979],{6961:(e,t,n)=>{n.d(t,{Ay:()=>s});var r=n(4848),i=n(8453);function o(e){const t={admonition:"admonition",p:"p",...(0,i.R)(),...e.components};return(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsx)(t.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function s(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},186:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>l});var r=n(4848),i=n(8453),o=n(6961);const s={},a="Encrypted Storage",c={id:"vckit-plugins/encrypted-storage",title:"Encrypted Storage",description:"The encrypted storage plugin provides a secure storage for the agent. It is used to store the verifiable credentials that issued when call the routeCreationVerifiableCredential method.",source:"@site/versioned_docs/version-1.0.0/vckit-plugins/encrypted-storage.md",sourceDirName:"vckit-plugins",slug:"/vckit-plugins/encrypted-storage",permalink:"/project-vckit/docs/vckit-plugins/encrypted-storage",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/versioned_docs/version-1.0.0/vckit-plugins/encrypted-storage.md",tags:[],version:"1.0.0",frontMatter:{},sidebar:"getStartedSideBar",previous:{title:"Credential Router",permalink:"/project-vckit/docs/vckit-plugins/credential-router"},next:{title:"Renderer Plugin",permalink:"/project-vckit/docs/vckit-plugins/renderer"}},d={},l=[{value:"Usage",id:"usage",level:2},{value:"Configuration",id:"configuration",level:3},{value:"To use the encrypted storage plugin",id:"to-use-the-encrypted-storage-plugin",level:3}];function p(e){const t={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"encrypted-storage",children:"Encrypted Storage"}),"\n",(0,r.jsx)(o.Ay,{}),"\n",(0,r.jsxs)(t.p,{children:["The encrypted storage plugin provides a secure storage for the agent. It is used to store the verifiable credentials that issued when call the ",(0,r.jsx)(t.code,{children:"routeCreationVerifiableCredential"})," method."]}),"\n",(0,r.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(t.h3,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(t.p,{children:"To use the encrypted storage plugin, you need to add the following configuration to the agent.yml."}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["First, add the ",(0,r.jsx)(t.code,{children:"dbConnectionEncrypted"})," to define the database connection for the encrypted storage."]}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"dbConnectionEncrypted:\n  $require: typeorm#DataSource\n  $args:\n    - type: sqlite\n      database:\n        $ref: /constants/databaseFile\n      synchronize: false\n      migrationsRun: true\n      migrations:\n        $require: '@vckit/encrypted-storage?t=object#migrations'\n      logging: false\n      entities:\n        $require: '@vckit/encrypted-storage?t=object#Entities'\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Second, add the ",(0,r.jsx)(t.code,{children:"encryptedStorage"})," to define the encrypted storage plugin."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"# Encrypted Storage Plugin\nencryptedStorage:\n  $require: '@vckit/encrypted-storage#EncryptedStorage'\n  $args:\n    - dbConnection:\n        $ref: /dbConnectionEncrypted\n"})}),"\n",(0,r.jsx)(t.p,{children:"then require the encrypted storage plugin to the agent."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"# Agent\nagent:\n  $require: '@vckit/core#Agent'\n  $args:\n    - schemaValidation: false\n      plugins:\n        # Plugins\n        - $ref: /encryptedStorage\n"})}),"\n",(0,r.jsx)(t.p,{children:"Then, you need to expose the functions of the plugin."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"- encryptAndStoreData\n- fetchEncryptedData\n- fetchEncryptedDataByCredentialHash\n"})}),"\n",(0,r.jsxs)(t.p,{children:["After that, you need to configure the middleware to use the encrypted storage plugin to store the verifiable credentials when issue the verifiable credentials. You can configure the middleware in the ",(0,r.jsx)(t.code,{children:"apiRoutes"})," section of the agent.yml."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"# API base path\n- - /agent\n  - $require: '@vckit/remote-server?t=function#apiKeyAuth'\n    $args:\n      - apiKey: test123\n  # Configure the middleware before the AgentRouter function. The middleware only allow the apis in `apiRoutes` to use the encrypted storage plugin.\n  - $require: '@vckit/encrypted-storage?t=function#encryptedStoreMiddleware'\n    $args:\n      - apiRoutes:\n          - /routeCreationVerifiableCredential\n\n  - $require: '@vckit/remote-server?t=function#AgentRouter'\n    $args:\n      - exposedMethods:\n          $ref: /constants/methods\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Finally, you need to expose the endpoint that can be used to fetch the encrypted verifiable credential. You can configure the endpoint in the ",(0,r.jsx)(t.code,{children:"apiRoutes"})," section of the agent.yml."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"# Encrypted storage API\n- - /encrypted-storage\n  - $require: '@vckit/encrypted-storage?t=function#encryptedStoreRouter'\n"})}),"\n",(0,r.jsx)(t.h3,{id:"to-use-the-encrypted-storage-plugin",children:"To use the encrypted storage plugin"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:["To use the encrypted storage plugin, you need to call the ",(0,r.jsx)(t.code,{children:"routeCreationVerifiableCredential"})," method with the parameter ",(0,r.jsx)(t.code,{children:"save"})," to store the verifiable credential, then it will trigger the middleware to store the verifiable credential to the encrypted storage."]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:"After that, it will response the decrypted key, id of encrypted verifiable credential, and the verifiable credential."}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:["Use the decrypted key to decrypt the encrypted verifiable credential that fetched from the endpoint ",(0,r.jsx)(t.code,{children:"/encrypted-storage/encrypted-data/:id"}),"."]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var r=n(6540);const i={},o=r.createContext(i);function s(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);