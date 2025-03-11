"use strict";(self.webpackChunkvckit_documentation=self.webpackChunkvckit_documentation||[]).push([[7327],{1404:(e,t,n)=>{n.d(t,{Ay:()=>r});var i=n(4848),s=n(8453);function a(e){const t={admonition:"admonition",p:"p",...(0,s.R)(),...e.components};return(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Please note that this content is under development and is not ready for implementation. This status message will be updated as content development progresses."})})}function r(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},8377:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var i=n(4848),s=n(8453),a=n(1404);const r={sidebar_label:"Installation",sidebar_position:1},o="Installation",l={id:"get-started/cli-get-started/installation",title:"Installation",description:"Prerequisites",source:"@site/versioned_docs/version-1.0.1/get-started/cli-get-started/installation.md",sourceDirName:"get-started/cli-get-started",slug:"/get-started/cli-get-started/installation",permalink:"/project-vckit/docs/get-started/cli-get-started/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/uncefact/project-vckit/tree/main/versioned_docs/version-1.0.1/get-started/cli-get-started/installation.md",tags:[],version:"1.0.1",sidebarPosition:1,frontMatter:{sidebar_label:"Installation",sidebar_position:1},sidebar:"getStartedSideBar",previous:{title:"CLI",permalink:"/project-vckit/docs/category/cli"},next:{title:"Basic Operations",permalink:"/project-vckit/docs/get-started/cli-get-started/basic-operations"}},c={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Instal VCkit CLI",id:"instal-vckit-cli",level:2},{value:"Start using the CLI",id:"start-using-the-cli",level:2}];function p(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"installation",children:"Installation"}),"\n",(0,i.jsx)(a.Ay,{}),"\n",(0,i.jsx)(t.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://nodejs.org/en/",children:"Node.js"})," version 20.12.2"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://pnpm.io/",children:"pnpm"})," version 8.14.1"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://yarnpkg.com/",children:"yarn"})," version 1.22.22"]}),"\n"]}),"\n",(0,i.jsx)(t.admonition,{type:"warning",children:(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Notice"}),": You should install the pnpm package manager globally on your machine by using the npm package manager. You can install pnpm by running the following command: ",(0,i.jsx)(t.code,{children:"npm install -g pnpm@8.14.1"}),". Using ",(0,i.jsx)(t.a,{href:"https://nodejs.org/api/corepack.html",children:"Corepack"})," to install pnpm that will have some conflicts with the project dependencies that are using yarn package manager to install and build."]})}),"\n",(0,i.jsx)(t.p,{children:"This project has been tested and optimized for Node.js version v20.12.2 and pnpm version 8.14.1. Please note that using a Node.js version later than v20.12.2 may result incorrect functionality and potential bugs. It is strongly recommended to use these specific versions for running and testing the project. Deviating from these versions may result in unforeseen compatibility issues or unexpected behavior."}),"\n",(0,i.jsx)(t.h2,{id:"instal-vckit-cli",children:"Instal VCkit CLI"}),"\n",(0,i.jsxs)(t.p,{children:["After cloned VCkit repository, go to ",(0,i.jsx)(t.code,{children:"project-vckit/packages/cli"})," and run this command."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"npm install -g .\n"})}),"\n",(0,i.jsx)(t.p,{children:"This command will install VCkit CLI globally."}),"\n",(0,i.jsx)(t.h2,{id:"start-using-the-cli",children:"Start using the CLI"}),"\n",(0,i.jsx)(t.p,{children:"Create a new folder, open a terminal, and run this command to check if the VCkit CLI has been installed successfully."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"vckit -v\n"})}),"\n",(0,i.jsx)(t.p,{children:"It's expected to show the version of VCkit CLI."}),"\n",(0,i.jsxs)(t.p,{children:["Next, run this command to create an ",(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.code,{children:"agent.yml"})})," file."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"vckit config create\n"})})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var i=n(6540);const s={},a=i.createContext(s);function r(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);