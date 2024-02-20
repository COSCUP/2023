import{d as p,u as d,r as u,w as v,m as o,_ as w,o as s,c as i,a as t,t as c,J as m,F as _,s as g,v as f,x}from"./app-f6b039fa.js";import{_ as k}from"./banner-logo-28fb64d0.js";const M=p({name:"Home",setup(){const{t:e,locale:r}=d(),a=u([]),l="2023/07/29",h="2023/07/30";return v(r,async()=>{a.value=[{name:"notice",title:e("home.notice.title"),content:o(e("home.notice.content"))},{name:"coc",title:e("home.coc.title"),content:o(e("home.coc.content"))},{name:"about",title:e("home.about.title"),content:o(e("home.about.content"))}]},{immediate:!0}),{t:e,sections:a,startDate:l,endDate:h}}}),V={id:"home",class:"page-container"},b=f('<div class="banner-container"><div class="logo-wrapper"><div class="logo-container"><h2>COSCUP 2023</h2><div class="logo-content"><img src="'+k+'" alt="COSCUP"><div><p>Conference for Open Source Coders, Users &amp; Promoters</p></div></div></div></div></div>',1),H={class:"info-container"},L={class:"date"},C=t("img",{class:"prefix-icon",src:x},null,-1),y={class:"section-title"},z=["innerHTML"];function B(e,r,a,l,h,Y){return s(),i("main",V,[b,t("div",H,[t("span",L,c(e.startDate)+" ~ "+c(e.endDate),1),m(` <div class="info">
        <a class="venue" href="https://youtu.be/MaQuXvkR7to" target="_blank">
          {{ t('home.info.day_1_rb_online') }}
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.0em" height="1.0em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" class="suffix-icon"><path d="M432 320h-32a16 16 0 0 0-16 16v112H64V128h144a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 0 0 0 34L157.67 377a24 24 0 0 0 34 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 0 0-24-24z" fill="currentColor"></path></svg>
        </a>
        <a class="venue" href="https://youtu.be/YexUnVOZC8M" target="_blank">
          {{ t('home.info.day_1_au_online') }}
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.0em" height="1.0em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" class="suffix-icon"><path d="M432 320h-32a16 16 0 0 0-16 16v112H64V128h144a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 0 0 0 34L157.67 377a24 24 0 0 0 34 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 0 0-24-24z" fill="currentColor"></path></svg>
        </a>
        <a class="venue" href="https://youtu.be/87qYQQ3pHFc" target="_blank">
          {{ t('home.info.day_2_rb_online') }}
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.0em" height="1.0em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" class="suffix-icon"><path d="M432 320h-32a16 16 0 0 0-16 16v112H64V128h144a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 0 0 0 34L157.67 377a24 24 0 0 0 34 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 0 0-24-24z" fill="currentColor"></path></svg>
        </a>
        <a class="venue" href="https://youtu.be/3a-bbpf2CcI" target="_blank">
          {{ t('home.info.day_2_au_online') }}
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1.0em" height="1.0em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" class="suffix-icon"><path d="M432 320h-32a16 16 0 0 0-16 16v112H64V128h144a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 0 0 0 34L157.67 377a24 24 0 0 0 34 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 0 0-24-24z" fill="currentColor"></path></svg>
        </a>
      </div> `),m(` <router-link
        class="announcement-toggle"
        :to="{
          query: {
            popUp: 'announcement',
          },
        }"
      >
        <span>
          {{ t('home.info.tabs.announcement') }}
        </span>
      </router-link> `)]),(s(!0),i(_,null,g(e.sections,n=>(s(),i("section",{key:`section-${n.name}`,class:"section-block"},[C,t("h2",y,c(n.title),1),t("article",{class:"section-content notice markdown",innerHTML:n.content},null,8,z)]))),128))])}const S=w(M,[["render",B],["__file","/home/runner/work/2023/2023/src/pages/Home.vue"]]);export{S as default};
