var LICENSE = 'html.js 1.4.2, ©2022 katsu-oh, MIT License: https://github.com/katsu-oh/html.js/blob/main/LICENSE';
export {HTML, E};

/*** (short) ***/
const _content = e => e.tagName == "TEMPLATE" ? e.content : e;
const _root = h => h._stack[0] || h._current;
const _js = t => t.replace(/[\\`$]/g, m => "\\" + m).replace(/\n/g, "\\n");
const _camel = n => n.replace(/-[a-z]/g, m => m[1].toUpperCase());
const _void = () => {};

/*** [Element Selector] ***/
const E = (...args) => args[0] && args[0].tagName ? args[0] : document.getElementById(_tagStr(args));

/*** [HTML Builder] ***/
const HTML = function(...args){
  const h = (...args) => h._call(...args);
  delete h.name;
  delete h.length;
  Object.setPrototypeOf(h, HTML.prototype);
  h._target = E(...args);
  h._stack = [];
  h._current = document.createElement("template");
  h.on = new _On;
  h.on._owner = h;
  h._publishEvents = [];
  h._call = _void;
  return h;
};
/*** tag-begin ***/
HTML.prototype.defineTag = function(name){
  Object.defineProperty(this, "$" + name, {configurable: true, enumerable: true,
    get(){
      this._stack.push(this._current);
      this._current = _content(this._current).appendChild(document.createElement(name));
      this._call = _void;
      return this;
    }
  });
};
"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BIG,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,COMMAND,DATA,DATALIST,DD,DEL,DETAILS,DFN,DIR,DIV,DL,DT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,MAIN,MAP,MARK,MENU,MENUITEM,META,METER,NAV,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PICTURE,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SLOT,SMALL,SOURCE,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR".split(",").forEach(name => HTML.prototype.defineTag(name));
/*** tag-end ***/
Object.defineProperty(HTML.prototype, "$", {configurable: true, enumerable: true,
  get(){
    if(this._stack[0]){
      this._current = this._stack.pop();
    }
    this._call = _void;
    return this;
  }
});
/*** attribute ***/
HTML.prototype.defineAttribute = function(name){
  Object.defineProperty(this, _camel(name), {configurable: true, enumerable: true,
    get(){
      this._current.setAttribute(name, "");
      this._call = (...args) => {
        if(args[0] === false){
          this._current.removeAttribute(name);
        }else if(args[0] !== true){
          this._current.setAttribute(name, _tagStr(args));
        }
        this._call = _void;
        return this;
      };
      return this;
    }
  });
};
"abbr,accept,accept-charset,accesskey,action,align,alink,allow,allowfullscreen,alt,archive,as,async,autocapitalize,autocomplete,autofocus,autoplay,axis,Background,bgcolor,Border,capture,cellpadding,cellspacing,char,charoff,charset,checked,cite,class,classid,Clear,code,codebase,codetype,Color,cols,colspan,compact,content,contenteditable,controls,coords,crossorigin,data,datetime,declare,decoding,default,defer,dir,dirname,disabled,download,draggable,enctype,enterkeyhint,face,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,frame,frameborder,headers,Height,hidden,high,href,hreflang,hspace,http-equiv,id,imagesizes,imagesrcset,inputmode,integrity,is,ismap,itemid,itemprop,itemref,itemscope,itemtype,kind,label,lang,language,link,list,loading,longdesc,loop,low,marginheight,marginwidth,max,maxlength,media,method,min,minlength,multiple,muted,name,nohref,nomodule,nonce,noresize,noshade,novalidate,nowrap,object,open,optimum,pattern,ping,placeholder,playsinline,poster,preload,profile,prompt,readonly,referrerpolicy,rel,required,rev,reversed,role,rows,rowspan,rules,sandbox,scheme,scope,scrolling,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,standby,start,step,style,summary,tabindex,target,text,title,translate,type,usemap,valign,value,valuetype,version,vlink,vspace,Width,wrap&activedescendant&atomic&autocomplete&busy&checked&colcount&colindex&colspan&controls&current&describedby&details&disabled&dropeffect&errormessage&expanded&flowto&grabbed&haspopup&hidden&invalid&keyshortcuts&label&labelledby&level&live&modal&multiline&multiselectable&orientation&owns&placeholder&posinset&pressed&readonly&relevant&required&roledescription&rowcount&rowindex&rowspan&selected&setsize&sort&valuemax&valuemin&valuenow&valuetext".replace(/&/g,",aria-").split(",").forEach(name => HTML.prototype.defineAttribute(name));
/*** data-* ***/
HTML.prototype.data_ = function(...args){
  if(args.length == 1 || _tagTest(args)){
    const name = _tagStr(args);
    return (...args) => {
      this._current.setAttribute("data-" + name, _tagStr(args));
      this._call = _void;
      return this;
    };
  }else{
    this._current.setAttribute("data-" + args[0], args[1]);
    this._call = _void;
    return this;
  }
};
/*** style ***/
HTML.prototype.defineStyle = function(name){
  this[_camel(name)] = function(...args){
    this._current.style.setProperty(name, _tagStr(args));
    this._call = _void;
    return this;
  };
};
"align-content,align-items,align-self,all,animation,animation-delay,animation-direction,animation-duration,animation-fill-mode,animation-iteration-count,animation-name,animation-play-state,animation-timing-function,azimuth,backface-visibility,background,background-attachment,background-clip,background-color,background-image,background-origin,background-position,background-repeat,background-size,border,border-bottom,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-style,border-bottom-width,border-collapse,border-color,border-image,border-image-outset,border-image-repeat,border-image-slice,border-image-source,border-image-width,border-left,border-left-color,border-left-style,border-left-width,border-radius,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-style,border-top,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,border-width,bottom,box-decoration-break,box-shadow,box-sizing,break-after,break-before,break-inside,caption-side,clear,clip,color,column-count,column-fill,column-gap,column-rule,column-rule-color,column-rule-style,column-rule-width,columns,column-span,column-width,Content,counter-increment,counter-reset,crop,cue,cue-after,cue-before,cursor,direction,display,elevation,empty-cells,fit,fit-position,flex,flex-basis,flex-direction,flex-flow,flex-grow,flex-shrink,flex-wrap,float,font,font-family,font-feature-settings,font-kerning,font-language-override,font-size,font-size-adjust,font-stretch,font-style,font-synthesis,font-variant,font-variant-alternates,font-variant-caps,font-variant-east-asian,font-variant-ligatures,font-variant-numeric,font-variant-position,font-weight,grid-cell,grid-column,grid-column-align,grid-columns,grid-column-sizing,grid-column-span,grid-flow,grid-row,grid-row-align,grid-rows,grid-row-sizing,grid-row-span,grid-template,hanging-punctuation,height,hyphens,icon,image-orientation,image-resolution,ime-mode,justify-content,left,letter-spacing,line-break,line-height,list-style,list-style-image,list-style-position,list-style-type,margin,margin-bottom,margin-left,margin-right,margin-top,marks,marquee-direction,marquee-play-count,marquee-speed,marquee-style,max-height,max-width,min-height,min-width,move-to,nav-down,nav-index,nav-left,nav-right,nav-up,object-fit,object-position,opacity,order,orphans,outline,outline-color,outline-offset,outline-style,outline-width,overflow,overflow-style,overflow-wrap,overflow-x,overflow-y,padding,padding-bottom,padding-left,padding-right,padding-top,page,page-break-after,page-break-before,page-break-inside,page-policy,pause,pause-after,pause-before,perspective,perspective-origin,pitch,pitch-range,play-during,position,quotes,resize,rest,rest-after,rest-before,richness,right,Size,speak,speak-as,speak-header,speak-numeral,speak-punctuation,speech-rate,stress,table-layout,tab-size,text-align,text-align-last,text-combine-horizontal,text-combine-mode,text-decoration,text-decoration-color,text-decoration-line,text-decoration-skip,text-decoration-style,text-emphasis,text-emphasis-color,text-emphasis-position,text-emphasis-style,text-indent,text-justify,text-orientation,text-overflow,text-shadow,text-transform,text-underline-position,top,transform,transform-origin,transform-style,transition,transition-delay,transition-duration,transition-property,transition-timing-function,unicode-bidi,vertical-align,visibility,voice-balance,voice-duration,voice-family,voice-pitch,voice-range,voice-rate,voice-stress,voice-volume,volume,white-space,widows,width,word-break,word-spacing,writing-mode,z-index".split(",").forEach(name => HTML.prototype.defineStyle(name));
/*** text ***/
HTML.prototype.T = function(...args){
  _content(this._current).append(_tagStr(args));
  this._call = _void;
  return this;
};
/*** html ***/
HTML.prototype.HTML = function(...args){
  let html = args[0];
  if(!html._publishEvents){
    (html = HTML())._current.innerHTML = _tagStr(args);
  }
  _content(this._current).appendChild(_root(html).content);
  this._publishEvents.push(...html._publishEvents);
  this._call = _void;
  return this;
};
/*** event ***/
const _On = function(){};
HTML.prototype.on = _On.prototype;
HTML.prototype.defineEvent = function(type){
  this.on[type] = function(listener, options){
    this._owner._current.addEventListener(type, listener, options);
    this._owner._call = _void;
    return this._owner;
  };
};
"abort,afterprint,afterscriptexecute,animationcancel,animationend,animationiteration,animationstart,appinstalled,auxclick,beforeinput,beforeprint,beforescriptexecute,beforeunload,blur,cancel,canplay,canplaythrough,change,click,close,compositionend,compositionstart,compositionupdate,contextmenu,copy,cuechange,cut,dblclick,devicemotion,deviceorientation,DOMActivate,DOMContentLoaded,DOMMouseScroll,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,enterpictureinpicture,error,focus,focusin,focusout,formdata,fullscreenchange,fullscreenerror,gamepadconnected,gamepaddisconnected,gotpointercapture,hashchange,input,invalid,keydown,keypress,keyup,languagechange,leavepictureinpicture,load,loadeddata,loadedmetadata,loadstart,lostpointercapture,message,messageerror,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,offline,online,orientationchange,overflow,pagehide,pageshow,paste,pause,play,playing,pointercancel,pointerdown,pointerenter,pointerleave,pointerlockchange,pointerlockerror,pointermove,pointerout,pointerover,pointerup,popstate,progress,ratechange,readystatechange,rejectionhandled,reset,resize,scroll,search,seeked,seeking,select,selectionchange,selectstart,show,slotchange,stalled,storage,submit,suspend,timeupdate,toggle,touchcancel,touchend,touchmove,touchstart,transitioncancel,transitionend,transitionrun,transitionstart,underflow,unhandledrejection,unload,visibilitychange,volumechange,waiting,webglcontextcreationerror,webglcontextlost,webglcontextrestored,wheel".split(",").forEach(type => HTML.prototype.defineEvent(type));
HTML.prototype.on.publish = function(listener, options){
  if(this._owner._stack[0]){
    this._owner._current.addEventListener("publish", listener, options);
    this._owner._publishEvents.push(this._owner._current);
  }
  this._owner._call = _void;
  return this._owner;
};
/*** publish ***/
HTML.prototype.publish = function(removeTarget){
  if(removeTarget){
    this._target.replaceWith(_root(this).content);
  }else{
    this._target.innerHTML = "";
    this._target.appendChild(_root(this).content);
  }
  new Set(this._publishEvents).forEach(e => e.dispatchEvent(new Event("publish")));
};
/*** to-html ***/
HTML.prototype.toString = function(){
  return _root(this).innerHTML;
};
/*** to-js ***/
function _code(sb, node, indent){
  for(const c of _content(node).childNodes){
    if(c.nodeType == 3){
      sb.push(c.textContent.split(/\n[ \t]*/g).map(text => text && `T\`${_js(text)}\`.`).join(indent));
    }else if(c.nodeType == 1){
      sb.push(`\$${c.tagName}.`);
      [...c.attributes].forEach(attr => sb.push(attr.name == "style" ? "" : attr.name.startsWith("data-") ? `data_\`${attr.name.slice(5)}\`\`${_js(attr.value)}\`.` : `${_camel((~",background,border,clear,color,height,width,".indexOf(`,${attr.name},`) ? "-" : "") + attr.name)}${attr.value && `\`${attr.value}\``}.`));
      [...c.style].forEach(name => sb.push(`${_camel(name)}\`${_js(c.style[name])}\`.`));
      _code(sb, c, indent + "  ");
      sb.push((sb.pop() + "$.").replace("  $", "$"));
    }
  }
  return sb;
}
HTML.prototype.toLocaleString = function(){
  return _code([], _root(this), "\n").join("");
};

/*** (template literal) ***/
const _tagFunc = args => {
  const r = [args[0][0]];
  for(let i = 1; i < args.length; i++){
    r.push(args[i], args[0][i]);
  }
  return r.join("");
};
const _tagTest = args => Array.isArray(args[0]) && args[0].length == args.length && Array.isArray(args[0].raw);
const _tagStr = args => _tagTest(args) ? _tagFunc(args) : args[0];
