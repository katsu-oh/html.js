var c = 'html.js 1.3.0, ©2022 katsu-oh, MIT License: https://github.com/katsu-oh/html.js/blob/main/LICENSE';
export {HTML, E};

/*** (short) ***/
const _content = e => e.tagName == "TEMPLATE" ? e.content : e;
const _root = h => h._stack[0] || h._current;
const _js = t => t.replace(/[\\`$]/g, m => "\\" + m).replace(/\n/g, "\\n");
const _camel = n => n.replace(/-[a-z]/g, m => m[1].toUpperCase());

/*** [Element Selector] ***/
const E = (...args) => args[0] && args[0].tagName ? args[0] : document.getElementById(_tagStr(args));

/*** [HTML Builder] ***/
const HTML = function(...args){
  if(!(this instanceof HTML)) return new HTML(...args);
  this._target = E(...args);
  this._stack = [];
  this._current = document.createElement("template");
  this.on = new _On();
  this.on._owner = this;
  this._publishEvents = [];
};
/*** tag-begin ***/
HTML.prototype.defineTag = function(name){
  Object.defineProperty(this, "$" + name, {configurable: true, enumerable: true,
    get(){
      const newElement = document.createElement(name);
      _content(this._current).appendChild(newElement);
      this._stack.push(this._current);
      this._current = newElement;
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
    return this;
  }
});
/*** attribute ***/
HTML.prototype.defineAttribute = function(name){
  this[_camel(name)] = function(...args){
    if(args[0] !== false){
      this._current.setAttribute(name, args[0] === true ? "" : _tagStr(args));
    }
    return this;
  };
};
"abbr,accept,accept-charset,accesskey,action,align,alink,allow,allowfullscreen,alt,archive,as,async,autocapitalize,autocomplete,autofocus,autoplay,axis,Background,bgcolor,Border,cellpadding,cellspacing,char,charoff,charset,checked,cite,class,classid,Clear,code,codebase,codetype,Color,cols,colspan,compact,content,contenteditable,controls,coords,crossorigin,data,datetime,declare,decoding,default,defer,dir,dirname,disabled,download,draggable,enctype,enterkeyhint,face,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,frame,frameborder,headers,Height,hidden,high,href,hreflang,hspace,http-equiv,id,imagesizes,imagesrcset,inputmode,integrity,is,ismap,itemid,itemprop,itemref,itemscope,itemtype,kind,label,lang,language,link,list,loading,longdesc,loop,low,marginheight,marginwidth,max,maxlength,media,method,min,minlength,multiple,muted,name,nohref,nomodule,nonce,noresize,noshade,novalidate,nowrap,object,open,optimum,pattern,ping,placeholder,playsinline,poster,preload,profile,prompt,readonly,referrerpolicy,rel,required,rev,reversed,rows,rowspan,rules,sandbox,scheme,scope,scrolling,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,standby,start,step,style,summary,tabindex,target,text,title,translate,type,usemap,valign,value,valuetype,version,vlink,vspace,Width,wrap&activedescendant&atomic&autocomplete&busy&checked&colcount&colindex&colspan&controls&current&describedby&details&disabled&dropeffect&errormessage&expanded&flowto&grabbed&haspopup&hidden&invalid&keyshortcuts&label&labelledby&level&live&modal&multiline&multiselectable&orientation&owns&placeholder&posinset&pressed&readonly&relevant&required&roledescription&rowcount&rowindex&rowspan&selected&setsize&sort&valuemax&valuemin&valuenow&valuetext".replace(/&/g,",aria-").split(",").forEach(name => HTML.prototype.defineAttribute(name));
/*** data-* ***/
HTML.prototype.data_ = function(...args){
  if(args.length == 1 || _tagTest(args)){
    const name = _tagStr(args);
    return (...args) => {
      this._current.setAttribute("data-" + name, _tagStr(args));
      return this;
    };
  }else{
    this._current.setAttribute("data-" + args[0], args[1]);
    return this;
  }
};
/*** style ***/
HTML.prototype.defineStyle = function(name){
  this[_camel(name)] = function(...args){
    this._current.style.setProperty(name, _tagStr(args));
    return this;
  };
};
"azimuth,background,background-attachment,background-color,background-image,background-position,background-repeat,border,border-bottom,border-bottom-color,border-bottom-style,border-bottom-width,border-collapse,border-color,border-left,border-left-color,border-left-style,border-left-width,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-style,border-top,border-top-color,border-top-style,border-top-width,border-width,bottom,caption-side,clear,clip,color,Content,counter-increment,counter-reset,cue,cue-after,cue-before,cursor,direction,display,elevation,empty-cells,float,font,font-family,font-size,font-style,font-variant,font-weight,height,left,letter-spacing,line-height,list-style,list-style-image,list-style-position,list-style-type,margin,margin-bottom,margin-left,margin-right,margin-top,max-height,max-width,min-height,min-width,orphans,outline,outline-color,outline-style,outline-width,overflow,padding,padding-bottom,padding-left,padding-right,padding-top,page-break-after,page-break-before,page-break-inside,pause,pause-after,pause-before,pitch,pitch-range,play-during,position,quotes,richness,right,speak,speak-header,speak-numeral,speak-punctuation,speech-rate,stress,table-layout,text-align,text-decoration,text-indent,text-transform,top,unicode-bidi,vertical-align,visibility,voice-family,volume,white-space,widows,width,word-spacing,z-index".split(",").forEach(name => HTML.prototype.defineStyle(name));
/*** text ***/
HTML.prototype.T = function(...args){
  _content(this._current).appendChild(document.createTextNode(_tagStr(args)));
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
  return this;
};
/*** event ***/
const _On = function(){};
HTML.prototype.on = _On.prototype;
HTML.prototype.defineEvent = function(type){
  this.on[type] = function(listener, options){
    this._owner._current.addEventListener(type, listener, options);
    return this._owner;
  };
};
"abort,afterprint,afterscriptexecute,animationcancel,animationend,animationiteration,animationstart,appinstalled,auxclick,beforeinput,beforeprint,beforescriptexecute,beforeunload,blur,cancel,canplay,canplaythrough,change,click,close,compositionend,compositionstart,compositionupdate,contextmenu,copy,cuechange,cut,dblclick,devicemotion,deviceorientation,DOMActivate,DOMContentLoaded,DOMMouseScroll,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,enterpictureinpicture,error,focus,focusin,focusout,formdata,fullscreenchange,fullscreenerror,gamepadconnected,gamepaddisconnected,gotpointercapture,hashchange,input,invalid,keydown,keypress,keyup,languagechange,leavepictureinpicture,load,loadeddata,loadedmetadata,loadstart,lostpointercapture,message,messageerror,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,offline,online,orientationchange,overflow,pagehide,pageshow,paste,pause,play,playing,pointercancel,pointerdown,pointerenter,pointerleave,pointerlockchange,pointerlockerror,pointermove,pointerout,pointerover,pointerup,popstate,progress,ratechange,readystatechange,rejectionhandled,reset,resize,scroll,search,seeked,seeking,select,selectionchange,selectstart,show,slotchange,stalled,storage,submit,suspend,timeupdate,toggle,touchcancel,touchend,touchmove,touchstart,transitioncancel,transitionend,transitionrun,transitionstart,underflow,unhandledrejection,unload,visibilitychange,volumechange,waiting,webglcontextcreationerror,webglcontextlost,webglcontextrestored,wheel".split(",").forEach(type => HTML.prototype.defineEvent(type));
HTML.prototype.on.publish = function(listener, options){
  if(this._owner._stack[0]){
    this._owner._current.addEventListener("publish", listener, options);
    this._owner._publishEvents.push(this._owner._current);
  }
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
/*** to-HTML ***/
HTML.prototype.toString = function(){
  return _root(this).innerHTML;
};
/*** to-JS ***/
function _code(sb, node, indent){
  for(const c of _content(node).childNodes){
    if(c.nodeType == 3){
      sb.push(c.textContent.split(/\n[ \t]*/g).map(text => text && `T\`${_js(text)}\`.`).join(indent));
    }else if(c.nodeType == 1){
      sb.push(`\$${c.tagName}.`);
      [...c.attributes].forEach(attr => sb.push(attr.name == "style" ? "" : attr.name.startsWith("data-") ? `data_\`${attr.name.slice(5)}\`\`${_js(attr.value)}\`.` : `${_camel((~",background,border,clear,color,height,width,".indexOf(`,${attr.name},`) ? "-" : "") + attr.name)}\`${_js(attr.value)}\`.`));
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
