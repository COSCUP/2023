import{d as T,u as z,D as f,G as M,m as w,H as P,_ as I,l as L,o,c as l,a as e,t as n,J as h,F as i,s as r,q as u,n as y,p as k}from"./app-f6b039fa.js";const A="/2023/assets/bronze_dark-e0fb422a.svg",F=Object.freeze(Object.defineProperty({__proto__:null,default:A},Symbol.toStringTag,{value:"Module"})),K="/2023/assets/bronze_light-ded942ac.svg",q=Object.freeze(Object.defineProperty({__proto__:null,default:K},Symbol.toStringTag,{value:"Module"})),C="/2023/assets/diamond_dark-ccbdfb5e.svg",H=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"})),N="/2023/assets/diamond_light-0cdfe0ab.svg",V=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"})),B="/2023/assets/friend_dark-8d56a053.svg",D=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"})),E="/2023/assets/friend_light-d4d1c4cd.svg",G=Object.freeze(Object.defineProperty({__proto__:null,default:E},Symbol.toStringTag,{value:"Module"})),J="/2023/assets/gold_dark-061baebb.svg",U=Object.freeze(Object.defineProperty({__proto__:null,default:J},Symbol.toStringTag,{value:"Module"})),X="/2023/assets/gold_light-ceebb425.svg",Q=Object.freeze(Object.defineProperty({__proto__:null,default:X},Symbol.toStringTag,{value:"Module"})),R="/2023/assets/sliver_dark-e0e7ed8f.svg",W=Object.freeze(Object.defineProperty({__proto__:null,default:R},Symbol.toStringTag,{value:"Module"})),Y="/2023/assets/sliver_light-2638ddce.svg",Z=Object.freeze(Object.defineProperty({__proto__:null,default:Y},Symbol.toStringTag,{value:"Module"})),x="/2023/assets/titanium_dark-010a9cd0.svg",ss=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"})),es="/2023/assets/titanium_light-92aee398.svg",ts=Object.freeze(Object.defineProperty({__proto__:null,default:es},Symbol.toStringTag,{value:"Module"})),os="/2023/assets/banner_dark-6ea47ffb.png",ls=Object.freeze(Object.defineProperty({__proto__:null,default:os},Symbol.toStringTag,{value:"Module"})),ns="/2023/assets/banner_dark-6ea47ffb.png",as=Object.freeze(Object.defineProperty({__proto__:null,default:ns},Symbol.toStringTag,{value:"Module"})),is="/2023/assets/flag_dark-3c512435.png",rs=Object.freeze(Object.defineProperty({__proto__:null,default:is},Symbol.toStringTag,{value:"Module"})),ds="/2023/assets/flag_light-bc72c56b.png",ps=Object.freeze(Object.defineProperty({__proto__:null,default:ds},Symbol.toStringTag,{value:"Module"})),_s="/2023/assets/lanyards_dark-9c863385.png",us=Object.freeze(Object.defineProperty({__proto__:null,default:_s},Symbol.toStringTag,{value:"Module"})),gs="/2023/assets/lanyards_light-339fbdb6.png",cs=Object.freeze(Object.defineProperty({__proto__:null,default:gs},Symbol.toStringTag,{value:"Module"})),hs="/2023/assets/promotion_dark-19d4ddcc.png",bs=Object.freeze(Object.defineProperty({__proto__:null,default:hs},Symbol.toStringTag,{value:"Module"})),ms="/2023/assets/promotion_light-75c16fcd.png",vs=Object.freeze(Object.defineProperty({__proto__:null,default:ms},Symbol.toStringTag,{value:"Module"})),fs="/2023/assets/website-agenda-ads_dark-96258490.png",ys=Object.freeze(Object.defineProperty({__proto__:null,default:fs},Symbol.toStringTag,{value:"Module"})),ks="/2023/assets/website-agenda-ads_light-16d29b5a.png",Os=Object.freeze(Object.defineProperty({__proto__:null,default:ks},Symbol.toStringTag,{value:"Module"}));const $s=Object.assign({"../assets/images/sponsorships/levels/bronze_dark.svg":F,"../assets/images/sponsorships/levels/bronze_light.svg":q,"../assets/images/sponsorships/levels/diamond_dark.svg":H,"../assets/images/sponsorships/levels/diamond_light.svg":V,"../assets/images/sponsorships/levels/friend_dark.svg":D,"../assets/images/sponsorships/levels/friend_light.svg":G,"../assets/images/sponsorships/levels/gold_dark.svg":U,"../assets/images/sponsorships/levels/gold_light.svg":Q,"../assets/images/sponsorships/levels/sliver_dark.svg":W,"../assets/images/sponsorships/levels/sliver_light.svg":Z,"../assets/images/sponsorships/levels/titanium_dark.svg":ss,"../assets/images/sponsorships/levels/titanium_light.svg":ts}),js=s=>$s[`../assets/images/sponsorships/levels/${s}.svg`].default,Ss=Object.assign({"../assets/images/sponsorships/banner_dark.png":ls,"../assets/images/sponsorships/banner_light.png":as,"../assets/images/sponsorships/flag_dark.png":rs,"../assets/images/sponsorships/flag_light.png":ps,"../assets/images/sponsorships/lanyards_dark.png":us,"../assets/images/sponsorships/lanyards_light.png":cs,"../assets/images/sponsorships/promotion_dark.png":bs,"../assets/images/sponsorships/promotion_light.png":vs,"../assets/images/sponsorships/website-agenda-ads_dark.png":ys,"../assets/images/sponsorships/website-agenda-ads_light.png":Os}),Ts=s=>Ss[`../assets/images/sponsorships/${s}.png`].default,zs=T({name:"Sponsorship",setup(){const{t:s,tm:g,te:O}=z(),v=f(()=>Object.keys(g("sponsorship.level.list"))),$=f(()=>P(v.value,3)),j=["flag","lanyards","promotion","website-agenda-ads"],b=f(()=>{const p=_=>Object.keys(g(`sponsorship.add-ons.list.${_}`)).filter(c=>!["X",""].includes(g(`sponsorship.add-ons.list.${_}`)[c]));return Object.keys(g("sponsorship.add-ons.columns")).map(_=>{const c=p(_);return c.map((m,S)=>({key:_,column:s(`sponsorship.add-ons.columns.${_}`),rowspan:S===0?c.length:void 0,image:m!=="all"?d(m):void 0,name:s(m!=="all"?`sponsorship.level.list.${m}.name`:"sponsorship.add-ons.all"),cost:s(`sponsorship.add-ons.list.${_}.${m}`)}))}).reduce((_,c)=>_.concat(c),[])}),{isDark:t}=M(),d=p=>js(`${p}_${t.value?"dark":"light"}`);return{t:s,tm:g,te:O,levelKeys:v,groupLevelKeys:$,markdown:w,addOnsImageKeys:j,getImageFromAddOns:p=>Ts(`${p}_${t.value?"dark":"light"}`),addOnsThinTable:b,getImageFromLevel:d}}}),Ms="/2023/assets/about-4dd9c9b6.jpg",ws={id:"sponsorship",class:"page-container"},Ps=["src","alt"],Is={class:"markdown overview avoid-page-break"},Ls=["innerHTML"],As={class:"markdown"},Fs={class:"subtitle"},Ks={class:"level-table"},qs=e("th",null,null,-1),Cs=["src","alt"],Hs={class:"level-list"},Ns=["src","alt"],Vs={class:"markdown"},Bs={class:"subtitle"},Ds={class:"add-ons-table"},Es=["src","alt"],Gs={key:0},Js=["colspan"],Us={class:"add-ons-thin-table"},Xs=["rowspan"],Qs={key:0},Rs={class:"level"},Ws=["src","alt"],Ys={class:"cost"},Zs={class:"images"},xs=["src","alt"],se=e("img",null,null,-1),ee={class:"highlight"},te=e("a",{href:"mailto:sponsorship@coscup.org"},"sponsorship@coscup.org",-1),oe={class:"markdown"},le={class:"faq"},ne=["innerHTML"],ae={class:"markdown"},ie=e("a",{href:"https://www.flickr.com/photos/coscup/albums"},"COSCUP flickr album",-1),re={class:"about-image"},de=e("img",{src:Ms},null,-1),pe={class:"markdown avoid-page-break"},_e=e("a",{href:"mailto:sponsorship@coscup.org"},"sponsorship@coscup.org",-1);function ue(s,g,O,v,$,j){const b=L("i18n-t");return o(),l("main",ws,[e("img",{class:"banner",src:s.getImageFromAddOns("banner"),alt:s.t("sponsorship.plan.title")},null,8,Ps),e("h2",null,n(s.t("sponsorship.plan.title")),1),e("section",Is,[e("h3",null,n(s.t("sponsorship.overview.title")),1),h(` <p>{{ t('sponsorship.overview.announcement.title') }}</p>
      <ul>
        <li
          v-for="text in tm('sponsorship.overview.announcement.list')"
          :key="\`\${text}\`"
        >
          {{ text }}
        </li>
      </ul> `),e("p",null,n(s.t("sponsorship.overview.description")),1),e("p",null,n(s.t("sponsorship.overview.feedback.title")),1),e("ul",null,[(o(!0),l(i,null,r(s.tm("sponsorship.overview.feedback.list"),t=>(o(),l("li",{key:`${t}`},n(t),1))),128))]),e("p",{class:"highlight",innerHTML:s.markdown(s.t("sponsorship.overview.end"))},null,8,Ls)]),e("section",As,[e("h3",null,[u(n(s.t("sponsorship.level.title")),1),e("span",Fs,n(s.t("sponsorship.level.subtitle")),1)]),e("div",Ks,[(o(!0),l(i,null,r(s.groupLevelKeys,(t,d)=>(o(),l("table",{key:`group-${d}`},[e("thead",null,[e("tr",null,[qs,(o(!0),l(i,null,r(t,a=>(o(),l("th",{key:`name-${a}`},[e("img",{src:s.getImageFromLevel(a),alt:s.t(`sponsorship.level.list.${a}.name`)},null,8,Cs),u(" "+n(s.t(`sponsorship.level.list.${a}.name`))+n(s.t(`sponsorship.level.list.${a}.subtitle`)),1)]))),128))])]),e("tbody",null,[e("tr",null,[e("td",null,n(s.t("sponsorship.level.columns.cost")),1),(o(!0),l(i,null,r(t,a=>(o(),l("td",{key:`cost-${a}`,class:"cost"},n(s.t(`sponsorship.level.list.${a}.cost`)),1))),128))]),e("tr",null,[e("td",null,n(s.t("sponsorship.level.columns.benefit")),1),(o(!0),l(i,null,r(t,a=>(o(),l("td",{key:`benefits-${a}`},[e("ul",null,[(o(!0),l(i,null,r(s.tm(`sponsorship.level.list.${a}.benefits`),p=>(o(),l("li",{key:`${p}`},n(p),1))),128))])]))),128))])])]))),128))]),e("ul",Hs,[(o(!0),l(i,null,r(s.levelKeys,t=>(o(),l("li",{key:t},[e("img",{src:s.getImageFromLevel(t),alt:s.t(`sponsorship.level.list.${t}.name`)},null,8,Ns),e("h4",null,n(s.t(`sponsorship.level.list.${t}.name`))+n(s.t(`sponsorship.level.list.${t}.subtitle`)),1),e("p",null,n(s.t(`sponsorship.level.list.${t}.cost`)),1),e("ul",null,[(o(!0),l(i,null,r(s.tm(`sponsorship.level.list.${t}.benefits`),d=>(o(),l("li",{key:`${d}`},n(d),1))),128))])]))),128))])]),e("section",Vs,[e("h3",null,[u(n(s.t("sponsorship.add-ons.title")),1),e("span",Bs,n(s.t("sponsorship.add-ons.subtitle")),1)]),e("div",Ds,[e("table",null,[e("thead",null,[e("tr",null,[e("th",null,n(s.t("sponsorship.add-ons.item")),1),(o(!0),l(i,null,r(s.levelKeys,t=>(o(),l("th",{key:`${t}`},[e("img",{src:s.getImageFromLevel(t),alt:s.t(`sponsorship.level.list.${t}.name`)},null,8,Es),u(" "+n(s.t(`sponsorship.level.list.${t}.name`)),1)]))),128))])]),e("tbody",null,[(o(!0),l(i,null,r(s.tm("sponsorship.add-ons.columns"),(t,d)=>(o(),l("tr",{key:`${t}`},[e("td",null,[u(n(t)+" ",1),s.te(`sponsorship.add-ons.details.${d}`)?(o(),l("ul",Gs,[(o(!0),l(i,null,r(s.tm(`sponsorship.add-ons.details.${d}`),(a,p)=>(o(),l("li",{key:p},n(a),1))),128))])):h("v-if",!0)]),s.te(`sponsorship.add-ons.list.${d}.all`)?(o(),l("td",{key:0,colspan:s.levelKeys.length,style:{"text-align":"center"}},n(s.t(`sponsorship.add-ons.list.${d}.all`)),9,Js)):(o(!0),l(i,{key:1},r(s.levelKeys,a=>(o(),l("td",{key:`${a}`},n(s.t(`sponsorship.add-ons.list.${d}.${a}`)),1))),128))]))),128))])])]),e("div",Us,[e("table",null,[e("thead",null,[e("tr",null,[e("th",null,n(s.t("sponsorship.add-ons.item")),1),e("th",null,n(s.t("sponsorship.add-ons.level-limit")),1),e("th",null,n(s.t("sponsorship.add-ons.cost")),1)])]),e("tbody",null,[(o(!0),l(i,null,r(s.addOnsThinTable,t=>(o(),l("tr",{key:`${t.key}`},[t.rowspan?(o(),l("td",{key:0,rowspan:t.rowspan,class:"name"},[u(n(t.column)+" ",1),s.te(`sponsorship.add-ons.details.${t.key}`)?(o(),l("ul",Qs,[(o(!0),l(i,null,r(s.tm(`sponsorship.add-ons.details.${t.key}`),(d,a)=>(o(),l("li",{key:a},n(d),1))),128))])):h("v-if",!0)],8,Xs)):h("v-if",!0),e("td",Rs,[t.image?(o(),l("img",{key:0,src:t.image,alt:t.name},null,8,Ws)):h("v-if",!0),e("p",null,n(t.name),1)]),e("td",Ys,n(t.cost),1)]))),128))])])]),(o(!0),l(i,null,r(s.tm("sponsorship.add-ons.explains"),(t,d)=>(o(),l("p",{key:d},n(t),1))),128)),e("div",Zs,[(o(!0),l(i,null,r(s.addOnsImageKeys,t=>(o(),l("div",{key:t,class:"item"},[e("img",{src:s.getImageFromAddOns(t),alt:s.t(`sponsorship.add-ons.columns.${t}`)},null,8,xs),e("p",null,n(s.t(`sponsorship.add-ons.columns.${t}`)),1)]))),128)),se]),y(b,{keypath:"sponsorship.add-ons.end.content",tag:"p"},{date:k(()=>[e("span",ee,n(s.t("sponsorship.add-ons.end.date")),1)]),_:1}),y(b,{keypath:"sponsorship.contact",tag:"p"},{email:k(()=>[te]),_:1})]),e("section",oe,[e("h3",null,n(s.t("sponsorship.faq.title")),1),e("ul",le,[(o(!0),l(i,null,r(s.tm("sponsorship.faq.list"),t=>(o(),l("li",{key:t.q},[e("h4",null,n(t.q),1),e("p",{innerHTML:s.markdown(t.a)},null,8,ne)]))),128))])]),e("section",ae,[e("h3",null,n(s.t("sponsorship.about-coscup.title")),1),e("p",null,n(s.t("sponsorship.about-coscup.description")),1),e("ul",null,[(o(!0),l(i,null,r(s.tm("sponsorship.about-coscup.messages"),t=>(o(),l("li",{key:`${t}`},n(t),1))),128))]),e("p",null,[u(n(s.t("sponsorship.about-coscup.ps1")),1),ie]),e("div",re,[de,e("p",null,n(s.t("sponsorship.about-coscup.ps2")),1)])]),h(`
    <section class="markdown avoid-page-break">
      <h3>{{ t('sponsorship.about-kcd.title') }}</h3>
      <p>{{ t('sponsorship.about-kcd.description') }}</p>
      <p>{{ t('sponsorship.about-kcd.message') }}</p>
    </section>
    -`),e("section",pe,[e("h3",null,n(s.t("sponsorship.wish.title")),1),e("ul",null,[(o(!0),l(i,null,r(s.tm("sponsorship.wish.list"),t=>(o(),l("li",{key:`${t}`},n(t),1))),128))]),y(b,{keypath:"sponsorship.contact",tag:"p"},{email:k(()=>[_e]),_:1})])])}const ce=I(zs,[["render",ue],["__file","/home/runner/work/2023/2023/src/pages/Sponsorship.vue"]]);export{ce as default};
