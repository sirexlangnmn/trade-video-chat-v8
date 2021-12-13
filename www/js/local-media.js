/**
 * Connected to Signaling Server.
 * Once the user has given us access to their
 * microphone/camcorder, join the channel
 * and start peering up
 */
function handleConnect() {
    console.log("handleConnect: " + localMediaStream);
    console.log("Connected to signaling server");

    /**
     * if localMediaStream is defined, can join automatically,
     * else, ask athe credentials
     */
    if (localMediaStream) joinToChannel();
    else
        setupLocalMedia(() => {
            whoAreYou();
        });
}

/**
 * set your name for the conference
 */
function whoAreYou() {
    playSound("newMessage");

    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swalBackground,
        position: "center",
        // imageAlt: 'trade-name',
        imageUrl: welcomeImg,
        title: "Enter your name",
        input: "text",
        html: `<br>
        <button id="initAudioBtn" class="fas fa-microphone" onclick="handleAudio(event, true)"></button>
        <button id="initVideoBtn" class="fas fa-video" onclick="handleVideo(event, true)"></button>`,
        confirmButtonText: `Join meeting`,
        showClass: {
            popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutUp",
        },
        inputValidator: (value) => {
            if (!value) return "Please enter your name";

            document.body.style.backgroundImage = "none";
            myVideoWrap.style.display = "inline";
            logStreamSettingsInfo("localMediaStream", localMediaStream);
            attachMediaStream(myVideo, localMediaStream);
            resizeVideos();

            myPeerName = value;
            myVideoParagraph.innerHTML = myPeerName + " (me)";
            setPeerAvatarImgName("myVideoAvatarImage", myPeerName);
            setPeerChatAvatarImgName("right", myPeerName);
            joinToChannel();
        },
    }).then(() => {
        welcomeUser();
    });

    if (isMobileDevice) return;

    initAudioBtn = getId("initAudioBtn");
    initVideoBtn = getId("initVideoBtn");

    tippy(initAudioBtn, {
        content: "Click to audio OFF",
        placement: "top",
    });
    tippy(initVideoBtn, {
        content: "Click to video OFF",
        placement: "top",
    });
}

/**
 * join to chennel and send some peer info
 */
function joinToChannel() {
    console.log("join to channel: ", roomId);
    console.log("joinToChannelpeerInfo: ", peerInfo);
    console.log("joinToChannelpeerGeo: ", peerGeo);
    console.log("joinToChannelmyPeerName: ", myPeerName);
    console.log("joinToChannelmyVideoStatus: ", myVideoStatus);
    console.log("joinToChannelmyAudioStatus: ", myAudioStatus);
    console.log("joinToChannelmyHandStatus: ", myHandStatus);

    sendToServer("join", {
        channel: roomId,
        peer_info: peerInfo,
        peer_geo: peerGeo,
        peer_name: myPeerName,
        peer_video: myVideoStatus,
        peer_audio: myAudioStatus,
        peer_hand: myHandStatus,
        peer_rec: isRecScreenSream,
    });
}

/**
 * welcome message
 */
function welcomeUser() {
    const myRoomUrl = window.location.href;
    playSound("newMessage");
    Swal.fire({
        background: swalBackground,
        position: "center",
        title: "<strong>Welcome " + myPeerName + "</strong>",
        // imageAlt: 'trade-welcome',
        imageUrl: welcomeImg,
        html:
            `<p style="color:white;">Share this meeting invite others to join.</p>
        <p style="color:rgb(8, 189, 89);">` +
            myRoomUrl +
            `</p>`,
        showDenyButton: false, // true
        showCancelButton: true,
        confirmButtonText: `Copy meeting URL`,
        // denyButtonText: `Email invite`,
        cancelButtonText: `Close`,
        showClass: {
            popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutUp",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            copyRoomURL();
        } else if (result.isDenied) {
            let message = {
                email: "",
                subject: "Please join our Video Chat Meeting",
                body: "Click to join: " + myRoomUrl,
            };
            shareRoomByEmail(message);
        }
    });
}

/**
 * Setup local media stuff. Ask user for permission to use the computers microphone and/or camera,
 * attach it to an <audio> or <video> tag if they give us access.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * @param {*} callback
 * @param {*} errorback
 */
function setupLocalMedia(callback, errorback) {
    // if we've already been initialized do nothing
    if (localMediaStream != null) {
        if (callback) callback();
        return;
    }

    getPeerGeoLocation();

    console.log("Requesting access to local audio / video inputs");

    // default | qvgaVideo | vgaVideo | hdVideo | fhdVideo | 4kVideo |
    let videoConstraints =
        myBrowserName === "Firefox"
            ? getVideoConstraints("useVideo")
            : getVideoConstraints("default");

    const constraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
        video: videoConstraints,
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            loadLocalMedia(stream);
            if (callback) callback();
        })
        .catch((err) => {
            // https://blog.addpipe.com/common-getusermedia-errors/
            console.error("Access denied for audio/video", err);
            playSound("error");
            window.location.href = `/permission?roomId=${roomId}&getUserMediaError=${err.toString()}`;
            if (errorback) errorback();
        });
} // end [setup_local_stream]

/**
 * Load Local Media Stream obj
 * @param {*} stream
 */
function loadLocalMedia(stream) {
    console.log("Access granted to audio/video");
    // hide loading div
    getId("loadingDiv").style.display = "none";

    localMediaStream = stream;

    // local video elemets
    const videoWrap = document.createElement("div");
    const localMedia = document.createElement("video");

    // handle my peer name video audio status
    const myStatusMenu = document.createElement("div");
    const myCountTimeImg = document.createElement("i");
    const myCountTime = document.createElement("p");
    const myVideoParagraphImg = document.createElement("i");
    const myVideoParagraph = document.createElement("h4");
    const myHandStatusIcon = document.createElement("button");
    const myVideoStatusIcon = document.createElement("button");
    const myAudioStatusIcon = document.createElement("button");
    const myVideoFullScreenBtn = document.createElement("button");
    const myVideoAvatarImage = document.createElement("img");

    // menu Status
    myStatusMenu.setAttribute("id", "myStatusMenu");
    myStatusMenu.className = "statusMenu";

    // session time
    myCountTimeImg.setAttribute("id", "countTimeImg");
    myCountTimeImg.className = "fas fa-clock";
    myCountTime.setAttribute("id", "countTime");
    tippy(myCountTime, {
        content: "Session Time",
    });
    // my peer name
    myVideoParagraphImg.setAttribute("id", "myVideoParagraphImg");
    myVideoParagraphImg.className = "fas fa-user";
    myVideoParagraph.setAttribute("id", "myVideoParagraph");
    myVideoParagraph.className = "videoPeerName";
    tippy(myVideoParagraph, {
        content: "My name",
    });
    // my hand status element
    myHandStatusIcon.setAttribute("id", "myHandStatusIcon");
    myHandStatusIcon.className = "fas fa-hand-paper pulsate";
    myHandStatusIcon.style.setProperty("color", "rgb(0, 255, 0)");
    tippy(myHandStatusIcon, {
        content: "My hand is RAISED",
    });
    // my video status element
    myVideoStatusIcon.setAttribute("id", "myVideoStatusIcon");
    myVideoStatusIcon.className = "fas fa-video";
    tippy(myVideoStatusIcon, {
        content: "My video is ON",
    });
    // my audio status element
    myAudioStatusIcon.setAttribute("id", "myAudioStatusIcon");
    myAudioStatusIcon.className = "fas fa-microphone";
    tippy(myAudioStatusIcon, {
        content: "My audio is ON",
    });
    // my video full screen mode
    myVideoFullScreenBtn.setAttribute("id", "myVideoFullScreenBtn");
    myVideoFullScreenBtn.className = "fas fa-expand";
    tippy(myVideoFullScreenBtn, {
        content: "Full screen mode",
    });
    // my video avatar image
    myVideoAvatarImage.setAttribute("id", "myVideoAvatarImage");
    myVideoAvatarImage.className = "videoAvatarImage pulsate";

    // add elements to myStatusMenu div
    myStatusMenu.appendChild(myCountTimeImg);
    myStatusMenu.appendChild(myCountTime);
    myStatusMenu.appendChild(myVideoParagraphImg);
    myStatusMenu.appendChild(myVideoParagraph);
    myStatusMenu.appendChild(myHandStatusIcon);
    myStatusMenu.appendChild(myVideoStatusIcon);
    myStatusMenu.appendChild(myAudioStatusIcon);
    myStatusMenu.appendChild(myVideoFullScreenBtn);

    // hand display none on default menad is raised == false
    myHandStatusIcon.style.display = "none";

    localMedia.setAttribute("id", "myVideo");
    localMedia.setAttribute("playsinline", true);
    localMedia.className = "mirror";
    localMedia.autoplay = true;
    localMedia.muted = true;
    localMedia.volume = 0;
    localMedia.controls = false;

    videoWrap.className = "video";
    videoWrap.setAttribute("id", "myVideoWrap");

    // add elements to video wrap div
    videoWrap.appendChild(myStatusMenu);
    videoWrap.appendChild(myVideoAvatarImage);
    videoWrap.appendChild(localMedia);

    document.body.appendChild(videoWrap);
    videoWrap.style.display = "none";

    getHtmlElementsById();
    setButtonsTitle();
    manageLeftButtons();
    handleBodyOnMouseMove();
    setupMySettings();
    startCountTime();
    handleVideoPlayerFs("myVideo", "myVideoFullScreenBtn");
}
