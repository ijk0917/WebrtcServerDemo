'use strict'

//devices
var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');

//filter
var filterSelect = document.querySelector('select#filter');

//picture
var snapshot = document.querySelector('button#snapshot');
var picture = document.querySelector('canvas#picture');

var videoPlayer = document.querySelector('video#player');
// var audioPlayer = document.querySelector('audio#audioplayer');

function gotMediaStream(stream) {
    videoPlayer.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    deviceInfos.forEach(function (deviceInfo) {

        var option = document.createElement('option');
        option.text = deviceInfo.label;
        option.value = deviceInfo.deviceId;

        if (deviceInfo.kind === 'audioinput') {
            audioSource.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
            audioOutput.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            videoSource.appendChild(option);
        }
    })
}

function handleError(err) {
    console.log('getUserMedia error: ' + err);
}

function start() {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia is not supported!')
    } else {

        var deviceId = videoSource.value;
        var constraints = {
            video: {
                width: 640
                , height: 480
                , frameRate: 30
                , facingMode: 'enviroment'
                , deviceId: deviceId ? deviceId : undefined
            },
            audie: {
                noiseSuppression: true
                , echoCancellation: true
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMediaStream)
            .then(gotDevices)
            .catch(handleError)
    }
}

start();

videoSource.onchange = start();

filterSelect.onchange = function () {
    videoPlayer.className = filterSelect.value;
}

snapshot.onclick = function () {
    picture.getContext('2d').drawImage(videoPlayer, 0, 0, 320, 240);
}
