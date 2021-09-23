/**
 * modules.js
 *
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

import { Auth, Database, DB_ROOT } from '/common/js/firebaseinit.js';
import { Dialog } from '/common/js/overlays.js'
import { onAuthStateChanged as firebaseOnAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import {
    ref as firebaseDBRef,
    update as firebaseDBUpdate,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

/**
 * Global theme colors.
 * These can be used to modify the accent of the website.
 * It was meant to provide users with custom control over
 * how their account looks and feels.
 * CSS definitions: `/common/css/colors.css`
 *
 * Available Colors:
 - ACCENT_BGCOLOR
 - PRIMARY_BGCOLOR
 - SECONDARY_BGCOLOR
 - CHAT_BUBBLE_BGCOLOR
 - HIGHLIGHT_SELECT_COLOR
 - CONTROL_COLOR
 - FG_COLOR
 - DARK_FG_COLOR
 */
export const Colors = {
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --accent-bgcolor
     */
    ACCENT_BGCOLOR: document.body.style.getPropertyValue('--accent-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --primary-bgcolor
     */
    PRIMARY_BGCOLOR: document.body.style.getPropertyValue('--primary-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --secondary-bgcolor
     */
    SECONDARY_BGCOLOR: document.body.style.getPropertyValue('--secondary-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --chat-bubble-bgcolor
     */
    CHAT_BUBBLE_BGCOLOR: document.body.style.getPropertyValue('--chat-bubble-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --highlight-select-color
     */
    HIGHLIGHT_SELECT_COLOR: document.body.style.getPropertyValue('--highlight-select-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --control-color
     */
    CONTROL_COLOR: document.body.style.getPropertyValue('--control-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --fg-color
     */
    FG_COLOR: document.body.style.getPropertyValue('--fg-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --dark-fg-color
     */
    DARK_FG_COLOR: document.body.style.getPropertyValue('--dark-fg-color'),
}

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
let LOAD_THEME = !true;

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
 - DEBUG
 - LOAD_THEME
 *
 * This is for scripts that import modules.js.
 * @param {String} variable Variable identifier - case sensitive.
 * @param {*} value New value of variable.
 */
export const setVariable = (variable, value) => {
    switch (variable) {
        case 'DEBUG':
            DEBUG = value;
            break;
        case 'LOAD_THEME':
            LOAD_THEME = value;
            break;
        default:
            throw `Error: for variable ${variable}, no such variable in modules.js, note that variables are case-sensitive`;
    }
}

// Object to hold logs with nanosecond timestamps as keys
const SessionLogs = {};

/**
 * Returns a local timestamp in ms since Unix epoch or in ns since app launch.
 * @param {Boolean} nanosec Optional, if true returns nanosecond time since app launch. If false, returns milliseconds time since Unix epoch.
 * @return {Number} Milliseconds time since Unix epoch.
 * @return {Number} Nanosecond time since app launch (conditional).
 */
export const getTimeStamp = (nanosec = false) => {
    if (!nanosec) return new Date().getTime();
    else return Math.floor(performance.now() * 1000);
}

/**
 * Gets current time zone, date time or return a date object.
 * @param {Boolean} Optional, if false returns a date object
 * @return {String} Current date in Continent/City/YYYY-MM-DD @ HH:MM:SS format.
 * @return {Object} Date object (conditional).
 */
export const getLongDateTime = (long_time = true) => {
    let date_ob = new Date();
    if (!long_time) return date_ob;
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ('0' + date_ob.getHours()).slice(-2);
    let minutes = ('0' + date_ob.getMinutes()).slice(-2);
    let seconds = ('0' + date_ob.getSeconds()).slice(-2);
    return `${Intl.DateTimeFormat().resolvedOptions().timeZone}/${year}-${month}-${date} @ ${hours}:${minutes}:${seconds}`;
}

// session time token
const SESSION_TOKEN = getLongDateTime();

/**
 * Console log function.
 * Apart from wrapping console.log, it also allows the logs to be uploaded to database.
 * @param {String} val The stuff to be printed
 */
export const log = (val) => {
    if (DEBUG) console.log(`Log: modules.js: ${val}`);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = val;
}

/**
 * Console error function
 * Apart from wrapping console.error, it also allows the logs to be uploaded to database.
 * @param {String} val The stuff to be printed
 */
export const err = (val) => {
    if (DEBUG) console.error(`Err: ${val}`);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = `[ERR]: ${val}`;
}

/**
 * Console warn function
 * Apart from wrapping console.warn, it also allows the logs to be uploaded to database.
 * @param {String} val The stuff to be printed
 */
export const wrn = (val) => {
    if (DEBUG) console.warn(`Wrn: ${val}`);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = `[WRN]: ${val}`;
}

/**
 * Uploads debug logs to the database for debugging.
 */
export const uploadSessionLogs = () => {
    firebaseDBUpdate(firebaseDBRef(Database, `${DB_ROOT}/records/sessionlogs/${USER_TOKEN}/${SESSION_TOKEN}`), SessionLogs).then(() => {
        // do nothing
    }).catch((error) => {
        err(`modules.js: ${error}`);
    });
}

/**
 * Creates a random `length` sized token.
 * @param {Number} length Optional, default value = 64. Size of token.
 * @return {String} The token of given size.
 */
export const generateToken = (length = 64) => {
    let arrayOfChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let outputToken = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (arrayOfChars.length - 1)).toFixed(0);
        outputToken[i] = arrayOfChars[j];
    }
    return outputToken.join('');
}

/**
 * Creates the user token and stores it in the global variable USER_TOKEN.
 */
export const generateUserToken = () => {
    if (!localStorage.getItem('User.token')) {
        USER_TOKEN = generateToken();
        localStorage.setItem('User.token', USER_TOKEN);
        log(`modules.js: user: new token = ${USER_TOKEN}`);
    }
    USER_TOKEN = localStorage.getItem('User.token');
}

/**
 * Gets current user info from Firebase Auth and stores the id in the global variable USER_ID.
 */
export const getUserInfo = () => {
    firebaseOnAuthStateChanged(Auth, (user) => {
        if (!user) {
            err('modules.js: user not signed in');
            localStorage.removeItem('Auth.user');
            return;
        }
        USER_ID = user.uid;
        localStorage.setItem('Auth.user', JSON.stringify(user));
        log(`modules.js: user: id = ${USER_ID}`);
    });
}

/**
 * Replace certain special characters of a string with 'ASCII[character_code]'.
 * @param {String} str The string to be encoded.
 * @return {String} The encoded string.
 */
export const encode = (str) => {
    let specialChars = '\n\r!"#$%&\'./<=>@[\\]{}';
    for (let character of specialChars) {
        str = str.replaceAll(character, `ASCII${character.charCodeAt(0)}`);
    }
    if (DEBUG) console.log(`Log: modules.js: encode(): str = ${str}`);
    return str;
}

/**
 * Decode string from 'ASCII[character_code]' format to something more readable.
 * @param {String} str The string to be decoded.
 * @return {String} The decoded string.
 */
export const decode = (str) => {
    let specialChars = '\n\r!"#$%&\'./<=>@[\\]{}';
    for (let character of specialChars) {
        str = str.replaceAll(`ASCII${character.charCodeAt(0)}`, character);
    }
    if (DEBUG) console.log(`Log: modules.js: decode(): str = ${str}`);
    return str;
}

/**
 * Download a file using the Android WebAppInterface.
 * @param {String} directurl The direct URL to the file.
 * @param {String} filename Optional, but recommended otherwise the file extension is set to '.bin'.
 * @throws {Error} android interface doesn't exist.
 */
export const download = (directurl, filename = `sozialnmedien_${getTimeStamp()}.bin`) => { 
    if (EXISTS_ANDROID_INTERFACE) {
        try {
            Android.download(directurl, filename);
            log('[AND]: modules.js: download(): through Android WepAppInterface');
        } catch (error) {
            err(`modules.js: ${error}`);
            throw error;
        }
        return;
    }
    err('modules.js: android interface doesn\'t exist');
    throw 'Error: android interface doesn\'t exist';
    let element = document.createElement('a');
    element.setAttribute('href', directurl);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Copy some text.
 * @param {String} str The string to be copied.
 */
export const copyPlainTxt = (copytext = '') => {
    copytext = copytext.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(copytext).then(() => {
        log('modules.js: text copied to clipboard');
    }).catch((error) => {
        err(`modules.js: ${error}`);
        if (EXISTS_ANDROID_INTERFACE) {
            Android.copyToClipboard(copytext);
            log('[AND]: modules.js: copyPlainTxt(): through Android WepAppInterface');
            Android.showToast('Text copied!');
        } else {
            err('modules.js: android interface doesn\'t exist');
            Dialog.display('alert', 'Oops!', 'Copy text to clipboard failed');
        }
    });
}

/**
 * Get the name of the current browser.
 * @return {String} Name of current browser.
 */
export const getBrowser = () => {
    if (navigator.userAgent.match(/Opera|OPR/)) return 'opera';
    if (navigator.userAgent.includes('Chrome')) return 'chrome';
    if (navigator.userAgent.includes('Safari')) return 'safari';
    if (navigator.userAgent.includes('Firefox')) return 'firefox';
    if (navigator.userAgent.indexOf('MSIE') != -1 || !!document.documentMode == true) return 'IE';
    return 'unknown';
}

/**
 * Select HTML element/s from the document root using CSS syntax.
 * @param {String} val The CSS representation of the element.
 * @return {Node} The HTML element or,
 * @return {HTMLCollection} A collection of similar HTML elements.
 */
export const $ = (val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) return document.querySelectorAll(val);
    switch (val.charAt(0)) {
        case '#':
            return document.getElementById(val.substring(1));
        case '.':
            return document.getElementsByClassName(val.substring(1));
        default:
            return document.getElementsByTagName(val);
    }
}

/**
 * Select HTML element/s from an HTML node using CSS syntax.
 * @param {Node} element The element from which other elements will be selected.
 * @param {String} val The CSS representation of the element.
 * @return {Node} The HTML element or,
 * @return {HTMLCollection} A collection of similar HTML elements.
 */
export const getChildElement = (element, val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) return element.querySelectorAll(val);
    switch (val.charAt(0)) {
        case '#':
            return document.getElementById(val.substring(1));
        case '.':
            return element.getElementsByClassName(val.substring(1));
        default:
            return element.getElementsByTagName(val);
    }
}

/**
 * Checks if the given child has the given parent.
 * @param {Node} child The child in concern.
 * @param {Node} parent The parent in concern.
 * @return {Boolean} If true, the given child has the given parent.
 */
export const childHasParent = (child, parent) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            log(`modules.js: ${node.nodeName} of class = ${node.className} has parent ${parent.nodeName} of class = ${parent.className}`);
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * Takes an HTML string, converts it to a node and attatches it to the element passed.
 * This is done by detaching and reattaching the element to its parent to improve performance.
 * @param {Node} element The element to which HTML will be appended.
 * @param {String} str The HTML string.
 * @param {Boolean} reversed  Prepends the HTML to the node.
 */
export const appendHTMLString = (element, str = '', reversed = false) => {
    let parent =  element.parentNode;
    let next = element.nextSibling;
    if (!parent) return;                                   // No parent node? Abort!
    parent.removeChild(element);                           // Detach node from DOM.
    if (!reversed) element.innerHTML += str;               // append html string
    else element.innerHTML = `${str}${element.innerHTML}`; // reversed append html
    parent.insertBefore(element, next);                    // Re-attach node to DOM.
}

/** 
 * Looks for updates to the android app and opens an alert dialog if update is available.
 */
export const checkForApkUpdates = () => {
    if (!EXISTS_ANDROID_INTERFACE) return;
    log('[APK]: modules.js: checking for update');
    try { 
        switch (Android.updateAvailable()) {
            case 'true':
                log('modules.js: alertDialog: launch: update available');
                Dialog.display('alert', 'Update available', 'A new version of this Android app is available.', 'Download', () => {
                   setTimeout(() => {
                        Android.showToast('Downloading app, look into your notification panel');
                        Android.download('https://sozialnmedien.web.app/downloads/app.web.sozialnmedien.apk', 'app.web.sozialnmedien.apk');
                    }, 500);
                    Dialog.hide('alert');
                    log('[AND]: modules.js: downloaded Android app');
                });
                break;
            case 'failed':
                err('modules.js: update check failed');
                break;
        }
    }
    catch (error) {
        err(`modules.js: ${error}`);
    }
}

/**
 * Scrolls down a view smoothly if amount of element below viewport is less than 720 pixels.
 * @param {Node} element The element to scroll down.
 * @param {Boolean} get_behavior_only If true, only returns scroll behavior based on amount of element below viewport.
 * @param {Boolean} not_smooth Explicitly mention to scroll without animations.
 * @return {String} The scroll behavior (conditional).
 */
export const smoothScroll = (element, get_behavior_only = false, smooth = true) => {
    // check if down scrollable part of element is < 720 px
    if (smooth && element.scrollHeight - (document.body.clientHeight - 110) - element.scrollTop < 720) {
        if (get_behavior_only) return 'smooth';
        element.style.scrollBehavior = 'smooth';
    } else {
        if (get_behavior_only) return 'auto';
        element.style.scrollBehavior = 'auto';
    }
    log(`modules.js: smoothscroll(): element = ${element.nodeName} class = ${element.className} diff = ${element.scrollHeight - element.scrollTop}`);
    element.scrollTop = element.scrollHeight;
}

/**
 * @deprecated Apparently unnecessary function.
 * This function was supposed to reload the dynamic accent colors of the newly added chat bubbles.
 * But currently we're using an all-teal accent (former WhatsApp brand colors).
 * So this won't be needed.
 */
export const loadTheme = () => {
    if (!LOAD_THEME) return;
    // custom accents: accent background color
    for (let element of $('.acc_bg')) {
        element.style.backgroundColor = ACCENT_BGCOLOR;
        element.style.borderColor = ACCENT_BGCOLOR;
        element.style.color = DARK_FG_COLOR;
    }
    // custom accents: primary background color
    for (let element of $('.prim_bg')) {
        element.style.backgroundColor = PRIMARY_BGCOLOR;
        element.style.borderColor = PRIMARY_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: secondary background color
    for (let element of $('.sec_bg')) {
        element.style.backgroundColor = SECONDARY_BGCOLOR;
        element.style.borderColor = SECONDARY_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: chat bubble background color
    for (let element of $('.chatbubble_bg')) {
        element.style.backgroundColor = CHAT_BUBBLE_BGCOLOR;
        element.style.borderColor = CHAT_BUBBLE_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: controls background color
    for (let element of $('.control_bg')) {
        element.style.backgroundColor = CONTROL_COLOR;
        element.style.borderColor = CONTROL_COLOR;
        element.style.color = DARK_FG_COLOR;
    }
    log('modules.js: loadTheme(): loaded');
}
