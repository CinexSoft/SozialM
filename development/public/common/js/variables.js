/**
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

import { RTDB_USERS_ROOT, RTDB_SLOGS_ROOT, RTDB_CHATS_ROOT, } from '/common/js/firebaseinit.js';
 
/**
 * Holds authentication info about the user.
 * @type {Object} Stores user info from Firebase Auth.
 */
export let AuthData = {};

/**
 * Holds non-auth info about the user.
 * @type {Object} Stores user info from Firebase Auth.
 */
export let UserData = {}; 

/**
 * Holds UID.
 * @type {String} Stores UID from Firebase Auth.
 */
export let USER_ID = '';

/**
 * USER_TOKEN is a random 64 bit alphanumeric string that is used to recognise a device until browser cookies get cleared.
 * The token is used to then identify the logs taken for a session.
 * If user signs in, the logs under a token also contain the user id.
 * @type {String}
 */
export let USER_TOKEN = '';

/**
 * Flag
 * @type {Boolean} If true, prints debug info in the console.
 */
export let DEBUG = !true;

/**
 * Flag
 * @type {Boolean} If true, reloads the theme/accent colors based on usage of function loadTheme().
 */
export let LOAD_THEME = !true;

/**
 * Session logs token
 * @type {String} Stores current session startup time.
 */
export let SESSION_TOKEN;

/**
 * Database root
 * @type {String} root location of user data in database.
 */
export let USER_ROOT;

/**
 * Database root
 * @type {String} root location of logs in database.
 */
export let LOGS_ROOT;

/**
 * Database root
 * @type {String} root location of chats in database.
 */
export let CHAT_ROOT;

/**
 * Checks if the Android WebAppInterface exists.
 * The `Android` WebAppInterface is a class available in the Android APK of this project.
 * The interface allows the website to use Android features through javascript without requiring an independent Android app to be developed.
 * The interface is available only when this webpage is loaded on the Android APK.
 * @type {Boolean}
 */
export const EXISTS_ANDROID_INTERFACE = typeof Android !== 'undefined'
                                     && typeof Android.isSozialMWebapp === 'function'
                                     && Android.isSozialMWebapp();

/**
 * Setter for global variables.
 *
 * This is for scripts that import modules.js.
 * @param {String} variable Variable identifier, valid values are listed below - case sensitive.
 * @param {Any} value New value of variable.
 *
 * Available values of parameter 'variable':
 * @param {Object}  AuthData
 * @param {Object}  UserData
 * @param {String}  USER_ID
 * @param {String}  USER_TOKEN
 * @param {Boolean} DEBUG
 * @param {Boolean} LOAD_THEME
 * @param {String}  SESSION_TOKEN
 * @param {String}  USER_ROOT - ONLY pass in the user id, DON'T pass in database root.
 * @param {String}  LOGS_ROOT - ONLY pass in the user token + session token, DON'T pass in database root.
 * @param {String}  CHAT_ROOT - ONLY pass in the chat room id, DON'T pass in database root.
 */
export const setVariable = (variable, value) => {
    switch (variable) {
        case 'AuthData':
            UserData = value;
            break;
        case 'UserData':
            UserData = value;
            break;
        case 'USER_ID':
            USER_ID = value;
            break;
        case 'USER_TOKEN':
            USER_TOKEN = value;
            break;
        case 'DEBUG':
            DEBUG = value;
            break;
        case 'LOAD_THEME':
            LOAD_THEME = value;
            break;
        case 'SESSION_TOKEN':
            SESSION_TOKEN = value;
            break;
        case 'USER_ROOT':
            USER_ROOT = `${RTDB_USERS_ROOT}/${value}`;
            break;
        case 'LOGS_ROOT':
            LOGS_ROOT = `${RTDB_SLOGS_ROOT}/${value}`;
            break;
        case 'CHAT_ROOT':
            CHAT_ROOT = `${RTDB_CHATS_ROOT}/${value}`;
            break;
        default:
            throw `Error: variables.js: setVariable(): no such variable: ${variable}\nNOTE: variable names are case-sensitive`;
    }
}

console.log('module variables.js loaded');
