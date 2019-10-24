'use strict'

var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');
var videoPlayer = document.querySelector('video#player');


if (!navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported!')
} else {
    var constraints = {
        video: true,
        audie: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotMediaStream)
        .then(gotDevices)
        .catch(handleError)
}

function gotMediaStream(stream) {
    videoPlayer.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    deviceInfos.forEach(function (deviceInfo) {

        var option = document.createElement('option');
        option.text = deviceInfo.label;
        option.value = deviceInfo.deviceId;

        if(deviceInfo.kind === 'audioinput'){
            audioSource.appendChild(option);
        }else if(deviceInfo.kind === 'audiooutput'){
            audioOutput.appendChild(option);
        }else if(deviceInfo.kind === 'videoinput'){
            videoSource.appendChild(option);
        }

        // console.log(
        //     "kind = " + deviceInfo.kind + ":" +
        //     "label = " + deviceInfo.label + ":" +
        //     "deviceId = " + deviceInfo.deviceId + ":" +
        //     "groupId = " + deviceInfo.groupId
        // )
    })
}

function handleError(err) {
    console.log(err.name + ": " + err.message);
}
