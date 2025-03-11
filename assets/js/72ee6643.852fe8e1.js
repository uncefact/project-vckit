"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[8925],{6961:(e,t,i)=>{i.d(t,{Ay:()=>o});var n=i(4848),r=i(8453);function d(e){const t={admonition:"admonition",p:"p",...(0,r.R)(),...e.components};return(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function o(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},1172:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>a,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var n=i(4848),r=i(8453),d=i(6961);const o={sidebar_label:"Preconfigured Setup: Seed Identifier Script",sidebar_position:1},s="Preconfigured Setup: Seed Identifier Script",c={id:"get-started/did-web/how-to-create/seed-identifier",title:"Preconfigured Setup: Seed Identifier Script",description:"Overview",source:"@site/versioned_docs/version-1.0.0/get-started/did-web/how-to-create/seed-identifier.md",sourceDirName:"get-started/did-web/how-to-create",slug:"/get-started/did-web/how-to-create/seed-identifier",permalink:"/project-vckit/docs/1.0.0/get-started/did-web/how-to-create/seed-identifier",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/versioned_docs/version-1.0.0/get-started/did-web/how-to-create/seed-identifier.md",tags:[],version:"1.0.0",sidebarPosition:1,frontMatter:{sidebar_label:"Preconfigured Setup: Seed Identifier Script",sidebar_position:1},sidebar:"getStartedSideBar",previous:{title:"Creating and Hosting a did:web Identifier",permalink:"/project-vckit/docs/1.0.0/category/creating-and-hosting-a-didweb-identifier"},next:{title:"Using Your Own Domain or Ngrok",permalink:"/project-vckit/docs/1.0.0/get-started/did-web/how-to-create/hosting-did-web"}},a={},l=[{value:"Overview",id:"overview",level:2},{value:"How to Use",id:"how-to-use",level:2},{value:"When to Use This Method",id:"when-to-use-this-method",level:2},{value:"For Development and Testing",id:"for-development-and-testing",level:3},{value:"Quick Start for New Users",id:"quick-start-for-new-users",level:3}];function h(e){const t={a:"a",admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"preconfigured-setup-seed-identifier-script",children:"Preconfigured Setup: Seed Identifier Script"}),"\n",(0,n.jsx)(d.Ay,{}),"\n",(0,n.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,n.jsxs)(t.p,{children:["The easiest way to create a ",(0,n.jsx)(t.code,{children:"did:web"})," in Project VCkit is by using the ",(0,n.jsx)(t.strong,{children:"Seed Identifier Script"}),". This method automatically sets up a ",(0,n.jsx)(t.code,{children:"did:web"})," pointing to the preconfigured GitHub Pages URL for Project VCkit."]}),"\n",(0,n.jsxs)(t.p,{children:["This setup is ideal for developers who need a quick and reliable ",(0,n.jsx)(t.code,{children:"did:web"})," for testing or development without configuring custom hosting."]}),"\n",(0,n.jsx)(t.h2,{id:"how-to-use",children:"How to Use"}),"\n",(0,n.jsxs)(t.p,{children:["In this guide, we'll use CLI to seed the preconfigured identifier. Before proceeding, ensure that you have the CLI set up. ",(0,n.jsx)(t.strong,{children:(0,n.jsx)(t.a,{href:"/docs/get-started/cli-get-started/installation",children:"Go here to set up the CLI"})})]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Run the Seed Identifier Script"}),":",(0,n.jsx)(t.br,{}),"\n","Navigate to your project directory and run the following command:"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"pnpm seed-identifier\n"})}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsx)(t.p,{children:"The Docker Compose entrypoint includes a shell command to run the seed-identifier script automatically."})}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.strong,{children:"Resulting DID"})}),"\n",(0,n.jsxs)(t.p,{children:["The script will generate a did",":web"," that points to the following GitHub Pages URL:"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.code,{children:"did:web:uncefact.github.io:project-vckit:test-and-development"})}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.strong,{children:"What Happens"})}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["The script imports the predefined identifier located in the repo at ",(0,n.jsx)(t.code,{children:"/development/did-web-identifier"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"This identifier contains the public and private key pair, which is then imported into the local key management system (KMS)."}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["The did",":web"," document itself has already been generated and hosted at ",(0,n.jsx)(t.code,{children:"https://uncefact.github.io/project-vckit/test-and-development/did.json"}),"."]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"when-to-use-this-method",children:"When to Use This Method"}),"\n",(0,n.jsx)(t.h3,{id:"for-development-and-testing",children:"For Development and Testing"}),"\n",(0,n.jsxs)(t.p,{children:["If you're in the development phase and don't want the hassle of setting up your own domain or local server, this method gives you a preconfigured did",":web"," that\u2019s easy to use."]}),"\n",(0,n.jsx)(t.h3,{id:"quick-start-for-new-users",children:"Quick Start for New Users"}),"\n",(0,n.jsx)(t.p,{children:"New users can immediately start working with decentralised identity without any additional configuration."})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,t,i)=>{i.d(t,{R:()=>o,x:()=>s});var n=i(6540);const r={},d=n.createContext(r);function o(e){const t=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(d.Provider,{value:t},e.children)}}}]);