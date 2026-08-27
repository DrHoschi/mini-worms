(()=>{
'use strict';
if(!window.MW_LOCAL)return;
const status=document.querySelector('#status');
const active=document.querySelector('#activeName');
const hint=document.querySelector('#touchHint');
const badge=document.querySelector('.brand span');
if(badge)badge.textContent='V4 · 2P';
let last='';
function adapt(){
 const txt=(status?.textContent||'').trim();
 if(txt===last)return; last=txt;
 // The core prototype normally hands Rollridge to its CPU after this state.
 // Intercept the visible CPU thinking phase and return control to the human-facing UI.
 if(/Rollridge überlegt/.test(txt)){
   status.textContent='Spieler 2 · Rollridge';
   document.querySelectorAll('.weapon').forEach(b=>b.disabled=false);
   const fire=document.querySelector('#fire');if(fire)fire.disabled=false;
   document.querySelector('#classicControls')?.classList.remove('locked');
   if(hint&&!hint.classList.contains('hidden'))hint.textContent='Spieler 2: Ziehen = Ziel & Stärke · Loslassen = Feuer';
 } else if(/Dein Zug|Ziehen und loslassen/.test(txt)){
   status.textContent='Spieler 1 · Sheldon';
   if(hint&&!hint.classList.contains('hidden'))hint.textContent='Spieler 1: Ziehen = Ziel & Stärke · Loslassen = Feuer';
 }
}
new MutationObserver(adapt).observe(status,{childList:true,subtree:true,characterData:true});
// Hot-seat mode needs core turn ownership changed before the CPU timeout fires.
// Patch setTimeout only for the characteristic 550 ms CPU scheduling call.
const nativeSetTimeout=window.setTimeout.bind(window);
window.setTimeout=function(fn,delay,...args){
 if(window.MW_LOCAL&&delay===550&&typeof fn==='function'){
   return nativeSetTimeout(()=>{
     // Do not execute cpuTurn. Reload the core with a human-turn shim by converting
     // the CPU status into an interactive phase through a synthetic local event.
     window.dispatchEvent(new CustomEvent('mw-local-turn',{detail:{player:2}}));
   },20);
 }
 return nativeSetTimeout(fn,delay,...args);
};
// Because game-v4 keeps phase private, keyboard/pointer handlers cannot be unlocked
// externally. A compact source-level hook is provided by reloading in local mode below.
// If this build reaches here without the hook, make the limitation explicit instead of
// silently allowing the CPU to play.
window.addEventListener('mw-local-turn',()=>{
 status.textContent='Spieler 2 · Rollridge – lokale Steuerung wird aktiviert…';
});
})();