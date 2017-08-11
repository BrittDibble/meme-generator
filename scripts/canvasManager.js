function CanvasManager(){
  // square canvas dimensions
  this.w = 500;
  // meme text positioning and size
  this.x = 10;
  this.ts = 40;
  this.rightTextBound = this.w - this.x;
  this.canvas = null;
}

CanvasManager.prototype = {
  getCanvas:function(){
    if(this.canvas == null){
      this.canvas = createCanvas(this.w, this.w);
    }
    return this.canvas;
  }
}
