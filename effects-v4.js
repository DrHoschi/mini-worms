(()=>{
'use strict';
const status=document.querySelector('#status');
const wrap=document.querySelector('.game-wrap');
const canvas=document.querySelector('#game');
const fire=document.querySelector('#fire');
const start=document.querySelector('#startGame');
if(!status||!wrap||!canvas)return;

let audioCtx=null,master=null,lastStatus='',lastProjectile={x:480,y:300,t:0};
function ensureAudio(){
  if(audioCtx)return audioCtx;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  audioCtx=new AC();
  master=audioCtx.createGain();
  master.gain.value=.48;
  master.connect(audioCtx.destination);
  return audioCtx;
}
function resumeAudio(){const a=ensureAudio();if(a&&a.state==='suspended')a.resume();}
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,resumeAudio,{once:true,passive:true}));

function osc(type,f0,f1,dur,vol=.2,delay=0){
  const a=ensureAudio();if(!a||!master)return;
  const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.04);
}
function noise(dur=.4,vol=.25,filterFreq=900,delay=0,filterType='lowpass'){
  const a=ensureAudio();if(!a||!master)return;
  const sr=a.sampleRate,len=Math.max(1,Math.floor(sr*dur)),buf=a.createBuffer(1,len,sr),data=buf.getChannelData(0);
  for(let i=0;i<len;i++){const env=Math.pow(1-i/len,1.7);data[i]=(Math.random()*2-1)*env;}
  const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+delay;
  src.buffer=buf;f.type=filterType;f.frequency.value=filterFreq;f.Q.value=.7;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  src.connect(f);f.connect(g);g.connect(master);src.start(t);src.stop(t+dur+.03);
}
function shotSound(){
  noise(.075,.14,2600,0,'bandpass');
  osc('sawtooth',185,58,.14,.12);
  osc('sine',82,46,.12,.07,.015);
}
function grenadeSound(){osc('triangle',360,205,.10,.08);noise(.07,.07,1500)}
function explosionSound(heavy=false){
  // Fast crack + dense blast + low-frequency thump + short debris tail.
  noise(.055,heavy?.42:.34,4200,0,'bandpass');
  noise(heavy?1.05:.82,heavy?.62:.52,heavy?720:920,.015,'lowpass');
  osc('sine',heavy?88:110,24,heavy?.78:.62,heavy?.48:.38,.005);
  osc('triangle',heavy?58:72,22,heavy?.95:.72,heavy?.30:.22,.025);
  noise(heavy?.50:.34,heavy?.20:.15,260,.10,'lowpass');
  noise(.22,.10,1900,.18,'bandpass');
}
function uiClick(){osc('sine',430,540,.05,.035)}
function turnTone(){osc('triangle',440,650,.09,.045);osc('triangle',650,840,.10,.035,.07)}

// Track the last projectile center directly from the game's own canvas drawing.
// Projectile circles are rendered at radius 7 (bazooka/grenade) or 10 (heavy).
const nativeArc=CanvasRenderingContext2D.prototype.arc;
CanvasRenderingContext2D.prototype.arc=function(x,y,r,...args){
  if(this.canvas===canvas&&(Math.abs(r-7)<.01||Math.abs(r-10)<.01))lastProjectile={x,y,t:performance.now()};
  return nativeArc.call(this,x,y,r,...args);
};

const style=document.createElement('style');
style.textContent=`
.fx-layer{position:absolute;inset:0;z-index:7;pointer-events:none;overflow:hidden;border-radius:inherit}
.fx-flash{position:absolute;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle,rgba(255,252,218,.98) 0,rgba(255,192,69,.88) 15%,rgba(255,91,20,.38) 38%,transparent 70%);transform:translate(-50%,-50%) scale(.25);opacity:0;mix-blend-mode:screen}
.fx-ring{position:absolute;width:22px;height:22px;border:4px solid rgba(255,236,174,.98);border-radius:50%;transform:translate(-50%,-50%) scale(.25);opacity:0;box-shadow:0 0 18px rgba(255,137,28,.95),inset 0 0 12px rgba(255,255,255,.65)}
.fx-ring.r2{border-width:2px;border-color:rgba(255,160,70,.75);animation-delay:.045s!important}
.fx-spark{position:absolute;width:5px;height:5px;border-radius:50%;background:#ffd46a;opacity:0;box-shadow:0 0 7px #ff7118}
.fx-smoke{position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(65,49,39,.72);filter:blur(2px);opacity:0}
.game-wrap.fx-boom{animation:mwShake .38s linear}
.fx-layer.boom .fx-flash{animation:mwFlash .36s ease-out}
.fx-layer.boom .fx-ring{animation:mwRing .58s cubic-bezier(.12,.65,.2,1)}
.fx-layer.boom .fx-spark{animation:mwSpark .68s ease-out}
.fx-layer.boom .fx-smoke{animation:mwSmoke .85s ease-out}
@keyframes mwFlash{0%{opacity:0;transform:translate(-50%,-50%) scale(.18)}8%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)}}
@keyframes mwRing{0%{opacity:1;transform:translate(-50%,-50%) scale(.2)}65%{opacity:.78}100%{opacity:0;transform:translate(-50%,-50%) scale(8.5)}}
@keyframes mwShake{0%,100%{transform:translate(0,0)}12%{transform:translate(-5px,3px)}25%{transform:translate(6px,-4px)}40%{transform:translate(-4px,-3px)}56%{transform:translate(4px,3px)}72%{transform:translate(-2px,2px)}86%{transform:translate(2px,-1px)}}
@keyframes mwSpark{0%{opacity:1;transform:translate(-50%,-50%) translate(0,0) scale(1.2)}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(.15)}}
@keyframes mwSmoke{0%{opacity:.76;transform:translate(-50%,-50%) translate(0,0) scale(.55)}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--sx),var(--sy)) scale(2.5)}}
@media (prefers-reduced-motion:reduce){.game-wrap.fx-boom,.fx-layer.boom>*{animation:none!important}}
`;
document.head.appendChild(style);

const layer=document.createElement('div');layer.className='fx-layer';
const flash=document.createElement('div');flash.className='fx-flash';
const ring=document.createElement('div');ring.className='fx-ring';
const ring2=document.createElement('div');ring2.className='fx-ring r2';
layer.append(flash,ring,ring2);
const sparks=[];for(let i=0;i<28;i++){const s=document.createElement('i');s.className='fx-spark';const a=Math.random()*Math.PI*2,d=42+Math.random()*165;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');layer.appendChild(s);sparks.push(s)}
const smoke=[];for(let i=0;i<8;i++){const s=document.createElement('i');s.className='fx-smoke';const a=Math.random()*Math.PI*2,d=18+Math.random()*55;s.style.setProperty('--sx',Math.cos(a)*d+'px');s.style.setProperty('--sy',(Math.sin(a)*d-30-Math.random()*30)+'px');layer.appendChild(s);smoke.push(s)}
wrap.appendChild(layer);

function setOrigin(){
  const cr=canvas.getBoundingClientRect(),wr=wrap.getBoundingClientRect();
  const fresh=performance.now()-lastProjectile.t<1200;
  const gx=fresh?lastProjectile.x:480,gy=fresh?lastProjectile.y:300;
  const x=(cr.left-wr.left)+(gx/canvas.width)*cr.width;
  const y=(cr.top-wr.top)+(gy/canvas.height)*cr.height;
  [flash,ring,ring2,...sparks,...smoke].forEach(el=>{el.style.left=x+'px';el.style.top=y+'px'});
}
function boom(heavy=false){
  setOrigin();explosionSound(heavy);
  layer.classList.remove('boom');wrap.classList.remove('fx-boom');void layer.offsetWidth;
  layer.classList.add('boom');wrap.classList.add('fx-boom');
  setTimeout(()=>{layer.classList.remove('boom');wrap.classList.remove('fx-boom')},900);
}

if(fire)fire.addEventListener('pointerdown',()=>shotSound());
document.querySelectorAll('.weapon').forEach(b=>b.addEventListener('pointerdown',()=>{uiClick();if(b.dataset.weapon==='grenade')grenadeSound()}));
document.querySelectorAll('[data-tap="jump"]').forEach(b=>b.addEventListener('pointerdown',()=>osc('triangle',260,430,.09,.045)));
if(start)start.addEventListener('pointerdown',()=>{resumeAudio();turnTone()});

const obs=new MutationObserver(()=>{
  const txt=(status.textContent||'').trim();if(!txt||txt===lastStatus)return;lastStatus=txt;
  if(/Explosion/i.test(txt))boom(/Heavy|HEAVY/i.test(txt));
  else if(/Rollridge überlegt|Dein Zug|Ziehen und loslassen/.test(txt))turnTone();
});
obs.observe(status,{childList:true,characterData:true,subtree:true});
})();