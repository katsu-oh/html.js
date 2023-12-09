var LICENSE = 'html.js 2.1.0, ©2022 katsu-oh, MIT License: https://github.com/katsu-oh/html.js/blob/main/LICENSE';
export {HTML, E};

/*** (short) ***/
const _content = e => e.tagName == "TEMPLATE" ? e.content : e;
const _camel = n => n.replace(/-[a-z]/g, m => m[1].toUpperCase());
const _getter = (obj, name, func) => Object.defineProperty(obj, name, {configurable: true, enumerable: true, get: func});

/*** (check definition) ***/
const _strict = target => new Proxy(target, {
  get(target, name, receiver){
    if(name in target || typeof name == "symbol"){
      return Reflect.get(target, name, receiver);
    }
    throw ReferenceError(name + " is not defined");
  },
  apply(target, thisArg, args){
    if(typeof target._call == "function"){
      return Reflect.apply(target._call, thisArg, args);
    }
    throw TypeError(target._call + " is not a function");
  }
});

/*** [Element Selector] ***/
const E = (...args) => args[0] && args[0].tagName ? args[0] : document.getElementById(_tagStr(args));

/*** [HTML Builder] ***/
const HTML = function(...args){
  const h = _strict(Object.setPrototypeOf(() => {}, HTML.prototype));
  h.s = _strict(Object.setPrototypeOf({_owner: h}, h.s));
  h.T = _strict(Object.setPrototypeOf(() => {}, h.T));
  h.on = _strict(Object.setPrototypeOf({_owner: h}, h.on));
  h.T._owner = h;
  delete h.name;
  delete h.length;
  delete h.T.name;
  delete h.T.length;
  h._target = E(...args);
  h._stack = [];
  h._current = document.createElement("template");
  h._publishEvents = [];
  h._call = "HTML()";
  return h;
};
/*** tag-begin ***/
HTML.prototype.defineTag = function(name){
  const js = "$" + name.replace(/-/g, "_");
  _getter(this, js, function(){
    this._stack.push(this._current);
    this._current = _content(this._current).appendChild(document.createElement(name));
    this._call = js;
    return this;
  });
};
"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BIG,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,COMMAND,DATA,DATALIST,DD,DEL,DETAILS,DFN,DIR,DIV,DL,DT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,MAIN,MAP,MARK,MENU,MENUITEM,META,METER,NAV,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PICTURE,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SLOT,SMALL,SOURCE,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR".split(",").forEach(name => HTML.prototype.defineTag(name));
/*** tag-end ***/
_getter(HTML.prototype, "$", function(){
  if(!this._stack[0]){
    throw SyntaxError("$ is unexpected");
  }
  this._current = this._stack.pop();
  this._call = "$";
  return this;
});
/*** attribute ***/
HTML.prototype.defineAttribute = function(name){
  const js = _camel(name);
  _getter(this, js, function(){
    this._current.setAttribute(name, "");
    this._call = (...args) => {
      if(args[0] === false){
        this._current.removeAttribute(name);
      }else if(args[0] !== true){
        this._current.setAttribute(name, _tagStr(args));
      }
      this._call = js + "()";
      return this;
    };
    return this;
  });
};
"abbr,accept,accept-charset,accesskey,action,align,alink,allow,allowfullscreen,alt,archive,as,async,autocapitalize,autocomplete,autofocus,autoplay,axis,background,bgcolor,border,capture,cellpadding,cellspacing,char,charoff,charset,checked,cite,class,classid,clear,code,codebase,codetype,color,cols,colspan,compact,content,contenteditable,controls,coords,crossorigin,data,datetime,declare,decoding,default,defer,dir,dirname,disabled,download,draggable,enctype,enterkeyhint,face,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,frame,frameborder,headers,height,hidden,high,href,hreflang,hspace,http-equiv,id,imagesizes,imagesrcset,inputmode,integrity,is,ismap,itemid,itemprop,itemref,itemscope,itemtype,kind,label,lang,language,link,list,loading,longdesc,loop,low,marginheight,marginwidth,max,maxlength,media,method,min,minlength,multiple,muted,name,nohref,nomodule,nonce,noresize,noshade,novalidate,nowrap,object,open,optimum,pattern,ping,placeholder,playsinline,poster,preload,profile,prompt,readonly,referrerpolicy,rel,required,rev,reversed,role,rows,rowspan,rules,sandbox,scheme,scope,scrolling,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,standby,start,step,style,summary,tabindex,target,text,title,translate,type,usemap,valign,value,valuetype,version,vlink,vspace,width,wrap&activedescendant&atomic&autocomplete&busy&checked&colcount&colindex&colspan&controls&current&describedby&details&disabled&dropeffect&errormessage&expanded&flowto&grabbed&haspopup&hidden&invalid&keyshortcuts&label&labelledby&level&live&modal&multiline&multiselectable&orientation&owns&placeholder&posinset&pressed&readonly&relevant&required&roledescription&rowcount&rowindex&rowspan&selected&setsize&sort&valuemax&valuemin&valuenow&valuetext".replace(/&/g,",aria-").split(",").forEach(name => HTML.prototype.defineAttribute(name));
/*** data-* ***/
HTML.prototype.data_ = function(...args){
  if(args.length == 1 || _tagTest(args)){
    const name = _tagStr(args);
    return (...args) => {
      this._current.setAttribute("data-" + name, _tagStr(args));
      this._call = "data_()()";
      return this;
    };
  }else{
    this._current.setAttribute("data-" + args[0], args[1]);
    this._call = "data_()";
    return this;
  }
};
/*** style ***/
HTML.prototype.s = {};
HTML.prototype.defineStyle = function(name){
  const js = _camel(name);
  this.s[js] = function(...args){
    this._owner._current.style.setProperty(name, _tagStr(args));
    this._owner._call = js + "()";
    return this._owner;
  };
};
"accent-color,align-content,align-items,align-self,align-tracks,all,animation,animation-delay,animation-direction,animation-duration,animation-fill-mode,animation-iteration-count,animation-name,animation-play-state,animation-timeline,animation-timing-function,appearance,aspect-ratio,azimuth,backdrop-filter,backface-visibility,background,background-attachment,background-blend-mode,background-clip,background-color,background-image,background-origin,background-position,background-position-x,background-position-y,background-repeat,background-size,block-size,border,border-block,border-block-color,border-block-end,border-block-end-color,border-block-end-style,border-block-end-width,border-block-start,border-block-start-color,border-block-start-style,border-block-start-width,border-block-style,border-block-width,border-bottom,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-style,border-bottom-width,border-collapse,border-color,border-end-end-radius,border-end-start-radius,border-image,border-image-outset,border-image-repeat,border-image-slice,border-image-source,border-image-width,border-inline,border-inline-color,border-inline-end,border-inline-end-color,border-inline-end-style,border-inline-end-width,border-inline-start,border-inline-start-color,border-inline-start-style,border-inline-start-width,border-inline-style,border-inline-width,border-left,border-left-color,border-left-style,border-left-width,border-radius,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-start-end-radius,border-start-start-radius,border-style,border-top,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,border-width,bottom,box-decoration-break,box-shadow,box-sizing,break-after,break-before,break-inside,caption-side,caret-color,clear,clip,clip-path,color,color-scheme,column-count,column-fill,column-gap,column-rule,column-rule-color,column-rule-style,column-rule-width,columns,column-span,column-width,contain,content,content-visibility,counter-increment,counter-reset,counter-set,crop,cue,cue-after,cue-before,cursor,direction,display,elevation,empty-cells,filter,fit,fit-position,flex,flex-basis,flex-direction,flex-flow,flex-grow,flex-shrink,flex-wrap,float,font,font-family,font-feature-settings,font-kerning,font-language-override,font-optical-sizing,font-size,font-size-adjust,font-stretch,font-style,font-synthesis,font-variant,font-variant-alternates,font-variant-caps,font-variant-east-asian,font-variant-ligatures,font-variant-numeric,font-variant-position,font-variation-settings,font-weight,forced-color-adjust,gap,grid,grid-area,grid-auto-columns,grid-auto-flow,grid-auto-rows,grid-cell,grid-column,grid-column-align,grid-column-end,grid-columns,grid-column-sizing,grid-column-span,grid-column-start,grid-flow,grid-row,grid-row-align,grid-row-end,grid-rows,grid-row-sizing,grid-row-span,grid-row-start,grid-template,grid-template-areas,grid-template-columns,grid-template-rows,hanging-punctuation,height,hyphenate-character,hyphens,icon,image-orientation,image-rendering,image-resolution,ime-mode,initial-letter,initial-letter-align,inline-size,inset,inset-block,inset-block-end,inset-block-start,inset-inline,inset-inline-end,inset-inline-start,isolation,justify-content,justify-items,justify-self,justify-tracks,left,letter-spacing,line-break,line-height,line-height-step,list-style,list-style-image,list-style-position,list-style-type,margin,margin-block,margin-block-end,margin-block-start,margin-bottom,margin-inline,margin-inline-end,margin-inline-start,margin-left,margin-right,margin-top,margin-trim,marks,marquee-direction,marquee-play-count,marquee-speed,marquee-style,mask,mask-border,mask-border-mode,mask-border-outset,mask-border-repeat,mask-border-slice,mask-border-source,mask-border-width,mask-clip,mask-composite,mask-image,mask-mode,mask-origin,mask-position,mask-repeat,mask-size,mask-type,masonry-auto-flow,max-block-size,max-height,max-inline-size,max-width,min-block-size,min-height,min-inline-size,min-width,mix-blend-mode,move-to,nav-down,nav-index,nav-left,nav-right,nav-up,object-fit,object-position,offset,offset-anchor,offset-distance,offset-path,offset-position,offset-rotate,opacity,order,orphans,outline,outline-color,outline-offset,outline-style,outline-width,overflow,overflow-anchor,overflow-block,overflow-clip-margin,overflow-inline,overflow-style,overflow-wrap,overflow-x,overflow-y,overscroll-behavior,overscroll-behavior-block,overscroll-behavior-inline,overscroll-behavior-x,overscroll-behavior-y,padding,padding-block,padding-block-end,padding-block-start,padding-bottom,padding-inline,padding-inline-end,padding-inline-start,padding-left,padding-right,padding-top,page,page-break-after,page-break-before,page-break-inside,page-policy,paint-order,pause,pause-after,pause-before,perspective,perspective-origin,pitch,pitch-range,place-content,place-items,place-self,play-during,pointer-events,position,print-color-adjust,quotes,resize,rest,rest-after,rest-before,revert,richness,right,rotate,row-gap,ruby-align,ruby-position,scale,scrollbar-color,scrollbar-gutter,scrollbar-width,scroll-behavior,scroll-margin,scroll-margin-block,scroll-margin-block-end,scroll-margin-block-start,scroll-margin-bottom,scroll-margin-inline,scroll-margin-inline-end,scroll-margin-inline-start,scroll-margin-left,scroll-margin-right,scroll-margin-top,scroll-padding,scroll-padding-block,scroll-padding-block-end,scroll-padding-block-start,scroll-padding-bottom,scroll-padding-inline,scroll-padding-inline-end,scroll-padding-inline-start,scroll-padding-left,scroll-padding-right,scroll-padding-top,scroll-snap-align,scroll-snap-stop,scroll-snap-type,shape-image-threshold,shape-margin,shape-outside,size,speak,speak-as,speak-header,speak-numeral,speak-punctuation,speech-rate,stress,table-layout,tab-size,text-align,text-align-last,text-combine-horizontal,text-combine-mode,text-combine-upright,text-decoration,text-decoration-color,text-decoration-line,text-decoration-skip,text-decoration-skip-ink,text-decoration-style,text-decoration-thickness,text-emphasis,text-emphasis-color,text-emphasis-position,text-emphasis-style,text-indent,text-justify,text-orientation,text-overflow,text-rendering,text-shadow,text-size-adjust,text-transform,text-underline-offset,text-underline-position,top,touch-action,transform,transform-box,transform-origin,transform-style,transition,transition-delay,transition-duration,transition-property,transition-timing-function,translate,unicode-bidi,user-select,vertical-align,visibility,voice-balance,voice-duration,voice-family,voice-pitch,voice-range,voice-rate,voice-stress,voice-volume,volume,white-space,widows,width,will-change,word-break,word-spacing,word-wrap,writing-mode,z-index".split(",").forEach(name => HTML.prototype.defineStyle(name));
/*** text ***/
HTML.prototype.T = {
  _call(...args){
    _content(this._current).append(_tagStr(args));
    this._call = "T()";
    return this;
  }
};
/*** character-reference ***/
const _temp = document.createElement("template");
HTML.prototype.defineReference = function(name){
  _getter(this.T, name, function(){
    _temp.innerHTML = `&${name};`;
    _content(this._owner._current).appendChild(_temp.content);
    this._owner._call = name;
    return this._owner;
  });
};
"Aacute,aacute,Abreve,abreve,ac,acd,acE,Acirc,acirc,acute,Acy,acy,AElig,aelig,af,Afr,afr,Agrave,agrave,alefsym,aleph,Alpha,alpha,Amacr,amacr,amalg,AMP,amp,And,and,andand,andd,andslope,andv,ang,ange,angle,angmsd,angmsdaa,angmsdab,angmsdac,angmsdad,angmsdae,angmsdaf,angmsdag,angmsdah,angrt,angrtvb,angrtvbd,angsph,angst,angzarr,Aogon,aogon,Aopf,aopf,ap,apacir,apE,ape,apid,apos,ApplyFunction,approx,approxeq,Aring,aring,Ascr,ascr,Assign,ast,asymp,asympeq,Atilde,atilde,Auml,auml,awconint,awint,backcong,backepsilon,backprime,backsim,backsimeq,Backslash,Barv,barvee,Barwed,barwed,barwedge,bbrk,bbrktbrk,bcong,Bcy,bcy,bdquo,becaus,Because,because,bemptyv,bepsi,bernou,Bernoullis,Beta,beta,beth,between,Bfr,bfr,bigcap,bigcirc,bigcup,bigodot,bigoplus,bigotimes,bigsqcup,bigstar,bigtriangledown,bigtriangleup,biguplus,bigvee,bigwedge,bkarow,blacklozenge,blacksquare,blacktriangle,blacktriangledown,blacktriangleleft,blacktriangleright,blank,blk12,blk14,blk34,block,bne,bnequiv,bNot,bnot,Bopf,bopf,bot,bottom,bowtie,boxbox,boxDL,boxDl,boxdL,boxdl,boxDR,boxDr,boxdR,boxdr,boxH,boxh,boxHD,boxHd,boxhD,boxhd,boxHU,boxHu,boxhU,boxhu,boxminus,boxplus,boxtimes,boxUL,boxUl,boxuL,boxul,boxUR,boxUr,boxuR,boxur,boxV,boxv,boxVH,boxVh,boxvH,boxvh,boxVL,boxVl,boxvL,boxvl,boxVR,boxVr,boxvR,boxvr,bprime,Breve,breve,brvbar,Bscr,bscr,bsemi,bsim,bsime,bsol,bsolb,bsolhsub,bull,bullet,bump,bumpE,bumpe,Bumpeq,bumpeq,Cacute,cacute,Cap,cap,capand,capbrcup,capcap,capcup,capdot,CapitalDifferentialD,caps,caret,caron,Cayleys,ccaps,Ccaron,ccaron,Ccedil,ccedil,Ccirc,ccirc,Cconint,ccups,ccupssm,Cdot,cdot,cedil,Cedilla,cemptyv,cent,CenterDot,centerdot,Cfr,cfr,CHcy,chcy,check,checkmark,Chi,chi,cir,circ,circeq,circlearrowleft,circlearrowright,circledast,circledcirc,circleddash,CircleDot,circledR,circledS,CircleMinus,CirclePlus,CircleTimes,cirE,cire,cirfnint,cirmid,cirscir,ClockwiseContourIntegral,CloseCurlyDoubleQuote,CloseCurlyQuote,clubs,clubsuit,Colon,colon,Colone,colone,coloneq,comma,commat,comp,compfn,complement,complexes,cong,congdot,Congruent,Conint,conint,ContourIntegral,Copf,copf,coprod,Coproduct,COPY,copy,copysr,CounterClockwiseContourIntegral,crarr,Cross,cross,Cscr,cscr,csub,csube,csup,csupe,ctdot,cudarrl,cudarrr,cuepr,cuesc,cularr,cularrp,Cup,cup,cupbrcap,CupCap,cupcap,cupcup,cupdot,cupor,cups,curarr,curarrm,curlyeqprec,curlyeqsucc,curlyvee,curlywedge,curren,curvearrowleft,curvearrowright,cuvee,cuwed,cwconint,cwint,cylcty,Dagger,dagger,daleth,Darr,dArr,darr,dash,Dashv,dashv,dbkarow,dblac,Dcaron,dcaron,Dcy,dcy,DD,dd,ddagger,ddarr,DDotrahd,ddotseq,deg,Del,Delta,delta,demptyv,dfisht,Dfr,dfr,dHar,dharl,dharr,DiacriticalAcute,DiacriticalDot,DiacriticalDoubleAcute,DiacriticalGrave,DiacriticalTilde,diam,Diamond,diamond,diamondsuit,diams,die,DifferentialD,digamma,disin,div,divide,divideontimes,divonx,DJcy,djcy,dlcorn,dlcrop,dollar,Dopf,dopf,Dot,dot,DotDot,doteq,doteqdot,DotEqual,dotminus,dotplus,dotsquare,doublebarwedge,DoubleContourIntegral,DoubleDot,DoubleDownArrow,DoubleLeftArrow,DoubleLeftRightArrow,DoubleLeftTee,DoubleLongLeftArrow,DoubleLongLeftRightArrow,DoubleLongRightArrow,DoubleRightArrow,DoubleRightTee,DoubleUpArrow,DoubleUpDownArrow,DoubleVerticalBar,DownArrow,Downarrow,downarrow,DownArrowBar,DownArrowUpArrow,DownBreve,downdownarrows,downharpoonleft,downharpoonright,DownLeftRightVector,DownLeftTeeVector,DownLeftVector,DownLeftVectorBar,DownRightTeeVector,DownRightVector,DownRightVectorBar,DownTee,DownTeeArrow,drbkarow,drcorn,drcrop,Dscr,dscr,DScy,dscy,dsol,Dstrok,dstrok,dtdot,dtri,dtrif,duarr,duhar,dwangle,DZcy,dzcy,dzigrarr,Eacute,eacute,easter,Ecaron,ecaron,ecir,Ecirc,ecirc,ecolon,Ecy,ecy,eDDot,Edot,eDot,edot,ee,efDot,Efr,efr,eg,Egrave,egrave,egs,egsdot,el,Element,elinters,ell,els,elsdot,Emacr,emacr,empty,emptyset,EmptySmallSquare,emptyv,EmptyVerySmallSquare,emsp,emsp13,emsp14,ENG,eng,ensp,Eogon,eogon,Eopf,eopf,epar,eparsl,eplus,epsi,Epsilon,epsilon,epsiv,eqcirc,eqcolon,eqsim,eqslantgtr,eqslantless,Equal,equals,EqualTilde,equest,Equilibrium,equiv,equivDD,eqvparsl,erarr,erDot,Escr,escr,esdot,Esim,esim,Eta,eta,ETH,eth,Euml,euml,euro,excl,exist,Exists,expectation,ExponentialE,exponentiale,fallingdotseq,Fcy,fcy,female,ffilig,fflig,ffllig,Ffr,ffr,filig,FilledSmallSquare,FilledVerySmallSquare,fjlig,flat,fllig,fltns,fnof,Fopf,fopf,ForAll,forall,fork,forkv,Fouriertrf,fpartint,frac12,frac13,frac14,frac15,frac16,frac18,frac23,frac25,frac34,frac35,frac38,frac45,frac56,frac58,frac78,frasl,frown,Fscr,fscr,gacute,Gamma,gamma,Gammad,gammad,gap,Gbreve,gbreve,Gcedil,Gcirc,gcirc,Gcy,gcy,Gdot,gdot,gE,ge,gEl,gel,geq,geqq,geqslant,ges,gescc,gesdot,gesdoto,gesdotol,gesl,gesles,Gfr,gfr,Gg,gg,ggg,gimel,GJcy,gjcy,gl,gla,glE,glj,gnap,gnapprox,gnE,gne,gneq,gneqq,gnsim,Gopf,gopf,grave,GreaterEqual,GreaterEqualLess,GreaterFullEqual,GreaterGreater,GreaterLess,GreaterSlantEqual,GreaterTilde,Gscr,gscr,gsim,gsime,gsiml,GT,Gt,gt,gtcc,gtcir,gtdot,gtlPar,gtquest,gtrapprox,gtrarr,gtrdot,gtreqless,gtreqqless,gtrless,gtrsim,gvertneqq,gvnE,Hacek,hairsp,half,hamilt,HARDcy,hardcy,hArr,harr,harrcir,harrw,Hat,hbar,Hcirc,hcirc,hearts,heartsuit,hellip,hercon,Hfr,hfr,HilbertSpace,hksearow,hkswarow,hoarr,homtht,hookleftarrow,hookrightarrow,Hopf,hopf,horbar,HorizontalLine,Hscr,hscr,hslash,Hstrok,hstrok,HumpDownHump,HumpEqual,hybull,hyphen,Iacute,iacute,ic,Icirc,icirc,Icy,icy,Idot,IEcy,iecy,iexcl,iff,Ifr,ifr,Igrave,igrave,ii,iiiint,iiint,iinfin,iiota,IJlig,ijlig,Im,Imacr,imacr,image,ImaginaryI,imagline,imagpart,imath,imof,imped,Implies,in,incare,infin,infintie,inodot,Int,int,intcal,integers,Integral,intercal,Intersection,intlarhk,intprod,InvisibleComma,InvisibleTimes,IOcy,iocy,Iogon,iogon,Iopf,iopf,Iota,iota,iprod,iquest,Iscr,iscr,isin,isindot,isinE,isins,isinsv,isinv,it,Itilde,itilde,Iukcy,iukcy,Iuml,iuml,Jcirc,jcirc,Jcy,jcy,Jfr,jfr,jmath,Jopf,jopf,Jscr,jscr,Jsercy,jsercy,Jukcy,jukcy,Kappa,kappa,kappav,Kcedil,kcedil,Kcy,kcy,Kfr,kfr,kgreen,KHcy,khcy,KJcy,kjcy,Kopf,kopf,Kscr,kscr,lAarr,Lacute,lacute,laemptyv,lagran,Lambda,lambda,Lang,lang,langd,langle,lap,Laplacetrf,laquo,Larr,lArr,larr,larrb,larrbfs,larrfs,larrhk,larrlp,larrpl,larrsim,larrtl,lat,lAtail,latail,late,lates,lBarr,lbarr,lbbrk,lbrace,lbrack,lbrke,lbrksld,lbrkslu,Lcaron,lcaron,Lcedil,lcedil,lceil,lcub,Lcy,lcy,ldca,ldquo,ldquor,ldrdhar,ldrushar,ldsh,lE,le,LeftAngleBracket,LeftArrow,Leftarrow,leftarrow,LeftArrowBar,LeftArrowRightArrow,leftarrowtail,LeftCeiling,LeftDoubleBracket,LeftDownTeeVector,LeftDownVector,LeftDownVectorBar,LeftFloor,leftharpoondown,leftharpoonup,leftleftarrows,LeftRightArrow,Leftrightarrow,leftrightarrow,leftrightarrows,leftrightharpoons,leftrightsquigarrow,LeftRightVector,LeftTee,LeftTeeArrow,LeftTeeVector,leftthreetimes,LeftTriangle,LeftTriangleBar,LeftTriangleEqual,LeftUpDownVector,LeftUpTeeVector,LeftUpVector,LeftUpVectorBar,LeftVector,LeftVectorBar,lEg,leg,leq,leqq,leqslant,les,lescc,lesdot,lesdoto,lesdotor,lesg,lesges,lessapprox,lessdot,lesseqgtr,lesseqqgtr,LessEqualGreater,LessFullEqual,LessGreater,lessgtr,LessLess,lesssim,LessSlantEqual,LessTilde,lfisht,lfloor,Lfr,lfr,lg,lgE,lHar,lhard,lharu,lharul,lhblk,LJcy,ljcy,Ll,ll,llarr,llcorner,Lleftarrow,llhard,lltri,Lmidot,lmidot,lmoust,lmoustache,lnap,lnapprox,lnE,lne,lneq,lneqq,lnsim,loang,loarr,lobrk,LongLeftArrow,Longleftarrow,longleftarrow,LongLeftRightArrow,Longleftrightarrow,longleftrightarrow,longmapsto,LongRightArrow,Longrightarrow,longrightarrow,looparrowleft,looparrowright,lopar,Lopf,lopf,loplus,lotimes,lowast,lowbar,LowerLeftArrow,LowerRightArrow,loz,lozenge,lozf,lpar,lparlt,lrarr,lrcorner,lrhar,lrhard,lrm,lrtri,lsaquo,Lscr,lscr,Lsh,lsh,lsim,lsime,lsimg,lsqb,lsquo,lsquor,Lstrok,lstrok,LT,Lt,lt,ltcc,ltcir,ltdot,lthree,ltimes,ltlarr,ltquest,ltri,ltrie,ltrif,ltrPar,lurdshar,luruhar,lvertneqq,lvnE,macr,male,malt,maltese,Map,map,mapsto,mapstodown,mapstoleft,mapstoup,marker,mcomma,Mcy,mcy,mdash,mDDot,measuredangle,MediumSpace,Mellintrf,Mfr,mfr,mho,micro,mid,midast,midcir,middot,minus,minusb,minusd,minusdu,MinusPlus,mlcp,mldr,mnplus,models,Mopf,mopf,mp,Mscr,mscr,mstpos,Mu,mu,multimap,mumap,nabla,Nacute,nacute,nang,nap,napE,napid,napos,napprox,natur,natural,naturals,nbsp,nbump,nbumpe,ncap,Ncaron,ncaron,Ncedil,ncedil,ncong,ncongdot,ncup,Ncy,ncy,ndash,ne,nearhk,neArr,nearr,nearrow,nedot,NegativeMediumSpace,NegativeThickSpace,NegativeThinSpace,NegativeVeryThinSpace,nequiv,nesear,nesim,NestedGreaterGreater,NestedLessLess,NewLine,nexist,nexists,Nfr,nfr,ngE,nge,ngeq,ngeqq,ngeqslant,nges,nGg,ngsim,nGt,ngt,ngtr,nGtv,nhArr,nharr,nhpar,ni,nis,nisd,niv,NJcy,njcy,nlArr,nlarr,nldr,nlE,nle,nLeftarrow,nleftarrow,nLeftrightarrow,nleftrightarrow,nleq,nleqq,nleqslant,nles,nless,nLl,nlsim,nLt,nlt,nltri,nltrie,nLtv,nmid,NoBreak,NonBreakingSpace,Nopf,nopf,Not,not,NotCongruent,NotCupCap,NotDoubleVerticalBar,NotElement,NotEqual,NotEqualTilde,NotExists,NotGreater,NotGreaterEqual,NotGreaterFullEqual,NotGreaterGreater,NotGreaterLess,NotGreaterSlantEqual,NotGreaterTilde,NotHumpDownHump,NotHumpEqual,notin,notindot,notinE,notinva,notinvb,notinvc,NotLeftTriangle,NotLeftTriangleBar,NotLeftTriangleEqual,NotLess,NotLessEqual,NotLessGreater,NotLessLess,NotLessSlantEqual,NotLessTilde,NotNestedGreaterGreater,NotNestedLessLess,notni,notniva,notnivb,notnivc,NotPrecedes,NotPrecedesEqual,NotPrecedesSlantEqual,NotReverseElement,NotRightTriangle,NotRightTriangleBar,NotRightTriangleEqual,NotSquareSubset,NotSquareSubsetEqual,NotSquareSuperset,NotSquareSupersetEqual,NotSubset,NotSubsetEqual,NotSucceeds,NotSucceedsEqual,NotSucceedsSlantEqual,NotSucceedsTilde,NotSuperset,NotSupersetEqual,NotTilde,NotTildeEqual,NotTildeFullEqual,NotTildeTilde,NotVerticalBar,npar,nparallel,nparsl,npart,npolint,npr,nprcue,npre,nprec,npreceq,nrArr,nrarr,nrarrc,nrarrw,nRightarrow,nrightarrow,nrtri,nrtrie,nsc,nsccue,nsce,Nscr,nscr,nshortmid,nshortparallel,nsim,nsime,nsimeq,nsmid,nspar,nsqsube,nsqsupe,nsub,nsubE,nsube,nsubset,nsubseteq,nsubseteqq,nsucc,nsucceq,nsup,nsupE,nsupe,nsupset,nsupseteq,nsupseteqq,ntgl,Ntilde,ntilde,ntlg,ntriangleleft,ntrianglelefteq,ntriangleright,ntrianglerighteq,Nu,nu,num,numero,numsp,nvap,nVDash,nVdash,nvDash,nvdash,nvge,nvgt,nvHarr,nvinfin,nvlArr,nvle,nvlt,nvltrie,nvrArr,nvrtrie,nvsim,nwarhk,nwArr,nwarr,nwarrow,nwnear,Oacute,oacute,oast,ocir,Ocirc,ocirc,Ocy,ocy,odash,Odblac,odblac,odiv,odot,odsold,OElig,oelig,ofcir,Ofr,ofr,ogon,Ograve,ograve,ogt,ohbar,ohm,oint,olarr,olcir,olcross,oline,olt,Omacr,omacr,Omega,omega,Omicron,omicron,omid,ominus,Oopf,oopf,opar,OpenCurlyDoubleQuote,OpenCurlyQuote,operp,oplus,Or,or,orarr,ord,order,orderof,ordf,ordm,origof,oror,orslope,orv,oS,Oscr,oscr,Oslash,oslash,osol,Otilde,otilde,Otimes,otimes,otimesas,Ouml,ouml,ovbar,OverBar,OverBrace,OverBracket,OverParenthesis,par,para,parallel,parsim,parsl,part,PartialD,Pcy,pcy,percnt,period,permil,perp,pertenk,Pfr,pfr,Phi,phi,phiv,phmmat,phone,Pi,pi,pitchfork,piv,planck,planckh,plankv,plus,plusacir,plusb,pluscir,plusdo,plusdu,pluse,PlusMinus,plusmn,plussim,plustwo,pm,Poincareplane,pointint,Popf,popf,pound,Pr,pr,prap,prcue,prE,pre,prec,precapprox,preccurlyeq,Precedes,PrecedesEqual,PrecedesSlantEqual,PrecedesTilde,preceq,precnapprox,precneqq,precnsim,precsim,Prime,prime,primes,prnap,prnE,prnsim,prod,Product,profalar,profline,profsurf,prop,Proportion,Proportional,propto,prsim,prurel,Pscr,pscr,Psi,psi,puncsp,Qfr,qfr,qint,Qopf,qopf,qprime,Qscr,qscr,quaternions,quatint,quest,questeq,QUOT,quot,rAarr,race,Racute,racute,radic,raemptyv,Rang,rang,rangd,range,rangle,raquo,Rarr,rArr,rarr,rarrap,rarrb,rarrbfs,rarrc,rarrfs,rarrhk,rarrlp,rarrpl,rarrsim,Rarrtl,rarrtl,rarrw,rAtail,ratail,ratio,rationals,RBarr,rBarr,rbarr,rbbrk,rbrace,rbrack,rbrke,rbrksld,rbrkslu,Rcaron,rcaron,Rcedil,rcedil,rceil,rcub,Rcy,rcy,rdca,rdldhar,rdquo,rdquor,rdsh,Re,real,realine,realpart,reals,rect,REG,reg,ReverseElement,ReverseEquilibrium,ReverseUpEquilibrium,rfisht,rfloor,Rfr,rfr,rHar,rhard,rharu,rharul,Rho,rho,rhov,RightAngleBracket,RightArrow,Rightarrow,rightarrow,RightArrowBar,RightArrowLeftArrow,rightarrowtail,RightCeiling,RightDoubleBracket,RightDownTeeVector,RightDownVector,RightDownVectorBar,RightFloor,rightharpoondown,rightharpoonup,rightleftarrows,rightleftharpoons,rightrightarrows,rightsquigarrow,RightTee,RightTeeArrow,RightTeeVector,rightthreetimes,RightTriangle,RightTriangleBar,RightTriangleEqual,RightUpDownVector,RightUpTeeVector,RightUpVector,RightUpVectorBar,RightVector,RightVectorBar,ring,risingdotseq,rlarr,rlhar,rlm,rmoust,rmoustache,rnmid,roang,roarr,robrk,ropar,Ropf,ropf,roplus,rotimes,RoundImplies,rpar,rpargt,rppolint,rrarr,Rrightarrow,rsaquo,Rscr,rscr,Rsh,rsh,rsqb,rsquo,rsquor,rthree,rtimes,rtri,rtrie,rtrif,rtriltri,RuleDelayed,ruluhar,rx,Sacute,sacute,sbquo,Sc,sc,scap,Scaron,scaron,sccue,scE,sce,Scedil,scedil,Scirc,scirc,scnap,scnE,scnsim,scpolint,scsim,Scy,scy,sdot,sdotb,sdote,searhk,seArr,searr,searrow,sect,semi,seswar,setminus,setmn,sext,Sfr,sfr,sfrown,sharp,SHCHcy,shchcy,SHcy,shcy,ShortDownArrow,ShortLeftArrow,shortmid,shortparallel,ShortRightArrow,ShortUpArrow,shy,Sigma,sigma,sigmaf,sigmav,sim,simdot,sime,simeq,simg,simgE,siml,simlE,simne,simplus,simrarr,slarr,SmallCircle,smallsetminus,smashp,smeparsl,smid,smile,smt,smte,smtes,SOFTcy,softcy,sol,solb,solbar,Sopf,sopf,spades,spadesuit,spar,sqcap,sqcaps,sqcup,sqcups,Sqrt,sqsub,sqsube,sqsubset,sqsubseteq,sqsup,sqsupe,sqsupset,sqsupseteq,squ,Square,square,SquareIntersection,SquareSubset,SquareSubsetEqual,SquareSuperset,SquareSupersetEqual,SquareUnion,squarf,squf,srarr,Sscr,sscr,ssetmn,ssmile,sstarf,Star,star,starf,straightepsilon,straightphi,strns,Sub,sub,subdot,subE,sube,subedot,submult,subnE,subne,subplus,subrarr,Subset,subset,subseteq,subseteqq,SubsetEqual,subsetneq,subsetneqq,subsim,subsub,subsup,succ,succapprox,succcurlyeq,Succeeds,SucceedsEqual,SucceedsSlantEqual,SucceedsTilde,succeq,succnapprox,succneqq,succnsim,succsim,SuchThat,Sum,sum,sung,Sup,sup,sup1,sup2,sup3,supdot,supdsub,supE,supe,supedot,Superset,SupersetEqual,suphsol,suphsub,suplarr,supmult,supnE,supne,supplus,Supset,supset,supseteq,supseteqq,supsetneq,supsetneqq,supsim,supsub,supsup,swarhk,swArr,swarr,swarrow,swnwar,szlig,Tab,target,Tau,tau,tbrk,Tcaron,tcaron,Tcedil,tcedil,Tcy,tcy,tdot,telrec,Tfr,tfr,there4,Therefore,therefore,Theta,theta,thetasym,thetav,thickapprox,thicksim,ThickSpace,thinsp,ThinSpace,thkap,thksim,THORN,thorn,Tilde,tilde,TildeEqual,TildeFullEqual,TildeTilde,times,timesb,timesbar,timesd,tint,toea,top,topbot,topcir,Topf,topf,topfork,tosa,tprime,TRADE,trade,triangle,triangledown,triangleleft,trianglelefteq,triangleq,triangleright,trianglerighteq,tridot,trie,triminus,TripleDot,triplus,trisb,tritime,trpezium,Tscr,tscr,TScy,tscy,TSHcy,tshcy,Tstrok,tstrok,twixt,twoheadleftarrow,twoheadrightarrow,Uacute,uacute,Uarr,uArr,uarr,Uarrocir,Ubrcy,ubrcy,Ubreve,ubreve,Ucirc,ucirc,Ucy,ucy,udarr,Udblac,udblac,udhar,ufisht,Ufr,ufr,Ugrave,ugrave,uHar,uharl,uharr,uhblk,ulcorn,ulcorner,ulcrop,ultri,Umacr,umacr,uml,UnderBar,UnderBrace,UnderBracket,UnderParenthesis,Union,UnionPlus,Uogon,uogon,Uopf,uopf,UpArrow,Uparrow,uparrow,UpArrowBar,UpArrowDownArrow,UpDownArrow,Updownarrow,updownarrow,UpEquilibrium,upharpoonleft,upharpoonright,uplus,UpperLeftArrow,UpperRightArrow,Upsi,upsi,upsih,Upsilon,upsilon,UpTee,UpTeeArrow,upuparrows,urcorn,urcorner,urcrop,Uring,uring,urtri,Uscr,uscr,utdot,Utilde,utilde,utri,utrif,uuarr,Uuml,uuml,uwangle,vangrt,varepsilon,varkappa,varnothing,varphi,varpi,varpropto,vArr,varr,varrho,varsigma,varsubsetneq,varsubsetneqq,varsupsetneq,varsupsetneqq,vartheta,vartriangleleft,vartriangleright,Vbar,vBar,vBarv,Vcy,vcy,VDash,Vdash,vDash,vdash,Vdashl,Vee,vee,veebar,veeeq,vellip,Verbar,verbar,Vert,vert,VerticalBar,VerticalLine,VerticalSeparator,VerticalTilde,VeryThinSpace,Vfr,vfr,vltri,vnsub,vnsup,Vopf,vopf,vprop,vrtri,Vscr,vscr,vsubnE,vsubne,vsupnE,vsupne,Vvdash,vzigzag,Wcirc,wcirc,wedbar,Wedge,wedge,wedgeq,weierp,Wfr,wfr,Wopf,wopf,wp,wr,wreath,Wscr,wscr,xcap,xcirc,xcup,xdtri,Xfr,xfr,xhArr,xharr,Xi,xi,xlArr,xlarr,xmap,xnis,xodot,Xopf,xopf,xoplus,xotime,xrArr,xrarr,Xscr,xscr,xsqcup,xuplus,xutri,xvee,xwedge,Yacute,yacute,YAcy,yacy,Ycirc,ycirc,Ycy,ycy,yen,Yfr,yfr,YIcy,yicy,Yopf,yopf,Yscr,yscr,YUcy,yucy,Yuml,yuml,Zacute,zacute,Zcaron,zcaron,Zcy,zcy,Zdot,zdot,zeetrf,ZeroWidthSpace,Zeta,zeta,Zfr,zfr,ZHcy,zhcy,zigrarr,Zopf,zopf,Zscr,zscr,zwj,zwnj".split(",").forEach(name => HTML.prototype.defineReference(name));
/*** html ***/
HTML.prototype.HTML = function(...args){
  let html = args[0];
  if(!html._publishEvents){
    (html = HTML())._current.innerHTML = _tagStr(args);
  }else if(html._stack[0]){
    throw SyntaxError("$ is missing");
  }
  _content(this._current).appendChild(html._current.content);
  this._publishEvents.push(...html._publishEvents);
  this._call = "HTML()";
  return this;
};
/*** event ***/
HTML.prototype.on = {};
HTML.prototype.defineEvent = function(type){
  const js = _camel(type);
  this.on[js] = function(listener, options){
    this._owner._current.addEventListener(type, listener, options);
    this._owner._call = js + "()";
    return this._owner;
  };
};
"abort,afterprint,afterscriptexecute,animationcancel,animationend,animationiteration,animationstart,appinstalled,auxclick,beforeinput,beforeprint,beforescriptexecute,beforeunload,blur,cancel,canplay,canplaythrough,change,click,close,compositionend,compositionstart,compositionupdate,contextmenu,copy,cuechange,cut,dblclick,devicemotion,deviceorientation,DOMActivate,DOMContentLoaded,DOMMouseScroll,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,enterpictureinpicture,error,focus,focusin,focusout,formdata,fullscreenchange,fullscreenerror,gamepadconnected,gamepaddisconnected,gotpointercapture,hashchange,input,invalid,keydown,keypress,keyup,languagechange,leavepictureinpicture,load,loadeddata,loadedmetadata,loadstart,lostpointercapture,message,messageerror,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,offline,online,orientationchange,overflow,pagehide,pageshow,paste,pause,play,playing,pointercancel,pointerdown,pointerenter,pointerleave,pointerlockchange,pointerlockerror,pointermove,pointerout,pointerover,pointerup,popstate,progress,ratechange,readystatechange,rejectionhandled,reset,resize,scroll,search,seeked,seeking,select,selectionchange,selectstart,show,slotchange,stalled,storage,submit,suspend,timeupdate,toggle,touchcancel,touchend,touchmove,touchstart,transitioncancel,transitionend,transitionrun,transitionstart,underflow,unhandledrejection,unload,visibilitychange,volumechange,waiting,webglcontextcreationerror,webglcontextlost,webglcontextrestored,wheel".split(",").forEach(type => HTML.prototype.defineEvent(type));
HTML.prototype.on.publish = function(listener, options){
  if(this._owner._stack[0]){
    this._owner._current.addEventListener("publish", listener, options);
    this._owner._publishEvents.push(this._owner._current);
  }
  this._owner._call = "publish()";
  return this._owner;
};
/*** publish ***/
HTML.prototype.publish = function(removeTarget){
  if(this._stack[0]){
    throw SyntaxError("$ is missing");
  }
  if(removeTarget){
    this._target.replaceWith(this._current.content);
  }else{
    this._target.innerHTML = "";
    this._target.appendChild(this._current.content);
  }
  new Set(this._publishEvents).forEach(e => e.dispatchEvent(new Event("publish")));
};
/*** to-html ***/
HTML.prototype.toString = function(){
  return this._current.innerHTML;
};
/*** to-js ***/
const _js = t => t.replace(/[\\`$]/g, m => "\\" + m).replace(/\n/g, "\\n");
function _code(sb, node, indent){
  for(const c of _content(node).childNodes){
    if(c.nodeType == 3){
      sb.push(c.textContent.split(/\n[ \t]*/g).map(text => text && `T\`${_js(text)}\`.`).join(indent));
    }else if(c.nodeType == 1){
      sb.push(`\$${c.tagName.replace(/-/g, "_")}.`);
      [...c.attributes].forEach(attr => sb.push(attr.name == "style" ? "" : attr.name.startsWith("data-") ? `data_\`${attr.name.slice(5)}\`\`${_js(attr.value)}\`.` : `${_camel(attr.name)}${attr.value && `\`${_js(attr.value)}\``}.`));
      [...c.style].forEach(name => sb.push(`s.${_camel(name)}\`${_js(c.style[name])}\`.`));
      _code(sb, c, indent + "  ");
      sb.push((sb.pop() + "$.").replace("  $", "$"));
    }
  }
  return sb;
}
HTML.prototype.toLocaleString = function(){
  return _code([], this._current, "\n").join("");
};

/*** (template literal) ***/
const _tagFunc = args => {
  let r = args[0][0];
  for(let i = 1; i < args.length; i++){
    r += args[i] + args[0][i];
  }
  return r;
};
const _tagTest = args => Array.isArray(args[0]) && args[0].length == args.length && Array.isArray(args[0].raw);
const _tagStr = args => _tagTest(args) ? _tagFunc(args) : args[0];
