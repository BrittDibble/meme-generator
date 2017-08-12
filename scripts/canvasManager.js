function CanvasManager(){
  // square canvas dimensions
  this.w = 500;
  // meme text positioning and size
  this.x = 10;
  this.ts = 40;
  this.rightTextBound = this.w - this.x;
  this.textFont = "Montserrat";
  this.canvas = null;
}

CanvasManager.prototype = {
  getCanvas:function(){
    if(this.canvas == null){
      this.canvas = createCanvas(this.w, this.w);
      background(200);
    }
    return this.canvas;
  },
  clearCanvas:function() {
    clear();
    background(200);
  },
  saveIt:function() {
    saveCanvas(canvasManager.getCanvas(), 'Share_'+ mocName, 'jpg');
  },
  loadImage:function(imgUrl) {
    loadImage(imgUrl, function(loadedImg) {
    var ratio = loadedImg.width / loadedImg.height;
    var divide = loadedImg.width / this.w;
    var height = loadedImg.height / divide;
    image(loadedImg, 0, 0, this.w, height);
    });
  },
  setCanvasText:function(inputText, offset, offset2) {
    textSize(this.ts);
    textFont(this.textFont);
    var widthOfText = textWidth(inputText);
    var lineHeight = this.ts * 1.2;
    var bgColor = color('rgba(25, 38, 82, .5)');
    fill(bgColor);
    noStroke();
    var textRect = rect(this.x, this.w-offset, canvasManager.getSizeOfTopLine(this.ts, this.textFont, inputText), lineHeight);
    if(widthOfText > this.w - this.rightTextBound) {
      var textRect2 = rect(this.x, this.w - offset2, widthOfText-canvasManager.getSizeOfTopLine(this.ts, this.textFont, inputText), lineHeight);
    }
    fill(255);
    var line = text(inputText, this.x, this.w - offset, this.rightTextBound, this.w);
  },
  setUpperCanvasText:function(text) {
    canvasManager.setCanvasText(text, 450, 400);
  },
  setLowerCanvasText:function(text) {
    canvasManager.setCanvasText(text, 150, 100);
  },
  getSizeOfTopLine:function(ts, tf, text) {
    textSize(ts);
    textFont(tf);
    var textArr = text.split(" ");
    var index = 1;
    var testString = textArr[0];
    while(textWidth(testString + " " + textArr[index]) < this.rightTextBound){
      testString = testString + " " + textArr[index];
      index++;
    }
    return textWidth(testString);
  }
}
