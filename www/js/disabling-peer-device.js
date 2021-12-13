/**
 * Mute or Hide everyone except yourself
 * @param {*} element audio/video
 */
 function disableAllPeers(element) {
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }
    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageUrl: element == 'audio' ? audioOffImg : camOffImg,
        title: element == 'audio' ? 'Mute everyone except yourself?' : 'Hide everyone except yourself?',
        text:
            element == 'audio'
                ? "Once muted, you won't be able to unmute them, but they can unmute themselves at any time."
                : "Once hided, you won't be able to unhide them, but they can unhide themselves at any time.",
        showDenyButton: true,
        confirmButtonText: element == 'audio' ? `Mute` : `Hide`,
        denyButtonText: `Cancel`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            switch (element) {
                case 'audio':
                    userLog('toast', 'Mute everyone 👍');
                    emitPeersAction('muteAudio');
                    break;
                case 'video':
                    userLog('toast', 'Hide everyone 👍');
                    emitPeersAction('hideVideo');
                    break;
            }
        }
    });
}

/**
 * Emit actions to all peers in the same room except yourself
 * @param {*} peerAction muteAudio hideVideo start/stop recording ...
 */
 function emitPeersAction(peerAction) {
    if (!thereIsPeerConnections()) return;

    sendToServer('peerAction', {
        room_id: roomId,
        peer_name: myPeerName,
        peer_id: null,
        peer_action: peerAction,
    });
}

/**
 * Mute Audio to specific user in the room
 * @param {*} peer_id
 */
 function handlePeerAudioBtn(peer_id) {
    let peerAudioBtn = getId(peer_id + '_audioStatus');
    peerAudioBtn.onclick = () => {
        if (peerAudioBtn.className === 'fas fa-microphone') disablePeer(peer_id, 'audio');
    };
}

/**
 * Hide Video to specific user in the room
 * @param {*} peer_id
 */
function handlePeerVideoBtn(peer_id) {
    let peerVideoBtn = getId(peer_id + '_videoStatus');
    peerVideoBtn.onclick = () => {
        if (peerVideoBtn.className === 'fas fa-video') disablePeer(peer_id, 'video');
    };
}

/**
 * Mute or Hide specific peer
 * @param {*} peer_id
 * @param {*} element audio/video
 */
 function disablePeer(peer_id, element) {
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }
    Swal.fire({
        background: swalBackground,
        position: 'center',
        imageUrl: element == 'audio' ? audioOffImg : camOffImg,
        title: element == 'audio' ? 'Mute this participant?' : 'Hide this participant?',
        text:
            element == 'audio'
                ? "Once muted, you won't be able to unmute them, but they can unmute themselves at any time."
                : "Once hided, you won't be able to unhide them, but they can unhide themselves at any time.",
        showDenyButton: true,
        confirmButtonText: element == 'audio' ? `Mute` : `Hide`,
        denyButtonText: `Cancel`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            switch (element) {
                case 'audio':
                    userLog('toast', 'Mute audio 👍');
                    emitPeerAction(peer_id, 'muteAudio');
                    break;
                case 'video':
                    userLog('toast', 'Hide video 👍');
                    emitPeerAction(peer_id, 'hideVideo');
                    break;
            }
        }
    });
}

/**
 * Emit actions to specified peers in the same room
 * @param {*} peer_id
 * @param {*} peerAction
 */
 function emitPeerAction(peer_id, peerAction) {
    if (!thereIsPeerConnections()) return;

    sendToServer('peerAction', {
        room_id: roomId,
        peer_id: peer_id,
        peer_name: myPeerName,
        peer_action: peerAction,
    });
}

/**
 * Audio mute - unmute button click event
 */
 function setAudioBtn() {
    audioBtn.addEventListener('click', (e) => {
        handleAudio(e, false);
    });
}

/**
 * Video hide - show button click event
 */
function setVideoBtn() {
    videoBtn.addEventListener('click', (e) => {
        handleVideo(e, false);
    });
}

/**
 * Handle Audio ON - OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
 function handleAudio(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getAudioTracks
    localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
    myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
    e.target.className = 'fas fa-microphone' + (myAudioStatus ? '' : '-slash');
    if (init) {
        audioBtn.className = 'fas fa-microphone' + (myAudioStatus ? '' : '-slash');
        if (!isMobileDevice) {
            tippy(initAudioBtn, {
                content: myAudioStatus ? 'Click to audio OFF' : 'Click to audio ON',
                placement: 'top',
            });
        }
    }
    setMyAudioStatus(myAudioStatus);
}

/**
 * Handle Video ON - OFF
 * @param {*} e event
 * @param {*} init bool true/false
 */
function handleVideo(e, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getVideoTracks
    localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0].enabled;
    myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
    e.target.className = 'fas fa-video' + (myVideoStatus ? '' : '-slash');
    if (init) {
        videoBtn.className = 'fas fa-video' + (myVideoStatus ? '' : '-slash');
        if (!isMobileDevice) {
            tippy(initVideoBtn, {
                content: myVideoStatus ? 'Click to video OFF' : 'Click to video ON',
                placement: 'top',
            });
        }
    }
    setMyVideoStatus(myVideoStatus);
}

/**
 * Set My Audio Status Icon and Title
 * @param {*} status
 */
 function setMyAudioStatus(status) {
    myAudioStatusIcon.className = 'fas fa-microphone' + (status ? '' : '-slash');
    // send my audio status to all peers in the room
    emitPeerStatus('audio', status);
    tippy(myAudioStatusIcon, {
        content: status ? 'My audio is ON' : 'My audio is OFF',
    });
    status ? playSound('on') : playSound('off');
    // only for desktop
    if (!isMobileDevice) {
        tippy(audioBtn, {
            content: status ? 'Click to audio OFF' : 'Click to audio ON',
            placement: 'right-start',
        });
    }
}

/**
 * Set My Video Status Icon and Title
 * @param {*} status
 */
function setMyVideoStatus(status) {
    // on vdeo OFF display my video avatar name
    myVideoAvatarImage.style.display = status ? 'none' : 'block';
    myVideoStatusIcon.className = 'fas fa-video' + (status ? '' : '-slash');
    // send my video status to all peers in the room
    emitPeerStatus('video', status);
    tippy(myVideoStatusIcon, {
        content: status ? 'My video is ON' : 'My video is OFF',
    });
    status ? playSound('on') : playSound('off');
    // only for desktop
    if (!isMobileDevice) {
        tippy(videoBtn, {
            content: status ? 'Click to video OFF' : 'Click to video ON',
            placement: 'right-start',
        });
    }
}

/**
 * Set Participant Video Status Icon and Title
 * @param {*} peer_id
 * @param {*} status
 */
 function setPeerVideoStatus(peer_id, status) {
    let peerVideoAvatarImage = getId(peer_id + '_avatar');
    let peerVideoStatus = getId(peer_id + '_videoStatus');
    peerVideoStatus.className = 'fas fa-video' + (status ? '' : '-slash');
    peerVideoAvatarImage.style.display = status ? 'none' : 'block';
    tippy(peerVideoStatus, {
        content: status ? 'Participant video is ON' : 'Participant video is OFF',
    });
    status ? playSound('on') : playSound('off');
}

/**
 * Set Participant Audio Status Icon and Title
 * @param {*} peer_id
 * @param {*} status
 */
 function setPeerAudioStatus(peer_id, status) {
    let peerAudioStatus = getId(peer_id + '_audioStatus');
    peerAudioStatus.className = 'fas fa-microphone' + (status ? '' : '-slash');
    tippy(peerAudioStatus, {
        content: status ? 'Participant audio is ON' : 'Participant audio is OFF',
    });
    status ? playSound('on') : playSound('off');
}

/**
 * Set my Audio off and Popup the peer name that performed this action
 */
 function setMyAudioOff(peer_name) {
    if (myAudioStatus === false) return;
    localMediaStream.getAudioTracks()[0].enabled = false;
    myAudioStatus = localMediaStream.getAudioTracks()[0].enabled;
    audioBtn.className = 'fas fa-microphone-slash';
    setMyAudioStatus(myAudioStatus);
    userLog('toast', peer_name + ' has disabled your audio');
    playSound('off');
}

/**
 * Set my Video off and Popup the peer name that performed this action
 */
function setMyVideoOff(peer_name) {
    if (myVideoStatus === false) return;
    localMediaStream.getVideoTracks()[0].enabled = false;
    myVideoStatus = localMediaStream.getVideoTracks()[0].enabled;
    videoBtn.className = 'fas fa-video-slash';
    setMyVideoStatus(myVideoStatus);
    userLog('toast', peer_name + ' has disabled your video');
    playSound('off');
}