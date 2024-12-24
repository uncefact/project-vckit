"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[9556],{2056:(e,t,n)=>{n.d(t,{Ay:()=>r});var i=n(4848),o=n(8453);function s(e){const t={admonition:"admonition",p:"p",...(0,o.R)(),...e.components};return(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function r(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(s,{...e})}):s(e)}},1839:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var i=n(4848),o=n(8453),s=n(2056);const r={},a="Revocation list 2020",c={id:"vckit-plugins/revocation-list-2020",title:"Revocation list 2020",description:"The revocation list 2020 plugin is used to revoke and verify the verify credential based on the revocation list 2020 https://w3c-ccg.github.io/vc-status-rl-2020/",source:"@site/docs/vckit-plugins/revocation-list-2020.md",sourceDirName:"vckit-plugins",slug:"/vckit-plugins/revocation-list-2020",permalink:"/project-vckit/docs/next/vckit-plugins/revocation-list-2020",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/docs/vckit-plugins/revocation-list-2020.md",tags:[],version:"current",frontMatter:{},sidebar:"getStartedSideBar",previous:{title:"Renderer Plugin",permalink:"/project-vckit/docs/next/vckit-plugins/renderer"},next:{title:"How to create and manage plugins",permalink:"/project-vckit/docs/next/manage-plugins"}},l={},d=[{value:"Usage",id:"usage",level:2},{value:"Configuration",id:"configuration",level:3},{value:"Sample Operations",id:"sample-operations",level:2}];function u(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"revocation-list-2020",children:"Revocation list 2020"}),"\n",(0,i.jsx)(s.Ay,{}),"\n",(0,i.jsxs)(t.p,{children:["The revocation list 2020 plugin is used to revoke and verify the verify credential based on the revocation list 2020 ",(0,i.jsx)(t.a,{href:"https://w3c-ccg.github.io/vc-status-rl-2020/",children:"https://w3c-ccg.github.io/vc-status-rl-2020/"})]}),"\n",(0,i.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(t.h3,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsx)(t.p,{children:"To use the plugin you need to add the following configuration to the agent.yml"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"First, define the revocation list plugin:"}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"dbConnectionRevocationList:\n  $require: typeorm#DataSource\n  $args:\n    - type: sqlite\n      database:\n        $ref: /constants/databaseFile\n      synchronize: true\n      migrationsRun: true\n      migrations:\n        $require: '@vckit/revocationlist?t=object#migrations'\n      logging: false\n      entities:\n        $require: '@vckit/revocationlist?t=object#Entities'\n\nrevocationList:\n  $require: '@vckit/revocationlist#RevocationStatus2020'\n  $args:\n    - dbConnection:\n        $ref: /dbConnectionRevocationList\n      revocationListPath: http://localhost:3332\n      bitStringLength: 8\n"})}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Second, add the plugin and credential status plugin to the agent plugins list:"}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"agent:\n  $require: '@vckit/core#Agent'\n  $args:\n    - schemaValidation: false\n      plugins:\n        # Plugins\n        - $ref: /revocationList\n        - $require: '@veramo/credential-status#CredentialStatusPlugin'\n          $args:\n            - RevocationList2020Status:\n                $require: '@vckit/revocationlist?t=object#checkStatus'\n"})}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Then, set the revocation list middleware to inject the credential status to the credential when it is issued:"}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"- $require: '@vckit/revocationlist?t=function#revocationList2020'\n  $args:\n    - apiRoutes:\n        - /routeCreationVerifiableCredential\n      supportedProofFormats:\n        - jwt\n        - lds\n"})}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"After that, you need to expose the plugin functions:"}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"- revokeCredential\n- activateCredential\n- checkStatus\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Every time the credential is issued by API ",(0,i.jsx)(t.code,{children:"/routeCreationVerifiableCredential"}),", the middleware will inject the credential status to the credential."]}),"\n",(0,i.jsx)(t.h2,{id:"sample-operations",children:"Sample Operations"}),"\n",(0,i.jsx)(t.p,{children:"Please make sure you have the VCkit API server started on your local machine, and that you're running the Demo Explorer locally as well."}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/docs/category/demo-explorer",children:"Getting started with Demo Explorer"}),"."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"After that you can follow this intruction to try some sample operations like revoking/unrevoking VC with VCkit Revocation List 2020 plugin"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/docs/get-started/demo-explorer-get-started/basic-operations",children:"VCkit Revocation List 2020 sample operations"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>a});var i=n(6540);const o={},s=i.createContext(o);function r(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);