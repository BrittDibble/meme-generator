// variables for tabletop.js values
var rawData, 
  selector, 
  selectedState, 
  fontsize, 
  tempCanvas, 
  context, 
  issue;

var repId;

// square canvas dimensions
var w = 500;
// meme text positioning and size
var x = 10;
var ts = 40;
var rightTextMargin = w - x;

function preload() {
  senators = loadJSON('senators.json');
  // testImg = loadImage('test.png')
}

var canvas,
  findButton,
  clearButton,
  saveButton,
  textSizeSlider;

function setup() {
  Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1Yj83AF5q6sv2XTQ8ZGCX1ZrwDCFbtc_O7CidSPSEI0o/pubhtml',
                   callback: gotData,
                   simpleSheet: true } )

  canvas = createCanvas(w, w);
  canvas.parent('canvas');
  background(200);

  // create state dropdown list from 'senators' array in databaseA.js
  // TODO: rewrite dropdown in p5
  selector = document.getElementById("state-dropdown");
  var states = Object.keys(senators);
  for (var i = 0; i < states.length; i++) {
      var opt = states[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      selector.appendChild(el);
    }

  findButton = createButton('Find')
  findButton.parent('check-zip')
  findButton.mousePressed(findReps);

  clearButton = createButton('Clear Canvas');
  clearButton.parent('actions');
  clearButton.mousePressed(clearCanvas);

  saveButton = createButton('Save');
  saveButton.parent('actions');
  saveButton.mousePressed(saveIt);
}

function saveIt() {
  saveCanvas(canvas, 'Share_'+ senator.name, 'jpg');
}

function clearCanvas() {
  clear();
  background(200);
}
// store spreadsheet data in rawData variable
function gotData(data, tabletop) {
  rawData = data;
}

// this function performs a lookup of senators based on the state selected 
// from the dropdown. then, it creates a button for each senator returned by 
// the lookup, puts the button in the 'list-reps' div, and calls the 
// assignSenator function on button click
function findReps() {
  clearCanvas();
  selectedState = selector.options[selector.selectedIndex].value;
  var selectedSenators = senators[selectedState];
  for (var i = 0; i < selectedSenators.length; i++) {
    var button = createButton(selectedSenators[i].name)
    button.parent('list-reps');
    setSenator(button, selectedSenators[i]);
  }
  function setSenator(button, senator) {
    function assignSenator() {
      getImage(senator.image)
      getMsg(senator.name, senator.phone)
      // fillImage(senator.image, senator.phone, senator.name)
      matchSenatorName("senate", senator.name)
    }
    button.mousePressed(assignSenator);
  }
} //draw rep ends

function getImage(imgUrl) {
  var img = createImg(imgUrl);
  img.hide()
  console.log
  var ratio = img.width / img.height
  var divide = img.width / w
  var height = img.height / divide
  image(img, 0, 0, w, height)
}

function getMsg(name, phone, sentiment, vote, bill) {
  textSize(ts);
  // Call 208-980-2091 to say "I oppose!"
  // Rep. Murray just voted "No" on RB. 157
  var top = "Call " + phone + " to say " + sentiment;
  var bottom = name + " just voted " + vote + " on " + bill;
  text(top, x, w - 450, rightTextMargin, w);
  text(bottom, x, w - 150, rightTextMargin, w);
}

// function fillImage(image, number, name, fontsize, refreshing){
//   if (!fontsize) {
//     fontsize = 32
//   }
//   // using vanilla JS instead of p5 here to draw image to canvas from URL
//   // see https://github.com/processing/p5.js/issues/561
//   var img = new Image;
//   img.src = image;
//   img.crossOrigin = 'Anonymous'
//   var tempDiv = document.getElementById('canvas')
//   tempCanvas = document.getElementById('defaultCanvas0'),
//   context = tempCanvas.getContext('2d');
//   if (!refreshing){
//     drawTextBG(context, "PLEASE WAIT, LOADING IMAGE OF", fontsize + 'px arial', 0, 100);
//     drawTextBG(context, name, fontsize + 'px arial', 0, 130);
//   }

//   img.onload = function(){
//     var ratio = img.width/img.height
//     var divide = img.width / 500
//     var height = img.height / divide
//     context.drawImage(img,0,0,500,height);
//     drawTextBG(context, "CALL: " + number + ' To Say', fontsize + 'px arial', 0, 400);
//     // drawTextBG(context, sentiment, fontsize  + 'px arial', 0, 450)
//     drawTextBG(context, name + ' just voted on', fontsize + 'px arial', 0, 40);
//     drawTextBG(context, issue, fontsize + 'px arial', 0, 80);
//   };
// } //fill image ends

function drawTextBG(ctx, txt, font, x, y) {
  ctx.save();
  ctx.font = font;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(40,40,40,.5)';
  var width = ctx.measureText(txt).width;
  ctx.fillRect(x, y, width, parseInt(font, 10));
  ctx.fillStyle = '#fff';
  ctx.fillText(txt, x, y);
  ctx.restore();
}

// this function uses the propublica api to get recent bills by a specific member: 
// https://propublica.github.io/congress-api-docs/#get-recent-bills-by-a-specific-member
// TODO: figure out 'introduced' vs. 'updated' args
// function getBill(repId) {
//   $.ajax({
//            url: "https://api.propublica.org/congress/v1/members/"+repId+"/bills/updated.json",
//            type: "GET",
//            dataType: 'json',
//            headers: {'X-API-Key': 'AzuJWcFuUg3f0iLuL5zrl5M8RExaka469UWE81df'}
//          }).done(function(data) {
//           var billList = data.results[0].bills;
//             for (var i = 0; i < billList.length; i++) {
//               var bill = billList[i].bill_id
//               console.log(bill)
//             }
//          });
// }

// this function uses the propublica api to return how a particular rep voted on a bill
// https://propublica.github.io/congress-api-docs/#get-a-specific-roll-call-vote
// takes two arguments: roll call # and rep's 7-character bio id, both as strings
function getVote(rollCall, repId) {
  $.ajax({
           url: "https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/"+rollCall+".json",
           type: "GET",
           dataType: 'json',
           headers: {'X-API-Key': 'AzuJWcFuUg3f0iLuL5zrl5M8RExaka469UWE81df'}
         }).done(function(data) {
          var positions = data.results.votes.vote.positions
          for (var i = 0; i < positions.length; i++) {
            var repIdToCheck = positions[i].member_id
            console.log('repId: ', repId)
            console.log('repIdToCheck: ', repIdToCheck)
            if (repIdToCheck.indexOf(repId) > -1) {
              var position = positions[i].vote_position
              console.log(position)
              break;
            }
          }
        });
}

// this function uses the propublica api to match a senator's name to his/her bio id: 
// https://propublica.github.io/congress-api-docs/#lists-of-members
// takes two arguments: chamber can either be 'senate' or 'house'; 'senator' is first name + last name
function matchSenatorName(chamber, senator){
  $.ajax({
           url: "https://api.propublica.org/congress/v1/115/"+chamber+"/members.json",
           type: "GET",
           dataType: 'json',
           headers: {'X-API-Key': 'AzuJWcFuUg3f0iLuL5zrl5M8RExaka469UWE81df'}
         }).done(function(data) {
          var memberList = data.results[0].members;
          for (var i = 0; i < memberList.length; i++) {
            var name = memberList[i].first_name + ' ' + memberList[i].last_name;
            if (name.indexOf(senator) > -1 ) {
              repId = (memberList[i].id).toString()
              // getBill(repId)
              getVote("17", repId)
              break;
            }
          }
        })
}


