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
  setImageMessage:function(name, phone, sentiment, vote, bill) {
    textSize(this.ts);
    // Call 208-980-2091 to say "I oppose!"
    // Rep. Murray just voted "No" on RB. 157
    textFont("Montserrat");
    // construct the text strings and measure their widths
    var callText = 'Call ' + phone + ' to say ' + '\"' + sentiment + '\"';
    var repVoteText = name + " just voted " + vote + " on " + bill;
    var topWidth = textWidth(callText);
    var bottomWidth = textWidth(repVoteText);
    var lineHeight = this.ts*1.2
    
    // draw background boxes for text based on text string widths
    var bgColor = color('rgba(25, 38, 82, .5)');
    fill(bgColor);
    noStroke();
    var topRect = rect(this.x, this.w-450, this.w - 2 * this.x, lineHeight);
    var bottomRect = rect(this.x, this.w-150, this.w - 2 * this.x, lineHeight);
    // if text goes past the rightTextBound, 
    // draw background boxes on the next line
    if (topWidth > this.w - this.rightTextBound || bottomWidth > this.w - this.rightTextBound) {
      var topRect2 = rect(this.x, this.w-400, topWidth - this.w + this.x, lineHeight);
      var bottomRect2 = rect(this.x, this.w-100, bottomWidth - this.w + this.x, lineHeight);
    }
    // remove 'loading' text
    $('#tempLoading').remove();
    // create bounding boxes for text
    fill(255);
    var topLine = text(callText, this.x, this.w - 450, this.rightTextBound, this.w);
    var bottomLine = text(repVoteText, this.x, this.w - 150, this.rightTextBound, this.w);
  }
}
