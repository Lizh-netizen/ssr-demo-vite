/* empty css             */import{i as to,G as lo,H as Ne,l as no,f as W,I as xe,g as io,_ as H,a as K,q as le,m as ro,h as co,j as uo,p as _,u as po,E as ho,c as fo,b as mo,k as go,n as _o,o as vo,d as Io}from"./flag-f648e0ad.js";import{a as yo,b as Co,c as bo}from"./el-popper-91dc7088.js";import{E as ko}from"./el-input-fde44cc2.js";import{ap as Uo,C as f,G as Lo,c as Vo,o as l,k as c,m as n,I as y,Y as m,a6 as C,v as u,an as F,am as j,s as g,n as E,W as v,t as b,q as w,p as Eo,K as te,l as wo,ar as No,a4 as xo,a5 as Oo,aj as Do,ak as So,at as Oe,ao as R,as as To}from"./index-7990f084.js";import{_ as $o}from"./_plugin-vue_export-helper-c27b6911.js";import{E as Mo}from"./index-45810730.js";import"./el-tooltip-4ed993c7.js";const Bo="/assets/imageUpload-856d3404.svg";const x=q=>(Do("data-v-ff9429d2"),q=q(),So(),q),Po={class:"drawer"},Fo={class:"check section"},jo={class:"content"},Ro={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",fill:`
                              none
                            `,version:"1.1",width:"9.999975204467773",height:"9.999975204467773",viewBox:"0 0 9.999975204467773 9.999975204467773"},Ao=["fill"],Wo={key:0,src:H},qo={key:1,src:K},Jo={key:1,style:{display:"inline-flex"}},Go={class:"specialTitle"},Zo={class:"image section"},zo=x(()=>n("img",{src:Bo},null,-1)),Ho={class:"content",style:{"padding-top":"0"}},Ko=x(()=>n("div",{class:"questionItem__header"},[n("img",{src:le}),n("span",{class:"questionItem__header__title"},"面型评估")],-1)),Yo={class:"container"},Qo=["src"],Xo=["onClick"],es=["src"],os={key:0,src:H},ss={key:1,src:K},as=x(()=>n("div",{class:"questionItem__header"},[n("img",{src:le}),n("span",{class:"questionItem__header__title"},"口内照")],-1)),ts={class:"container"},ls=["src"],ns=["onClick"],is=["src"],rs={key:0,src:H},ds={key:1,src:K},cs=x(()=>n("div",{class:"questionItem__header"},[n("img",{src:le}),n("span",{class:"questionItem__header__title"},"全景片")],-1)),us=["src"],ps=["onClick"],hs=["src"],fs={class:"imageItem__content specialComponent",style:{"min-width":"780px"}},ms={class:"container"},gs={class:"left-column"},_s={key:0,src:H},vs={key:1,src:K},Is={class:"leftLower-column"},ys=["onClick"],Cs={class:"diagram"},bs={class:"diagramBox"},ks={class:"toothItem1"},Us={class:"toothItem2"},Ls={class:"diagramBox"},Vs={class:"toothItem3"},Es={class:"toothItem4"},ws={class:"selectContainer",id:"selectContainer"},Ns={class:"container"},xs=["id","onClick"],Os=x(()=>n("div",{class:"left"},"右",-1)),Ds=x(()=>n("div",{class:"right"},"左",-1)),Ss={class:"footer"},Ts={class:"dialog-footer"},$s={class:"imageManagement__images subSection"},Ms={class:"title"},Bs=x(()=>n("div",{class:"title__left"},"图库",-1)),Ps=x(()=>n("div",{class:"title__middle"},[n("img",{src:ro,style:{"margin-right":"4px"}}),v(" 可直接拖拽照片到右侧指定位置或点击下方一键“自动分类”哦～ ")],-1)),Fs={class:"title__right file-upload"},js={class:"file-upload__label"},Rs={style:{"padding-left":"14px","padding-bottom":"50px","padding-top":"50px"}},As={key:0,class:"imgContainer__empty",src:co},Ws={class:"imgContainer"},qs=["onMouseenter","onMouseleave"],Js={style:{position:"relative",border:"1px solid #e5e6eb","border-radius":"12px"}},Gs=["src","onDragstart","onClick"],Zs=["onClick"],zs=x(()=>n("span",null,"加载上次影像",-1)),Hs=x(()=>n("img",{src:_o},null,-1)),Ks=[zs,Hs],Ys={class:"classifyWrapper"},Qs={style:{"margin-right":"6px"}},Xs={class:"imageManagement__classify subSection"},ea=x(()=>n("div",{class:"title"},"分类",-1)),oa={class:"imageWrapper"},sa=["onMouseenter","onMouseleave"],aa={style:{position:"relative",border:"1px solid #e5e6eb","border-radius":"12px"}},ta=["src","onDrop","onDragover","onDragstart"],la={key:0,style:{cursor:"pointer"},class:"deleteImage",src:uo},na={class:"item__caption"},ia={class:"dialog-footer"},ra=x(()=>n("img",{id:"img",style:{opacity:0}},null,-1)),da={style:{"margin-top":"20px"},class:"advice__state"},ca={key:0},ua={class:"dialog-footer"},pa={__name:"evaluate",setup(q){const ne=Uo(),L=ne.params.appId,Y=ne.params.patientId,A=f(!1),S=f(),Q=f();async function De(){A.value=!0}const ie=f();async function Se(){const a=await F(`/prod-api/business/orthBase/${L}`);ie.value=a.data.id}Se();async function Te(){try{let a="";S.value==="立即矫正"||S.value==="无需矫正"?a=S.value:a=Q.value+"个月后"+S.value.slice(2);const o=await Oe("/prod-api/business/orthBase",{id:ie.value,remark:a});A.value=!1,o.code===200&&R.success(o.msg)}catch(a){console.log(a)}}Lo(()=>{window.addEventListener("click",a=>{const o=document.querySelector(".el-popper.el-popover");if(o&&a.target!==o&&!o.contains(a.target)){const e=N.value[0].orthTitleList.findIndex(r=>r.popVisible===!0);e!==-1&&(N.value[0].orthTitleList[e].popVisible=!1)}})});const J=f();J.value=to;const X=f([]),$e=a=>{X.value.forEach(o=>{o.forEach(e=>{var r;e.active=!1,(r=a.toothCode)!=null&&r.includes(e.value+"")&&(e.active=!0)})})},re=f([]);async function Me(){const a=await F(`/prod-api/business/orthClass/list/1/临床检查/${L}`);re.value=a.data[0],a.data.forEach(o=>{o.orthTitleList.forEach(e=>e.showInput=!1)}),a.data.forEach(o=>{o.orthTitleList.forEach(e=>{if(e.orthOptionsList[e.orthOptionsList.length-1].otherContent&&(e.otherContent=e.orthOptionsList[e.orthOptionsList.length-1].otherContent),e.titleName=="关节弹响"){e.optionId="",e.text="",e.showInput=!1,e.selectId="";const r=e.orthOptionsList.filter(i=>i.choosen===!0);if(r.length>0){e.optionId=r[0].id;const i=e.listMap.filter(h=>h.choosen===!0);i.length>0&&(e.selectId=i[0].id)}}else if(e.titleName=="侧关节"){e.optionId=[],e.text="",e.showInput=!1,e.selectId1="",e.selectId2="";const r=e.orthOptionsList.filter(h=>h.choosen===!0);r.length>0&&(e.selectId1=r[0].id);const i=e.listMap.filter(h=>h.choosen===!0);i.length>0&&(e.selectId2=i[0].id)}else if(e.titleName=="骨龄"){e.optionId="",e.text="",e.showInput=!1,e.selectId1="",e.selectId2="".filter(i=>i.optionName==="骨龄超"||i.optionName==="骨龄晚").map(()=>f(null)),e.orthOptionsList.forEach(i=>{(i.optionName==="骨龄超"||i.optionName==="骨龄晚")&&(i.fillColor="#C9CDD4",i.seriousColor="#f44c4c",i.hoverColor="#2e6ce4",i.clicked=!!i.choosen,i.visible=!1)});const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r[0].id)}else if(e.type==1){e.optionId="",e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r[0].id)}else if(e.type==2){e.optionId=[],e.optionId1=[],e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r.map(i=>i.id),e.optionId1=e.optionId)}})})}const de=f([]);async function ce(){const a=await F(`/prod-api/business/orthClass/list/1/面型评估/${L}`);de.value=a.data,a.data.forEach(o=>o.orthTitleList.forEach(e=>e.showInput=!1)),a.data.forEach(o=>{o.imageUrl?o.hasImage=!0:o.hasImage=!1,o.orthTitleList.forEach(e=>{if(e.type==1){e.optionId="",e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r[0].id)}else if(e.type==2){e.optionId=[],e.optionId1=[],e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r.map(i=>i.id),e.optionId1=e.optionId)}})})}const ue=f([]);async function pe(){const a=await F(`/prod-api/business/orthClass/list/1/口内照/${L}`);ue.value=a.data,a.data.forEach(o=>o.orthTitleList.forEach(e=>e.showInput=!1)),a.data.forEach(o=>{o.imageUrl?o.hasImage=!0:o.hasImage=!1,o.orthTitleList.forEach(e=>{if(e.type==1){e.optionId="",e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r[0].id)}else if(e.type==2){e.optionId=[],e.optionId1=[],e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r.map(i=>i.id),e.optionId1=e.optionId)}})})}const Be=f(),N=f([]),he=f(!1),fe=f([]),me=f(),ge=f();async function _e(){const a=await F(`/prod-api/business/orthClass/list/1/全景片/${L}`);N.value=a.data,a.data.forEach(o=>{if(me.value=o.sourceApmtId?o.sourceApmtId:L,ge.value=o.id,o.imageUrl?(o.hasImage=!0,Be.value=o.imageUrl):o.hasImage=!1,!o.flag){he.value=!0;const e={sourceApmtId:me.value,apmtId:L,classId:ge.value,location:"1"};j("/prod-api/business/orthClass/mouthCheck",e).then(r=>{if(r.code==200){const i=N.value[0].orthTitleList.slice(0,6);fe.value=r.data.slice(6),N.value[0].orthTitleList=[...i,...fe.value],ve(N)}})}o.orthTitleList.forEach(e=>{e.showInput=!1,e.popVisible=!1})}),he.value||ve(N)}function ve(a){a.value.forEach(o=>{o.orthTitleList.forEach(e=>{e.topLeft=[],e.topRight=[],e.bottomLeft=[],e.bottomRight=[];const r=JSON.parse(e.showPosition);e.fdiToothCode?(e.toothCode=e.fdiToothCode.split(","),e.fdiToothCode.split(",").forEach((i,h)=>{i.startsWith("1")||i.startsWith("5")?e.topLeft.push(r[h][0]):i.startsWith("2")||i.startsWith("6")?e.topRight.push(r[h][0]):i.startsWith("4")||i.startsWith("8")?e.bottomLeft.push(r[h][0]):(i.startsWith("3")||i.startsWith("7"))&&e.bottomRight.push(r[h][0])})):e.toothCode=[],e.position=r||[],e.submitAble=!1})}),a.value.forEach(o=>{o.orthTitleList.forEach(e=>{if(e.type==1){e.optionId="",e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r[0].id)}else if(e.type==2){e.optionId=[],e.optionId1=[],e.text="",e.showInput=!1;const r=e.orthOptionsList.filter(i=>i.choosen===!0);r.length>0&&(e.optionId=r.map(i=>i.id),e.optionId1=e.optionId)}})})}Me(),ce(),pe(),_e();const T=(a,o)=>{o.type==2&&(o.optionId1.includes(10)&&o.optionId1.length<o.optionId.length?(o.optionId1=o.optionId.filter(e=>e!==10),o.optionId=o.optionId1):!o.optionId1.includes(10)&&o.optionId1.length<o.optionId.length&&o.optionId.includes(10)&&(o.optionId1=[10],o.optionId=[10],o.otherContent=""),o.orthOptionsList.forEach(e=>{o.optionId.includes(e.id)?e.choosen=!0:e.choosen=!1})),o.type==1&&o.orthOptionsList.forEach(e=>{a!==e.id&&(e.choosen=!1)}),Pe(o.optionId,o)};async function Pe(a,o){let e=null;o.type==1?e={apmtId:L,titleId:o.id,optionsIdStr:[a],otherContent:o.otherContent,cephalometricsContent:o.cephalometricsContent,fdiToothCode:"",showPosition:""}:o.type==2&&(e={apmtId:L,titleId:o.id,optionsIdStr:a,otherContent:o.otherContent,cephalometricsContent:"",fdiToothCode:"",showPosition:""}),await j("/prod-api/business/facialResult",e)}const P=f(!1),O=f([{caption:"正面像",typeName:"FrontalRepose",fileUrl:_},{caption:"正面微笑像",typeName:"FrontalSmile",fileUrl:_},{caption:"90度侧面像",typeName:"LeftProfile",fileUrl:_},{caption:"90度侧面微笑像",typeName:"RightProfile",fileUrl:_},{caption:"45度侧面像",typeName:"LeftSideProfile",fileUrl:_},{caption:"45度侧面微笑像",typeName:"RightSideProfile",fileUrl:_},{caption:"口内照（左侧）",typeName:"",fileUrl:_},{caption:"口内照（右侧）",typeName:"",fileUrl:_},{caption:"磨牙关系（左侧）",typeName:"Left",fileUrl:_},{caption:"磨牙关系（右侧）",typeName:"Right",fileUrl:_},{caption:"正面咬合",typeName:"Anterior",fileUrl:_},{caption:"前牙覆盖",typeName:"Cover",fileUrl:_},{caption:"上颌",typeName:"Upper",fileUrl:_},{caption:"下颌",typeName:"Lower",fileUrl:_},{caption:"全景片",typeName:"Panoramic",fileUrl:_},{caption:"侧位片",typeName:"Cephalometric",fileUrl:_}]),Fe=()=>{P.value=!0,O.value.forEach(a=>{a.fileUrl=_}),ee()};async function ee(){const a=await F(`/prod-api/business/orthImage/list?apmtId=${L}`);a.code==200&&a.data.length>0?a.data.forEach(o=>{O.value.forEach(e=>{o.imageType==e.caption&&(e.fileUrl=o.imageUrl,e.id=o.id)})}):O.value.forEach(o=>{o.fileUrl=_})}const je=f([]),oe=f([]),Re=new FormData;X.value=lo();const Ie=f(!1),Ae=a=>{const o=a.target.files;if(o.length>16)a.preventDefault(),R("最多上传16张图片");else{for(let e=0;e<o.length;e++){const r=o[e];if(Re.append("files",r),r){const i=new FileReader;i.onload=()=>{je.value.push(i.result),oe.value.push({imgUrl:i.result,showFlag:!1,choose:!0,file:r})},i.readAsDataURL(r)}}Ie.value?k.value[0].imageList=oe.value:(k.value.unshift({file:!0,StartTime:"2023-8-14",imageList:oe.value}),Ie.value=!0)}},ye=Vo(()=>{let a=0;return k.value.forEach(o=>{o.imageList.forEach(e=>{e.choose&&a++})}),a}),Ce=a=>{a.choose=!a.choose},be=a=>{a.id?To(`/prod-api/business/orthImage/${a.id}`).then(o=>{if(o.code==200){const e=O.value.find(r=>a==r);e.fileUrl=_,e.id=void 0}}):a.fileUrl=_},ke=f(0),k=f([]),G=f([]),se=()=>{P.value=!0,O.value.forEach(a=>{a.fileUrl=_}),ee()},We=()=>{if(k.value.length<G.value.length){G.value[k.value.length].imageList.forEach(o=>{o.imgUrl=o.fileUrl});const a=G.value.slice(ke.value+1).find(o=>o.imageList.length!==0);a?(k.value.push(a),ke.value=G.value.findIndex(o=>o==k.value[k.value.length-1]),k.value[k.value.length-1].imageList.forEach(o=>{o.imgUrl=o.fileUrl})):R("没有更多图像了哦")}},Ue=f();async function qe(){if(ye.value==0)R({message:"未选中图片",type:"error"});else{const a=Mo.service({lock:!0,text:"正在分类中",background:"rgba(0, 0, 0, 0.7)",target:Ue.value}),o=new FormData;let e,r;k.value.filter(h=>h.file===void 0).forEach(h=>{r=h.imageList.filter(V=>V.choose===!0).map(V=>{if(V.choose)return{ljUrl:V.imgUrl,ljId:V.id,LJCreateDatetime:V.timestamp}})}),e=JSON.stringify({patientId:Y,apmtId:L,orthImageList:r}),k.value.filter(h=>h.file===!0).length>0?k.value.filter(h=>h.file===!0)[0].imageList.filter(h=>h.choose===!0).forEach(h=>{o.append("files",h.file)}):o.append("files",null),o.append("orthImageString",e);const i=await j("/prod-api/business/orthImage/handleMultiImage",o,!0);a.close(),i.code===200&&(k.value.forEach(h=>h.imageList.forEach(V=>V.choose=!1)),i.data.forEach(h=>{O.value.forEach(V=>{h.typeName==V.typeName&&(V.fileUrl=h.fileUrl)})}))}}const D=f(null),ae=f(),Je=a=>{D.value=a,D.value.rightDrop=!0,ae.value=D.value.fileUrl;const o=document.getElementById("img");o.src=a.fileUrl,o.style.opacity=1,o.width=120,o.height=80,o.style.position="absolute",o.style.top="-9999px",o.style.objectFit="cover",o.style.border="2px solid #2E6CE4",o.style.boxShadow="0px 9px 18px 0px rgba(0, 0, 0, 0.57)",event.dataTransfer.setDragImage(o,60,40)},Ge=(a,o)=>{a.file?(o.dataTransfer.setData("text/plain",a),D.value=o.dataTransfer.files[0]):D.value=a;const e=document.getElementById("img");e.src=a.imgUrl,e.style.opacity=1,e.width=120,e.height=80,e.style.position="absolute",e.style.top="-9999px",e.style.objectFit="cover",e.style.border="2px solid #2E6CE4",e.style.boxShadow="0px 9px 18px 0px rgba(0, 0, 0, 0.57)",o.dataTransfer.setDragImage(e,60,40)},Le=()=>{const a=document.getElementById("img");a.style.opacity=0},Ze=(a,o)=>{const e=document.getElementById("img");if(e.style.opacity=0,a.target.classList.remove("hover"),!D.value.rightDrop)Ke(D.value,o);else{if(D.value.id)be(D.value);else{const r=O.value.find(i=>D.value.fileUrl==i.fileUrl);r.fileUrl=_}o.id?Oe("/prod-api/business/orthImage",{id:o.id,imageUrl:ae.value}).then(()=>{ee()}):o.fileUrl=ae.value}},ze=a=>{!a.target.src.endsWith("jpeg")&&!a.target.src.endsWith("jpg")&&(a.target.src=vo,a.target.classList.add("hover"))},He=a=>{!a.target.src.endsWith("jpeg")&&!a.target.src.endsWith("jpg")&&(a.target.src=_),a.target.classList.remove("hover")},Ve=f(0);async function Ke(a,o){const e=new FormData;a.type?(e.append("file",a,"Cover"),e.append("orthImageString",JSON.stringify({patientId:Y,apmtId:L,orthImageList:[]}))):e.append("orthImageString",JSON.stringify({patientId:Y,apmtId:L,orthImageList:[{ljUrl:a.imgUrl,ljId:a.id,LJCreateDatetime:a.timestamp}]}));const r=await j("/prod-api/business/orthImage/handleSingleImage",e,!0);r.code==200&&r.data[0].fileUrl?o.fileUrl=r.data[0].fileUrl:(o.fileUrl=_,Ve.value==0?(Ve.value++,R({message:"拖拽失败，请再试一次",type:"warning"})):R({message:"拖拽失败，请联系管理员",type:"warning"}))}const Ye=(a,o)=>{if(o.hasImage)N.value[0].orthTitleList.forEach(e=>{a!==e&&(e.popVisible=!1)}),a.popVisible=!a.popVisible;else return},Qe=a=>{if(!a.submitAble)return;let o={apmtId:L,titleId:a.id,optionsIdStr:[],otherContent:"",cephalometricsContent:"",fdiToothCode:a.toothCode.join(),showPosition:JSON.stringify(a.position)};j("/prod-api/business/optionsResult",o).then(()=>{a.submitAble=!1})},Ee=(a,o)=>{po(a,o,"",L)},Xe=(a,o)=>{Io(a,o)};async function eo(){P.value=!1,O.value.forEach(e=>e.reminder=!1);const o=O.value.filter(e=>e.fileUrl!==_).map(e=>({imageType:e.caption,imageUrl:e.fileUrl}));j("/prod-api/business/orthImage",{apmtId:L,orthImageList:o}).then(e=>{e.code==200&&oo()})}function oo(){ce(),pe(),_e()}const so=()=>{O.value.forEach(a=>a.reminder=!1)};return(a,o)=>{const e=ho,r=ko,i=fo,h=mo,V=Co,Z=bo,$=yo,ao=go,we=no;return l(),c(m,null,[n("div",Po,[n("div",Fo,[y(Ne,{text:"临床检查",backgroundColor:"#f4f7fd"}),n("div",jo,[(l(!0),c(m,null,C(re.value.orthTitleList,t=>(l(),c(m,{key:t.id},[t.titleName!=="关节弹响"&&t.titleName!=="侧关节"?(l(),g(W,{key:0,label:t.titleName,width:"100px"},{default:u(()=>[t.type==1?(l(),g(h,{key:0,modelValue:t.optionId,"onUpdate:modelValue":s=>t.optionId=s,onChange:s=>T(t.optionId,t)},{default:u(()=>[(l(!0),c(m,null,C(t.orthOptionsList,(s,d)=>(l(),c(m,{key:s.id},[s.optionSuffix?(l(),g(i,{key:1,"popper-class":"myPopper","popper-style":{width:"auto","min-width":"100px"},placement:"top-start",width:200,visible:s.visible,onShow:p=>a.showPopover(d-2)},{reference:u(()=>[y(e,{class:E({serious:s.serious=="1",checked:s.choosen===!0}),label:s.id,onMouseenter:p=>a.handleMouseEnter(s),onMouseleave:p=>a.handleMouseLeave(s)},{default:u(()=>[v(b(s.optionName),1),(l(),c("svg",Ro,[n("g",null,[n("path",{d:"M0,4.99999C0,2.23857,2.23857,0,4.99999,0C7.76141,0,9.99998,2.23857,9.99998,4.99999C9.99998,7.76141,7.76141,9.99998,4.99999,9.99998C2.23857,9.99998,0,7.76141,0,4.99999C0,4.99999,0,4.99999,0,4.99999ZM5.49999,3.49999C5.49999,3.49999,5.49999,2.49999,5.49999,2.49999C5.49999,2.49999,4.49999,2.49999,4.49999,2.49999C4.49999,2.49999,4.49999,3.49999,4.49999,3.49999C4.49999,3.49999,5.49999,3.49999,5.49999,3.49999C5.49999,3.49999,5.49999,3.49999,5.49999,3.49999ZM4.49999,3.99999C4.49999,3.99999,4.49999,7.49998,4.49999,7.49998C4.49999,7.49998,5.49999,7.49998,5.49999,7.49998C5.49999,7.49998,5.49999,3.99999,5.49999,3.99999C5.49999,3.99999,4.49999,3.99999,4.49999,3.99999C4.49999,3.99999,4.49999,3.99999,4.49999,3.99999Z","fill-rule":"evenodd",fill:s.clicked?s.seriousColor:s.hover?s.hoverColor:s.fillColor,"fill-opacity":"1"},null,8,Ao)])]))]),_:2},1032,["class","label","onMouseenter","onMouseleave"])]),default:u(()=>{var p;return[y(r,{maxlength:"2",ref_for:!0,ref:a.inputRefs[d-2],modelValue:s.otherContent,"onUpdate:modelValue":I=>s.otherContent=I,onBlur:I=>a.handleSubmitContent(t.optionId,t,s),class:E({borderless:s.otherContent})},null,8,["modelValue","onUpdate:modelValue","onBlur","class"]),v(b((p=s.optionSuffix)==null?void 0:p.substr(-1)),1)]}),_:2},1032,["visible","onShow"])):(l(),g(e,{key:0,class:E({serious:s.serious=="1"}),label:s.id},{default:u(()=>[v(b(s.optionName),1)]),_:2},1032,["class","label"]))],64))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0),t.type==2?(l(),g(Z,{key:1,modelValue:t.optionId,"onUpdate:modelValue":s=>t.optionId=s,onChange:s=>T(t.optionId,t)},{default:u(()=>[(l(!0),c(m,null,C(t.orthOptionsList,s=>(l(),g(V,{class:E({serious:s.serious=="1",checked:s.choosen===!0}),key:s.id,label:s.id},{default:u(()=>[v(b(s.optionName)+" ",1),s.serious=="0"?(l(),c("img",Wo)):(l(),c("img",qo))]),_:2},1032,["class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0),t.optionId.constructor===Array&&t.optionId.includes(9)||t.optionId==9?(l(),g(r,{key:2,placeholder:"请输入",modelValue:t.otherContent,"onUpdate:modelValue":s=>t.otherContent=s,onBlur:s=>Ee(t.optionId,t)},null,8,["modelValue","onUpdate:modelValue","onBlur"])):w("",!0)]),_:2},1032,["label"])):w("",!0),t.titleName=="关节弹响"?(l(),c("div",Jo,[n("div",Go,b(t.titleName),1),y(h,{class:"specialRadio",modelValue:t.optionId,"onUpdate:modelValue":s=>t.optionId=s,onChange:s=>T(t.optionId,t)},{default:u(()=>[(l(!0),c(m,null,C(t.orthOptionsList,s=>(l(),g(e,{class:E({serious:s.serious=="1",checked:s.choosen===!0}),key:s.id,label:s.id},{default:u(()=>[v(b(s.optionName),1)]),_:2},1032,["class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])])):w("",!0)],64))),128))])]),n("div",Zo,[y(Ne,{text:"图像分析",backgroundColor:"#EAF0FC"},{default:u(()=>[n("div",{style:{display:"flex","align-items":"center",color:"#2E6CE4",gap:"4px",cursor:"pointer"},onClick:Fe},[zo,v("图像管理 ")])]),_:1}),n("div",Ho,[Ko,n("div",Yo,[(l(!0),c(m,null,C(de.value,t=>(l(),g(xe,{key:t.id,imageCaption:t.className},{img:u(()=>[t.imageUrl?(l(),c("img",{key:0,src:t.imageUrl,style:{height:"240px","object-fit":"cover"}},null,8,Qo)):(l(),c("div",{key:1,class:"imageItem__placeholder",onClick:s=>se(t.className)},[n("img",{src:J.value,class:"addPic"},null,8,es)],8,Xo))]),content:u(()=>[(l(!0),c(m,null,C(t.orthTitleList,s=>(l(),g(W,{key:s.id,label:s.titleName,width:"120px"},{default:u(()=>[s.type==1?(l(),g(h,{key:0,modelValue:s.optionId,"onUpdate:modelValue":d=>s.optionId=d,onChange:d=>T(s.optionId,s,t.className,t)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,d=>(l(),g(e,{disabled:!t.hasImage,class:E({serious:d.serious=="1",checked:d.choosen===!0}),key:d.id,label:d.id},{default:u(()=>[v(b(d.optionName),1)]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0),s.type==2?(l(),g(Z,{key:1,modelValue:s.optionId,"onUpdate:modelValue":d=>s.optionId=d,onChange:d=>T(s.optionId,s,t.className,t)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,d=>(l(),g(V,{disabled:!t.hasImage,class:E({serious:d.serious=="1",checked:d.choosen===!0}),key:d.id,label:d.id},{default:u(()=>[v(b(d.optionName)+" ",1),d.serious=="0"?(l(),c("img",os)):(l(),c("img",ss))]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0)]),_:2},1032,["label"]))),128))]),_:2},1032,["imageCaption"]))),128))]),as,n("div",ts,[(l(!0),c(m,null,C(ue.value,t=>(l(),g(xe,{key:t.id,imageCaption:t.className,class:E({removeBorder:t.className==="90度侧面像"||t.className==="45度侧面像"})},{img:u(()=>[t.imageUrl?(l(),c("img",{key:0,src:t.imageUrl,style:{height:"240px","object-fit":"cover"}},null,8,ls)):(l(),c("div",{key:1,class:"imageItem__placeholder",onClick:s=>se(t.className)},[n("img",{src:J.value,class:"addPic"},null,8,is)],8,ns))]),content:u(()=>[(l(!0),c(m,null,C(t.orthTitleList,s=>(l(),g(W,{key:s.id,label:s.titleName,width:"120px"},{default:u(()=>[s.type==1?(l(),g(h,{key:0,modelValue:s.optionId,"onUpdate:modelValue":d=>s.optionId=d,onChange:d=>T(s.optionId,s,t.className,t)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,d=>(l(),g(e,{disabled:!t.hasImage,class:E({serious:d.serious=="1",checked:d.choosen===!0}),key:d.id,label:d.id},{default:u(()=>[v(b(d.optionName),1)]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0),s.type==2?(l(),g(Z,{key:1,modelValue:s.optionId,"onUpdate:modelValue":d=>s.optionId=d,onChange:d=>T(s.optionId,s,t.className,t)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,d=>(l(),g(V,{disabled:!t.hasImage,class:E({serious:d.serious=="1",checked:d.choosen===!0}),key:d.id,label:d.id},{default:u(()=>[v(b(d.optionName)+" ",1),d.serious=="0"?(l(),c("img",rs)):(l(),c("img",ds))]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0)]),_:2},1032,["label"]))),128))]),_:2},1032,["imageCaption","class"]))),128))]),cs,(l(!0),c(m,null,C(N.value,t=>(l(),c("div",{key:t.id,class:"placeholderContainer"},[n("div",{class:"image",style:Eo({flex:t.imageUrl?"1":"0","min-width":t.imageUrl?"250px":"auto"})},[t.imageUrl?(l(),c("img",{key:0,src:t.imageUrl,style:{width:"100%",cursor:"pointer"},onClick:o[0]||(o[0]=(...s)=>a.handleZoomPanoImage&&a.handleZoomPanoImage(...s))},null,8,us)):(l(),c("div",{key:1,class:"imageItem__placeholder",onClick:s=>se(t.className)},[n("img",{src:J.value,class:"addPic"},null,8,hs)],8,ps))],4),n("div",fs,[n("div",ms,[n("div",gs,[(l(!0),c(m,null,C(N.value[0].orthTitleList,(s,d)=>(l(),c(m,{key:s.id},[d<=1?(l(),g(W,{key:0,label:s.titleName,width:"120px"},{default:u(()=>[s.type==1?(l(),g(h,{key:0,modelValue:s.optionId,"onUpdate:modelValue":p=>s.optionId=p,onChange:p=>T(s.optionId,s)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,p=>(l(),g(e,{disabled:!N.value[0].hasImage,class:E({serious:p.serious=="1",checked:p.choosen===!0}),key:p.id,label:p.id},{default:u(()=>[v(b(p.optionName),1)]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0),s.optionId==136?(l(),g(r,{key:1,placeholder:"请输入",modelValue:s.otherContent,"onUpdate:modelValue":p=>s.otherContent=p,onBlur:p=>Ee(s.optionId,s)},null,8,["modelValue","onUpdate:modelValue","onBlur"])):s.type==2?(l(),g(Z,{key:2,modelValue:s.optionId,"onUpdate:modelValue":p=>s.optionId=p,onChange:p=>T(s.optionId,s)},{default:u(()=>[(l(!0),c(m,null,C(s.orthOptionsList,p=>(l(),g(V,{disabled:!N.value[0].hasImage,class:E({serious:p.serious=="1",checked:p.choosen===!0}),key:p.id,label:p.id},{default:u(()=>[v(b(p.optionName)+" ",1),p.serious=="0"?(l(),c("img",_s)):(l(),c("img",vs))]),_:2},1032,["disabled","class","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])):w("",!0)]),_:2},1032,["label"])):w("",!0)],64))),128))]),n("div",Is,[(l(!0),c(m,null,C(N.value[0].orthTitleList,(s,d)=>(l(),c(m,{key:s.id},[d>=2?(l(),g(W,{key:0,label:s.titleName,width:"120px"},{default:u(()=>[y(i,{width:490,visible:s.popVisible,onShow:p=>$e(s),onAfterLeave:p=>Qe(s)},{reference:u(()=>{var p,I,M,z;return[n("div",{class:"diagramWrapper",onClick:te(U=>Ye(s,N.value[0]),["stop"])},[n("div",Cs,[n("div",bs,[n("div",ks,b((p=s.topLeft)==null?void 0:p.sort((U,B)=>U.sort-B.sort).map(U=>U.value).join("")),1),n("div",Us,b((I=s.topRight)==null?void 0:I.sort((U,B)=>U.sort-B.sort).map(U=>U.value).join("")),1)]),n("div",Ls,[n("div",Vs,b((M=s.bottomLeft)==null?void 0:M.sort((U,B)=>U.sort-B.sort).map(U=>U.value).join("")),1),n("div",Es,b((z=s.bottomRight)==null?void 0:z.sort((U,B)=>U.sort-B.sort).map(U=>U.value).join("")),1)])])],8,ys)]}),default:u(()=>[n("div",ws,[n("div",Ns,[(l(!0),c(m,null,C(X.value,(p,I)=>(l(),c("div",{key:I,class:E(["symptomBox",{itemAlignRight:I===2||I===4||I===0||I===6,marginTop:I==4||I==5,marginBottom:I==2||I==3,marginRight:I===2||I===4||I===0||I===6,marginLeft:I===1||I===3||I===5||I===7}])},[(l(!0),c(m,null,C(p,(M,z)=>(l(),c("div",{class:E(["symptomItem",{selected:M.active===!0}]),id:M.value,key:z,onClick:te(U=>Xe(M,s),["stop"])},b(M.label),11,xs))),128))],2))),128))]),Os,Ds])]),_:2},1032,["visible","onShow","onAfterLeave"])]),_:2},1032,["label"])):w("",!0)],64))),128))])])])]))),128))])]),n("div",Ss,[n("span",Ts,[y($,{onClick:o[1]||(o[1]=t=>a.dialogVisible=!1)},{default:u(()=>[v("取消")]),_:1}),y($,{type:"primary",onClick:De},{default:u(()=>[v(" 确认 ")]),_:1})])])]),y(we,{modelValue:P.value,"onUpdate:modelValue":o[3]||(o[3]=t=>P.value=t),title:"影像管理",width:"1183px",onClose:so,"close-on-click-modal":!1},{footer:u(()=>[n("span",ia,[y($,{onClick:o[2]||(o[2]=t=>P.value=!1)},{default:u(()=>[v("取消")]),_:1}),y($,{type:"primary",onClick:eo},{default:u(()=>[v(" 确定 ")]),_:1})])]),default:u(()=>[n("div",{class:"imageManagement",ref_key:"loadingTarget2",ref:Ue},[n("div",$s,[n("div",Ms,[Bs,Ps,n("div",Fs,[n("div",js,[y($,{type:"primary",link:"",icon:wo(No)},{default:u(()=>[v("上传图片")]),_:1},8,["icon"])]),n("input",{class:"file-upload__input",type:"file",onChange:Ae,multiple:""},null,32)])]),n("div",Rs,[k.value.length==0?(l(),c("img",As)):(l(!0),c(m,{key:1},C(k.value,(t,s)=>(l(),c("div",{key:s},[n("div",null,b(t.StartTime.split("T")[0]),1),n("div",Ws,[(l(!0),c(m,null,C(t.imageList,d=>(l(),c("div",{class:"item",key:d.id,onMouseenter:p=>d.showFlag=!0,onMouseleave:p=>d.showFlag=!1},[n("div",Js,[n("img",{style:{display:"block"},class:E(["img",{choose:d.choose===!0}]),src:d.imgUrl,draggable:"true",onDragstart:p=>Ge(d,p),onDragend:Le,onClick:p=>Ce(d)},null,42,Gs),xo(n("img",{src:io,style:{position:"absolute",right:"6px",bottom:"6px"},onClick:p=>Ce(d)},null,8,Zs),[[Oo,d.choose===!0]])])],40,qs))),128))]),!t.file&&s===k.value.length-1?(l(),c("div",{key:0,style:{display:"inline-flex",color:"#4E5969",cursor:"pointer"},onClick:We},Ks)):w("",!0)]))),128))]),n("div",Ys,[n("span",Qs,"已选中"+b(ye.value)+"张",1),y($,{onClick:qe},{default:u(()=>[v("自动分类")]),_:1})])]),n("div",Xs,[ea,n("div",oa,[(l(!0),c(m,null,C(O.value,t=>(l(),c("div",{class:"item",key:t.typeName,onMouseenter:s=>t.showFlag=!0,onMouseleave:s=>t.showFlag=!1},[n("div",aa,[n("img",{class:E(["img",{hover:t.reminder===!0,animate__animated:t.reminder===!0,animate__bounce:t.reminder===!0}]),style:{display:"block"},src:t.fileUrl,onDrop:s=>Ze(s,t),onDragover:te(ze,["prevent"]),onDragleave:He,onDragstart:s=>Je(t),onDragend:Le},null,42,ta)]),y(ao,{width:"300","confirm-button-text":"确认",icon:a.WarningFilled,"icon-color":"#FF7D00","cancel-button-text":"取消",title:"确认删除该张图片吗？",onConfirm:s=>be(t)},{reference:u(()=>[t.showFlag&&!t.fileUrl.startsWith("data:image")?(l(),c("img",la)):w("",!0)]),_:2},1032,["icon","onConfirm"]),n("div",na,b(t.caption),1)],40,sa))),128))])])],512)]),_:1},8,["modelValue"]),ra,y(we,{modelValue:A.value,"onUpdate:modelValue":o[7]||(o[7]=t=>A.value=t),title:"面评建议",width:"30%",class:"advice"},{footer:u(()=>[n("span",ua,[y($,{onClick:o[6]||(o[6]=t=>A.value=!1)},{default:u(()=>[v("取消")]),_:1}),y($,{type:"primary",onClick:Te},{default:u(()=>[v(" 确定 ")]),_:1})])]),default:u(()=>[n("div",da,[v(" 状态选择： "),y(h,{modelValue:S.value,"onUpdate:modelValue":o[4]||(o[4]=t=>S.value=t)},{default:u(()=>[y(e,{label:"立即矫正"}),y(e,{label:"后续面评"}),y(e,{label:"后续矫正"}),y(e,{label:"无需矫正"})]),_:1},8,["modelValue"])]),S.value==="后续面评"||S.value==="后续矫正"?(l(),c("div",ca,[v(" 时间选择："),y(r,{modelValue:Q.value,"onUpdate:modelValue":o[5]||(o[5]=t=>Q.value=t)},null,8,["modelValue"]),v("个月后"+b(S.value.slice(2)),1)])):w("",!0)]),_:1},8,["modelValue"])],64)}}},Ca=$o(pa,[["__scopeId","data-v-ff9429d2"]]);export{Ca as default};
