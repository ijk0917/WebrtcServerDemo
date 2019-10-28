'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnStart = document.querySelector('button#start');
var btnCall = document.querySelector('button#call');
var btnHangUp = document.querySelector('button#hangup');

var localStream;
var pc1;
var pc2;

function getMediaStream(stream) {
    localVideo.srcObject = stream;
    localStream = stream;
}

function handleError(err) {
    console.error('Failed to get Media Stream!', err);
}

function start() {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        console.error('the getUserMedia is not supported!');
        return;
    } else {
        var constraints = {
            video: true,
            audio: false
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(getMediaStream)
            .catch(handleError);
    }
}

function getRemoteStream(e) {
    remoteVideo.srcObject = e.streams[0];
}

function getOffer(desc) {
    pc1.setLocalDescription(desc);

    //send desc to signal
    //receive desc from signal

    pc2.setRemoteDescription(desc);

    pc2.createAnswer()
        .then(getAnswer)
        .catch(handleAnswerError);
}

function getAnswer(desc) {
    pc2.setLocalDescription(desc);

    //send desc to signal
    //receive desc from signal
    pc1.setRemoteDescription(desc);

}

function handleOfferError(err) {
    console.error('Failed to create offer!', err);
}

function handleAnswerError(err) {
    console.error('Failed to create answer!', err);
}

function call() {
    pc1 = new RTCPeerConnection();
    pc2 = new RTCPeerConnection();

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate);
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate);
    }

    pc2.ontrack = getRemoteStream;

    localStream.getTracks().forEach((track) => {
        pc1.addTrack(track, localStream);
    });
    var offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
    }
    pc1.createOffer(offerOptions)
        .then(getOffer)
        .catch(handleOfferError);

}

function hangup() {

}

btnStart.onclick = start;
btnCall.onclick = call;
btnHangUp.onclick = hangup;








