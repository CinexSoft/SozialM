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

/**
 * Used to recognise a user.
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
 * Checks if the Android WebAppInterface exists.
 * The `Android` WebAppInterface is a class available in the Android APK of this project.
 * The interface allows the website to use Android features through javascript without requiring an independent Android app to be developed.
 * The interface is available only when this webpage is loaded on the Android APK.
 * @type {Boolean}
 */
export const EXISTS_ANDROID_INTERFACE = typeof Android !== 'undefined'
                                     && typeof Android.isSozialnMedienWebapp === 'function'
                                     && Android.isSozialnMedienWebapp();

/**
 * Setter for global variables.
 *
 * Available values:
 - USER_ID
 - USER_TOKEN
 - DEBUG
 - LOAD_THEME
 - SESSION_TOKEN
 *
 * This is for scripts that import modules.js.
 * @param {String} variable Variable identifier - case sensitive.
 * @param {*} value New value of variable.
 */
export const setVariable = (variable, value) => {
    switch (variable) {
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
        default:
            throw `Error: for ${variable}, no such variable in variables.js, note that variables are case-sensitive`;
    }
}
