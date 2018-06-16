const electron = require('electron');
const {ipcRenderer} = require('electron');
const {ipcMain} = require('electron');
var gsjson = require('google-spreadsheet-to-json');

var dropdown = document.getElementById('talkPicker');
document.getElementById('spreadsheetIDRefresh').addEventListener('click', function fetchSpreadsheet(e) {
console.log(e);
var spreadsheetID = document.getElementById('spreadsheetID').value;
console.log(spreadsheetID);
optionDefault = document.createElement('option');
document.getElementById('talkPicker').options.length = 0;
optionDefault.text = "Grabbing data, hold tight...";
dropdown.remove(dropdown[0]);
dropdown.add(optionDefault, 0);

gsjson({
    spreadsheetId: spreadsheetID,
    // other options...
})
.then(function(result) {
  console.log(e.srcElement.value);
  console.log(result.length);
  console.log(result);
  optionDefault = document.createElement('option');
  optionDefault.text = "Choose a talk...";
  dropdown.remove(dropdown[0]);
  dropdown.add(optionDefault, 0);
  for (var i = 0; i < result.length; i++) {
    option = document.createElement('option');
    option.text = result[i].speakerName+' - '+result[i].talkTitle;
    option.value = i;
    option.talkTitle = result[i].talkTitle;
    option.speakerName = result[i].speakerName;
    option.talkTime = result[i].talkTime;
    option.talkDate = result[i].talkDate;
    dropdown.add(option);
  }
})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});

document.getElementById('talkPicker').addEventListener('change', function(e) {
  console.log(e);
  document.getElementById('speakerName').value = e.target.selectedOptions[0].talkTitle;
  document.getElementById('speakerTitle').value = e.target.selectedOptions[0].speakerName;

  function minTommss(minutes){
   var hrs = Math.floor(Math.abs(minutes) * 24);
   var min = ((minutes * 24) - hrs);
   var min2 = Math.floor(Math.abs(min) * 60.5);
   console.log(min);
   return hrs + ":" + (min2 < 10 ? "0" : "") + min2;
  }
  document.getElementById('trackTime').value = minTommss(e.target.selectedOptions[0].talkTime);
})

})

//SEND SPEAKER INFO
document.getElementById('sendToMain').addEventListener('click', buttonClicked);
function buttonClicked(e) {
  e.preventDefault();
  var item = document.getElementById('speakerName').value;
  var item2 = document.getElementById('speakerTitle').value;
  var item3 = document.getElementById('trackTime').value;
  var item4 = document.getElementById('trackZone').value;
  var item5 = document.getElementById('speakerImage').value;
  var item6 = document.getElementById('eventLogo').value;
  var item7 = document.getElementById('eventName').value;
  ipcRenderer.send('button', item, item2, item3, item4, item5, item6, item7);
}
