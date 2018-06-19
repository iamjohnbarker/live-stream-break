const electron = require('electron');
const { ipcRenderer } = require('electron');
const { ipcMain } = require('electron');
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
    .then(function (result) {
      console.log(e.srcElement.value);
      console.log(result.length);
      console.log(result);
      optionDefault = document.createElement('option');
      optionDefault.text = "Choose a talk...";
      dropdown.remove(dropdown[0]);
      dropdown.add(optionDefault, 0);
      for (var i = 0; i < result.length; i++) {
        option = document.createElement('option');
        option.text = result[i].speakerName + ' - ' + result[i].talkTitle;
        option.value = i;
        option.headerText = result[i].headerText;
        option.eventLogo = result[i].eventLogo;
        option.talkTitle = result[i].talkTitle;
        option.speakerName = result[i].speakerName;
        option.talkTime = result[i].talkTime;
        option.timeZone = result[i].timeZone;
        option.speakerImage = result[i].speakerImage;
        option.brandColour = result[i].brandColour;
        dropdown.add(option);
      }
    })
    .catch(function (err) {
      console.log(err.message);
      console.log(err.stack);
      optionError = document.createElement('option');
      optionError.text = "That didn't work... Try checking your ID";
      dropdown.remove(dropdown[0]);
      dropdown.add(optionError, 0);
    });

  document.getElementById('talkPicker').addEventListener('change', function (e) {
    console.log(e);
    document.getElementById('headerText').value = e.target.selectedOptions[0].headerText;
    document.getElementById('eventLogo').value = e.target.selectedOptions[0].eventLogo;
    document.getElementById('speakerName').value = e.target.selectedOptions[0].speakerName;
    document.getElementById('talkTitle').value = e.target.selectedOptions[0].talkTitle;
    document.getElementById('trackZone').value = e.target.selectedOptions[0].timeZone;
    document.getElementById('speakerImage').value = e.target.selectedOptions[0].speakerImage;
    document.getElementById('brandColour').value = e.target.selectedOptions[0].brandColour;

    function minTommss(minutes) {
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
  var talkTitle = document.getElementById('talkTitle').value;
  var speakerName = document.getElementById('speakerName').value;
  var trackTime = document.getElementById('trackTime').value;
  var trackZone = document.getElementById('trackZone').value;
  var speakerImage = document.getElementById('speakerImage').value;
  var eventLogo = document.getElementById('eventLogo').value;
  var headerText = document.getElementById('headerText').value;
  var brandColour = document.getElementById('brandColour').value;
  var items = [talkTitle, speakerName, trackTime, trackZone, speakerImage, eventLogo, headerText, brandColour];
  ipcRenderer.send('button', items);
}


var spreadsheetIDValidate = document.getElementById("spreadsheetID");
var capital = document.getElementById("capital");


spreadsheetIDValidate.onkeyup = function() {
  // Validate http or edit
  var validateURL = /(http)|(edit)/g;
  if(spreadsheetIDValidate.value.match(validateURL)) {  
    // capital.classList.remove("invalid");
    // capital.classList.add("valid");
    spreadsheetIDValidate.style.borderColor = '#ec6f6f';
    document.getElementById("validationMessage").style.display = "block";
  } else {
    // capital.classList.remove("valid");
    // capital.classList.add("invalid");
    spreadsheetIDValidate.style.borderColor = '';
    document.getElementById("validationMessage").style.display = "none";
  }

}