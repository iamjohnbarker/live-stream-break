const electron = require('electron');
const {ipcRenderer} = require('electron');

const notification5 = {
  title: '5 minutes to go',
  body: 'Quick, go get some coffee!'
}

const notification1 = {
  title: '1 minute to go',
  body: 'The break is almost over!'
}

const notification30 = {
  title: '30 seconds to go',
  body: 'Get ready!'
}

var today = new Date();
var todaysDate = today.toISOString().slice(0,10);
console.log(todaysDate);

ipcRenderer.on('buttonSend', function (e, item, item2) {
  var div = document.getElementById('talkTitle');
  console.log(item);
  div.innerText = item;
})

ipcRenderer.on('buttonSend2', function (e, item2) {
  var div = document.getElementById('talkSpeaker');
  console.log(item2);
  div.innerText = item2;
})


ipcRenderer.on('buttonSend3', function (e, item3) {
  var div = document.getElementById('talkTime');
  console.log(item3);
  div.innerText = item3;
  document.getElementById('countdown').innerHTML = '';

  var countDownDate = new Date(todaysDate+" "+item3);
  myFunction(countDownDate);

})

ipcRenderer.on('buttonSend4', function (e, item4) {
  var div = document.getElementById('talkZone');
  console.log(item4);
  div.innerText = item4;
})


ipcRenderer.on('buttonSend5', function (e, item5) {
  document.getElementById("speakerImage").src = item5;
  console.log(item5);
})

ipcRenderer.on('buttonSend6', function (e, item6) {
  document.getElementById("eventLogo").src = item6;
  console.log(item6);
})

ipcRenderer.on('buttonSend7', function (e, item7) {
  var div = document.getElementById('eventName');
  div.innerText = item7;
  console.log(item7);
})


var myVar;

function myFunction(countDownDate) {
    clearTimeout(myVar);
    myVar = setInterval(function(){
      // console.log(countDownDate);

      var now = new Date().getTime();

      var distance = countDownDate - now;
      console.log(distance);

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var zero = '0';
      if (hours < 10) {
        hours = zero + hours;
      }
      if (minutes < 10) {
        minutes = zero + minutes;
      }
      if (seconds < 10) {
        seconds = zero + seconds;
      }

      document.getElementById("countdown").innerHTML = hours + ":"
      + minutes + ":" + seconds;

      if (distance < 300000 && distance > 299000) {
            const myNotification5 = new window.Notification(notification5.title, notification5)
        }

      if (distance < 60000 && distance > 59000) {
            const myNotification1 = new window.Notification(notification1.title, notification1)
        }

      if (distance < 30000 && distance > 29000) {
            const myNotification30 = new window.Notification(notification30.title, notification30)
        }


      if (distance < 0) {
            clearInterval(myVar);
            document.getElementById("countdown").innerHTML = " ";
        }

    }, 1000);
}

function myStopFunction() {
    clearTimeout(myVar);
}
