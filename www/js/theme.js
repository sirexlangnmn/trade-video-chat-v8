/**
 * @param {*} theme
 */
 function setTheme(theme) {
    if (!theme) return;

    mirotalkTheme = theme;
    switch (mirotalkTheme) {
        case 'neon':
            // neon theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'black');
            document.documentElement.style.setProperty('--msger-private-bg', 'black');
            document.documentElement.style.setProperty('--left-msg-bg', '#da05f3');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#579ffb');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #0500ff, -3px -3px 6px #da05f3');
            break;
        case 'dark':
            // dark theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', '#16171b');
            document.documentElement.style.setProperty('--msger-bg', '#16171b');
            document.documentElement.style.setProperty('--msger-private-bg', '#16171b');
            document.documentElement.style.setProperty('--left-msg-bg', '#222328');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#0a0b0c');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #0a0b0c, -3px -3px 6px #222328');
            break;
        case 'forest':
            // forest theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'black');
            document.documentElement.style.setProperty('--msger-private-bg', 'black');
            document.documentElement.style.setProperty('--left-msg-bg', '#2e3500');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#004b1c');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #27944f, -3px -3px 6px #14843d');
            break;
        case 'sky':
            // sky theme
            swalBackground = 'rgba(0, 0, 0, 0.7)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'black');
            document.documentElement.style.setProperty('--msger-private-bg', 'black');
            document.documentElement.style.setProperty('--left-msg-bg', '#0c95b7');
            document.documentElement.style.setProperty('--private-msg-bg', '#f77070');
            document.documentElement.style.setProperty('--right-msg-bg', '#012a5f');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'white');
            document.documentElement.style.setProperty('--btn-color', 'black');
            document.documentElement.style.setProperty('--btn-opc', '1');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--my-settings-label-color', '#03a5ce');
            document.documentElement.style.setProperty('--box-shadow', '3px 3px 6px #03a5ce, -3px -3px 6px #03a5ce');
            break;
        case 'ghost':
            // ghost theme
            swalBackground = 'rgba(0, 0, 0, 0.150)';
            document.documentElement.style.setProperty('--body-bg', 'black');
            document.documentElement.style.setProperty('--msger-bg', 'transparent');
            document.documentElement.style.setProperty('--msger-private-bg', 'black');
            document.documentElement.style.setProperty('--wb-bg', '#000000');
            document.documentElement.style.setProperty('--wb-hbg', '#000000');
            document.documentElement.style.setProperty('--btn-bg', 'transparent');
            document.documentElement.style.setProperty('--btn-color', 'white');
            document.documentElement.style.setProperty('--btn-opc', '0.7');
            document.documentElement.style.setProperty('--btns-left', '20px');
            document.documentElement.style.setProperty('--box-shadow', '0px');
            document.documentElement.style.setProperty('--my-settings-label-color', 'limegreen');
            document.documentElement.style.setProperty('--left-msg-bg', 'rgba(0, 0, 0, 0.7)');
            document.documentElement.style.setProperty('--private-msg-bg', 'rgba(252, 110, 110, 0.7)');
            document.documentElement.style.setProperty('--right-msg-bg', 'rgba(0, 0, 0, 0.7)');
            break;
        // ...
        default:
            console.log('No theme found');
    }
}
