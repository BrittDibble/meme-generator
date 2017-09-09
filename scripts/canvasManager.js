function CanvasManager(){
  // square canvas dimensions
  this.w = 500;
  // meme text positioning and size
  this.x = 10;
  this.ts = 40;
  this.rightTextBound = this.w - this.x;
  this.textFont = "Montserrat";
  this.canvas = null;



  this.getCanvas = function(){
    if(this.canvas == null){
      this.canvas = createCanvas(this.w, this.w);
      background(200);
    }
    return this.canvas;
  };

  this.clearCanvas = function() {
    clear();
    background(200);
    return this;
  };

  this.saveIt = function() {
    saveCanvas(this.canvas, 'Share_'+ mocName, 'jpg');
  };

  this.loadFrame = function(imgUrl, upperText, lowerText) {
    loadImage(imgUrl, function(loadedImg) {
    var ratio = loadedImg.width / loadedImg.height;
    var divide = loadedImg.width / this.w;
    var height = loadedImg.height / divide;
    image(loadedImg, 0, 0, this.w, height);
    canvasManager.setUpperCanvasText(upperText);
    canvasManager.setLowerCanvasText(lowerText);
    });
  };

  this.setCanvasTextLine = function(inputText, startx, starty, lineHeight){
    return this;
  };

  this.setCanvasText = function(inputText, startx, offset) {
    textSize(this.ts);
    textFont(this.textFont);
    var widthOfText = textWidth(inputText);
    var lineHeight = this.ts * 1.2;
    var bgColor = color('rgba(25, 38, 82, .5)');
    fill(bgColor);
    noStroke();
    var textRect = rect(this.x, this.w-startx, this.getSizeOfLine(this.ts, this.textFont, inputText), lineHeight);
    if(widthOfText > this.w - this.rightTextBound) {
      var textRect2 = rect(this.x, this.w - offset, widthOfText-this.getSizeOfLine(this.ts, this.textFont, inputText), lineHeight);
    }
    fill(255);
    var line = text(inputText, this.x, this.w - startx, this.rightTextBound, this.w);
    return this;
  };

  this.setUpperCanvasText = function(text) {
    this.setCanvasText(text, 450, 400);
    return this;
  };

  this.setLowerCanvasText = function(text) {
    this.setCanvasText(text, 150, 100);
    return this;
  };

  this.getSizeOfLine = function(ts, tf, text) {
    textSize(ts);
    textFont(tf);
    var textArr = text.split(" ");
    var index = 1;
    var testString = textArr[0];
    while(textWidth(testString + " " + textArr[index]) < this.rightTextBound - 10){
      testString = testString + " " + textArr[index];
      index++;
    }
    return textWidth(testString);
  };
};
