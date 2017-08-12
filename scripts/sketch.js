var PPKEY = ''
var MAXVOTESSHOWN = 3
// variables for pulling data from spreadsheet
var rawData;
var rollCalls = []
// variables for application interface
var findButton,
  saveButton,
  selector;
//canvasManager
var canvasManager;
// vars for populating the canvas with data
var mocPosition,
  sentiment,
  mocRollCall,
  mocPhone,
  mocName,
  mocImage;

function setup() {
  Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1oWAFQIIRZneiAQAXRvJ1S4K_Lall0DY_A8WGIVawXpc/pubhtml',
                   callback: gotData,
                   simpleSheet: true } )
  // create canvas
  canvasManager  = new CanvasManager();
  canvasManager.getCanvas().parent('canvas');
  // create dropdown list of states
  selector = document.getElementById("state-dropdown");
  for (var i = 0; i < states_titlecase.length; i++) {
      var element = document.createElement("option");
      element.textContent = states_titlecase[i].name;
      element.value = states_titlecase[i].abbreviation;
      selector.appendChild(element);
    }
  // create find button
  findButton = createButton('Find')
  findButton.parent('check-zip')
  findButton.mousePressed(findReps);
  // create save button
  saveButton = createButton('Save');
  saveButton.parent('save-canvas');
  saveButton.mousePressed(canvasManager.saveIt);
}

// store daily spreadsheet data in rawData variable
function gotData(data, tabletop) {
  rawData = data;
  // get roll call numbers from daily spreadsheet
  for (i = 0; i < rawData.length; i++) {
    rollCalls.push(rawData[i].roll_call_number)
  }
}

// this function performs a lookup of senators based on the state selected 
// from the dropdown
function findReps() {
  selectedState = selector.options[selector.selectedIndex].value;
  getSenatorsByState(selectedState)
}

// this makes an API call to: https://propublica.github.io/congress-api-docs/#get-current-members-by-state-district
function getSenatorsByState(state, senatorList) {
  $.ajax({
           url: "https://api.propublica.org/congress/v1/members/senate/" + state +  "/current.json",
           type: "GET",
           dataType: 'json',
           headers: {'X-API-Key': PPKEY }
         }).done(function(data) {
          senatorList = [];
          for (var i = 0; i < data.results.length; i++) {
            senatorList.push(data.results[i].name);
          }
          createButtons(senatorList)
        })    
}

// this function creates a button for each MOC returned by findReps()
// then, it puts the button in the 'list-reps' div
function createButtons(senatorList) {
  // clear existing stuff on the canvas
  canvasManager.clearCanvas();
  // clear existing button cache
  $('#list-reps').html('');
  // for each MOC, create a button with MOC's name
  for (var i = 0; i < senatorList.length; i++) {
    var button = createButton(senatorList[i])
    button.parent('list-reps');
    setMoc(button, senatorList[i]);
  }
  function setMoc(button, moc) {
    function assignMoc() {
      $('#tempLoading').remove();
      $('#canvas').append('<p id="tempLoading">Select Vote...</p>');
      // set MOC's name to be used on meme 
      mocName = moc
      // start collecting vote information
      matchSenatorName("senate", mocName)
    }
    // on button click, call assignSenator(), which calls matchSenatorName()
    button.mousePressed(assignMoc);
  }
}

function getImage(moc) {
  // clear existing image
  canvasManager.clearCanvas();
  // get imgUrl from moc name that was passed into the function
  var imgUrl;
  for (i = 0; i < senators.length; i++) {
    if (moc.indexOf(senators[i]["last_name"]) > -1) {
      imgUrl = senators[i]["image"];
    }
  }
  // load MOC's image from the imgUrl passed in
  canvasManager.loadImage(imgUrl);
}

// this function makes a call to the propublica API to get recent votes and contact info:
// https://propublica.github.io/congress-api-docs/#lists-of-members
// 'chamber' can either be 'senate' or 'house'
function matchSenatorName(chamber, moc, picker) {
  $.ajax({
           url: "https://api.propublica.org/congress/v1/115/"+chamber+"/members.json",
           type: "GET",
           dataType: 'json',
           headers: {'X-API-Key': PPKEY }
         }).done(function(data) {
          var memberList = data.results[0].members;
          // for each member returned, check if it matches the MOC passed in
          for (var i = 0; i < memberList.length; i++) {
            var name = memberList[i].first_name + ' ' + memberList[i].last_name;
            // if there's a match, get voting and contact info
            if (moc.indexOf(memberList[i].last_name) > -1 ) {
              repId = (memberList[i].id).toString()
              getRecentVotes()
              mocPhone = memberList[i].phone
            } else {
            }
          }
        })    
}

// this function uses the propublica API to return how a particular rep voted on a bill:
// https://propublica.github.io/congress-api-docs/#get-a-specific-roll-call-vote
function getVote(rollCall, repId, picker) {
  $.ajax({
           url: "https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/"+rollCall+".json",
           type: "GET",
           dataType: 'json',
           headers: {'X-API-Key': PPKEY}
         }).done(function(data) {
          var positions = data.results.votes.vote.positions
          for (var i = 0; i < positions.length; i++) {
            var repIdToCheck = positions[i].member_id
            if (repIdToCheck.indexOf(repId) > -1) {
              mocPosition = positions[i].vote_position.toLowerCase()
              console.log('vote: ', mocPosition)
              break;
            }
          }
          getSentiment(mocPosition, picker)
        });
}

function getSentiment(mocPosition, picker) {
  var desiredVote = rawData[picker].desired_vote;
  if (mocPosition.indexOf(desiredVote) > -1) {
    sentiment = rawData[picker].pro_text;
    console.log('sentiment: ', sentiment);
  } else {
    sentiment = rawData[picker].anti_text;
    console.log('sentiment: ', sentiment);
  }
  setImageMessage(mocName, mocPhone, sentiment, mocPosition, mocRollCall);
}

function setImageMessage(name, phone, sentiment, vote, bill) {
  // Call 208-980-2091 to say "I oppose!"
  // Rep. Murray just voted "No" on RB. 157
  // construct the text strings
  var callText = 'Call ' + phone + ' to say ' + '\"' + sentiment + '\"';
  var repVoteText = name + " just voted " + vote + " on " + bill;
  
  // remove 'loading' text
  $('#tempLoading').remove();
  
  canvasManager.setUpperCanvasText(callText);
  canvasManager.setLowerCanvasText(repVoteText);
}

function getRecentVotes() {
  var maxRollNumber = getMostRecentVote();
  $('#list-votes').html('');
  for(i = 0; i < rawData.length; i++) {
    if(maxRollNumber - rawData[i].roll_call_number < MAXVOTESSHOWN)
    {
      var button = createButton(rawData[i].summary)
      button.parent('list-votes');
      setVote(button, rawData[i], i);
    }
  }
  function setVote(button, data, index) {
    function assignVote() {
      mocRollCall = data.roll_call_number;
      canvasManager.clearCanvas();
      getImage(mocName);
      getVote(data.roll_call_number, repId, index);
    }
    button.mousePressed(assignVote)
  }
}

function getMostRecentVote() {
  var largestRollCallNumber = 0;
  for(i = 0; i < rawData.length; i++)
  {
  	var vote = rawData[i];
  	if(vote.roll_call_number > largestRollCallNumber)
  	{
  		largestRollCallNumber = vote.roll_call_number;
  	}
  }
  return largestRollCallNumber;
}