import {
    setVariable,
    EXISTS_ANDROID_INTERFACE,
    getUserID,
    generateUserToken,
    uploadSessionLogs,
    log,
    dialog,
    menu
} from '/common/js/modules.js';

// global onclick listeners
document.body.addEventListener('click', (e) => {
    log(`click: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
    if (['alertDialog_btn', 'actionDialog_btnClose'].includes(e.target.id) && e.target.innerHTML == 'Close') {
        e.target.id.slice(0, 5) == 'alert' ? dialog.hide('alert') : dialog.hide('action');
    }
    else if (['menuRoot', 'actionDialogRoot'].includes(e.target.id)) {
        e.target.id.slice(0, 4) == 'menu' ? menu.hide() : dialog.hide('action');
    }
});

// user ID recognises a person while user token recognises a device
getUserID();
generateUserToken();

// upload logs in intervals for current session
setInterval(() => {
    uploadSessionLogs();
}, 5000);

console.log('common.js loaded');
log(`[AND]: WebAppInterface: ${EXISTS_ANDROID_INTERFACE}`);
