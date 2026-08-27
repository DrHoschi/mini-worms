(()=>{
'use strict';
// Cross-browser Canvas fix for Chromium/Android.
// The game terrain is produced as a full ImageData buffer with transparent sky pixels.
// Some Android/Chromium GPU paths composite those pixels differently on an opaque canvas,
// which can cause black sky areas, flicker or apparent frame ghosting.
const nativePutImageData=CanvasRenderingContext2D.prototype.putImageData;
const terrainLayer=document.createElement('canvas');
let terrainCtx=null;

CanvasRenderingContext2D.prototype.putImageData=function(imageData,dx,dy,...rest){
  if(this.canvas&&this.canvas.id==='game'&&imageData&&imageData.width&&imageData.height){
    if(terrainLayer.width!==imageData.width||terrainLayer.height!==imageData.height){
      terrainLayer.width=imageData.width;
      terrainLayer.height=imageData.height;
      terrainCtx=terrainLayer.getContext('2d',{alpha:true});
    }
    terrainCtx.clearRect(0,0,terrainLayer.width,terrainLayer.height);
    nativePutImageData.call(terrainCtx,imageData,0,0);
    this.drawImage(terrainLayer,dx,dy);
    return;
  }
  return nativePutImageData.call(this,imageData,dx,dy,...rest);
};
})();
