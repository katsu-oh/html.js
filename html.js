/* html.js - 14.14 01-30 2022 */ 
export {HTML, E};

/*** [Element Selector] ***/
const E = (...args) => args[0] instanceof EventTarget ? args[0] : document.getElementById(_tagStr(args));

/*** [HTML Builder] ***/
const HTML = function(...args){
  if(!(this instanceof HTML)) return new HTML(...args);
  this._target = E(_tagStr(args));
  this._stack = [];
  this._current = document.createElement("template");
  this._onPublishElements = [];
};
/*** tag-begin ***/
for(const name of "A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BIG,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,COMMAND,DATA,DATALIST,DD,DEL,DETAILS,DFN,DIR,DIV,DL,DT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PICTURE,PLAINTEXT,PRE,PROGRESS,Q,RB,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP".split(",")){
  Object.defineProperty(HTML.prototype, "$" + name, {
    get(){
      const newElement = document.createElement(name);
      (this._current instanceof HTMLTemplateElement ? this._current.content : this._current).appendChild(newElement);
      this._stack.push(this._current);
      this._current = newElement;
      return this;
    }
  })
}
/*** tag-end ***/
Object.defineProperty(HTML.prototype, "$", {
  get(){
    if(this._stack.length > 0){
      this._current = this._stack.pop();
    }
    return this;
  }
});
/*** attribute ***/
for(const name of "abbr,accept,accept-charset,accesskey,action,align,alink,allow,allowfullscreen,alt,archive,as,async,autocapitalize,autocomplete,autofocus,autoplay,axis,Background,bgcolor,Border,cellpadding,cellspacing,char,charoff,charset,checked,cite,class,classid,Clear,code,codebase,codetype,Color,cols,colspan,compact,content,contenteditable,controls,coords,crossorigin,data,datetime,declare,decoding,default,defer,dir,dirname,disabled,download,draggable,enctype,enterkeyhint,face,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,frame,frameborder,headers,Height,hidden,high,href,hreflang,hspace,http-equiv,id,imagesizes,imagesrcset,inputmode,integrity,is,ismap,itemid,itemprop,itemref,itemscope,itemtype,kind,label,lang,language,link,list,loading,longdesc,loop,low,marginheight,marginwidth,max,maxlength,media,method,min,minlength,multiple,muted,name,nohref,nomodule,nonce,noresize,noshade,novalidate,nowrap,object,open,optimum,pattern,ping,placeholder,playsinline,poster,preload,profile,prompt,readonly,referrerpolicy,rel,required,rev,reversed,rows,rowspan,rules,sandbox,scheme,scope,scrolling,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,standby,start,step,style,summary,tabindex,target,text,title,translate,type,usemap,valign,value,valuetype,version,vlink,vspace,Width,wrap".split(",")){
  HTML.prototype[name.replace(/-[a-z]/g, m => m[1].toUpperCase())] = function(...args){
    this._current.setAttribute(name, _tagStr(args));
    return this;
  }
}
/*** data-* ***/
HTML.prototype.data_ = function(...args){
  if(args.length == 1 || _tagTest(args)){
    const name = _tagStr(args);
    return function(...args){
      this._current.setAttribute("data-" + name, _tagStr(args));
      return this;
    }.bind(this);
  }else{
    this._current.setAttribute("data-" + args[0], args[1]);
    return this;
  }
};
/*** style ***/
for(const name of "azimuth,background,background-attachment,background-color,background-image,background-position,background-repeat,border,border-bottom,border-bottom-color,border-bottom-style,border-bottom-width,border-collapse,border-color,border-left,border-left-color,border-left-style,border-left-width,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-style,border-top,border-top-color,border-top-style,border-top-width,border-width,bottom,caption-side,clear,clip,color,Content,counter-increment,counter-reset,cue,cue-after,cue-before,cursor,direction,display,elevation,empty-cells,float,font,font-family,font-size,font-style,font-variant,font-weight,height,left,letter-spacing,line-height,list-style,list-style-image,list-style-position,list-style-type,margin,margin-bottom,margin-left,margin-right,margin-top,max-height,max-width,min-height,min-width,orphans,outline,outline-color,outline-style,outline-width,overflow,padding,padding-bottom,padding-left,padding-right,padding-top,page-break-after,page-break-before,page-break-inside,pause,pause-after,pause-before,pitch,pitch-range,play-during,position,quotes,richness,right,speak,speak-header,speak-numeral,speak-punctuation,speech-rate,stress,table-layout,text-align,text-decoration,text-indent,text-transform,top,unicode-bidi,vertical-align,visibility,voice-family,volume,white-space,widows,width,word-spacing,z-index".split(",")){
  HTML.prototype[name.replace(/-[a-z]/g, m => m[1].toUpperCase())] = function(...args){
    this._current.style.setProperty(name, _tagStr(args));
    return this;
  }
}
/*** text ***/
HTML.prototype.T = function(...args){
  (this._current instanceof HTMLTemplateElement ? this._current.content : this._current).appendChild(document.createTextNode(_tagStr(args)));
  return this;
};
/*** html ***/
HTML.prototype.HTML = function(...args){
  const html = _tagStr(args);
  if(html._current instanceof EventTarget && Array.isArray(html._stack) && Array.isArray(html._onPublishElements)){
    (this._current instanceof HTMLTemplateElement ? this._current.content : this._current).appendChild((html._stack.length == 0 ? html._current : html._stack[0]).content);
    this._onPublishElements = this._onPublishElements.concat(html._onPublishElements)
  }else{
    if(this._current instanceof HTMLTemplateElement){
      this._current.innerHTML += html;
    }else{
      this._current.insertAdjacentHTML("beforeend", html);
    }
  }
  return this;
};
/*** event ***/
HTML.on = {};
for(const type of "abort,afterprint,afterscriptexecute,animationcancel,animationend,animationiteration,animationstart,appinstalled,auxclick,beforeinput,beforeprint,beforescriptexecute,beforeunload,blur,cancel,canplay,canplaythrough,change,click,close,compositionend,compositionstart,compositionupdate,contextmenu,copy,cuechange,cut,dblclick,devicemotion,deviceorientation,DOMActivate,DOMContentLoaded,DOMMouseScroll,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,enterpictureinpicture,error,focus,focusin,focusout,formdata,fullscreenchange,fullscreenerror,gamepadconnected,gamepaddisconnected,gotpointercapture,hashchange,input,invalid,keydown,keypress,keyup,languagechange,leavepictureinpicture,load,loadeddata,loadedmetadata,loadstart,lostpointercapture,message,messageerror,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,offline,online,orientationchange,overflow,pagehide,pageshow,paste,pause,play,playing,pointercancel,pointerdown,pointerenter,pointerleave,pointerlockchange,pointerlockerror,pointermove,pointerout,pointerover,pointerup,popstate,progress,ratechange,readystatechange,rejectionhandled,reset,resize,scroll,search,seeked,seeking,select,selectionchange,selectstart,show,slotchange,stalled,storage,submit,suspend,timeupdate,toggle,touchcancel,touchend,touchmove,touchstart,transitioncancel,transitionend,transitionrun,transitionstart,underflow,unhandledrejection,unload,visibilitychange,volumechange,waiting,webglcontextcreationerror,webglcontextlost,webglcontextrestored,wheel".split(",")){
  HTML.on[type] = function(listener, options){
    this.owner._current.addEventListener(type, listener, options);
    return this.owner;
  };
}
HTML.on.publish = function(listener, options){
  if(!(this.owner._current instanceof HTMLTemplateElement)){
    this.owner._current.addEventListener("publish", listener, options);
    this.owner._onPublishElements.push(this.owner._current);
  }
  return this.owner;
};
Object.defineProperty(HTML.prototype, "on", {
  get(){
    return Object.assign({owner: this}, HTML.on);
  }
});
/*** publish ***/
HTML.prototype.publish = function(removeTarget){
  if(removeTarget){
    this._target.replaceWith((this._stack.length > 0 ? this._stack[0] : this._current).content);
  }else{
    this._target.innerHTML = "";
    this._target.appendChild((this._stack.length > 0 ? this._stack[0] : this._current).content);
  }
  for(const element of this._onPublishElements){
    element.dispatchEvent(new Event("publish"));
  }
};
/*** toString ***/
HTML.prototype.toString = function(){
  return (this._stack.length > 0 ? this._stack[0] : this._current).innerHTML;
};

/*** (template literal) ***/
const _tagFunc = args => {
  const r = [args[0][0]];
  for(let i = 1; i < args.length; i++){
    r.push(args[i]);
    r.push(args[0][i]);
  }
  return r.join("");
};
const _tagTest = args => Array.isArray(args[0]) && args[0].length == args.length && typeof args[0][0] == "string";
const _tagStr = args => _tagTest(args) ? _tagFunc(args) : args[0];
