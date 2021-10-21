import { Database, Auth, } '/common/js/firebaseinit.js';
import {
    USER_ID,
    USER_TOKEN,
    SESSION_TOKEN,
    setVariable,
    EXISTS_ANDROID_INTERFACE,
    USER_ROOT,
} from '/common/js/variables.js';
import { generateToken, getLongDateTime, displayErrorDialog, } from '/common/js/generalfunc.js';
import { uploadSessionLogs, log, err, } from '/common/js/logging.js';
import { Dialog, Menu, } from '/common/js/overlays.js';

/**
 * Gets current user info from Firebase Auth and stores the id in the global variable USER_ID.
 */
const getUserData = async () => {

    // load all auth data of the user to AuthData
    const FirebaseAuth = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js');
    FirebaseAuth.onAuthStateChanged(Auth, (user) => {
        if (!user) {
            console.error('generalfunc.js: user signed out / not signed in');
            localStorage.removeItem('AuthData');
            localStorage.removeItem('Auth.UID');

            // open login page if not already on login page
            if (!location.href.includes('/auth')) location.href = '/auth';
            return;
        }
        localStorage.setItem('AuthData', JSON.stringify(user));
        localStorage.setItem('Auth.UID', JSON.stringify(user.uid));
        setVariable('AuthData', user);
        setVariable('USER_ID', user.uid);
        setVariable('USER_ROOT', user.uid);
    });

    // load all data of the user to UserData
    const FirebaseDatabase = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js');
    FirebaseDatabase.onValue(FirebaseDatabase.ref(Database, USER_ROOT), (snapshot) => {
        const data = snapshot.val();
        setVariable('UserData', data);
        localStorage.setItem('UserData', JSON.stringify(data));
    }, (error) => {
        displayErrorDialog(error, 'init.js: getUserData()');
    });
}

/**
 * Creates the user token and stores it in the global variable USER_TOKEN.
 */
const generateUserToken = () => {
    if (!localStorage.getItem('UserData.token')) {
        setVariable('USER_TOKEN', generateToken());
        localStorage.setItem('UserData.token', USER_TOKEN);
        console.log(`generalfunc.js: user: new token = ${USER_TOKEN}`);
    }
    setVariable('USER_TOKEN', localStorage.getItem('UserData.token'));
}

/**
 * Sets SESSION_TOKEN to current date time. Crucial for logging functions.
 */
const generateSessionToken = () => {
    setVariable('SESSION_TOKEN', getLongDateTime());
}

const init = () => {
    /* Uncomment to start displaying logs in the console.
     * setVariable('DEBUG', true);
     */
     
    /* These lines are crucial and must be run before all module functions.
     * The order of execution is important and shouldn't be messed with.
     * getUserInfo            ->  Gets user info from Firebase db asynchronously and loads them into global variables / localStorage.
     * generateUserToken      ->  Generates a token for current user if it doesn't already exist in localStorage. Used to to recognise a device. Crucial for logging functions.
     * generateSessionToken   ->  Generates a date & time string. Crucial for logging functions.
     * setVariable LOGS_ROOT  ->  Sets LOGS_ROOT to root of current session logs.
     */
    getUserData();
    generateUserToken();
    generateSessionToken();
    if (!USER_TOKEN) throw 'Error: undefined USER_TOKEN';
    if (!SESSION_TOKEN) throw 'Error: undefined SESSION_TOKEN';
    setVariable('LOGS_ROOT', `${USER_TOKEN}/${SESSION_TOKEN}`);
    
    // upload logs in intervals (of 5s) for current session
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
