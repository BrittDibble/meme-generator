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
    $('#tempLoading').remove();
    $('#canvas').append('<p id="tempLoading">Loading...</p>');
    loadImage(imgUrl, 
    function(loadedImg) {
      var ratio = loadedImg.width / loadedImg.height;
      var divide = loadedImg.width / canvasManager.w;
      var height = loadedImg.height / divide;
      image(loadedImg, 0, 0, canvasManager.w, height);
      canvasManager.setUpperCanvasText(upperText);
      canvasManager.setLowerCanvasText(lowerText);
      $('#tempLoading').remove();
    },
    function() {
      $('#tempLoading').remove();
      $('#canvas').append('<p id="tempLoading">Error Loading Image</p>');
    });
  };

  this.setCanvasText = function(inputText, startx, offset) {
    textSize(this.ts);
    textFont(this.textFont);
    var widthOfText = textWidth(inputText);
    var lineHeight = this.ts * 1.2;
    noStroke();
    
    var textArray = [];
    var textArr = inputText.split(" ");
    var buildString = textArr[0];
    var index = 1;
    while(index < textArr.length){
      while(textWidth(buildString + " " + textArr[index]) < this.rightTextBound - 10 && index < textArr.length){
        buildString = (buildString == "") ? textArr[index] : buildString + " " + textArr[index];
        index++;
      }
      textArray.push(buildString);
      buildString = "";
    }

    for(var i = 0; i < textArray.length; i++)
    {
      this.setTextLine(textArray[i], startx - offset * i, startx, lineHeight);
    }

    return this;
  };

  this.setUpperCanvasText = function(text) {
    this.setCanvasText(text, 450, 50);
    return this;
  };

  this.setLowerCanvasText = function(text) {
    this.setCanvasText(text, 150, 50);
    return this;
  };

  this.setTextLine = function (inputText, startx, xoffset, lineHeight) {
    var bgColor = color('rgba(25, 38, 82, .5)');
    fill(bgColor);
    var textRect = rect(this.x, this.w - startx, this.getSizeOfLine(this.ts, this.textFont, inputText), lineHeight);
    fill(255);
    var textLine = text(inputText, this.x, this.w - startx, this.rightTextBound, this.w);
    return this;
  };

  this.getSizeOfLine = function(ts, tf, textInput) {
    textSize(ts);
    textFont(tf);
    var textArr = textInput.split(" ");
    var index = 1;
    var testString = textArr[0];
    while(index < textArr.length && textWidth(testString + " " + textArr[index]) < this.rightTextBound - 10){
      testString = testString + " " + textArr[index];
      index++;
    }
    return textWidth(testString);
  };
};
