const electron = require('electron');
const { ipcRenderer } = require('electron');

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
var todaysDate = today.toISOString().slice(0, 10);
console.log(todaysDate);

ipcRenderer.on('buttonSend', function (e, items) {
  console.log(items);
  
  var div = document.getElementById('talkTitle');
  div.innerText = items[0];
})

ipcRenderer.on('buttonSend', function (e, items) {
  var div = document.getElementById('speakerName');
  div.innerText = items[1];
})


ipcRenderer.on('buttonSend', function (e, items) {
  var div = document.getElementById('talkTime');
  div.innerText = items[2];;
  document.getElementById('countdown').innerHTML = '';

  var countDownDate = new Date(todaysDate + " " + items[2]);
  myFunction(countDownDate);

})

ipcRenderer.on('buttonSend', function (e, items) {
  var div = document.getElementById('talkZone');
  if (items[3] == '') {
    div.innerText = '';
  } else {
    div.innerText = '(' + items[3] + ')';
  }
})

ipcRenderer.on('buttonSend', function (e, items) {
  if (items[4] == '') {
   document.getElementById("speakerImage").src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";
  } else {
    document.getElementById("speakerImage").src = items[4];
  }
})

ipcRenderer.on('buttonSend', function (e, items) {
  if (items[5] == '') {
    document.getElementById("eventLogo").src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";
   } else {
     document.getElementById("eventLogo").src = items[5];
   }
})

ipcRenderer.on('buttonSend', function (e, items) {
  var div = document.getElementById('headerText');
  div.innerHTML = items[6];
})

ipcRenderer.on('buttonSend', function (e, items) {
  var div = document.getElementById('countdown');
  div.style.backgroundColor = items[7];
  var tableHead = document.getElementById('tableHead');
  tableHead.style.backgroundColor = items[7];
})


var myVar;

function myFunction(countDownDate) {
  clearTimeout(myVar);
  myVar = setInterval(function () {
    // console.log(countDownDate);

    var now = new Date().getTime();

    var distance = countDownDate - now;
    //console.log(distance);

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
      document.getElementById("countdown").innerHTML = "Starting soon...";
    }

  }, 1000);
}

function myStopFunction() {
  clearTimeout(myVar);
}
