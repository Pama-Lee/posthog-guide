"use strict";(self.webpackChunkposthog_guide=self.webpackChunkposthog_guide||[]).push([[6903],{68189:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>i,default:()=>g,frontMatter:()=>l,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"intro","title":"PostHog \u6307\u5357","description":"\u6b22\u8fce\u6765\u5230 PostHog Guide \u4e2d\u6587\u793e\u533a\uff01","source":"@site/docs/intro.mdx","sourceDirName":".","slug":"/intro","permalink":"/posthog-guide/docs/intro","draft":false,"unlisted":false,"editUrl":"https://github.com/pama-lee/posthog-guide/tree/main/docs/intro.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","next":{"title":"\ud83c\udfed \u57fa\u672c\u67b6\u6784","permalink":"/posthog-guide/docs/category/-\u57fa\u672c\u67b6\u6784"}}');var o=n(74848),r=n(28453),a=n(83355);const l={sidebar_position:1},i="PostHog \u6307\u5357",c={},d=[{value:"PostHog \u662f\u4ec0\u4e48\uff1f",id:"posthog-\u662f\u4ec0\u4e48",level:2},{value:"\u4e3b\u8981\u529f\u80fd",id:"\u4e3b\u8981\u529f\u80fd",level:2},{value:"\u5f00\u59cb\u4f7f\u7528",id:"\u5f00\u59cb\u4f7f\u7528",level:2}];function h(e){const s={h1:"h1",h2:"h2",header:"header",li:"li",mermaid:"mermaid",ol:"ol",p:"p",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s.header,{children:(0,o.jsx)(s.h1,{id:"posthog-\u6307\u5357",children:"PostHog \u6307\u5357"})}),"\n",(0,o.jsx)(a.A,{repo:"PostHog/posthog"}),"\n",(0,o.jsx)(s.p,{children:"\u6b22\u8fce\u6765\u5230 PostHog Guide \u4e2d\u6587\u793e\u533a\uff01"}),"\n",(0,o.jsx)(s.h2,{id:"posthog-\u662f\u4ec0\u4e48",children:"PostHog \u662f\u4ec0\u4e48\uff1f"}),"\n",(0,o.jsx)(s.p,{children:"PostHog \u662f\u4e00\u4e2a\u5f00\u6e90\u7684\u4ea7\u54c1\u5206\u6790\u5e73\u53f0\uff0c\u5b83\u53ef\u4ee5\u5e2e\u52a9\u60a8\uff1a"}),"\n",(0,o.jsx)(s.mermaid,{value:"flowchart LR\n    A[\ud83e\udd94 \u6570\u636e\u6536\u96c6] --\x3e B{\ud83d\udcca \u6570\u636e\u5206\u6790}\n    B --\x3e|\u7528\u6237\u884c\u4e3a| C[\ud83d\udc65 \u7528\u6237\u6d1e\u5bdf]\n    B --\x3e|\u7279\u5f81\u5206\u6790| D[\ud83c\udfaf \u4ea7\u54c1\u51b3\u7b56]\n    C --\x3e|\u6539\u8fdb\u5efa\u8bae| E[\u26a1\ufe0f \u4ea7\u54c1\u4f18\u5316]\n    D --\x3e|\u5b9e\u65bd\u65b9\u6848| E\n    style A fill:#efebe9,stroke:#5d4037,color:#3e2723\n    style B fill:#8d6e63,stroke:#5d4037,color:#efebe9\n    style C fill:#d7ccc8,stroke:#5d4037,color:#3e2723\n    style D fill:#d7ccc8,stroke:#5d4037,color:#3e2723\n    style E fill:#8d6e63,stroke:#5d4037,color:#efebe9"}),"\n",(0,o.jsx)(s.h2,{id:"\u4e3b\u8981\u529f\u80fd",children:"\u4e3b\u8981\u529f\u80fd"}),"\n",(0,o.jsx)(s.p,{children:"PostHog \u63d0\u4f9b\u4e86\u4e00\u5957\u5b8c\u6574\u7684\u4ea7\u54c1\u5206\u6790\u5de5\u5177\uff1a"}),"\n",(0,o.jsx)(s.mermaid,{value:"mindmap\n  root((\ud83e\udd94))\n    (\u6570\u636e\u5206\u6790)\n      [\u4e8b\u4ef6\u8ffd\u8e2a]\n      [\u6f0f\u6597\u5206\u6790]\n      [\u7559\u5b58\u5206\u6790]\n    (\u4ea7\u54c1\u4f18\u5316)\n      [A/B \u6d4b\u8bd5]\n      [\u529f\u80fd\u6807\u5fd7]\n    (\u7528\u6237\u4f53\u9a8c)\n      [\u4f1a\u8bdd\u56de\u653e]\n      [\u70ed\u529b\u56fe]\n    (\u6570\u636e\u7ba1\u7406)\n      [\u6570\u636e\u4ed3\u5e93]\n      [API \u96c6\u6210]"}),"\n",(0,o.jsx)(s.h2,{id:"\u5f00\u59cb\u4f7f\u7528",children:"\u5f00\u59cb\u4f7f\u7528"}),"\n",(0,o.jsxs)(s.ol,{children:["\n",(0,o.jsx)(s.li,{children:"\u4e8b\u4ef6\u8ffd\u8e2a"}),"\n",(0,o.jsx)(s.li,{children:"\u6f0f\u6597\u5206\u6790"}),"\n",(0,o.jsx)(s.li,{children:"\u7528\u6237\u8def\u5f84\u5206\u6790"}),"\n",(0,o.jsx)(s.li,{children:"\u529f\u80fd\u6807\u5fd7"}),"\n",(0,o.jsx)(s.li,{children:"\u4f1a\u8bdd\u56de\u653e"}),"\n",(0,o.jsx)(s.li,{children:"A/B \u6d4b\u8bd5"}),"\n"]})]})}function g(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,o.jsx)(s,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},83355:(e,s,n)=>{n.d(s,{A:()=>c});var t=n(96540);const o={card:"card_HyKA",small:"small_JEwn",avatar:"avatar_nIyB",title:"title_tOcj",repoIcon:"repoIcon_EPg5",icon:"icon_qpX9",description:"description_DwOY",footer:"footer_fimL",medium:"medium_nOD6",large:"large_fUjZ",header:"header_wAGD",repoTitle:"repoTitle_cPd1",owner:"owner_st1c",stats:"stats_Guut",stat:"stat_c0js",language:"language_JFOt",loading:"loading_Exjh",error:"error_fD9s"};var r=n(98027),a=n(16250),l=n(34164),i=n(74848);function c(e){let{repo:s,size:n="medium",showOwner:c=!0,showLanguage:d=!0,showStats:h=!0,className:g,style:m}=e;const[p,u]=(0,t.useState)(null),[x,j]=(0,t.useState)(!0),[f,_]=(0,t.useState)(null);return(0,t.useEffect)((()=>{(async()=>{try{const e=await fetch(`https://api.github.com/repos/${s}`);if(!e.ok)throw new Error("\u4ed3\u5e93\u83b7\u53d6\u5931\u8d25");const n=await e.json();u(n)}catch(e){_(e instanceof Error?e.message:"\u672a\u77e5\u9519\u8bef")}finally{j(!1)}})()}),[s]),x?(0,i.jsx)("div",{className:(0,l.A)(o.loading,o[n]),children:"\u52a0\u8f7d\u4e2d..."}):f||!p?(0,i.jsxs)("div",{className:(0,l.A)(o.error,o[n]),children:["\u52a0\u8f7d\u5931\u8d25: ",f]}):(0,i.jsxs)("a",{href:p.html_url,target:"_blank",rel:"noopener noreferrer",className:(0,l.A)(o.card,o[n],g),style:m,children:[(0,i.jsxs)("div",{className:o.header,children:[(0,i.jsx)("img",{src:p.owner.avatar_url,alt:p.owner.login,className:o.avatar}),(0,i.jsxs)("div",{className:o.title,children:[(0,i.jsxs)("div",{className:o.repoTitle,children:[(0,i.jsx)(a.RDs,{className:o.repoIcon}),(0,i.jsx)("h3",{children:p.name})]}),c&&(0,i.jsxs)("span",{className:o.owner,children:["by ",p.owner.login]})]})]}),(0,i.jsx)("p",{className:o.description,children:p.description}),h&&(0,i.jsx)("div",{className:o.footer,children:(0,i.jsxs)("div",{className:o.stats,children:[(0,i.jsxs)("span",{className:o.stat,children:[(0,i.jsx)(r.gt3,{className:o.icon}),p.stargazers_count.toLocaleString()]}),(0,i.jsxs)("span",{className:o.stat,children:[(0,i.jsx)(r.dMP,{className:o.icon}),p.forks_count.toLocaleString()]}),d&&p.language&&(0,i.jsxs)("span",{className:o.language,children:[(0,i.jsx)(r.FSj,{className:o.icon}),p.language]})]})})]})}}}]);