import{d as i,O as u,u as c,_ as g,o as t,c as o,a,F as _,s as l,t as d}from"./app-f6b039fa.js";const v="/2023/assets/1-all-df024d49.svg",b=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"})),f="/2023/assets/10-6F-edcd4439.svg",p=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"})),m="/2023/assets/11-6F-booth-779dff37.svg",F=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"})),O="/2023/assets/2-index-2fdd020e.svg",h=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"})),j="/2023/assets/3-2F-59ee0648.svg",S=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"})),y="/2023/assets/4-2F-outside-47984f17.svg",M=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"})),T="/2023/assets/5-3F-13ae636d.svg",P=Object.freeze(Object.defineProperty({__proto__:null,default:T},Symbol.toStringTag,{value:"Module"})),z="/2023/assets/6-4F-d58fd3a8.svg",w=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"})),$="/2023/assets/7-3F-4F-booth-128d9c2a.svg",B=Object.freeze(Object.defineProperty({__proto__:null,default:$},Symbol.toStringTag,{value:"Module"})),V="/2023/assets/8-5F-e4c9fe6e.svg",C=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"})),K="/2023/assets/9-5F-booth-3ea5aacc.svg",N=Object.freeze(Object.defineProperty({__proto__:null,default:K},Symbol.toStringTag,{value:"Module"}));const U="/2023/assets/map-8260fb9b.pdf",r=u(Object.assign({"../assets/images/venues/1-all.svg":b,"../assets/images/venues/10-6F.svg":p,"../assets/images/venues/11-6F-booth.svg":F,"../assets/images/venues/2-index.svg":h,"../assets/images/venues/3-2F.svg":S,"../assets/images/venues/4-2F-outside.svg":M,"../assets/images/venues/5-3F.svg":P,"../assets/images/venues/6-4F.svg":w,"../assets/images/venues/7-3F-4F-booth.svg":B,"../assets/images/venues/8-5F.svg":C,"../assets/images/venues/9-5F-booth.svg":N}),"../assets/images/venues/*.svg"),x=Object.keys(r).sort((e,n)=>Number(e.split("-")[0])-Number(n.split("-")[0])),A=i({name:"Venue",components:{},setup(){const e="COSCUP 2023 Map",{t:n}=c();return{t:n,imageKeys:x,imagesMap:r,mapFileUrl:U,downloadText:e}}}),D={id:"venue",class:"page-container"},I={class:"authors"},E=["href"],L=["name"],q=["href"],G=["src","alt"],H=["href","download"];function J(e,n,Q,R,W,X){return t(),o("main",D,[a("div",I,[(t(!0),o(_,null,l(e.imageKeys,s=>(t(),o("a",{key:s,href:`#${s}`},d(s.split(".")[0].split("-").slice(1).join(" ")),9,E))),128))]),(t(!0),o(_,null,l(e.imageKeys,s=>(t(),o("div",{key:s,class:"map-container"},[a("a",{name:s},null,8,L),a("a",{href:e.imagesMap[s],target:"_blank"},[a("img",{src:e.imagesMap[s],alt:`${s} Map`},null,8,G)],8,q)]))),128)),a("a",{class:"download",href:e.mapFileUrl,download:e.downloadText+".pdf"},"Download",8,H)])}const Z=g(A,[["render",J],["__file","/home/runner/work/2023/2023/src/pages/Venue.vue"]]);export{Z as default};