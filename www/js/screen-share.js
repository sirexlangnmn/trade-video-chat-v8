// alert("meow1");

/**
 * Check if i can share the screen, if yes show button else hide it
 */
function setScreenShareBtn() {
    if (!isMobileDevice && (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia)) {
        screenShareBtn.addEventListener('click', (e) => {
            toggleScreenSharing();
        });
    } else {
        screenShareBtn.style.display = 'none';
    }
}

/**
 * Enable - disable screen sharing
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 */
function toggleScreenSharing() {
    // no peers in the room
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }

    screenMaxFrameRate = parseInt(screenFpsSelect.value);
    const constraints = {
        video: { frameRate: { max: screenMaxFrameRate } },
    }; // true | { frameRate: { max: screenMaxFrameRate } }

    let screenMediaPromise;

    if (!isScreenStreaming) {
        // on screen sharing start
        screenMediaPromise = navigator.mediaDevices.getDisplayMedia(constraints);
    } else {
        // on screen sharing stop
        screenMediaPromise = navigator.mediaDevices.getUserMedia(getAudioVideoConstraints());
    }
    screenMediaPromise
        .then((screenStream) => {
            // stop cam video track on screen share
            stopLocalVideoTrack();[]
            isScreenStreaming = !isScreenStreaming;
            refreshMyStreamToPeers(screenStream);
            refreshMyLocalStream(screenStream);
            myVideo.classList.toggle('mirror');
            setScreenSharingStatus(isScreenStreaming);
        })
        .catch((err) => {
            console.error('[Error] Unable to share the screen', err);
            userLog('error', 'Unable to share the screen ' + err);
        });
}

/**
 * Set Screen Sharing Status
 * @param {*} status
 */
function setScreenSharingStatus(status) {
    screenShareBtn.className = status ? 'fas fa-stop-circle' : 'fas fa-desktop';
    // only for desktop
    if (!isMobileDevice) {
        tippy(screenShareBtn, {
            content: status ? 'STOP screen sharing' : 'START screen sharing',
            placement: 'right-start',
        });
    }
}