(()=>{
'use strict';
const status=document.querySelector('#status');
const wrap=document.querySelector('.game-wrap');
const fire=document.querySelector('#fire');
const start=document.querySelector('#startGame');
if(!status||!wrap)return;

let audioCtx=null, master=null, lastStatus='';
function ensureAudio(){
  if(audioCtx)return audioCtx;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  audioCtx=new AC();
  master=audioCtx.createGain();
  master.gain.value=.42;
  master.connect(audioCtx.destination);
  return audioCtx;
}
function resumeAudio(){const a=ensureAudio();if(a&&a.state==='suspended')a.resume();}
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,resumeAudio,{once:true,passive:true}));

function osc(type,f0,f1,dur,vol=.2,delay=0){
  const a=ensureAudio(); if(!a||!master)return;
  const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(25,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03);
}
function noise(dur=.4,vol=.25,filterFreq=900,delay=0){
  const a=ensureAudio(); if(!a||!master)return;
  const sr=a.sampleRate,len=Math.max(1,Math.floor(sr*dur)),buf=a.createBuffer(1,len,sr),data=buf.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
  const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+delay;
  src.buffer=buf;f.type='lowpass';f.frequency.value=filterFreq;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  src.connect(f);f.connect(g);g.connect(master);src.start(t);src.stop(t+dur+.02);
}
function shotSound(){osc('sawtooth',210,72,.16,.18);noise(.11,.18,1800);osc('square',95,45,.13,.08,.02)}
function grenadeSound(){osc('triangle',330,180,.12,.12);noise(.09,.11,1300)}
function explosionSound(heavy=false){
  noise(heavy?.85:.62,heavy?.48:.38,heavy?520:700);
  osc('sine',heavy?95:125,32,heavy?.72:.5,heavy?.34:.24);
  osc('triangle',heavy?70:90,28,heavy?.5:.36,heavy?.16:.12,.035);
  if(heavy)noise(.32,.18,260,.08);
}
function uiClick(){osc('sine',420,520,.055,.045)}
function turnTone(){osc('triangle',440,660,.11,.06);osc('triangle',660,880,.11,.045,.08)}

const style=document.createElement('style');
style.textContent=`
.fx-layer{position:absolute;inset:0;z-index:7;pointer-events:none;overflow:hidden;border-radius:inherit}
.fx-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 57%,rgba(255,250,205,.95) 0,rgba(255,170,50,.72) 9%,rgba(255,80,20,.22) 25%,transparent 55%);opacity:0}
.fx-ring{position:absolute;left:50%;top:57%;width:18px;height:18px;border:4px solid rgba(255,235,160,.95);border-radius:50%;transform:translate(-50%,-50%) scale(.2);opacity:0;box-shadow:0 0 22px rgba(255,145,30,.9)}
.fx-spark{position:absolute;left:50%;top:57%;width:5px;height:5px;border-radius:50%;background:#ffd262;opacity:0;box-shadow:0 0 7px #ff7a18}
.game-wrap.fx-boom{animation:mwShake .34s linear}
.fx-layer.boom .fx-flash{animation:mwFlash .38s ease-out}
.fx-layer.boom .fx-ring{animation:mwRing .55s ease-out}
.fx-layer.boom .fx-spark{animation:mwSpark .62s ease-out}
@keyframes mwFlash{0%{opacity:0}10%{opacity:1}100%{opacity:0}}
@keyframes mwRing{0%{opacity:1;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(11)}}
@keyframes mwShake{0%,100%{transform:translate(0,0)}15%{transform:translate(-4px,2px)}30%{transform:translate(5px,-3px)}45%{transform:translate(-3px,-2px)}60%{transform:translate(3px,3px)}75%{transform:translate(-2px,1px)}}
@keyframes mwSpark{0%{opacity:1;transform:translate(-50%,-50%) translate(0,0) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(.2)}}
@media (prefers-reduced-motion:reduce){.game-wrap.fx-boom,.fx-layer.boom .fx-flash,.fx-layer.boom .fx-ring,.fx-layer.boom .fx-spark{animation:none!important}}
`;
document.head.appendChild(style);
const layer=document.createElement('div');layer.className='fx-layer';
layer.innerHTML='<div class="fx-flash"></div><div class="fx-ring"></div>';
for(let i=0;i<22;i++){const s=document.createElement('i');s.className='fx-spark';const a=Math.random()*Math.PI*2,d=55+Math.random()*190;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');layer.appendChild(s)}
wrap.appendChild(layer);
function boom(heavy=false){
  explosionSound(heavy);
  layer.classList.remove('boom');wrap.classList.remove('fx-boom');void layer.offsetWidth;
  layer.classList.add('boom');wrap.classList.add('fx-boom');
  setTimeout(()=>{layer.classList.remove('boom');wrap.classList.remove('fx-boom')},700);
}

if(fire)fire.addEventListener('pointerdown',()=>shotSound());
document.querySelectorAll('.weapon').forEach(b=>b.addEventListener('pointerdown',()=>{uiClick();if(b.dataset.weapon==='grenade')grenadeSound()}));
document.querySelectorAll('[data-tap="jump"]').forEach(b=>b.addEventListener('pointerdown',()=>osc('triangle',260,430,.09,.055)));
if(start)start.addEventListener('pointerdown',()=>{resumeAudio();turnTone()});

const obs=new MutationObserver(()=>{
  const txt=(status.textContent||'').trim(); if(!txt||txt===lastStatus)return; lastStatus=txt;
  if(txt==='Explosion')boom(false);
  else if(/Heavy|HEAVY/i.test(txt)&&/Explosion/i.test(txt))boom(true);
  else if(/Rollridge überlegt|Dein Zug|Ziehen und loslassen/.test(txt))turnTone();
  else if(/Projektil fliegt/.test(txt))shotSound();
});
obs.observe(status,{childList:true,characterData:true,subtree:true});
})();