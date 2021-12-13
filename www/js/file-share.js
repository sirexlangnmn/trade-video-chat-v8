/**
 * File Transfer button event click
 */
function setMyFileShareBtn() {
    // make send file div draggable
    if (!isMobileDevice) dragElement(getId('sendFileDiv'), getId('imgShare'));

    fileShareBtn.addEventListener('click', (e) => {
        //window.open("https://fromsmash.com"); // for Big Data
        selectFileToShare();
    });
    sendAbortBtn.addEventListener('click', (e) => {
        abortFileTransfer();
    });
}

/**
 * Select the File to Share
 */
function selectFileToShare() {
    // no peers in the room
    if (!thereIsPeerConnections()) {
        userLog('info', 'No participants detected');
        return;
    }

    playSound('newMessage');

    Swal.fire({
        allowOutsideClick: false,
        background: swalBackground,
        imageAlt: 'trade-file-sharing',
        imageUrl: fileSharingImg,
        position: 'center',
        title: 'Share the file',
        input: 'file',
        inputAttributes: {
            accept: fileSharingInput,
            'aria-label': 'Select the file',
        },
        showDenyButton: true,
        confirmButtonText: `Send`,
        denyButtonText: `Cancel`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            fileToSend = result.value;

            if (!fileToSend || !fileToSend.size > 0) {
                userLog('error', 'File not selected or empty.');
                return;
            }

            console.log("selectFileToShare.result: ", result);
            console.log("selectFileToShare.fileToSend: ", fileToSend);
            console.log("selectFileToShare.fileToSend.name: ", fileToSend.name);
            let filetoSendExtensionName = getFileExtension(fileToSend.name);
            console.log("selectFileToShare.filetoSendExtensionName: ", filetoSendExtensionName);

            if (!checkFileFormat(filetoSendExtensionName)) {
                userLog("info", "File format not supported");
                return;
            }

            // send some metadata about our file to peers in the room
            sendToServer('fileInfo', {
                room_id: roomId,
                peer_name: myPeerName,
                file: {
                    fileName: fileToSend.name,
                    fileSize: fileToSend.size,
                    fileType: fileToSend.type,
                },
            });

            // send the File
            setTimeout(() => {
                sendFileData();
            }, 1000);
        }
    });
}

/**
 * Abort the file transfer
 */
function abortFileTransfer() {
    if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
        sendFileDiv.style.display = 'none';
        sendInProgress = false;
        sendToServer('fileAbort', {
            room_id: roomId,
            peer_name: myPeerName,
        });
    }
}

function getFileExtension(fileName) {
    // return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    return fileName.substring(fileName.lastIndexOf('.') + 1);
}

function checkFileFormat(filetoSendExtensionName) {
    // extract conditions to array
    const fileFormat = ['doc', 'docs', 'docx', 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'mp4', 'mkv'];
    return (fileFormat.includes(filetoSendExtensionName) ? true : false);
}

/**
 * Create File Sharing Data Channel
 * @param {*} peer_id
 */
function createFileSharingDataChannel(peer_id) {
    fileDataChannels[peer_id] = peerConnections[peer_id].createDataChannel('trade_file_sharing_channel');
    fileDataChannels[peer_id].binaryType = 'arraybuffer';
    fileDataChannels[peer_id].onopen = (event) => {
        console.log('fileDataChannels created', event);
    };
}

/**
 * Handle File Sharing
 * @param {*} data
 */
function handleDataChannelFileSharing(data) {
    console.log('handleDataChannelFileSharing.data', data);
    receiveBuffer.push(data);
    receivedSize += data.byteLength;

    // let getPercentage = ((receivedSize / incomingFileInfo.fileSize) * 100).toFixed(2);
    // console.log("Received progress: " + getPercentage + "%");

    if (receivedSize === incomingFileInfo.fileSize) {
        incomingFileData = receiveBuffer;
        receiveBuffer = [];
        endDownload();
    }
}

/**
 * Send File Data trought datachannel
 * https://webrtc.github.io/samples/src/content/datachannel/filetransfer/
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/filetransfer/js/main.js
 */
function sendFileData() {
    console.log('Send file ' + fileToSend.name + ' size ' + bytesToSize(fileToSend.size) + ' type ' + fileToSend.type);

    sendInProgress = true;

    sendFileInfo.innerHTML =
        'File name: ' +
        fileToSend.name +
        '<br>' +
        'File type: ' +
        fileToSend.type +
        '<br>' +
        'File size: ' +
        bytesToSize(fileToSend.size) +
        '<br>';

    sendFileDiv.style.display = 'inline';
    sendProgress.max = fileToSend.size;
    fileReader = new FileReader();
    let offset = 0;

    fileReader.addEventListener('error', (err) => console.error('fileReader error', err));
    fileReader.addEventListener('abort', (e) => console.log('fileReader aborted', e));
    fileReader.addEventListener('load', (e) => {
        if (!sendInProgress) return;

        // peer to peer over DataChannels
        sendFSData(e.target.result);
        offset += e.target.result.byteLength;

        sendProgress.value = offset;
        sendFilePercentage.innerHTML = 'Send progress: ' + ((offset / fileToSend.size) * 100).toFixed(2) + '%';

        // send file completed
        if (offset === fileToSend.size) {
            sendInProgress = false;
            sendFileDiv.style.display = 'none';
            userLog('success', 'The file ' + fileToSend.name + ' was sent successfully.');
        }

        if (offset < fileToSend.size) readSlice(offset);
    });
    const readSlice = (o) => {
        const slice = fileToSend.slice(offset, o + chunkSize);
        fileReader.readAsArrayBuffer(slice);
    };
    readSlice(0);
}

/**
 * Send File through RTC Data Channels
 * @param {*} data fileReader e.target.result
 */
function sendFSData(data) {
    for (let peer_id in fileDataChannels) {
        if (fileDataChannels[peer_id].readyState === 'open') fileDataChannels[peer_id].send(data);
    }
}

/**
 * File Transfer aborted by peer
 */
function handleFileAbort() {
    receiveBuffer = [];
    incomingFileData = [];
    receivedSize = 0;
    console.log('File transfer aborted');
    userLog('toast', '⚠️ File transfer aborted');
}

/**
 * Get remote file info
 * @param {*} config file
 */
function handleFileInfo(config) {
    incomingFileInfo = config;
    incomingFileData = [];
    receiveBuffer = [];
    receivedSize = 0;
    let fileToReceiveInfo =
        ' From: ' +
        incomingFileInfo.peerName +
        '\n' +
        ' incoming file: ' +
        incomingFileInfo.fileName +
        '\n' +
        ' size: ' +
        bytesToSize(incomingFileInfo.fileSize) +
        '\n' +
        ' type: ' +
        incomingFileInfo.fileType;
    console.log(fileToReceiveInfo);
    userLog('toast', fileToReceiveInfo);
}

/**
 * The file will be saved in the Blob. You will be asked to confirm if you want to save it on your PC / Mobile device.
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob
 */
function endDownload() {
    playSound('download');

    // save received file into Blob
    const blob = new Blob(incomingFileData);
    const file = incomingFileInfo.fileName;

    incomingFileData = [];

    // if file is image, show the preview
    if (isImageURL(incomingFileInfo.fileName)) {
        const reader = new FileReader();
        reader.onload = (e) => {
            Swal.fire({
                allowOutsideClick: false,
                background: swalBackground,
                position: 'center',
                title: 'Received file',
                text: incomingFileInfo.fileName + ' size ' + bytesToSize(incomingFileInfo.fileSize),
                imageUrl: e.target.result,
                // imageAlt: 'trade-file-img-download',
                showDenyButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Cancel`,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            }).then((result) => {
                if (result.isConfirmed) saveBlobToFile(blob, file);
            });
        };
        // blob where is stored downloaded file
        reader.readAsDataURL(blob);
    } else {
        // not img file
        Swal.fire({
            allowOutsideClick: false,
            background: swalBackground,
            // imageAlt: 'trade-file-download',
            imageUrl: fileSharingImg,
            position: 'center',
            title: 'Received file',
            text: incomingFileInfo.fileName + ' size ' + bytesToSize(incomingFileInfo.fileSize),
            showDenyButton: true,
            confirmButtonText: `Save`,
            denyButtonText: `Cancel`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
        }).then((result) => {
            if (result.isConfirmed) saveBlobToFile(blob, file);
        });
    }
}

/**
 * Save to PC / Mobile devices
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * @param {*} blob
 * @param {*} file
 */
function saveBlobToFile(blob, file) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}