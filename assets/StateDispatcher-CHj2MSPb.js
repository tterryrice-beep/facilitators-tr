import{n as ee,r as e,t}from"./jsx-runtime-CKZy1FJb.js";import{n as te,t as n}from"./index-BtsS-W26.js";import{n as r,t as i}from"./JSView-DsJL3-yW.js";import{t as ne}from"./ObjectView-DBWi6clt.js";import{n as re,t as a}from"./Pre-ByJBqR8I.js";e();var ie=ee(),ae={},o=t(),s=ee=>{let e=(0,ie.c)(178),{getText:t}=te(),s;e[0]===Symbol.for(`react.memo_cache_sentinel`)?(s=(0,o.jsx)(`a`,{href:`https://github.com/tterryrice-beep/StateDispatcher`,target:`_blank`,children:(0,o.jsx)(`img`,{src:`https://cdn.simpleicons.org/github/white`,alt:`git`,className:`h-6 w-auto`})}),e[0]=s):s=e[0];let oe;e[1]===Symbol.for(`react.memo_cache_sentinel`)?(oe=(0,o.jsx)(re,{title:`StateDispatcher`,rightBar:(0,o.jsxs)(`div`,{className:`flex gap-3 items-center`,children:[s,(0,o.jsx)(`a`,{href:`https://www.npmjs.com/package/state-dispatcher-red`,target:`_blank`,children:(0,o.jsx)(`img`,{src:`https://img.shields.io/npm/v/state-dispatcher-red`,alt:`npm version`})})]})}),e[1]=oe):oe=e[1];let se=t(`StateDispatcher/reason`),c;e[2]===se?c=e[3]:(c=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:se}),e[2]=se,e[3]=c);let ce;e[4]===Symbol.for(`react.memo_cache_sentinel`)?(ce=(0,o.jsx)(a,{inline:!0,children:`EventEmitter`}),e[4]=ce):ce=e[4];let l;e[5]===t?l=e[6]:(l=t(`StateDispatcher/discribe`,{EventEmitter:ce}),e[5]=t,e[6]=l);let u;e[7]===l?u=e[8]:(u=(0,o.jsx)(n,{children:l}),e[7]=l,e[8]=u);let le,ue;e[9]===Symbol.for(`react.memo_cache_sentinel`)?(le=(0,o.jsx)(`br`,{}),ue=(0,o.jsx)(`br`,{}),e[9]=le,e[10]=ue):(le=e[9],ue=e[10]);let de=t(`StateDispatcher/discribe_2`),d;e[11]===de?d=e[12]:(d=(0,o.jsx)(n,{children:de}),e[11]=de,e[12]=d);let fe=t(`StateDispatcher/install`),f;e[13]===fe?f=e[14]:(f=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:fe}),e[13]=fe,e[14]=f);let pe;e[15]===Symbol.for(`react.memo_cache_sentinel`)?(pe=(0,o.jsx)(a,{children:(0,o.jsx)(`a`,{href:`https://www.npmjs.com/package/state-dispatcher-red`,target:`_blank`,children:`npm i state-dispatcher-red`})}),e[15]=pe):pe=e[15];let me=t(`StateDispatcher/concept/title`),p;e[16]===me?p=e[17]:(p=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:me}),e[16]=me,e[17]=p);let he=t(`StateDispatcher/concept/desc`),m;e[18]===he?m=e[19]:(m=(0,o.jsx)(n,{className:`mb-3 block`,children:he}),e[18]=he,e[19]=m);let ge=t(`StateDispatcher/concept/state`),_e=t(`StateDispatcher/concept/events`),h;e[20]!==ge||e[21]!==_e?(h=(0,o.jsx)(ne,{defaultExpanded:!0,data:{StateValues:ge,Events:_e}}),e[20]=ge,e[21]=_e,e[22]=h):h=e[22];let ve,ye,be;e[23]===Symbol.for(`react.memo_cache_sentinel`)?(ve=(0,o.jsx)(a,{inline:!0,children:`StateValues`}),ye=(0,o.jsx)(a,{inline:!0,children:`Events`}),be=(0,o.jsx)(a,{inline:!0,children:`Setters`}),e[23]=ve,e[24]=ye,e[25]=be):(ve=e[23],ye=e[24],be=e[25]);let g;e[26]===t?g=e[27]:(g=t(`StateDispatcher/concept/abt`,{StateValues:ve,Events:ye,Setters:be}),e[26]=t,e[27]=g);let _;e[28]===g?_=e[29]:(_=(0,o.jsx)(n,{className:`mb-3 block mt-6`,children:g}),e[28]=g,e[29]=_);let xe=`
type State = {
  userName: string;
  age: number;
  bornYear: number; // ${t(`StateDispatcher/concept/ex_bornYear`)}
};

type Events = {
  userName: string;  // ${t(`StateDispatcher/concept/ex_name`)}
  age: { age: number; bornYear: number }; // ${t(`StateDispatcher/concept/ex_age`)}
};
`,v;e[30]===xe?v=e[31]:(v=(0,o.jsx)(i,{children:xe}),e[30]=xe,e[31]=v);let Se=t(`StateDispatcher/initial/title`),y;e[32]===Se?y=e[33]:(y=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:Se}),e[32]=Se,e[33]=y);let Ce,we;e[34]===Symbol.for(`react.memo_cache_sentinel`)?(Ce=(0,o.jsx)(a,{inline:!0,children:`StateDispatcher`}),we=(0,o.jsx)(a,{inline:!0,children:`super()`}),e[34]=Ce,e[35]=we):(Ce=e[34],we=e[35]);let b;e[36]===t?b=e[37]:(b=t(`StateDispatcher/initial/desc`,{StateDispatcher:Ce,super:we}),e[36]=t,e[37]=b);let x;e[38]===b?x=e[39]:(x=(0,o.jsx)(n,{className:`mb-3 block`,children:b}),e[38]=b,e[39]=x);let Te;e[40]===Symbol.for(`react.memo_cache_sentinel`)?(Te=(0,o.jsx)(i,{children:`
import { StateDispatcher, SetterMap } from "state-dispatcher-red";

type State  = { count: number };
type Events = { count: number };

const INITIAL: State = { count: 0 };

const SETTERS: SetterMap<State, Events> = {
  count(state, value) {
    state.count = value;
  },
};

class CounterManager extends StateDispatcher<State, Events> {
  constructor() {
    super(INITIAL, SETTERS);
  }

  public destroy() {
    this.destroyDispatcher();
  }
}

export const counter = new CounterManager();
`}),e[40]=Te):Te=e[40];let Ee=t(`StateDispatcher/initial/arguments/title`),S;e[41]===Ee?S=e[42]:(S=(0,o.jsx)(n,{className:`ml-8 mt-12 mb-6`,tag:`h3`,type:`subtitle`,children:Ee}),e[41]=Ee,e[42]=S);let De=t(`StateDispatcher/initial/arguments/initialState`),Oe=t(`StateDispatcher/initial/arguments/setters`),ke=t(`StateDispatcher/initial/arguments/maxListeners`),C;e[43]!==De||e[44]!==Oe||e[45]!==ke?(C=(0,o.jsx)(ne,{defaultExpanded:!0,data:{initialState:De,setters:Oe,"config.maxListeners":ke}}),e[43]=De,e[44]=Oe,e[45]=ke,e[46]=C):C=e[46];let Ae;e[47]===Symbol.for(`react.memo_cache_sentinel`)?(Ae=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:(0,o.jsx)(a,{inline:!0,children:`setters`})}),e[47]=Ae):Ae=e[47];let je,Me,Ne,Pe,Fe,Ie;e[48]===Symbol.for(`react.memo_cache_sentinel`)?(je=(0,o.jsx)(a,{inline:!0,children:`Events`}),Me=(0,o.jsx)(a,{inline:!0,children:`manager`}),Ne=(0,o.jsx)(a,{inline:!0,children:`key`}),Pe=(0,o.jsx)(a,{inline:!0,children:`value`}),Fe=(0,o.jsx)(a,{inline:!0,children:`state`}),Ie=(0,o.jsx)(a,{inline:!0,children:`manager.setters[key](value)`}),e[48]=je,e[49]=Me,e[50]=Ne,e[51]=Pe,e[52]=Fe,e[53]=Ie):(je=e[48],Me=e[49],Ne=e[50],Pe=e[51],Fe=e[52],Ie=e[53]);let w;e[54]===t?w=e[55]:(w=t(`StateDispatcher/initial/setters/desc`,{Events:je,manager:Me,key:Ne,value:Pe,state:Fe,setter:Ie}),e[54]=t,e[55]=w);let T;e[56]===w?T=e[57]:(T=(0,o.jsx)(n,{className:`mb-3 block`,children:w}),e[56]=w,e[57]=T);let Le,Re;e[58]===Symbol.for(`react.memo_cache_sentinel`)?(Le=(0,o.jsx)(a,{inline:!0,children:`undefined`}),Re=(0,o.jsx)(a,{inline:!0,children:`value`}),e[58]=Le,e[59]=Re):(Le=e[58],Re=e[59]);let E;e[60]===t?E=e[61]:(E=t(`StateDispatcher/initial/setters/desc_2`,{undefined:Le,value:Re}),e[60]=t,e[61]=E);let D;e[62]===E?D=e[63]:(D=(0,o.jsx)(n,{className:`mb-3 block`,children:E}),e[62]=E,e[63]=D);let ze=t(`StateDispatcher/initial/setters/no_return`),Be=t(`StateDispatcher/initial/setters/with_return`),Ve=t(`StateDispatcher/initial/setters/using/title`),He;e[64]===t?He=e[65]:(He=t(`StateDispatcher/initial/setters/using/name`,{return:`Alice`}),e[64]=t,e[65]=He);let Ue;e[66]===t?Ue=e[67]:(Ue=t(`StateDispatcher/initial/setters/using/age`,{return:`{ age: 25, bornYear: 2000 }`}),e[66]=t,e[67]=Ue);let We=`
const SETTERS: SetterMap<State, Events> = {
  userName(state, value) {
    state.userName = value;
    // ${ze}
  },

  age(state, value) {
    state.age = value;
    state.bornYear = new Date().getFullYear() - value;
    // ${Be}
    return { age: value, bornYear: state.bornYear };
  },
};

// ${Ve}
manager.setters.userName("Alice"); // ${He}
manager.setters.age(25); // ${Ue}
`,O;e[68]===We?O=e[69]:(O=(0,o.jsx)(i,{children:We}),e[68]=We,e[69]=O);let Ge;e[70]===Symbol.for(`react.memo_cache_sentinel`)?(Ge=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:(0,o.jsx)(a,{inline:!0,children:`listen`})}),e[70]=Ge):Ge=e[70];let Ke;e[71]===Symbol.for(`react.memo_cache_sentinel`)?(Ke=(0,o.jsx)(a,{inline:!0,children:`listen(key, callback)`}),e[71]=Ke):Ke=e[71];let k;e[72]===t?k=e[73]:(k=t(`StateDispatcher/initial/listen/desc`,{ex:Ke}),e[72]=t,e[73]=k);let A;e[74]===k?A=e[75]:(A=(0,o.jsx)(n,{className:`mb-3 block`,children:k}),e[74]=k,e[75]=A);let qe;e[76]===Symbol.for(`react.memo_cache_sentinel`)?(qe=(0,o.jsx)(i,{children:`
const unsubscribe = manager.listen("age", ({ age, bornYear }) => {
  console.log(\`Age: \${age}, year of born: \${bornYear}\`);
});

// Відписатися:
unsubscribe();
`}),e[76]=qe):qe=e[76];let Je;e[77]===Symbol.for(`react.memo_cache_sentinel`)?(Je=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:(0,o.jsx)(a,{inline:!0,children:`getState`})}),e[77]=Je):Je=e[77];let Ye,Xe,Ze;e[78]===Symbol.for(`react.memo_cache_sentinel`)?(Ye=(0,o.jsx)(a,{inline:!0,children:`getState()`}),Xe=(0,o.jsx)(a,{inline:!0,children:`Readonly<StateValues>`}),Ze=(0,o.jsx)(a,{inline:!0,children:`Readonly`}),e[78]=Ye,e[79]=Xe,e[80]=Ze):(Ye=e[78],Xe=e[79],Ze=e[80]);let j;e[81]===t?j=e[82]:(j=t(`StateDispatcher/initial/getState/desc`,{getState:Ye,state:Xe,readonly:Ze}),e[81]=t,e[82]=j);let M;e[83]===j?M=e[84]:(M=(0,o.jsx)(n,{className:`mb-3 block`,children:j}),e[83]=j,e[84]=M);let Qe;e[85]===Symbol.for(`react.memo_cache_sentinel`)?(Qe=(0,o.jsx)(i,{children:`
const state = manager.getState();
console.log(state.count);  // ✓
state.count = 10;           // ✗ TS Error: Cannot assign to read-only property
`}),e[85]=Qe):Qe=e[85];let $e;e[86]===Symbol.for(`react.memo_cache_sentinel`)?($e=(0,o.jsx)(a,{inline:!0,children:`getState()`}),e[86]=$e):$e=e[86];let N;e[87]===t?N=e[88]:(N=t(`StateDispatcher/initial/getState/desc_2`,{getState:$e}),e[87]=t,e[88]=N);let P;e[89]===N?P=e[90]:(P=(0,o.jsx)(n,{className:`mb-3 block mt-4`,children:N}),e[89]=N,e[90]=P);let et;e[91]===Symbol.for(`react.memo_cache_sentinel`)?(et=(0,o.jsx)(i,{children:`
class Ex {
...
  if (this.getState().isLoadingActive) return;
...
}
`}),e[91]=et):et=e[91];let tt;e[92]===Symbol.for(`react.memo_cache_sentinel`)?(tt=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:(0,o.jsx)(a,{inline:!0,children:`destroyDispatcher`})}),e[92]=tt):tt=e[92];let nt,rt;e[93]===Symbol.for(`react.memo_cache_sentinel`)?(nt=(0,o.jsx)(a,{inline:!0,children:`destroyDispatcher()`}),rt=(0,o.jsx)(a,{inline:!0,children:`isDestroyed`}),e[93]=nt,e[94]=rt):(nt=e[93],rt=e[94]);let F;e[95]===t?F=e[96]:(F=t(`StateDispatcher/initial/destroyDispatcher/desc`,{destroyDispatcher:nt,isDestroyed:rt}),e[95]=t,e[96]=F);let I;e[97]===F?I=e[98]:(I=(0,o.jsx)(n,{className:`mb-3 block`,children:F}),e[97]=F,e[98]=I);let it=`
class MyManager extends StateDispatcher<State, Events> {
  // ...
  public destroy() {
    this.destroyDispatcher();
  }
}

// ${t(`StateDispatcher/initial/destroyDispatcher/react`)}
useEffect(() => {
  return () => manager.destroy();
}, []);
`,L;e[99]===it?L=e[100]:(L=(0,o.jsx)(i,{children:it}),e[99]=it,e[100]=L);let at;e[101]===Symbol.for(`react.memo_cache_sentinel`)?(at=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:(0,o.jsx)(a,{inline:!0,children:`createHook`})}),e[101]=at):at=e[101];let ot;e[102]===Symbol.for(`react.memo_cache_sentinel`)?(ot=(0,o.jsx)(a,{inline:!0,children:`createHook`}),e[102]=ot):ot=e[102];let R;e[103]===t?R=e[104]:(R=t(`StateDispatcher/initial/createHook/desc`,{createHook:ot}),e[103]=t,e[104]=R);let z;e[105]===R?z=e[106]:(z=(0,o.jsx)(n,{className:`mb-3 block`,children:R}),e[105]=R,e[106]=z);let st=`
import { createHook } from "state-dispatcher-red";

export const useCounter = createHook(counter);

// ${t(`StateDispatcher/initial/createHook/in_component`)}:
const [count, setCount] = useCounter(
  "count",         //  ${t(`StateDispatcher/initial/createHook/key`)}
  (s) => s.count,  //  ${t(`StateDispatcher/initial/createHook/selector`)}
);
`,B;e[107]===st?B=e[108]:(B=(0,o.jsx)(i,{children:st}),e[107]=st,e[108]=B);let ct;e[109]===Symbol.for(`react.memo_cache_sentinel`)?(ct={color:r.string},e[109]=ct):ct=e[109];let lt;e[110]===Symbol.for(`react.memo_cache_sentinel`)?(lt=(0,o.jsx)(`span`,{style:{color:r.literal},children:`arg 1 -- key:`}),e[110]=lt):lt=e[110];let ut=` `+t(`StateDispatcher/initial/createHook/arg_1`),V;e[111]===ut?V=e[112]:(V=(0,o.jsxs)(n,{style:ct,className:`mb-3 mt-3 block`,children:[lt,ut]}),e[111]=ut,e[112]=V);let dt,ft;e[113]===Symbol.for(`react.memo_cache_sentinel`)?(dt={color:r.string},ft=(0,o.jsx)(`span`,{style:{color:r.literal},children:`arg 2 -- selector:`}),e[113]=dt,e[114]=ft):(dt=e[113],ft=e[114]);let pt=` `+t(`StateDispatcher/initial/createHook/arg_2`),H;e[115]===pt?H=e[116]:(H=(0,o.jsxs)(n,{className:`mb-3 block`,style:dt,children:[ft,pt]}),e[115]=pt,e[116]=H);let mt;e[117]===Symbol.for(`react.memo_cache_sentinel`)?(mt={color:r.string},e[117]=mt):mt=e[117];let ht;e[118]===Symbol.for(`react.memo_cache_sentinel`)?(ht={color:r.literal},e[118]=ht):ht=e[118];let gt=t(`StateDispatcher/initial/createHook/tuple_key`)+`: `,U;e[119]===gt?U=e[120]:(U=(0,o.jsx)(`span`,{style:ht,children:gt}),e[119]=gt,e[120]=U);let _t=t(`StateDispatcher/initial/createHook/tuple_value`),W;e[121]!==U||e[122]!==_t?(W=(0,o.jsxs)(n,{style:mt,className:`mb-3 block`,children:[U,_t]}),e[121]=U,e[122]=_t,e[123]=W):W=e[123];let vt=t(`StateDispatcher/initial/createHook/unmount`),G;e[124]===vt?G=e[125]:(G=(0,o.jsx)(n,{className:`mb-3 block mt-6`,children:vt}),e[124]=vt,e[125]=G);let yt=t(`StateDispatcher/initial/limits/title`),K;e[126]===yt?K=e[127]:(K=(0,o.jsx)(n,{tag:`h2`,type:`subtitle`,className:`mt-20 mb-8`,children:yt}),e[126]=yt,e[127]=K);let bt=t(`StateDispatcher/initial/limits/abstract`),q;e[128]===bt?q=e[129]:(q=(0,o.jsx)(n,{className:`ml-8 mt-8 mb-2`,tag:`h3`,type:`subtitle`,children:bt}),e[128]=bt,e[129]=q);let xt;e[130]===Symbol.for(`react.memo_cache_sentinel`)?(xt=(0,o.jsx)(a,{inline:!0,children:`abstract`}),e[130]=xt):xt=e[130];let J;e[131]===t?J=e[132]:(J=t(`StateDispatcher/initial/limits/disc`,{abstract:xt}),e[131]=t,e[132]=J);let Y;e[133]===J?Y=e[134]:(Y=(0,o.jsx)(n,{className:`mb-3 block`,children:J}),e[133]=J,e[134]=Y);let St=t(`StateDispatcher/initial/limits/mutate`),X;e[135]===St?X=e[136]:(X=(0,o.jsx)(n,{className:`ml-8 mt-6 mb-2`,tag:`h3`,type:`subtitle`,children:St}),e[135]=St,e[136]=X);let Ct=t(`StateDispatcher/initial/limits/mutate_desc`),Z;e[137]===Ct?Z=e[138]:(Z=(0,o.jsx)(n,{className:`mb-3 block`,children:Ct}),e[137]=Ct,e[138]=Z);let wt=t(`StateDispatcher/initial/limits/middleware`),Q;e[139]===wt?Q=e[140]:(Q=(0,o.jsx)(n,{className:`ml-8 mt-6 mb-2`,tag:`h3`,type:`subtitle`,children:wt}),e[139]=wt,e[140]=Q);let Tt=t(`StateDispatcher/initial/limits/middleware_desc`),$;e[141]===Tt?$=e[142]:($=(0,o.jsx)(n,{className:`mb-3 block`,children:Tt}),e[141]=Tt,e[142]=$);let Et;return e[143]!==W||e[144]!==G||e[145]!==K||e[146]!==d||e[147]!==q||e[148]!==Y||e[149]!==X||e[150]!==Z||e[151]!==Q||e[152]!==$||e[153]!==f||e[154]!==p||e[155]!==m||e[156]!==h||e[157]!==_||e[158]!==v||e[159]!==y||e[160]!==x||e[161]!==S||e[162]!==c||e[163]!==C||e[164]!==T||e[165]!==D||e[166]!==O||e[167]!==A||e[168]!==u||e[169]!==M||e[170]!==P||e[171]!==I||e[172]!==L||e[173]!==z||e[174]!==B||e[175]!==V||e[176]!==H?(Et=(0,o.jsxs)(`section`,{className:ae.page,children:[oe,(0,o.jsxs)(`div`,{children:[c,u,le,ue,d,f,pe,p,m,h,_,v,y,x,Te,S,C,Ae,T,D,O,Ge,A,qe,Je,M,Qe,P,et,tt,I,L,at,z,B,V,H,W,G,K,q,Y,X,Z,Q,$]})]}),e[143]=W,e[144]=G,e[145]=K,e[146]=d,e[147]=q,e[148]=Y,e[149]=X,e[150]=Z,e[151]=Q,e[152]=$,e[153]=f,e[154]=p,e[155]=m,e[156]=h,e[157]=_,e[158]=v,e[159]=y,e[160]=x,e[161]=S,e[162]=c,e[163]=C,e[164]=T,e[165]=D,e[166]=O,e[167]=A,e[168]=u,e[169]=M,e[170]=P,e[171]=I,e[172]=L,e[173]=z,e[174]=B,e[175]=V,e[176]=H,e[177]=Et):Et=e[177],Et};export{s as default};