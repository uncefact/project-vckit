"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[548],{2056:(e,n,t)=>{t.d(n,{Ay:()=>d});var i=t(4848),o=t(8453);function r(e){const n={admonition:"admonition",p:"p",...(0,o.R)(),...e.components};return(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsx)(n.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(r,{...e})}):r(e)}},345:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>d,metadata:()=>a,toc:()=>l});var i=t(4848),o=t(8453),r=t(2056);const d={sidebar_label:"Using Your Own Domain or Ngrok",sidebar_position:2},s="Create and Host a did Identifier",a={id:"get-started/did-web/how-to-create/hosting-did-web",title:"Create and Host a did:web Identifier",description:"Section 1: Domain Setup and Importance of HTTPS",source:"@site/docs/get-started/did-web/how-to-create/hosting-did-web.md",sourceDirName:"get-started/did-web/how-to-create",slug:"/get-started/did-web/how-to-create/hosting-did-web",permalink:"/project-vckit/docs/get-started/did-web/how-to-create/hosting-did-web",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/docs/get-started/did-web/how-to-create/hosting-did-web.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_label:"Using Your Own Domain or Ngrok",sidebar_position:2},sidebar:"getStartedSideBar",previous:{title:"Preconfigured Setup: Seed Identifier Script",permalink:"/project-vckit/docs/get-started/did-web/how-to-create/seed-identifier"},next:{title:"VCkit Library",permalink:"/project-vckit/docs/category/vckit-library"}},c={},l=[{value:"Section 1: Domain Setup and Importance of HTTPS",id:"section-1-domain-setup-and-importance-of-https",level:2},{value:"Why HTTPS is Essential",id:"why-https-is-essential",level:3},{value:"Preparing Your Domain",id:"preparing-your-domain",level:3},{value:"Alternative: Testing with Ngrok (Without a Domain)",id:"alternative-testing-with-ngrok-without-a-domain",level:4},{value:"Section 2: Creating a <code>did:web</code> and DID Document",id:"section-2-creating-a-didweb-and-did-document",level:2},{value:"Create a DID Identifier",id:"create-a-did-identifier",level:3},{value:"Request Body Example:",id:"request-body-example",level:4},{value:"Response Body Example:",id:"response-body-example",level:4},{value:"Generate the DID Document",id:"generate-the-did-document",level:3},{value:"Example CURL Request:",id:"example-curl-request",level:4},{value:"Example DID Document Response:",id:"example-did-document-response",level:4},{value:"Serving the DID Document with the Correct MIME Type",id:"serving-the-did-document-with-the-correct-mime-type",level:3},{value:"Correct MIME Type for DID Documents",id:"correct-mime-type-for-did-documents",level:4}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"create-and-host-a-did-identifier",children:["Create and Host a did",":web"," Identifier"]}),"\n",(0,i.jsx)(r.Ay,{}),"\n",(0,i.jsx)(n.h2,{id:"section-1-domain-setup-and-importance-of-https",children:"Section 1: Domain Setup and Importance of HTTPS"}),"\n",(0,i.jsx)(n.h3,{id:"why-https-is-essential",children:"Why HTTPS is Essential"}),"\n",(0,i.jsxs)(n.p,{children:["For ",(0,i.jsx)(n.code,{children:"did:web"})," identifiers, it's crucial that your domain is HTTPS-enabled. The DID method ",(0,i.jsx)(n.code,{children:"did:web"})," relies on web infrastructure to serve the DID Document from a domain. Without HTTPS, your DID Document won't be considered secure or verifiable by external services and clients."]}),"\n",(0,i.jsx)(n.p,{children:"Most browsers and services enforce HTTPS to ensure that data exchanged between servers and users remains encrypted and protected from interception."}),"\n",(0,i.jsx)(n.h3,{id:"preparing-your-domain",children:"Preparing Your Domain"}),"\n",(0,i.jsxs)(n.p,{children:["To create a ",(0,i.jsx)(n.code,{children:"did:web"}),", you'll need:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["A registered domain (e.g., ",(0,i.jsx)(n.code,{children:"example.com"}),")."]}),"\n",(0,i.jsx)(n.li,{children:"The ability to host files on that domain."}),"\n",(0,i.jsx)(n.li,{children:"HTTPS enabled on your domain, typically via SSL certificates (e.g., via Let's Encrypt or other providers)."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Once your domain is set up with HTTPS, you can proceed to create and host your ",(0,i.jsx)(n.code,{children:"did:web"})," identifier."]}),"\n",(0,i.jsx)(n.h4,{id:"alternative-testing-with-ngrok-without-a-domain",children:"Alternative: Testing with Ngrok (Without a Domain)"}),"\n",(0,i.jsxs)(n.p,{children:["If you don't have a domain but want to test the process locally, you can use ",(0,i.jsx)(n.a,{href:"https://ngrok.com/download",children:(0,i.jsx)(n.strong,{children:"ngrok"})})," to create a secure HTTPS tunnel to your localhost. Ngrok temporarily exposes your local server to the internet, giving you a unique URL for testing."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Steps to Use Ngrok:"})}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Install and register ",(0,i.jsx)(n.a,{href:"https://ngrok.com/download",children:(0,i.jsx)(n.strong,{children:"ngrok"})}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Run the following command to create a secure tunnel to your ",(0,i.jsx)(n.code,{children:"localhost:3332"})," (VCkit API server):"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"ngrok http 3332\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"section-2-creating-a-didweb-and-did-document",children:["Section 2: Creating a ",(0,i.jsx)(n.code,{children:"did:web"})," and DID Document"]}),"\n",(0,i.jsxs)(n.p,{children:["In this guide, we'll use the VCkit API server to create a ",(0,i.jsx)(n.code,{children:"did:web"})," identifier. Before proceeding, ensure that you have the API server set up and running. ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.a,{href:"/docs/get-started/api-server-get-started/installation",children:"Go here to set up the API server"})})]}),"\n",(0,i.jsxs)(n.p,{children:["Additionally, you will need to authenticate with the API server to make the necessary requests. ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.a,{href:"/docs/get-started/api-server-get-started/basic-operations#authentication",children:"Go here for how to authenticate"})})]}),"\n",(0,i.jsxs)(n.p,{children:["Once your API server is running, you can follow the steps below to create and host your ",(0,i.jsx)(n.code,{children:"did:web"})," identifier."]}),"\n",(0,i.jsxs)(n.p,{children:["To create a ",(0,i.jsx)(n.code,{children:"did:web"})," identifier, you\u2019ll use the VCkit API to generate a DID and the corresponding DID Document. This can later be hosted on your own domain or tested using a tunneling service like ",(0,i.jsx)(n.strong,{children:"ngrok"}),"."]}),"\n",(0,i.jsxs)(n.h3,{id:"create-a-did-identifier",children:["Create a DID",":web"," Identifier"]}),"\n",(0,i.jsxs)(n.p,{children:["Use the ",(0,i.jsx)(n.a,{href:"http://localhost:3332/api-docs#post-/didManagerCreate",children:(0,i.jsx)(n.code,{children:"/didManagerCreate"})})," endpoint to create a ",(0,i.jsx)(n.code,{children:"did:web"})," identifier."]}),"\n",(0,i.jsx)(n.h4,{id:"request-body-example",children:"Request Body Example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "alias": "example.com", //replace with your domain\n  "provider": "did:web",\n  "kms": "local",\n  "options": {\n    "keyType": "Ed25519"\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"alias"}),": Your domain name, or use the Ngrok URL (e.g., e3a8-42-117-186-253.ngrok-free.app) for local testing."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"provider"}),": Set to did",":web"," for this example."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"kms"}),': Key management system, set to "local".']}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"keyType"}),": Use the Ed25519 key type."]}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"response-body-example",children:"Response Body Example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'{\n  "did": "did:web:example.com",\n  "controllerKeyId": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",\n  "keys": [\n    {\n      "type": "Ed25519",\n      "kid": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",\n      "publicKeyHex": "b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e",\n      "meta": {\n        "algorithms": ["EdDSA", "Ed25519"]\n      },\n      "kms": "local"\n    }\n  ],\n  "provider": "did:web",\n  "alias": "example.com"\n}\n'})}),"\n",(0,i.jsx)(n.h3,{id:"generate-the-did-document",children:"Generate the DID Document"}),"\n",(0,i.jsx)(n.p,{children:"After creating your DID\n, you need to generate the corresponding DID document, which must be hosted on your HTTPS-enabled domain or served via your Ngrok URL."}),"\n",(0,i.jsx)(n.h4,{id:"example-curl-request",children:"Example CURL Request:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"curl --location 'localhost:3332/.well-known/did.json' \\\n--header 'Host: example.com' # or ngrok URL if testing locally\n"})}),"\n",(0,i.jsx)(n.h4,{id:"example-did-document-response",children:"Example DID Document Response:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'{\n  "@context": [\n    "https://www.w3.org/ns/did/v1",\n    "https://w3id.org/security/suites/jws-2020/v1"\n  ],\n  "id": "did:web:example.com", // or ngrok URL if testing locally\n  "verificationMethod": [\n    {\n      "id": "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0",\n      "type": "JsonWebKey2020",\n      "controller": "did:web:example.com",\n      "publicKeyJwk": {\n        "kty": "OKP",\n        "crv": "Ed25519",\n        "x": "sRFBatRait94T8quf3rJOdigzwB-rpnt76Mzk7GLHR4"\n      }\n    }\n  ],\n  "authentication": [\n    "did:web:example.com#b111416ad45a8adf784fcaae7f7ac939d8a0cf007eae99edefa33393b18b1d1e-key-0"\n  ]\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"Once generated, the DID document needs to be placed at the following path:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"For domain"}),": ",(0,i.jsx)(n.code,{children:"https://example.com/.well-known/did.json"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"For Ngrok:"})," VCKit automatically serves the DID document at ",(0,i.jsx)(n.code,{children:"http://localhost:3332/.well-known/did.json"}),". Since Ngrok points to your local server, you can access the DID document at ",(0,i.jsx)(n.code,{children:"https://e3a8-42-117-186-253.ngrok-free.app/.well-known/did.json"})," for external testing. VCKit retrieves the domain from the Host header to determine which did",":web"," to resolve, ensuring the correct DID document is served for your domain or Ngrok URL."]}),"\n"]}),"\n",(0,i.jsx)(n.admonition,{type:"important",children:(0,i.jsxs)(n.p,{children:["If you are using an additional path in your DID (e.g., did:web",":example",".com",":subpath","), you must not use /.well-known. Instead, host the DID document directly at the additional path, like so: ",(0,i.jsx)(n.code,{children:"https://example.com/subpath/did.json"})]})}),"\n",(0,i.jsx)(n.h3,{id:"serving-the-did-document-with-the-correct-mime-type",children:"Serving the DID Document with the Correct MIME Type"}),"\n",(0,i.jsxs)(n.p,{children:["When hosting your DID document (e.g., at ",(0,i.jsx)(n.code,{children:"/.well-known/did.json"}),"), it's essential to ensure the document is served with the correct MIME type. The appropriate MIME type ensures that clients and verifiers can correctly process your DID document."]}),"\n",(0,i.jsx)(n.h4,{id:"correct-mime-type-for-did-documents",children:"Correct MIME Type for DID Documents"}),"\n",(0,i.jsx)(n.p,{children:"The recommended MIME type depends on the format of your DID document:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"For JSON DID Documents"}),": Use ",(0,i.jsx)(n.code,{children:"application/did+json"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"For JSON-LD DID Documents"}),": Use ",(0,i.jsx)(n.code,{children:"application/did+ld+json"}),"."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>d,x:()=>s});var i=t(6540);const o={},r=i.createContext(o);function d(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:d(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);