import { setVariable, EXISTS_ANDROID_INTERFACE, } from '/common/js/variables.js';
import { getUserInfo, generateUserToken, getLongDateTime, } from '/common/js/generalfunc.js';
import { uploadSessionLogs, log, err, } from '/common/js/logging.js';
import { Dialog, Menu, } from '/common/js/overlays.js';
    
const init = () => {
    /* Uncomment to start displaying logs in the console.
     * setVariable('DEBUG', true);
     */
     
    /* These three lines are crucial and must be run before all module functions.
     * getUserInfo                 -> Gets user info from Firebase db asynchronously
     * generateUserToken           -> Generates a token for current user if it doesn't already exist in localStorage. Used to to recognise a device. Crucial for logging functions.
     * setVariable 'SESSION_TOKEN' -> Sets SESSION_TOKEN to current date time. Crucial for logging functions.
     */
    getUserInfo();
    generateUserToken();
    setVariable('SESSION_TOKEN', getLongDateTime());
    
    // upload logs in intervals for current session
    setInterval(() => {
        uploadSessionLogs();
    }, 5000);
    
    // global onclick listeners
    document.body.addEventListener('click', (e) => {
        log(`init.js: click: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
        if (['alertDialog_btn', 'actionDialog_btnClose'].includes(e.target.id) && e.target.innerHTML == 'Close') {
            e.target.id.slice(0, 5) == 'alert' ? Dialog.hide('alert') : Dialog.hide('action');
        } else if (['menuRoot', 'actionDialogRoot'].includes(e.target.id)) {
            e.target.id.slice(0, 4) == 'menu' ? Menu.hide() : Dialog.hide('action');
        }
    });
    
    console.log('init.js: loaded');
    log(`[AND]: init.js: WebAppInterface: ${EXISTS_ANDROID_INTERFACE}`);
}

init();
