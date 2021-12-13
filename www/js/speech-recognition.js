// speech recognition
let recognition;
let SpeechRecognition;
let current;
let transcript;
let mobileRepeatBug;


// input textarea
let noteTextarea;
let originalTextarea;
//let translatedTextarea;
let languageSelect;



/*-----------------------------
    Chech browser support 
------------------------------*/
try {
    SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    console.log('SpeechRecognition', SpeechRecognition);
    console.log('recognition', recognition);
}
catch (e) {
    console.error(e);
    userLog("info", "Sorry, Your Browser Doesn't Support the Speech Recognition. Try Opening In Google Chrome.");
}


noteTextarea = $('#note-textarea');
originalTextarea = $('#original-textarea');
// translatedTextarea = $('#translated-textarea');
languageSelect = $('#languageSelect');


/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function (event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    current = event.resultIndex;

    // Get a transcript of what was said.
    transcript = event.results[current][0].transcript;
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    if (!mobileRepeatBug) {
        originalTextarea.val("");
        originalTextarea.val(myPeerName + ": " + transcript);
        noteTextarea.val(transcript);

        // setTimeout(function () {
        //     postRawText();
        // }, 3000);

        setTimeout(function () {
            messageDataChannel();
        }, 3000);

        setTimeout(function () {
            noteTextarea.val("");
            originalTextarea.val("");
            //translatedTextarea.val("")
        }, 5000);
    }

};

recognition.onstart = function () {
    speechRecognitionBtn.style.color = "green";
    userLog("info", "Voice recognition activated. Try speaking into the microphone.");
}

recognition.onspeechend = function () {
    speechRecognitionBtn.style.color = "";
    userLog("info", "You were quiet for a while so voice recognition turned itself off.");
}

recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        speechRecognitionBtn.style.color = "";
        userLog("info", "No speech was detected. Try again.");
    };
}

/*-----------------------------
      App buttons and input 
------------------------------*/
// $('#speechRecognitionBtn').on('click', function (e) {
//     recognition.start();
// });

// speechRecognitionBtn.addEventListener("click", (e) => {
//     recognition.start();
// });

function setSpeechRecognitionBtn() {
	speechRecognitionBtn.addEventListener("click", (e) => {
		recognition.start();
	});
}

/*-----------------------------
    Translation
------------------------------*/

// function postRawText() {
//     let message = noteTextarea.val();
//     let language = languageSelect.val();

//     $.ajax({
//         url: '/speechtranslator',
//         method: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({ 
//             message: message,
//             language: language
//         }),
//         success: function (response) {
//             translatedTextarea.val(myPeerName + ": " + response);
//         }
//     });
// }

function speechTranslator(message) {
    let language = languageSelect.val();
    var translatedMessage;

    $.ajax({
        url: '/speechtranslator',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            message: message,
            language: language
        }),
        async: false,
        success: function (response) {
            translatedMessage = response;
        }
    });

    console.log("language: ", language);
    console.log("translatedMessage: ", translatedMessage);
    return translatedMessage;
}

/*---------------------------------
    disseminate to other network
----------------------------------*/
function messageDataChannel() {
    const msg = noteTextarea.val();
    console.log("messageDataChannel.msg: ", msg);
    if (msg) {
        emitMsg(myPeerName, 'toAll', msg, false, 'speech');
    } else {
        return;
    }
}




