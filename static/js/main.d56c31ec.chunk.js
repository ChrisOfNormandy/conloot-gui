(this["webpackJsonpconloot-gui"]=this["webpackJsonpconloot-gui"]||[]).push([[0],[,function(e,t){var n={position:{x:0,y:0,old:{x:0,y:0}},button:{state:!1,id:0,origin:{x:null,y:null}},displacement:function(){return{x:null===n.position.old.x?0:n.position.x-n.position.old.x,y:null===n.position.old.y?0:n.position.y-n.position.old.y}},getPosition:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return null===e?{x:n.position.x,y:n.position.y}:{x:n.position.x-e.x,y:n.position.y-e.y}},inBounds:!1,moving:!1,clicked:!1};e.exports=n},,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(2),a=n.n(r),o=n(16),i=n.n(o),s=(n(24),n(25),n(3)),c=n(7),l=n(6),u=n(5),d=n(4),h=n(10),b=n(1),p=n.n(b);function g(e){var t=Number(e).toString(16);return 1===t.length?"0".concat(t):t}function f(e){return parseInt(e,16)}function v(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return Number("0x".concat(g(e)).concat(g(t)).concat(g(n)).concat(null!==r?g(r):""))}function m(e){return v(e.r,e.g,e.b)}function y(e,t,n){return Math.floor(t*n+e*(1-n))}function x(e,t){return 0===e.a?t:0!==t.a&&t?{r:y(e.r,t.r,t.a/255),g:y(e.g,t.g,t.a/255),b:y(e.b,t.b,t.a/255),a:e.a+t.a>255?255:e.a+t.a}:e}var j=function e(t){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(Object(s.a)(this,e),this.visable=!0,this.opacity=255,this.pixels=[],this.clear=function(){n.pixels.forEach((function(e){return n.setPixel(e.x,e.y,null)}))},this.getPixel=function(e,t){return n.visable?n.pixels[t*n.resolution+e]?n.pixels[t*n.resolution+e]:null:{x:e,y:t,changed:n.pixels[t*n.resolution+e].changed,color:{r:0,g:0,b:0,a:0}}},this.toggle=function(){n.visable=!n.visable,n.editor.refresh=!0},this.updatePixel=function(e,t,r){var a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,i=n.getPixel(e,t);return null===i||i.changed&&!a?null:(null===o?(i.color=null===r?{r:0,g:0,b:0,a:0}:x(i.color,r),i.changed=!0):i.color.a=i.color.a/255*o,i)},this.setPixel=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return n.pixels[t*n.resolution+e]={color:null===r?{r:0,g:0,b:0,a:0}:r,x:e,y:t,changed:!1},n.pixels[t*n.resolution+e]},this.editor=t,this.resolution=t.resolution,null===r){var a=this.editor.layers.cache.map((function(e){return e.name}));if(a.length){var o=1;for(this.name="Layer ".concat(o);a.includes(this.name);)this.name="Layer ".concat(o),o++}else this.name="Layer 1"}else this.name=r;for(var i=0;i<t.resolution;i++)for(var c=0;c<t.resolution;c++)this.setPixel(i,c)};var O=h.c.shared,C=h.b,w={app:null,brush:{style:"pencil",fill:{r:0,g:0,b:0,a:255},size:1,mousePos:null,cursor:{position:{x:0,y:0,old:{x:0,y:0}},graphic:null,focus:null},getStyle:function(){return w.brush.style},setStyle:function(e){switch(e){case"eraser":w.brush.cursor.graphic.tint=16777215,w.brush.cursor.graphic.alpha=1;break;default:w.brush.cursor.graphic.tint=v(w.brush.fill.r,w.brush.fill.g,w.brush.fill.b),w.brush.cursor.graphic.alpha=w.brush.fill.a/255}w.brush.style=e},getColor:function(){return{r:w.brush.fill.r,g:w.brush.fill.g,b:w.brush.fill.b,a:w.brush.fill.a}},setColor:function(e){w.brush.cursor.graphic.tint=v(e.r,e.g,e.b),w.brush.cursor.graphic.alpha=e.a/255,w.brush.fill=e},getSize:function(){return w.brush.size},setSize:function(e){w.brush.size=e},updateCursor:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];w.brush.mousePos=p.a.getPosition(),w.brush.cursor.position.old.x=w.brush.cursor.position.x,w.brush.cursor.position.old.y=w.brush.cursor.position.y,w.brush.cursor.position.x=Math.floor((w.brush.mousePos.x-(w.brush.size-1)/2*w.scale)/w.scale),w.brush.cursor.position.y=Math.floor((w.brush.mousePos.y-(w.brush.size-1)/2*w.scale)/w.scale),w.brush.cursor.position.old.x===w.brush.cursor.position.x&&w.brush.cursor.position.old.y===w.brush.cursor.position.y||(w.brush.cursor.graphic.x=w.brush.cursor.position.x*w.scale,w.brush.cursor.graphic.y=w.brush.cursor.position.y*w.scale),t&&(w.brush.cursor.graphic.width=w.scale*w.brush.size,w.brush.cursor.graphic.height=w.scale*w.brush.size),e&&(w.brush.cursor.graphic.tint=v(w.brush.fill.r,w.brush.fill.g,w.brush.fill.b),w.brush.cursor.graphic.alpha=w.brush.fill.a/255)}},background:[],resolution:0,width:0,height:0,scale:0,debug:{enabled:!0,element:document.getElementById("debug")},pixels:[],layers:{cache:[],active:0,get:function(e){return w.layers.cache[e]},getActive:function(){return w.layers.cache[w.layers.active]},add:function(){var e=w.layers.cache.length;w.layers.cache.push(new j(_)),w.layers.active=e},remove:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:-1;return w.layers.cache.splice(e,1),w.layers.reload(),w.layers},move:function(e,t){var n=w.layers.cache.splice(e,1)[0];w.layers.cache.splice(t,0,n),w.layers.reload()},clear:function(){w.layers.cache=[]},toggle:function(e){w.layers.cache[e].visable=!w.layers.cache[e].visable,w.layers.reload()},reload:function(){w.refresh=!0}},buffer:[],showGrid:!1,refresh:!1,doBoundUpdate:!0,bounds:null,updateBounds:function(){w.bounds=w.app.view.getBoundingClientRect(),w.doBoundUpdate=!1},startup:function(){return w.onReady((function(){return w.app.ticker.add((function(){return w.draw()}))})),w.app.view},onReady:function(e){console.log("App ready. Loading."),O.load(e)},clear:function(){w.layers.cache.forEach((function(e){return e.clear()})),w.refresh=!0},updateDebug:function(){var e=p.a.getPosition(),t=Math.floor(e.x/w.scale),n=Math.floor(e.y/w.scale),r=w.pixels[n*w.resolution+t];r&&(w.debug.element.innerHTML="Mouse: ".concat(JSON.stringify(e)," --\x3e ").concat(t,", ").concat(n,"<br />")+"Brush:<br />"+" - Color: ".concat(JSON.stringify(w.brush.fill),"<br />")+" - Pos: ".concat(w.brush.cursor.position.x,", ").concat(w.brush.cursor.position.y," --\x3e ").concat(w.brush.cursor.position.x+w.brush.size-1,", ").concat(w.brush.cursor.position.y+w.brush.size-1,"<br />")+" - Hex: 0x".concat(g(w.brush.fill.r)).concat(g(w.brush.fill.g)).concat(g(w.brush.fill.b),"<br />")+" - Style: ".concat(w.brush.style,"<br />")+"Buffer: ".concat(w.buffer.length,"<br />")+"Hover: ".concat(JSON.stringify(r.color),"<br />")+" - Tint:".concat(r.graphic.tint,"<br />")+" - Alpha: ".concat(r.graphic.alpha))},updatePixel:function(e,t){w.pixels[t*w.resolution+e]||w.setPixel(e,t);var n=null;w.layers.cache.forEach((function(r){if(r.visable){var a=r.getPixel(e,t).color;0!==a.a&&(n=null===n?a:x(a,n))}})),w.pixels[t*w.resolution+e].color=n||{r:0,g:0,b:0,a:0},w.pixels[t*w.resolution+e].graphic.tint=m(w.pixels[t*w.resolution+e].color),w.pixels[t*w.resolution+e].graphic.alpha=w.pixels[t*w.resolution+e].color.a/255},draw:function(){if(null!==w.debug.element){if(w.debug.enabled?(w.debug.element.classList.contains("hidden")&&w.debug.element.classList.remove("hidden"),w.updateDebug()):w.debug.element.classList.contains("hidden")||w.debug.element.classList.add("hidden"),w.refresh)return w.pixels.forEach((function(e){w.updatePixel(e.x,e.y),w.app.stage.removeChild(e.graphic),w.app.stage.addChild(e.graphic)})),w.app.stage.removeChild(w.brush.cursor.graphic),w.app.stage.addChild(w.brush.cursor.graphic),void(w.refresh=!1);w.buffer.forEach((function(e,t){w.updatePixel(e.x,e.y),e.changed?p.a.button.state||(e.changed=!1):w.buffer.splice(t,1)})),w.brush.updateCursor();var e,t,n,r,a,o,i=w.layers.getActive();if(i&&p.a.button.state&&0===p.a.button.id)for(var s=w.brush.cursor.position.x<0?0:w.brush.cursor.position.x;s<w.brush.cursor.position.x+w.brush.size&&s<w.resolution;s++)for(var c=w.brush.cursor.position.y<0?0:w.brush.cursor.position.y;c<w.brush.cursor.position.y+w.brush.size&&c<w.resolution;c++){switch(w.brush.style){case"paint":(t=w.brush.getColor()).a=w.brush.fill.a/255*Math.floor(255*(1-(a={x:w.brush.cursor.position.x+Math.floor(w.brush.size/2),y:w.brush.cursor.position.y+Math.floor(w.brush.size/2)},o={x:s,y:c},(Math.abs(o.x-a.x)+Math.abs(o.y-a.y))/Math.round(w.brush.size/2)))),t.a<0&&(t.a=0),n=w.brush.cursor.position.old.x!==w.brush.cursor.position.x||w.brush.cursor.position.old.y!==w.brush.cursor.position.y,r=null;break;case"eraser":t=null,n=w.brush.cursor.position.old.x!==w.brush.cursor.position.x||w.brush.cursor.position.old.y!==w.brush.cursor.position.y,r=0;break;default:t=w.brush.getColor(),n=!1,r=null}null!==(e=i.updatePixel(s,c,t,n,r))&&w.buffer.push(e)}p.a.inBounds||(p.a.button.state=!1),p.a.clicked=!1}else w.debug.element=document.getElementById("debug")},compose:function(){var e=document.createElement("canvas"),t=e.getContext("2d");e.width=w.resolution,e.height=w.resolution;for(var n,r=t.createImageData(w.resolution,w.resolution),a=0;a<w.resolution;a++)for(var o=0;o<w.resolution;o++){var i=4*(o*w.resolution+a);n=w.getPixel(a,o).color,r.data[i]=n.r,r.data[i+1]=n.g,r.data[i+2]=n.b,r.data[i+3]=n.a}t.putImageData(r,0,0);var s=e.toDataURL("image/png"),c=document.createElement("a");c.href=s;var l=document.getElementById("image_name").value;c.setAttribute("download","".concat(l||"texture",".png")),c.click()},setPixel:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return w.pixels[t*w.resolution+e]={graphic:new C,color:null===n?{r:0,g:0,b:0,a:0}:n,changed:!1,x:e,y:t},w.pixels[t*w.resolution+e].graphic.beginFill(16777215),w.pixels[t*w.resolution+e].graphic.drawRect(0,0,w.scale,w.scale),w.pixels[t*w.resolution+e].graphic.endFill(),w.pixels[t*w.resolution+e].graphic.tint=m(w.pixels[t*w.resolution+e].color),w.pixels[t*w.resolution+e].graphic.alpha=w.pixels[t*w.resolution+e].color.a/255,w.pixels[t*w.resolution+e].graphic.x=e*w.scale,w.pixels[t*w.resolution+e].graphic.y=t*w.scale,w.pixels[t*w.resolution+e]},create:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:16;if(null!==w.app)for(;w.app.stage.children[0];)w.app.stage.removeChild(w.app.stage.children[0]);w.app=e,w.resolution=t,w.width=e.view.width,w.height=e.view.height,w.scale=w.width/w.resolution,w.pixels=[],w.layers.clear(),w.layers.add(),w.brush.cursor.graphic=new C,w.brush.cursor.graphic.beginFill(16777215),w.brush.cursor.graphic.drawRect(-1,-1,w.scale+3,w.scale+3),w.brush.cursor.graphic.endFill(),w.brush.updateCursor(!0,!0);for(var n=w.layers.get(w.layers.active),r=0;r<w.resolution;r++)for(var a=0;a<w.resolution;a++)w.background[a*w.resolution+r]=new C,w.background[a*w.resolution+r].beginFill(16777215),w.background[a*w.resolution+r].drawRect(0,0,w.scale,w.scale),w.background[a*w.resolution+r].endFill(),w.background[a*w.resolution+r].tint=r%2===0&&a%2===1||r%2===1&&a%2===0?16777215:14540253,w.background[a*w.resolution+r].x=r*w.scale,w.background[a*w.resolution+r].y=a*w.scale,w.app.stage.addChild(w.background[a*w.resolution+r]),w.app.stage.addChild(w.setPixel(r,a).graphic),n.setPixel(r,a,w.pixels[a*w.resolution+r].color);return w.app.stage.addChild(w.brush.cursor.graphic),w}},_=w,k=n(0);var N=function(e){return Object(k.jsx)("div",{id:e.id,className:"menu".concat(e.hidden?" hidden":""),children:e.content.map((function(e,t){return Object(k.jsx)("div",{className:"menu-item",children:e},t)}))})},B=(n(36),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).content=[{key:"File",id:"file_menu",value:Object(k.jsx)(N,{content:[Object(k.jsx)("div",{className:"menu-button",onClick:function(){return r.editor.compose()},children:"Download"}),Object(k.jsx)("div",{className:"menu-break"}),Object(k.jsxs)("div",{className:"menu-button",children:[Object(k.jsx)("label",{id:"debug_check_label",htmlFor:"debug-check",children:"Debug"}),Object(k.jsx)("input",{name:"debug-check",type:"checkbox",onChange:function(e){r.editor.debug=e.target.checked}})]})],id:"file_menu",hidden:!0})},{key:"Edit",id:"edit_menu",value:Object(k.jsx)(N,{content:[Object(k.jsx)("div",{className:"menu-button",onClick:function(){return r.editor.clear()},children:"Clear"})],id:"edit_menu",hidden:!0})},{key:"View",id:"view_menu",value:Object(k.jsx)(N,{content:[Object(k.jsx)("div",{className:"menu-button",onClick:function(){r.editor.showGrid=!r.editor.showGrid,r.editor.refresh=!0},children:"Toggle Grid"})],id:"view_menu",hidden:!0})}],r.componentDidMount=function(){var e=[];r.content.forEach((function(t){return e.push(document.getElementById(t.id))})),document.addEventListener("click",(function(t){e.forEach((function(e){e.parentElement.contains(t.target)||e.classList.add("hidden")}))}))},r.render=function(){return Object(k.jsx)("div",{className:"texture-editor-ribbon",children:r.content.map((function(e){return Object(k.jsxs)("div",{className:"ribbon-menu",children:[Object(k.jsx)("div",{className:"ribbon-menu-button",onClick:function(){document.getElementById(e.id).classList.toggle("hidden")},children:e.key}),e.value]},e.key)}))})},r.editor=e.editor,r.setResolution=r.setResolution.bind(Object(l.a)(r)),r}return Object(c.a)(n,[{key:"setResolution",value:function(e){e.preventDefault();var t=Number(document.getElementById("resolution_input").value);isNaN(t)||t%16===0&&t>0&&t<=128&&(this.editor=this.editor.create(this.editor.app,t))}}]),n}(a.a.Component)),E=(n(37),n.p+"static/media/pencil.34dc5e45.svg"),L=n.p+"static/media/paintbrush.3b3671d0.svg",P=n.p+"static/media/eraser.4da23591.svg",I=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).brushes=[{key:"pencil",icon:E},{key:"paint",icon:L},{key:"eraser",icon:P}],r.render=function(){return Object(k.jsx)("div",{className:"brushes-container",children:r.brushes.map((function(e){return Object(k.jsx)("img",{src:e.icon,className:"brush-icon",id:"".concat(e.key,"_brush"),alt:e.key,onClick:function(){return r.brush.setBrush(e.key)}},e.key)}))})},r.brush=e.brush,r}return n}(a.a.Component);n(38),n(39);var M=function(e){if(null===e)return console.error("Collapsable div was null.");e.style.maxHeight=e.style.maxHeight?null:e.scrollHeight+"px"},D=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r,a=this;return Object(s.a)(this,n),(r=t.call(this,e)).state={content:null,id:"collapsable_container"},r.render=function(){return Object(k.jsxs)("div",{className:"collapsable-container-wrapper",onLoad:function(){var e=document.getElementById(r.state.id);e.style.maxHeight=e.scrollHeight+"px"},children:[Object(k.jsx)("div",{className:"collapsable-container-group container-group",id:r.state.id,children:Object(k.jsx)(a.state.content,{})}),Object(k.jsx)("div",{className:"collapsable-container-group-trigger",onClick:function(){M(r.container)}})]})},r.state.id=e.id,r.state.content=e.content,r}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.container=document.getElementById(this.state.id)}}]),n}(a.a.Component),S=(n(40),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).state={brush:null},r.previewElem=null,r.container=null,r.updatePreview=function(){var e=r.state.brush.getColor();r.previewElem.style.backgroundColor="rgba(".concat(e.r,", ").concat(e.g,", ").concat(e.b,", ").concat(e.a/255,")")},r.updateHex=function(){var e=function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return"".concat(g(e)).concat(g(t)).concat(g(n)).concat(null!==r?g(r):"")}(document.getElementById("rgb_r").value,document.getElementById("rgb_g").value,document.getElementById("rgb_b").value,document.getElementById("rgb_a").value);document.getElementById("hex").value=e},r.fetchDisplayColor=function(){return{r:document.getElementById("rgb_r").value,g:document.getElementById("rgb_g").value,b:document.getElementById("rgb_b").value,a:document.getElementById("rgb_a").value}},r.refresh=function(){r.previewElem=document.getElementById("color_picker_preview"),r.container=document.getElementById("color_picker_controls_container")},r.rgbControls=function(){return Object(k.jsxs)("div",{className:"rgb-container-wrapper",children:[["r","g","b","a"].map((function(e){return Object(k.jsxs)("div",{className:"rgb-input-container",children:[Object(k.jsx)("div",{htmlFor:"rgb_".concat(e),className:"rgb-input-label",children:e.toUpperCase()}),Object(k.jsx)("input",{name:"rgb_".concat(e,"_slider"),type:"range",min:"0",max:"255",className:"rgb-input-slider",onChange:function(t){document.getElementById("rgb_".concat(e)).value=t.target.value,r.updateColor(r.fetchDisplayColor()),r.updatePreview(),r.updateHex()},defaultValue:"a"===e?255:0},"".concat(e,"_slider")),Object(k.jsx)("input",{name:"rgb_".concat(e),id:"rgb_".concat(e),type:"text",className:"rgb-input-field",placeholder:"0",onChange:function(e){r.updateColor(r.fetchDisplayColor()),r.updatePreview(),r.updateHex()},onKeyPress:function(e){e.key.match(/[0-9]/)||e.preventDefault()},defaultValue:"a"===e?255:""},e)]},"rgb_".concat(e,"_div"))})),Object(k.jsx)("input",{name:"hex",id:"hex",type:"text",className:"hex-input-field",placeholder:"000000ff",onChange:function(e){var t=function(e){switch(e.length){case 0:return{r:0,g:0,b:0,a:255};case 1:return{r:f(e),g:f(e),b:f(e),a:255};case 3:var t=e.split("");return{r:f("".concat(t[0]+t[0])),g:f("".concat(t[1]+t[1])),b:f("".concat(t[2]+t[2])),a:255};case 4:var n=e.split("");return{r:f("".concat(n[0]+n[0])),g:f("".concat(n[1]+n[1])),b:f("".concat(n[2]+n[2])),a:f("".concat(n[3]+n[3]))};case 6:var r=e.split("");return{r:f("".concat(r[0]+r[1])),g:f("".concat(r[2]+r[3])),b:f("".concat(r[4]+r[5]))};case 8:var a=e.split("");return{r:f("".concat(a[0]+a[1])),g:f("".concat(a[2]+a[3])),b:f("".concat(a[4]+a[5])),a:f("".concat(a[6]+a[7]))};default:return{r:0,g:0,b:0,a:255}}}(e.target.value);for(var n in t)document.getElementById("rgb_".concat(n)).value=t[n];r.updateColor(r.fetchDisplayColor()),r.updatePreview()},onKeyPress:function(e){(!e.key.match(/[0-9A-Fa-f]/)||e.target.value.length>=8)&&e.preventDefault()},defaultValue:"000000ff"})]})},r.render=function(){return Object(k.jsxs)("div",{className:"side-bar-group",children:[Object(k.jsxs)("div",{className:"container-group",id:"color_picker_preview_container",children:[Object(k.jsx)("div",{className:"color-picker-preview",id:"color_picker_preview"}),Object(k.jsx)("div",{className:"brush-size-preview",id:"brush_size_preview"}),Object(k.jsx)("input",{className:"brush-size-input",id:"brush_size_input",type:"text",defaultValue:1,onChange:function(e){r.state.brush.setSize(Number(e.target.value))},onKeyPress:function(e){null===e.key.match(/[0-9]/)&&e.preventDefault()}})]}),Object(k.jsx)(D,{id:"color_picker_container",content:r.rgbControls})]})},r.state.brush=e.brush,r.updateColor=e.updateColor.bind(Object(l.a)(r)),r.fetchDisplayColor=r.fetchDisplayColor.bind(Object(l.a)(r)),r}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.refresh(),this.updatePreview()}}]),n}(a.a.Component)),z=n.p+"static/media/eye-open.157d1f69.svg",A=n.p+"static/media/minus.e3517047.svg",R=(n(41),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).state={layers:null},r.container=null,r.updateActiveLayer=function(e){var t=r.state;t.layers.active=e;for(var n=t.layers.cache.length-1;n>=0;)n!==e?document.getElementById("layer_".concat(n)).classList.remove("layer-item-selected"):document.getElementById("layer_".concat(n)).classList.add("layer-item-selected"),n--;r.setState(t)},r.updateLayerViewable=function(e){var t=r.state;t.layers.get(e).toggle(),document.getElementById("layer_".concat(e,"_viewable")).classList.toggle("layer-item-viewable"),r.setState(t)},r.layerMovementButtons=function(e,t){return Object(k.jsxs)("div",{className:"layer-item-movement-group",children:[Object(k.jsx)("div",{id:"layer_item_move_up",className:"layer-item-movement-button".concat(0===e?" hidden":""),onClick:function(){var t=r.state;t.layers.move(e,e-1),r.setState(t),r.updateActiveLayer(e-1)},children:"/\\"}),Object(k.jsx)("div",{id:"layer_item_move_down",className:"layer-item-movement-button".concat(e===t?" hidden":""),onClick:function(){var t=r.state;t.layers.move(e,e+1),r.setState(t),r.updateActiveLayer(e+1)},children:"\\/"})]})},r.refresh=function(){r.container=document.getElementById("layers_controls_container")},r.layerControls=function(){return Object(k.jsxs)("div",{children:[r.state.layers.cache.map((function(e,t){return Object(k.jsxs)("div",{className:"layer-item".concat(t===r.state.layers.active?" layer-item-selected":""),id:"layer_".concat(t),onClick:function(e){e.target.childNodes>0&&r.updateActiveLayer(t)},children:[r.layerMovementButtons(t,r.state.layers.cache.length-1),Object(k.jsx)("input",{type:"text",className:"layer-item-title",placeholder:"Layer ".concat(t+1),value:e.name,onChange:function(e){var n=r.state;n.layers.get(t).name=e.target.value,r.setState(n)}}),Object(k.jsx)("img",{src:z,alt:"Hide",className:"layer-item-button",id:"layer_".concat(t,"_viewable"),onClick:function(){r.updateLayerViewable(t)}}),Object(k.jsx)("img",{src:A,alt:"Remove",className:"layer-item-button",onClick:function(){var e=r.state;e.layers=e.layers.remove(t),r.setState(r.state)}})]},t)})),Object(k.jsx)("div",{className:"layer-add-item",onClick:function(){r.state.layers.add(),r.setState(r.state)},children:"Add Layer"})]})},r.render=function(){return Object(k.jsx)("div",{className:"side-bar-group",children:Object(k.jsx)(D,{id:"layer_container",content:r.layerControls})})},r.state.layers=e.layers,r.updateActiveLayer=r.updateActiveLayer.bind(Object(l.a)(r)),r.updateLayerViewable=r.updateLayerViewable.bind(Object(l.a)(r)),r.layerMovementButtons=r.layerMovementButtons.bind(Object(l.a)(r)),r}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.refresh(),this.updateActiveLayer(0)}}]),n}(a.a.Component)),F=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).state={brush:null,layers:null},r.group=function(e,t){return Object(k.jsxs)("div",{children:[Object(k.jsx)("div",{className:"side-bar-group-title",children:e}),t]})},r.render=function(){return Object(k.jsx)("div",{className:"side-bar-container",children:Object(k.jsxs)("ul",{className:"side-bar-group-list",children:[Object(k.jsx)("li",{className:"side-bar-group",children:r.group("COLORS",Object(k.jsx)(S,{updateColor:r.updateColor,brush:r.state.brush}))}),Object(k.jsx)("li",{className:"side-bar-group",children:r.group("LAYERS",Object(k.jsx)(R,{layers:r.state.layers}))}),Object(k.jsx)("li",{className:"side-bar-group",children:Object(k.jsx)("div",{className:"debug",id:"debug"})})]})})},r.state.brush=e.brush,r.state.layers=e.layers,r.updateColor=e.updateColor,r}return n}(a.a.Component),H=(n(42),null),V=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(s.a)(this,n),(e=t.call(this)).state={app:null,canvas:null,doBoundUpdate:!0,editor:_},e.getCanvas=function(){var t=document.getElementById("texture_editor_wrapper"),n=t.getBoundingClientRect().height<t.getBoundingClientRect().width?.9*t.getBoundingClientRect().height:.9*t.getBoundingClientRect().width,r=e.state;r.app=new h.a({width:n,height:n}),r.editor=_.create(r.app,16),r.app.view.oncontextmenu=function(e){e.preventDefault(),e.stopPropagation()},r.app.view.id="editor",r.canvas=r.editor.startup(),t.appendChild(r.canvas),e.setState(r)},e.componentDidMount=function(){e.getCanvas(),e.state.editor.updateBounds(),e.state.canvas.addEventListener("mousemove",(function(t){p.a.position.old={x:Math.floor(p.a.position.x),y:Math.floor(p.a.position.y)},p.a.position.x=Math.floor(t.clientX-e.state.editor.bounds.left),p.a.position.y=Math.floor(t.clientY-e.state.editor.bounds.top),p.a.moving=!0,H&&clearTimeout(H),H=setTimeout((function(){p.a.position.old={x:Math.floor(p.a.position.x),y:Math.floor(p.a.position.y)},p.a.moving=!1}),30)})),e.state.canvas.addEventListener("mousedown",(function(e){p.a.button.state=!0,p.a.button.id=e.button})),e.state.canvas.addEventListener("mouseup",(function(){p.a.button.state=!1,p.a.button.id=null})),e.state.canvas.addEventListener("mouseleave",(function(){return p.a.inBounds=!1})),e.state.canvas.addEventListener("mouseenter",(function(){return p.a.inBounds=!0})),e.state.canvas.addEventListener("click",(function(){return p.a.clicked=!0})),window.addEventListener("resize",(function(){return e.state.editor.updateBounds()}))},e.render=function(){return Object(k.jsxs)("div",{className:"editor-container",children:[Object(k.jsx)(I,{brush:e.state.editor.brush}),Object(k.jsxs)("div",{className:"texture-editor-container",id:"texture_editor_container",children:[Object(k.jsx)(B,{editor:e.state.editor}),Object(k.jsx)("div",{className:"texture-editor-wrapper",id:"texture_editor_wrapper"}),Object(k.jsxs)("div",{className:"texture-editor-controls",children:[Object(k.jsx)("label",{htmlFor:"texture-name-input",children:"File name:"}),Object(k.jsx)("input",{type:"text",name:"texture-name-input",id:"image_name",defaultValue:"texture",onKeyPress:function(e){e.key.match(/[\w\d.()]/)||e.preventDefault()}})]})]}),Object(k.jsx)(F,{brush:e.state.editor.brush,updateColor:e.updateColor,layers:e.state.editor.layers})]})},e.updateColor=e.updateColor.bind(Object(l.a)(e)),e.fetchBrush=e.fetchBrush.bind(Object(l.a)(e)),e}return Object(c.a)(n,[{key:"fetchBrush",value:function(){return this.state.editor.brush}},{key:"updateColor",value:function(e){var t=this.state,n=t.editor.brush.getColor();for(var r in e)n[r]=""===e[r]?0:Number(e[r]);t.editor.brush.setColor(n),this.setState(t)}}]),n}(a.a.Component);var J=function(){return Object(k.jsx)("div",{className:"App",children:Object(k.jsx)(V,{})})},T=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,45)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,o=t.getLCP,i=t.getTTFB;n(e),r(e),a(e),o(e),i(e)}))},G=(n(43),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(s.a)(this,n);for(var r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a))).render=function(){return Object(k.jsx)("div",{className:"nav-bar"})},e}return n}(a.a.Component));i.a.render(Object(k.jsxs)(a.a.StrictMode,{children:[Object(k.jsx)("header",{children:Object(k.jsx)(G,{})}),Object(k.jsx)("main",{children:Object(k.jsx)(J,{})}),Object(k.jsxs)("footer",{children:[Object(k.jsx)("div",{children:"Built by ChrisOfNormandy."}),Object(k.jsxs)("div",{children:["Join ",Object(k.jsx)("a",{href:"https://discord.gg/EW5JsGJfdt",children:"Discord"})]})]})]}),document.getElementById("root")),T()}],[[44,1,2]]]);
//# sourceMappingURL=main.d56c31ec.chunk.js.map