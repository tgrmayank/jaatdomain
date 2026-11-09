var $=function(s){return document.querySelector(s)},$$=function(s){return document.querySelectorAll(s)};
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
(function(){var n=$("#nav"),b=$("#burger"),m=$("#menu");
b.onclick=function(){m.classList.toggle("on");b.setAttribute("aria-expanded",m.classList.contains("on"))};
$$("#menu a").forEach(function(a){a.addEventListener("click",function(){m.classList.remove("on")})});
window.addEventListener("scroll",function(){if(!n.hasAttribute("data-solid"))n.classList.toggle("sc",scrollY>20)},{passive:true});
setTimeout(function(){$("#pop").classList.add("on")},2200)})();
var W=["We build websites","We build Android & iOS apps","We create brands","We automate businesses","We grow your digital presence"],wi=0,ci=0,del=false,T=$("#t");
if(T)(function tick(){var w=W[wi];T.textContent=w.slice(0,ci);if(!del&&ci==w.length){del=true;return setTimeout(tick,1500)}if(del&&ci==0){del=false;wi=(wi+1)%W.length}ci+=del?-1:1;setTimeout(tick,del?30:65)})();
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(!x.isIntersecting)return;io.unobserve(x.target);var el=x.target;if(el.dataset.n){var n=+el.dataset.n,t=0,iv=setInterval(function(){t+=n/50;if(t>=n){t=n;clearInterval(iv)}el.textContent=Math.round(t)+"+"},24)}else el.classList.add("on")})},{threshold:.18});
$$(".stat b").forEach(function(n){io.observe(n)});$$(".rv").forEach(function(n,i){n.style.transitionDelay=(i%4)*70+"ms";io.observe(n)});
/* preselect service from ?service=slug */
var rs=$("#rs");if(rs){var q=new URLSearchParams(location.search).get("service");if(q)[].forEach.call(rs.options,function(o){if(o.dataset.slug===q)rs.value=o.value})}
/* ---- custom dropdowns (replace the phone's native select popup) ---- */
function syncAll(){$$("select").forEach(function(s){if(s._sync)s._sync()})}
function ddEnhance(sel){
var lb=document.querySelector('label[for="'+sel.id+'"]'),title=lb?lb.firstChild.textContent.trim():"Select";
var w=document.createElement("div");w.className="dd";sel.parentNode.insertBefore(w,sel);w.appendChild(sel);sel.classList.add("ddn");sel.tabIndex=-1;sel.setAttribute("aria-hidden","true");
w.insertAdjacentHTML("beforeend",'<button type="button" class="ddb" aria-haspopup="listbox" aria-expanded="false" aria-label="'+title+'"><span></span><svg class="i" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><div class="bk"></div><div class="ddp" role="listbox"><div class="ddh"><i></i><b>'+title+'</b></div><ul></ul></div>');
var b=w.querySelector(".ddb"),tx=b.firstChild,ul=w.querySelector("ul"),ac=-1;
ul.innerHTML=[].map.call(sel.options,function(o,i){return '<li role="option" data-i="'+i+'"'+(o.value?"":' class="dph"')+'>'+esc(o.text)+'<svg class="i ck2" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></li>'}).join("");
var lis=ul.children;
function sync(){var o=sel.options[sel.selectedIndex];tx.textContent=o?o.text:"";b.classList.toggle("dph",!sel.value);[].forEach.call(lis,function(li,i){var on=i==sel.selectedIndex;li.classList.toggle("on",on);li.setAttribute("aria-selected",on)})}
sel._sync=sync;sync();
function hi(i){ac=Math.max(0,Math.min(lis.length-1,i));[].forEach.call(lis,function(li,k){li.classList.toggle("ac",k==ac)});lis[ac].scrollIntoView({block:"nearest"})}
function open(){if(w.classList.contains("open"))return;var r=b.getBoundingClientRect();w.classList.toggle("up",innerWidth>820&&innerHeight-r.bottom<300&&r.top>innerHeight-r.bottom);w.classList.add("open");b.setAttribute("aria-expanded","true");hi(sel.selectedIndex<0?0:sel.selectedIndex)}
function close(){w.classList.remove("open");b.setAttribute("aria-expanded","false")}
function pick(i){sel.selectedIndex=i;sel.dispatchEvent(new Event("change",{bubbles:true}));w.classList.remove("er");var em=w.parentNode.querySelector(".em");if(em)em.textContent="";sync();close();b.focus()}
b.addEventListener("click",function(){w.classList.contains("open")?close():open()});
w.querySelector(".bk").addEventListener("click",close);
ul.addEventListener("click",function(e){var li=e.target.closest("li");if(li)pick(+li.dataset.i)});
b.addEventListener("keydown",function(e){var o=w.classList.contains("open");
if(e.key=="Escape"&&o){e.stopPropagation();close();return}
if(e.key=="ArrowDown"||e.key=="ArrowUp"){e.preventDefault();if(!o)open();else hi(ac+(e.key=="ArrowDown"?1:-1))}
else if((e.key=="Enter"||e.key==" ")&&o){e.preventDefault();pick(ac)}});
b.addEventListener("blur",function(){setTimeout(function(){if(!w.contains(document.activeElement)&&w.classList.contains("open"))close()},120)});
}
$$("select").forEach(ddEnhance);

/* ---- request form -> /api/request (Vercel serverless + Resend) ---- */
var rf=$("#rf");
if(rf){
function showSel(){$("#rsel").textContent=$("#rs").value||"your project"}showSel();$("#rs").addEventListener("change",showSel);
function clearErr(){$$("#rf .er").forEach(function(e){e.classList.remove("er")});$$("#rf .em").forEach(function(e){if(e.id!="rerr"&&e.dataset.k!="1")e.textContent=""});$("#rerr").textContent=""}
function bad(id,msg){var f=$("#"+id),h=f.closest(".dd")||f;h.classList.add("er");h.parentNode.querySelector(".em").textContent=msg;return h.querySelector(".ddb")||f}
rf.addEventListener("reset",function(){setTimeout(function(){syncAll();showSel()},0)});
function sendRequest(p){return fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok||!j.ok)throw new Error(j.error||"Request failed");return j})})}
function done(p){var rows=[["Reference",p.id],["Name",p.name],["Phone",p.phone],["Email",p.email],["Business",p.business],["City",p.city],["Service",p.service],["Budget",p.budget],["Timeline",p.timeline],["Contact via",p.contactVia],["Details",p.details]].filter(function(r){return r[1]});
$("#rsum").innerHTML=rows.map(function(r){return "<div><span>"+r[0]+"</span><b>"+esc(r[1])+"</b></div>"}).join("");
$("#rdid").textContent="Reference "+p.id;
$("#rwa").href="https://wa.me/918941801033?text="+encodeURIComponent("Hello TGR Digital Agency, I just sent a request ("+p.id+") for "+p.service+". My name is "+p.name+".");
$("#rform").hidden=true;$("#rdone").hidden=false;window.scrollTo({top:0,behavior:"smooth"})}
rf.addEventListener("submit",function(e){e.preventDefault();clearErr();var f,v=function(id){return $("#"+id).value.trim()};
if(v("rn").length<2)f=bad("rn","Enter your full name.");
if(!/^[+\d][\d\s\-]{8,15}$/.test(v("rp")))f=f||bad("rp","Enter a valid phone number.");
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("re")))f=f||bad("re","Enter a valid email address.");
if(!v("rs"))f=f||bad("rs","Choose a service.");
if(v("rd").length<15)f=f||bad("rd","Tell us a little more, at least 15 characters.");
if(f){f.focus();return}
var p={name:v("rn"),phone:v("rp"),email:v("re"),business:v("rb"),city:v("rc"),service:v("rs"),budget:v("rbg"),timeline:v("rt"),contactVia:(document.querySelector("input[name=cv]:checked")||{}).value,details:v("rd"),website:v("rh")};
var b=$("#rsub");b.disabled=true;b.classList.add("ld");b.firstChild.textContent="Sending";
sendRequest(p).then(function(r){p.id=r.id;done(p)}).catch(function(err){$("#rerr").textContent=err instanceof TypeError?"Could not reach the server. Check your internet, or message us on WhatsApp.":err.message}).then(function(){b.disabled=false;b.classList.remove("ld");b.firstChild.textContent="Send request"})});
$("#rnew").onclick=function(){$("#rdone").hidden=true;$("#rform").hidden=false;rf.reset();window.scrollTo({top:0})};
}
if($("#osl")){
/* ---- offer slider: loops left to right, auto plays, drag / swipe / arrows ---- */
(function(){var o=$("#osl"),vp=o.querySelector(".ovp"),tk=o.querySelector(".otk"),N=tk.children.length,busy=false,hold=false,dr=null,moved=false,dots=$("#odots"),T=0,DUR=5500,last=0;
function setHold(v){hold=v;o.classList.toggle("hold",v)}
function set(p,px,an){tk.style.transition=an?"transform .9s cubic-bezier(.65,0,.2,1)":"none";tk.style.transform="translateX(calc("+p+"% + "+(px||0)+"px))"}
function cur(){return +tk.children[1].dataset.k}
function focusSlide(el){[].forEach.call(tk.children,function(s){s.classList.toggle("cur",s==el)});el.classList.remove("pl");void el.offsetWidth;el.classList.add("pl")}
function mark(){var c=cur();[].forEach.call(dots.children,function(d,i){var on=i==c;d.classList.toggle("on",on);d.setAttribute("aria-current",on);d.firstChild.style.transform="scaleX(0)"});T=0}
tk.insertBefore(tk.lastElementChild,tk.firstChild);set(-100,0,false);
for(var i=0;i<N;i++){var d=document.createElement("button");d.setAttribute("aria-label","Show offer "+(i+1));d.dataset.t=i;d.style.order=(N-i)%N;d.innerHTML="<i></i>";dots.appendChild(d)}
focusSlide(tk.children[1]);mark();
function go(dir,px){if(busy)return;busy=true;T=0;set(-100,px,false);void tk.offsetWidth;focusSlide(dir=="prev"?tk.children[0]:tk.children[2]);set(dir=="prev"?0:-200,0,true);
setTimeout(function(){if(dir=="prev")tk.insertBefore(tk.lastElementChild,tk.firstChild);else tk.appendChild(tk.firstElementChild);set(-100,0,false);busy=false;mark()},920)}
$("#opv").onclick=function(){go("prev")};$("#onx").onclick=function(){go("next")};
dots.addEventListener("click",function(e){var d=e.target.closest("button");if(!d)return;var t=+d.dataset.t,c=cur();if(t==c)return;go((t-c+N)%N==1?"next":"prev")});
o.addEventListener("keydown",function(e){if(e.key=="ArrowLeft")go("prev");if(e.key=="ArrowRight")go("next")});
vp.addEventListener("pointerdown",function(e){if(busy||e.button>0)return;dr={x:e.clientX,id:e.pointerId};moved=false;setHold(true)});
vp.addEventListener("pointermove",function(e){if(!dr)return;var dx=e.clientX-dr.x;if(!moved&&Math.abs(dx)>8){moved=true;try{vp.setPointerCapture(dr.id)}catch(x){}}if(moved)set(-100,dx,false)});
function end(e){if(!dr)return;var dx=e.clientX-dr.x;dr=null;if(!moved){return}if(Math.abs(dx)>vp.offsetWidth*.15)go(dx>0?"prev":"next",dx);else set(-100,0,true)}
vp.addEventListener("pointerup",end);vp.addEventListener("pointercancel",end);
vp.addEventListener("click",function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
o.addEventListener("mouseenter",function(){setHold(true)});o.addEventListener("mouseleave",function(){if(!dr)setHold(false)});
document.addEventListener("pointerup",function(){if(!o.matches(":hover")&&!dr)setHold(false)});
o.addEventListener("focusin",function(){setHold(true)});o.addEventListener("focusout",function(){setHold(false)});
/* autoplay clock: pauses while hovered, dragged or off screen; the active dot fills as a progress bar */
var vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.15}).observe(o);
(function loop(t){var dt=Math.min(60,t-last);last=t;if(!hold&&!busy&&vis&&!document.hidden){T+=dt;var f=dots.querySelector(".on i");if(f)f.style.transform="scaleX("+Math.min(1,T/DUR)+")";if(T>=DUR)go("prev")}requestAnimationFrame(loop)})(0);
var IT=["Happy New Year","10% off on all new services","Fast delivery","Professional support","Affordable pricing","Business growth","Happy New Year from TGR"],h=IT.map(function(t){return "<span>"+t+"</span>"}).join("");$("#otr").innerHTML=h+h;
})();

}

/* ===== New Year 3D decoration (confetti, sparkles, fireworks, poster tilt) ===== */
(function(){
if(window.__nyfx)return;window.__nyfx=1;
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if(rm)return;
var c=document.createElement("canvas");c.id="nyfx";c.setAttribute("aria-hidden","true");document.body.appendChild(c);
var x=c.getContext("2d"),W=0,H=0,mob=false,P=[],S=[],F=[],last=0,nextFw=1200,raf=0;
var COL=["#0a5fd8","#3b86f2","#6fb1ff","#ffffff","#c3ccdc","#f0b429","#d3202b","#0a47a8"];
function R(a,b){return a+Math.random()*(b-a)}
function size(){var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);mob=W<700}
function mk(top){return{x:R(0,W),y:top?R(-H,0):R(-20,H),w:R(6,11),h:R(9,15),r:R(0,6.28),vr:R(-.04,.04),ph:R(0,6.28),vp:R(.03,.08),vy:R(.5,1.3),sw:R(.4,1.2),sp:R(.01,.03),t:R(0,6.28),c:COL[(Math.random()*COL.length)|0]}}
function init(){size();P=[];S=[];var n=mob?16:34,s=mob?8:16,i;for(i=0;i<n;i++)P.push(mk(false));for(i=0;i<s;i++)S.push({x:R(0,W),y:R(0,H),s:R(5,11),t:R(0,6.28),v:R(.02,.05),c:Math.random()<.5?"#f0b429":"#6fb1ff"})}
function burst(){var cx=Math.random()<.5?R(.06,.24)*W:R(.76,.94)*W,cy=R(.14,.34)*H,n=mob?22:38,col=[COL[1],COL[2],COL[5],COL[6],"#00b3ff"],cc=col[(Math.random()*col.length)|0];
for(var i=0;i<n;i++){var a=i/n*6.283+R(-.05,.05),v=R(1.6,3.6);F.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,d:R(.012,.02),c:i%3?cc:"#f0b429"})}}
function star(px,py,r,a,col){x.save();x.globalAlpha=a;x.translate(px,py);x.fillStyle=col;x.beginPath();x.moveTo(0,-r);x.quadraticCurveTo(0,0,r,0);x.quadraticCurveTo(0,0,0,r);x.quadraticCurveTo(0,0,-r,0);x.quadraticCurveTo(0,0,0,-r);x.fill();x.restore()}
function frame(ts){raf=requestAnimationFrame(frame);var dt=ts-last;last=ts;if(dt>80)dt=16;x.clearRect(0,0,W,H);
var i,p,k;
for(i=0;i<S.length;i++){p=S[i];p.t+=p.v;k=(Math.sin(p.t*8)+1)/2;star(p.x,p.y,p.s*(.5+k*.6),.25+k*.6,p.c)}
for(i=0;i<P.length;i++){p=P[i];p.y+=p.vy;p.t+=p.sp;p.x+=Math.sin(p.t)*p.sw;p.r+=p.vr;p.ph+=p.vp;
if(p.y>H+20){P[i]=mk(true);P[i].y=-20;continue}
k=Math.cos(p.ph);x.save();x.translate(p.x,p.y);x.rotate(p.r);x.scale(1,k);x.globalAlpha=.9;x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
x.fillStyle=k>0?"rgba(255,255,255,.35)":"rgba(10,24,48,.22)";x.fillRect(-p.w/2,-p.h/2,p.w,p.h/2);
x.strokeStyle="rgba(10,24,48,.18)";x.lineWidth=.6;x.strokeRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()}
nextFw-=dt;if(nextFw<=0){burst();nextFw=R(4200,7600)}
for(i=F.length-1;i>=0;i--){p=F[i];p.vy+=.035;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.l-=p.d;if(p.l<=0){F.splice(i,1);continue}
x.globalAlpha=p.l;x.strokeStyle=p.c;x.lineWidth=2;x.lineCap="round";x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*3,p.y-p.vy*3);x.stroke();
x.fillStyle="#fff";x.globalAlpha=p.l*.9;x.beginPath();x.arc(p.x,p.y,1.2,0,6.283);x.fill()}
x.globalAlpha=1}
function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
function stop(){cancelAnimationFrame(raf);raf=0}
init();start();
addEventListener("resize",function(){size();for(var i=0;i<P.length;i++){if(P[i].x>W)P[i].x=R(0,W)}});
document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
/* gentle 3D tilt on the New Year offer poster (mouse devices only) */
if(window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches){
var cards=document.querySelectorAll(".oc.fest");
Array.prototype.forEach.call(cards,function(el){var im=el.querySelector("img");if(!im)return;
el.addEventListener("mousemove",function(e){var b=el.getBoundingClientRect(),dx=(e.clientX-b.left)/b.width-.5,dy=(e.clientY-b.top)/b.height-.5;im.style.transform="perspective(900px) rotateY("+(dx*14).toFixed(2)+"deg) rotateX("+(-dy*10).toFixed(2)+"deg) scale(1.02)"});
el.addEventListener("mouseleave",function(){im.style.transform=""})})}
})();
