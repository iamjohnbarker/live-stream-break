const electron = require('electron');
const {ipcRenderer} = require('electron');
const {ipcMain} = require('electron');
var gsjson = require('google-spreadsheet-to-json');

var dropdown = document.getElementById('talkPicker');
var spreadsheetID = document.getElementById('spreadsheetID').addEventListener('change', function (e) {

optionDefault = document.createElement('option');
optionDefault.text = "Grabbing data, hold tight...";
dropdown.remove(dropdown[0]);
dropdown.add(optionDefault, 0);

gsjson({
    spreadsheetId: e.srcElement.value,
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


// SCREENSHOT LOGIC

const {desktopCapturer, screen, shell} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
//var moment = require('moment');
//var timr = require('timr');
//var scheduler = timr();
//var looksSame = require('looks-same');




// desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
//   if (error) throw error
//   console.log(sources);
//   for (let i = 0; i < sources.length; ++i) {
//     if (sources[i].name === 'Electron') {
//       navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {
//           mandatory: {
//             chromeMediaSource: 'desktop',
//             chromeMediaSourceId: sources[i].id,
//             minWidth: 1280,
//             maxWidth: 1280,
//             minHeight: 720,
//             maxHeight: 720
//           }
//         }
//       })
//       .then((stream) => handleStream(stream))
//       .catch((e) => handleError(e))
//       return
//     }
//   }
// })
//
// function handleStream (stream) {
//   const video = document.querySelector('video')
//   video.srcObject = stream
//   video.onloadedmetadata = (e) => video.play()
// }
//
// function handleError (e) {
//   console.log(e)
// }
//
//
// var d = Date();

const screenshot = document.getElementById('screen-shot')
const screenshotMsg = document.getElementById('screenshot-path')

screenshot.addEventListener('click', (event) => {
    screenshotMsg.textContent = 'Gathering screens...'
    const thumbSize = determineScreenShotSize()
    let options = { types: ['window'], thumbnailSize: thumbSize }

    desktopCapturer.getSources(options, (error, sources) => {
      if (error) return console.log(error)

      sources.forEach((source) => {
        if (source.name === 'Movie Recording') {
          const screenshotPath = path.join(os.homedir(), '/screenshots/captured.png')

          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
            if (error) return console.log(error)
            //shell.openExternal(`file://${screenshotPath}`)

            const message = `Saved screenshot to: ${screenshotPath}`
            screenshotMsg.textContent = message
          })
        }
      })
    })


})

function determineScreenShotSize () {
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: 1920,
    height: 1080
  }
}


const screenshotShare = document.getElementById('screen-shot-share')

screenshotShare.addEventListener('click', (event) => {
    screenshotMsg.textContent = 'Gathering screens...'
    const thumbSize = determineScreenShotSize()
    let options = { types: ['window'], thumbnailSize: thumbSize }

    desktopCapturer.getSources(options, (error, sources) => {
      if (error) return console.log(error)

      sources.forEach((source) => {
        console.log(source.name);
        if (source.name === 'displayScreenshot') {
          const screenshotPath = path.join(os.homedir(), '/screenshots/share.png')

          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
            if (error) return console.log(error)
            //shell.openExternal(`file://${screenshotPath}`)

            const message = `Saved screenshot to: ${screenshotPath}`
            screenshotMsg.textContent = message
          })
        }
      })
    })


})

function determineScreenShotSize () {
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: 1280,
    height: 720
  }
}
