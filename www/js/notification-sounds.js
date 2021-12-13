
/**
 * https://notificationsounds.com/notification-sounds
 * @param {*} name
 */
 async function playSound(name) {
    if (!notifyBySound) return;
    let sound = '../sounds/' + name + '.mp3';
    let audioToPlay = new Audio(sound);
    try {
        await audioToPlay.play();
    } catch (err) {
        // console.error("Cannot play sound", err);
        // Automatic playback failed. (safari)
        return;
    }
}