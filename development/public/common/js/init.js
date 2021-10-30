import { Database, Auth, } from '/common/js/firebaseinit.js';
import {
    USER_ID,
    USER_TOKEN,
    SESSION_TOKEN,
    setVariable,
    EXISTS_ANDROID_INTERFACE,
    USER_ROOT,
} from '/common/js/variables.js';
import { generateToken, getLongDateTime, checkForApkUpdates, } from '/common/js/generalfunc.js';
import { uploadSessionLogs, log, err, } from '/common/js/logging.js';
import { Dialog, Menu, } from '/common/js/overlays.js';

/**
 * Gets current user info from Firebase Auth and stores the id in the global variable USER_ID.
 */
const getUserData = async () => {

    /* This code is to cut the delay of USER_ID being set as
     * FirebaseAuth.onAuthStateChanged is asynchronous.
     */
    setVariable('USER_ID', localStorage.getItem('Auth.UID'));

    // load all auth data of the user to AuthData
    const FirebaseAuth = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js');
    FirebaseAuth.onAuthStateChanged(Auth, async (user) => {
        if (!user) {
            err('init.js: getUserData(): signed out / not signed in');
            localStorage.removeItem('AuthData');
            localStorage.removeItem('UserData');
            localStorage.removeItem('Auth.UID');
            // open login page if not already on login page
            if (!location.href.includes('/auth')) location.href = '/auth';
            return;
        }
        localStorage.setItem('AuthData', JSON.stringify(user));
        localStorage.setItem('Auth.UID', user.uid);
        setVariable('AuthData', user);
        setVariable('USER_ID', user.uid);
        setVariable('USER_ROOT', user.uid);

        // load all data of the user to UserData
        const FirebaseDB = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js');
        FirebaseDB.onValue(FirebaseDB.ref(Database, USER_ROOT), (snapshot) => {
            const data = snapshot.val();
            setVariable('UserData', data);
            localStorage.setItem('UserData', JSON.stringify(data));
        }, (error) => {
            if (/permission|denied/i.test(String(error))) {
                Dialog.display('alert', 'Fatal Error!', 'An authorization error occurred. Try clearing cookies for this site and try again.');
            }
            err(`init.js: getUserData(): ${error}`);
        });
    });
}

/**
 * Creates the user token and stores it in the global variable USER_TOKEN.
 */
const generateUserToken = () => {
    if (!localStorage.getItem('UserData.token')) {
        setVariable('USER_TOKEN', generateToken());
        localStorage.setItem('UserData.token', USER_TOKEN);
        log(`init.js: generateUserToken(): USER_TOKEN = ${USER_TOKEN}`);
    }
    setVariable('USER_TOKEN', localStorage.getItem('UserData.token'));
}

/**
 * Sets SESSION_TOKEN to current date time. Crucial for logging functions.
 */
const generateSessionToken = () => {
    setVariable('SESSION_TOKEN', getLongDateTime());
}

/**
 * It is crucial for this function to run before any other functions.
 * This function runs if init.js is imported into any script file or if
 * it is linked into a <script>.
 *
 * Purposes:
 *   Initialises USER_TOKEN & SESSION_TOKEN - variables used by logger.
 *   Starts the logger.
 *   Initialises USER_ID.
 *   Downloads user authentication information.
 *
 * Without this, multiple scripts will misbehave.
 */
const preInit = () => {

    // Uncomment to start displaying logs in the console.
    // setVariable('DEBUG', true);

    /* These lines are crucial and must be run before all module functions.
     * The order of execution is important and shouldn't be messed with.
     * generateUserToken      ->  Generates a token for current user if it doesn't already exist in localStorage. Used to to recognise a device. Crucial for logging functions.
     * generateSessionToken   ->  Generates a date & time string. Crucial for logging functions.
     * setVariable LOGS_ROOT  ->  Sets LOGS_ROOT to root of current session logs.
     * uploadSessionLogs      ->  Starts uploading logs to db for debugging.
     */
    generateUserToken();
    generateSessionToken();
    if (!USER_TOKEN) throw 'Error: init.js: init(): USER_TOKEN = undefined';
    if (!SESSION_TOKEN) throw 'Error: init.js: init(): SESSION_TOKEN = undefined';
    setVariable('LOGS_ROOT', `${USER_TOKEN}/${SESSION_TOKEN}`);
    setInterval(() => {
        uploadSessionLogs();
    }, 5000);

    // gets user info from Firebase db asynchronously and loads them into global variables / localStorage.
    getUserData();

    log(`init.js: init(): USER_ID = ${USER_ID}`);
    log(`[AND]: init.js: init(): EXISTS_ANDROID_INTERFACE = ${EXISTS_ANDROID_INTERFACE}`);
}

export const init = () => {

    if (!localStorage.getItem('Auth.UID')
    &&  !location.href.includes('/auth')) {
        location.href = '/auth';
        throw 'Error: init: user not signed in';
    }
    // global onclick listeners
    document.body.addEventListener('click', (e) => {
        log(`init.js: onclick 'document.body': node = ${e.target.nodeName || 'null'} : class = ${e.target.className || 'null'} : id = ${e.target.id || 'null'}`);
        if (['alertDialog_btn', 'actionDialog_btnClose'].includes(e.target.id) && e.target.innerHTML == 'Close') {
            e.target.id.slice(0, 5) == 'alert' ? Dialog.hide('alert') : Dialog.hide('action');
        } else if (['menuRoot', 'actionDialogRoot'].includes(e.target.id)) {
            e.target.id.slice(0, 4) == 'menu' ? Menu.hide() : Dialog.hide('action');
        }
    });
    checkForApkUpdates();
}

console.log('module init.js loaded');

preInit();
