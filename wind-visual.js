(()=>{
'use strict';
const wrap=document.querySelector('.game-wrap');
const windEl=document.querySelector('#windText');
if(!wrap||!windEl)return;

const style=document.createElement('style');
style.textContent=`
.wind-visual{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}
.wind-cloud{position:absolute;width:92px;height:27px;border-radius:999px;background:rgba(255,255,255,.54);filter:drop-shadow(0 2px 2px rgba(30,70,100,.12));will-change:transform}
.wind-cloud:before,.wind-cloud:after{content:"";position:absolute;background:inherit;border-radius:50%}
.wind-cloud:before{width:42px;height:42px;left:17px;top:-20px}
.wind-cloud:after{width:52px;height:52px;right:11px;top:-27px}
.wind-cloud.c1{top:14%;transform:scale(.78)}
.wind-cloud.c2{top:26%;transform:scale(1.05);opacity:.72}
.wind-cloud.c3{top:9%;transform:scale(.58);opacity:.62}
.wind-streak{position:absolute;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);opacity:0;will-change:transform,opacity}
.wind-streak.s1{top:20%;width:70px}.wind-streak.s2{top:33%;width:45px}.wind-streak.s3{top:12%;width:55px}
@media (prefers-reduced-motion:reduce){.wind-visual{display:none}}
`;
document.head.appendChild(style);

const layer=document.createElement('div');
layer.className='wind-visual';
layer.innerHTML='<div class="wind-cloud c1"></div><div class="wind-cloud c2"></div><div class="wind-cloud c3"></div><div class="wind-streak s1"></div><div class="wind-streak s2"></div><div class="wind-streak s3"></div>';
wrap.appendChild(layer);

const clouds=[...layer.querySelectorAll('.wind-cloud')];
const streaks=[...layer.querySelectorAll('.wind-streak')];
let positions=[80,430,760], streakPos=[220,570,850], last=performance.now();

function readWind(){
  const txt=windEl.textContent||'';
  const n=Number((txt.match(/(\d+(?:\.\d+)?)/)||[])[1]||0);
  const dir=txt.includes('←')?-1:txt.includes('→')?1:0;
  return {dir,n};
}
function wrapX(x,width){
  const span=width+180;
  while(x<-130)x+=span;
  while(x>width+50)x-=span;
  return x;
}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000); last=now;
  const {dir,n}=readWind();
  const rect=wrap.getBoundingClientRect();
  const width=Math.max(320,rect.width);
  const speed=dir*n*2.15;
  clouds.forEach((c,i)=>{
    positions[i]=wrapX(positions[i]+speed*dt*(.78+i*.17),width);
    const bob=Math.sin(now*.0007+i*2.1)*2;
    c.style.left=positions[i]+'px';
    c.style.marginTop=bob+'px';
  });
  const streakOpacity=Math.min(.5,Math.max(0,(n-5)/24));
  streaks.forEach((s,i)=>{
    streakPos[i]=wrapX(streakPos[i]+speed*dt*(1.7+i*.18),width);
    s.style.left=streakPos[i]+'px';
    s.style.opacity=String(streakOpacity);
    s.style.transform=`scaleX(${dir<0?-1:1})`;
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();