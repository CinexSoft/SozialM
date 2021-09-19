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
    ACCENT_BGCOLOR: document.body.style.getPropertyValue('--accent-bgcolor');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --primary-bgcolor
     */
    PRIMARY_BGCOLOR: document.body.style.getPropertyValue('--primary-bgcolor');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --secondary-bgcolor
     */
    SECONDARY_BGCOLOR: document.body.style.getPropertyValue('--secondary-bgcolor');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --chat-bubble-bgcolor
     */
    CHAT_BUBBLE_BGCOLOR: document.body.style.getPropertyValue('--chat-bubble-bgcolor');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --highlight-select-color
     */
    HIGHLIGHT_SELECT_COLOR: document.body.style.getPropertyValue('--highlight-select-color');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --control-color
     */
    CONTROL_COLOR: document.body.style.getPropertyValue('--control-color');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --fg-color
     */
    FG_COLOR: document.body.style.getPropertyValue('--fg-color');
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --dark-fg-color
     */
    DARK_FG_COLOR: document.body.style.getPropertyValue('--dark-fg-color');
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
 * Contains global data for behavior of overlays viz menus and dialogs.
 * The time taken for an overlay to animate out is Overlay.animation_duration ms.
 * Value of instance_open needs to be set to true everytime an overlay opens and to false everytime an overlay closes.
 * This has been made automatic when using dialog and menu functions.
 *
 * How low/high is too low/high?
 *      0 ms and over 5000 milliseconds is too low/high.
 */
export const Overlay = {
    /**
     * @type {Boolean} If an overlay is already open, other overlays are postponed for Overlay.animation_duration ms.
     */
    instance_open: false,
    /**
     * @type {Number} Can be modified to increase or decrease duration of overlay animations. Too low/high values may break the UI.
     */
    animation_duration: 250,
    /**
     * @deprecated The value associated is automatically handled by dialog.hide() and menu.hide().
     * Setter for scripts that import modules.js. Please do not use this function as the process has been made automatic.
     * @param {Boolean} val Is set to true if an overlay is opened. Reverse is true.
     */
    setInstanceOpen(val) {
        this.instance_open = val;
    },
    /**
     * Setter for scripts that import modules.js.
     * @param {Number} val Duration of all overlay animations.
     */
    setAnimDuration(val) {
        this.animation_duration = val;
    },
}

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
            throw `Error: for variable ${variable}, no such variable in module.js, note that variables are case-sensitive`;
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
    if (DEBUG) console.log(`Log: module.js: ${val}`);
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
        err(`module.js: ${error}`);
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
        log(`module.js: user: new token = ${USER_TOKEN}`);
    }
    USER_TOKEN = localStorage.getItem('User.token');
}

/**
 * Gets current user info from Firebase Auth and stores the id in the global variable USER_ID.
 */
export const getUserInfo = () => {
    firebaseOnAuthStateChanged(Auth, (user) => {
        if (!user) {
            err('module.js: user not signed in');
            localStorage.removeItem('Auth.user');
            return;
        }
        USER_ID = user.uid;
        localStorage.setItem('Auth.user', JSON.stringify(user));
        log(`module.js: user: id = ${USER_ID}`);
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
    if (DEBUG) console.log(`Log: module.js: encode(): str = ${str}`);
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
    if (DEBUG) console.log(`Log: module.js: decode(): str = ${str}`);
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
            log('[AND]: module.js: download(): through Android WepAppInterface');
        } catch (error) {
            err(`module.js: ${error}`);
            throw error;
        }
        return;
    }
    err('module.js: android interface doesn\'t exist');
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
        log('module.js: text copied to clipboard');
    }).catch((error) => {
        err(`module.js: ${error}`);
        if (EXISTS_ANDROID_INTERFACE) {
            Android.copyToClipboard(copytext);
            log('[AND]: module.js: copyPlainTxt(): through Android WepAppInterface');
            Android.showToast('Text copied!');
        } else {
            err('module.js: android interface doesn\'t exist');
            dialog.display('alert', 'Oops!', 'Copy text to clipboard failed');
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
    if (navigator.userAgent.indexOf('MSIE') != -1> || !!document.documentMode == true) return 'IE';
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
            log(`module.js: ${node.nodeName} of class = ${node.className} has parent ${parent.nodeName} of class = ${parent.className}`);
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

/* ----------------------------------------- TODO -------------------------------------------
 * The alert and action dialogs need to be made into a single
 * object named dialog.
 */

// alertDialog
const alertDialog = {
    // default button is Close
    display(title = 'Alert!', message = '', button = 'Close', func) {
        if (typeof button != 'string') {
            throw `Error: typeof button title = ${typeof button}, expected String`;
        }
        if (func && typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            log(`module.js: alertDialog display(): timeout = ${timeout}`);
            getChildElement($('#alertDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#alertDialog'), 'div')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#alertDialog_btn').innerHTML = button;
            // once: true removes listener after it fires atmost once
            if (func) $('#alertDialog_btn').addEventListener('click', func, { once: true });
            $('#alertDialogRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#alertDialog').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    hide(func) {
        $('#alertDialogRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#alertDialog').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
        }, Overlay.animation_duration);
        // additional function
        if (!func) return;
        if (typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
            return;
        }
        func.call();
    }
}

// actionDialog
const actionDialog = {
    onClickFunction: undefined,
    // default button is Ok
    display(title = 'Alert!', message = '', button = 'OK', func) {
        if (typeof button != 'string') {
            throw `Error: typeof button title = ${typeof button}, expected String`;
        }
        if (!func || typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        // remove previous button click listener if any
        if (this.onClickFunction) $('#actionDialog_btnOk').removeEventListener('click', this.onClickFunction);
        // the function to run on button click
        this.onClickFunction = func;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            log(`module.js: actionDialog display(): timeout = ${timeout}`);
            getChildElement($('#actionDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#actionDialog'), '.content')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#actionDialog_btnOk').innerHTML = button;    
            if (this.onClickFunction) $('#actionDialog_btnOk').addEventListener('click', this.onClickFunction);
            $('#actionDialogRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#actionDialog').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    hide(func) {
        $('#actionDialogRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#actionDialog').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        // remove button click listeners while hiding dialog, if any
        if (this.onClickFunction) $('#actionDialog_btnOk').removeEventListener('click', this.onClickFunction);
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
        }, Overlay.animation_duration);
        // additional function
        if (!func) return;
        if (typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
            return;
        }
        func.call();
    }
}

/*--------------------------------------- TODO START -------------------------------------------*/

/**
 * Represents a dialog.
 * Needs the code for a dialog in the HTML document.
 */
export const dialog = {
    /**
     * Display the dialog.
     * @param {String} category Either 'alert' or 'action'.
     * @param {String} title Title of the dialog.
     * @param {String} message Message to be displayed.
     * @param {String} button Title of the default button.
     * @param {Function} func Optional for 'alert' category, function to run if default is button clicked.
     * @throws {Error} If category is invalid.
     * @throws {Error} If no function is provided for 'action' category.
     */
    display(category, title, message, button, func) {
        if (category == 'alert') {
            alertDialog.display(title, message, button, func);
        } else if (category == 'action') {
            actionDialog.display(title, message, button, func);
        } else throw `Error: dialog category = ${category}, expected 'alert' or 'action'`;
    },
    /**
     * Hide the dialog.
     * @param {String} category Either 'alert' or 'action'.
     * @param {Function} func Optional, function to run once dialog is closed.
     * @throws {Error} If category is invalid.
     */
    hide(category, func) {
        if (category == 'alert') {
            alertDialog.hide(func);
        } else if (category == 'action') {
            actionDialog.hide(func);
        } else throw `Error: dialog category = ${category}, expected 'alert' or 'action'`;
    }
}

/*--------------------------------------- TODO END --------------------------------------------*/

/**
 * Represents a menu.
 * Needs the code for a menu in the HTML document.
 */
export const menu = {
    /**
     * Display the menu.
     * @param {String} title Optional, default value = 'Menu'. Title of the menu dialog.
     */
    display(title = 'Menu') {
        // delay when one overlay is already open
        let timeout = 0;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            log(`module.js: menu: timeout = ${timeout}`);
            getChildElement($('#menu'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            $('#menuRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#menu').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    /**
     * Hide the menu dialog.
     */
    hide() {
        $('#menuRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#menu').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
        }, Overlay.animation_duration);
    }
}

/** 
 * Looks for updates to the android app and opens an alert dialog if update is available.
 */
export const checkForApkUpdates = () => {
    if (!EXISTS_ANDROID_INTERFACE) return;
    log('[APK]: module.js: checking for update');
    try { 
        switch (Android.updateAvailable()) {
            case 'true':
                log('module.js: alertDialog: launch: update available');
                dialog.display('alert', 'Update available', 'A new version of this Android app is available.', 'Download', () => {
                   setTimeout(() => {
                        Android.showToast('Downloading app, look into your notification panel');
                        Android.download('https://sozialnmedien.web.app/downloads/chat.app.web.sozialnmedien.apk', 'chat.app.web.sozialnmedien.apk');
                    }, 500);
                    dialog.hide('alert');
                    log('[AND]: module.js: downloaded Android app');
                });
                break;
            case 'failed':
                err('module.js: update check failed');
                break;
        }
    }
    catch (error) {
        err(`module.js: ${error}`);
    }
}

/**
 * Scrolls down a view smoothly if amount of element below viewport is less than 720 pixels.
 * @param {Node} element The element to scroll down.
 * @param {Boolean} get_behavior_only If true, only returns scroll behavior based on amount of element below viewport.
 * @param {Boolean} not_smooth Explicitly mention to scroll without animations.
 * @return {String} The scroll behavior (conditional).
 */
export const smoothScroll = (element, get_behavior_only = true, not_smooth) => {
    // check if down scrollable part of element is < 720 px
    if (!not_smooth && element.scrollHeight - (document.body.clientHeight - 110) - element.scrollTop < 720) {
        if (!get_behavior_only) return 'smooth';
        element.style.scrollBehavior = 'smooth';
    } else {
        if (!get_behavior_only) return 'auto';
        element.style.scrollBehavior = 'auto';
    }
    log(`module.js: smoothscroll(): element = ${element.nodeName} class = ${element.className} diff = ${element.scrollHeight - element.scrollTop}`);
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
    log('module.js: loadTheme(): loaded');
}
