import { Auth, Database, USER_ROOT, } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js'
import { UserData, USER_ID, USER_TOKEN, setVariable, EXISTS_ANDROID_INTERFACE, } from '/common/js/variables.js';
import { generateToken, getLongDateTime, displayErrorDialog, } from '/common/js/generalfunc.js';
import { uploadSessionLogs, log, err, } from '/common/js/logging.js';
import { Dialog, Menu, } from '/common/js/overlays.js';

const getUserInfo = async () => {
    const FirebaseAuth = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js');
    FirebaseAuth.onAuthStateChanged(Auth, (auth) => {
        if (!auth) {
            localStorage.removeItem('UserData.auth');
            localStorage.removeItem('UserData.data');
            if (location.href.includes('/auth')) return;
            err('init.js: user not signed in, redirect to /auth');
            location.href = '/auth';
            return;
        }
        UserData['auth'] = auth;
        localStorage.setItem('UserData.auth', JSON.stringify(auth));
        setVariable('USER_ID', auth.uid);
    });
    FirebaseDatabase.onValue(FirebaseDatabase.ref(Database, `${USER_ROOT}/${USER_ID}`), (snapshot) => {
        const data = snapshot.val();
        UserData['data'] = data;
        localStorage.setItem('UserData.data', JSON.stringify(data));
    }, (error) => {
        displayErrorDialog(error, 'init.js: getUserInfo()');
    });
}

const generateUserToken = () => {
    if (!localStorage.getItem('UserData.token')) {
        setVariable('USER_TOKEN', generateToken());
        localStorage.setItem('UserData.token', USER_TOKEN);
        log(`generalfunc.js: user: new token = ${USER_TOKEN}`);
    }
    setVariable('USER_TOKEN', localStorage.getItem('UserData.token'));
}

const init = () => {

    /* Uncomment to start displaying logs in the console.
     * setVariable('DEBUG', true);
     */
     
    /* These lines are crucial and must be run before all module functions.
     * The order of execution is important and shouldn't be messed with.
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
    log(`init.js: user: id = ${USER_ID}`);
    log(`[AND]: init.js: WebAppInterface: ${EXISTS_ANDROID_INTERFACE}`);
}

init();
