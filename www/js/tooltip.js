/**
 * Using tippy aka very nice tooltip!
 * https://atomiks.github.io/tippyjs/
 */
 function setButtonsTitle() {
    // not need for mobile
    if (isMobileDevice) return;

    // left buttons
    tippy(shareRoomBtn, {
        content: 'Invite people to join',
        placement: 'right-start',
    });
    tippy(audioBtn, {
        content: 'Click to audio OFF',
        placement: 'right-start',
    });
    tippy(videoBtn, {
        content: 'Click to video OFF',
        placement: 'right-start',
    });
    tippy(screenShareBtn, {
        content: 'START screen sharing',
        placement: 'right-start',
    });
    tippy(fullScreenBtn, {
        content: 'VIEW full screen',
        placement: 'right-start',
    });
    tippy(chatRoomBtn, {
        content: 'OPEN the chat',
        placement: 'right-start',
    });
    tippy(myHandBtn, {
        content: 'RAISE your hand',
        placement: 'right-start',
    });
    tippy(fileShareBtn, {
        content: 'SHARE the file',
        placement: 'right-start',
    });
    tippy(mySettingsBtn, {
        content: 'Show settings',
        placement: 'right-start',
    });
    tippy(aboutBtn, {
        content: 'Show about',
        placement: 'right-start',
    });
    tippy(leaveRoomBtn, {
        content: 'Leave this room',
        placement: 'right-start',
    });

    // chat room buttons
    tippy(msgerTheme, {
        content: 'Ghost theme',
    });
    tippy(msgerCPBtn, {
        content: 'Private messages',
    });
    tippy(msgerClean, {
        content: 'Clean messages',
    });
    tippy(msgerSaveBtn, {
        content: 'Save messages',
    });
    tippy(msgerClose, {
        content: 'Close the chat',
    });
    tippy(msgerEmojiBtn, {
        content: 'Emoji',
    });
    tippy(msgerSendBtn, {
        content: 'Send',
    });

    // settings
    tippy(mySettingsCloseBtn, {
        content: 'Close settings',
    });
    tippy(myPeerNameSetBtn, {
        content: 'Change name',
    });

    // room actions btn
    tippy(muteEveryoneBtn, {
        content: 'MUTE everyone except yourself',
        placement: 'top',
    });
    tippy(hideEveryoneBtn, {
        content: 'HIDE everyone except yourself',
        placement: 'top',
    });

    // Suspend File transfer btn
    tippy(sendAbortBtn, {
        content: 'ABORT file transfer',
        placement: 'right-start',
    });

}
