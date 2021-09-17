import { Database, DB_ROOT } from '/common/js/firebaseinit.js';
import { ref, update } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

/* modules.js
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

/* @deprecated
 * global theme colors
 * These can be used to modify the accent of the website
 * It was meant to provide users with custom control over
 * how their account looks and feels.
 */
const ACCENT_PRIMARY_BGCOLOR = '#075E54';
const ACCENT_SECONDARY_BGCOLOR = '#dcf8c6';
const ACCENT_TERTIARY_BGCOLOR = '#ece5dd';
const ACCENT_FG_COLOR = '#ffffff';

/* user ID and Token
 * uid stores id from Firebase auth
 * token is a random 64 bit alphanumeric string
 * that is used to recognise a device until browser
 * cookies get cleared.
 * The token is used to then identify the logs taken for
 * a session.
 * If user signs in, the logs of a token also contain the User ID
 */
export let USER_ID = '';
export let USER_TOKEN = '';

// flags
export let DEBUG = !true;            // prints debug logs in console
export let LOAD_THEME = !true;       // deprecated

/**
 * Checks if android interface exists.
 * The `Android` WebAppInterface is a class available
 * in the Android web APK of this project. The interface allows the
 * website to use Android features through javascript without requiring
 * a complete Android app to be developed.
 * The interface is available only when this webpage is loaded on the Android
 * web APK.
 */
export const EXISTS_ANDROID_INTERFACE = typeof Android !== 'undefined'
                                     && typeof Android.isSozialnMedienWebapp === 'function'
                                     && Android.isSozialnMedienWebapp();

/**
 * Contains global data for behavior of overlays viz. menus and dialogs
 * The time taken for an overlay to animate out is overlay.animation_duration ms.
 * Vlaue of instance_open needs to be set to true everytime an overlay opens and to false everytime an overlay closes.
 * @param {Boolean}     instance_open  If an overlay is already open, other overlays are postponed for overlay.animation_duration ms.
 * @param {Number} animation_duration  Can be modified to increase or decrease duration of overlay animations. Too low/high values may break the UI.
 * 
 * How low/high is too low/high?
 *      0 ms and over 5000 milliseconds is too low/high.
 *
 * @param {function}  setInstanceOpen Setter for scripts that import this module script.
 * @param {function}  setAnimDuration Setter for scripts that import this module script.
 */
export const overlay = {
    instance_open: false,
    animation_duration: 250,
    setInstanceOpen(val) {
        this.instance_open = val;
    },
    setAnimDuration(val) {
        this.animation_duration = val;
    },
}

/**
 * Setters for global variables
 * This is for scripts that import this module script
 * @param {String} variable  Variable name - case sensitive.
 * @param {String}    value  nlNew value of variable.
 */
export const setVariable = (variable, value) => {
    switch (variable) {
        case 'DEBUG':
            DEBUG = value;
            break;
        case 'LOAD_THEME':
            LOAD_THEME = value;
            break;
    }
}

/* Object to hold logs with timestamp as keys
 */
export const SessionLogs = {};

/**
 * Returns a local timestamp in ms since Unix epoch or in ns since app launch.
 * @param {Boolean} nanosec If true returns nanosecond time since app launch. If false, returns milliseconds time since Unix epoch
 */
export const getTimeStamp = (nanosec = false) => {
    if (!nanosec) return new Date().getTime();
    else return Math.floor(performance.now() * 1000);
}

/**
 * Gets current time zone, date time in Continent/City/YYYY-MM-DD @ HH:MM:SS format
 * or return a date object
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
    return Intl.DateTimeFormat().resolvedOptions().timeZone + '/' + year + '-' + month + '-' + date + ' @ ' + hours + ':' + minutes + ':' + seconds;
}

// session time token
export const SESSION_TOKEN = getLongDateTime();

// console functions
export const log = (val) => {
    if (DEBUG) console.log(`Log: ${val}`);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = val;
}

export const err = (val) => {
    if (DEBUG) console.error(`Err: ${val}`);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = `[ERR]: ${val}`;
}

export const wrn = (val) => {
    if (DEBUG) console.warn('Wrn: ' + val);
    // write logs in local database
    SessionLogs[getTimeStamp(true)] = `[WRN]: ${val}`;
}

/* Uploads debug logs to the database
 * for debugging
 */
export const uploadSessionLogs = () => {
    update(ref(Database, `${DB_ROOT}/records/sessionlogs/${USER_TOKEN}/${SESSION_TOKEN}`), SessionLogs).then(() => {
        // do nothing
    }).catch((error) => {
        err(error);
    });
}

// creates a random `length` sized token
export const generateToken = (length = 64) => {
    let arrayOfChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let outputToken = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (arrayOfChars.length - 1)).toFixed(0);
        outputToken[i] = arrayOfChars[j];
    }
    return outputToken.join('');
}

// generates a user token to recognise a device
export const generateUserToken = () => {
    if (localStorage.getItem('User.token')) {
        USER_TOKEN = localStorage.getItem('User.token');
        log('new token generated');
        return;
    }
    USER_TOKEN = generateToken();
    log(`user: new token = ${USER_TOKEN}`);
    localStorage.setItem('User.token', USER_TOKEN);
}

// user id is used to mark a message and recognise a user            
export const getUserID = () => {
    if (!localStorage.getItem('Auth.user')) return;
    USER_ID = JSON.parse(localStorage.getItem('Auth.user')).uid;
    log(`user: id = ${USER_ID}`);
}

// replace unsupported firebase characters with something else
export const encode = (str) => {
    let specialChars = '\n\r!"#$%&\'./<=>@[\\]{}';
    for (let character of specialChars) {
        str = str.replaceAll(character, `ASCII${character.charCodeAt(0)}`);
    }
    if (DEBUG) console.log(`Log: encode(): str = ${str}`);
    return str;
}

// data decoder function, replace encoded chars with special characters
export const decode = (str) => {
    let specialChars = '\n\r!"#$%&\'./<=>@[\\]{}';
    for (let character of specialChars) {
        str = str.replaceAll(`ASCII${character.charCodeAt(0)`, character);
    }
    if (DEBUG) console.log(`Log: decode(): str = ${str}`);
    return str;
}

// download a file
export const download = (directurl, filename = `sozialnmedien_${getTimeStamp()}.bin`) => { 
    if (EXISTS_ANDROID_INTERFACE) {
        try {
            Android.download(directurl, filename);
            log('[AND]: download(): through Android WepAppInterface');
        } catch (error) {
            err(error);
            throw error;
        }
        return;
    }
    err('android interface doesn\'t exist');
    throw 'android interface doesn\'t exist';
    let element = document.createElement('a');
    element.setAttribute('href', directurl);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// copy text
export const copyPlainTxt = (copytext = '') => {
    copytext = copytext.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(copytext).then(() => {
        log('text copied to clipboard');
    }).catch((error) => {
        err(error);
        if (EXISTS_ANDROID_INTERFACE) {
            Android.copyToClipboard(copytext);
            log('[AND]: copyPlainTxt(): through Android WepAppInterface');
            Android.showToast('Text copied!');
        } else {
            err('android interface doesn\'t exist');
            dialog.display('alert', 'Oops!', 'Copy text to clipboard failed');
        }
    });
}

// detect browser
export const getBrowser = () => {
    if (navigator.userAgent.matches(/Opera|OPR/)) {
        return 'opera';
    }
    if (navigator.userAgent.indexOf('Chrome') != -1 ) {
        return 'chrome';
    }
    if (navigator.userAgent.indexOf('Safari') != -1) {
        return 'safari';
    }
    if (navigator.userAgent.indexOf('Firefox') != -1 ){
        return 'firefox';
    }
    if ((navigator.userAgent.indexOf('MSIE') != -1 ) || (!!document.documentMode == true)) {
        return 'IE';
    }
    return 'unknown';
}

// js element selector function, inspired by JQuery
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

// get child element using css selectors
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
 * @param {Node}  child  The child in concern.
 * @param {Node} parent  The parent in concern.
 * @return {Boolean} If true, the given child has the given parent
 */
export const childHasParent = (child, parent) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            log(`${node.nodeName} of class = ${node.className} has parent ${parent.nodeName} of class = ${parent.className}`);
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * Takes an HTML string, converts it to a node and attatches it to the
 * element passed.
 * This is done by detaching and reattaching the element
 * to its parent to improve performance.
 * @param {Node}     element  The element to which HTML will be appended.
 * @param {String}       str  The HTML string.
 * @param {Boolean} reversed  Prepends the HTML to the node.
 */
export const appendHTMLString = (element, str = '', reversed = false) => {
    let parent =  element.parentNode;
    let next = element.nextSibling;
    if (!parent) return;                              // No parent node? Abort!
    parent.removeChild(element);                      // Detach node from DOM.
    if (!reversed) element.innerHTML += str;          // append html string
    else element.innerHTML = str + element.innerHTML; // reversed append html
    parent.insertBefore(element, next);               // Re-attach node to DOM.
}

/* ----------------------------------------- TODO -------------------------------------------
 * The alert and action dialogs need to be made into a single
 * object named dialog.
 */

// alertDialog
const alertDialog = {
    // default button is close
    display(title = 'Alert!', message = '', button = 'Close', func) {
        if (typeof button != 'string') {
            throw `Error: typeof button title = ${typeof button}, expected String`;
        }
        if (func && typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) timeout = overlay.animation_duration;
        setTimeout(() => {
            log(`alertDialog display(): timeout = ${timeout}`);
            getChildElement($('#alertDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#alertDialog'), 'div')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#alertDialog_btn').innerHTML = button;
            if (func) $('#alertDialog_btn').addEventListener('click', (e) => {
                // removes event listener once action is complete
                $('#alertDialog_btn').removeEventListener('click', func);
                func.call();
            }, { once: true });
            $('#alertDialogRoot').style.animation = `fadeIn ${overlay.animation_duration}ms forwards`;
            $('#alertDialog').style.animation = `scaleIn ${overlay.animation_duration}ms forwards`;
            overlay.instance_open = true;
        }, timeout);
    },
    hide(func) {
        $('#alertDialogRoot').style.animation = `fadeOut ${overlay.animation_duration}ms forwards`;
        $('#alertDialog').style.animation = `scaleOut ${overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
        // additional function
        if (typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
            return;
        }
        func();
    }
}

// actionDialog
const actionDialog = {
    // default button is close
    display(title = 'Alert!', message = '', button = 'OK', func) {
        if (typeof button != 'string') {
            throw `Error: typeof button title = ${typeof button}, expected String`;
        }
        if (!func || typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) timeout = overlay.animation_duration;
        setTimeout(() => {
            log(`actionDialog display(): timeout = ${timeout}`);
            getChildElement($('#actionDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#actionDialog'), '.content')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#actionDialog_btnOk').innerHTML = button;
            if (func) $('#actionDialog_btnOk').addEventListener('click', (e) => {
                // removes event listener once action is complete
                $('#actionDialog_btnOk').removeEventListener('click', func);
                func();
            }, { once: true });
            $('#actionDialogRoot').style.animation = `fadeIn ${overlay.animation_duration}ms forwards`;
            $('#actionDialog').style.animation = `scaleIn ${overlay.animation_duration}ms forwards`;
            overlay.instance_open = true;
        }, timeout);
    },
    hide(func) {
        $('#actionDialogRoot').style.animation = `fadeOut ${overlay.animation_duration}ms forwards`;
        $('#actionDialog').style.animation = `scaleOut ${overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
        // additional function
        if (typeof func != 'function') {
            throw `Error: typeof func = ${typeof func}, expected function`;
            return;
        }
        func();
    }
}

/*--------------------------------------- TODO START -------------------------------------------*/

// dialog
export const dialog = {
    display(category, title, message, button, func) {
        if (category == 'alert') {
            alertDialog.display(title, message, button, func);
        } else if (category == 'action') {
            actionDialog.display(title, message, button, func);
        }
    },
    hide(category, func) {
        if (category == 'alert') {
            alertDialog.hide(func);
        } else if (category == 'action') {
            actionDialog.hide(func);
        }
    }
}

/*--------------------------------------- TODO END --------------------------------------------*/

// menu alertDialog
export const menu = {
    /**
     * Display the menu
     * @param {String} title Optional, default value = 'Menu'. Title of the menu dialog.
     */
    display(title = 'Menu') {
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) timeout = overlay.animation_duration;
        setTimeout(() => {
            log(`menu: timeout = ${timeout}`);
            getChildElement($('#menu'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            $('#menuRoot').style.animation = `fadeIn ${overlay.animation_duration}ms forwards`;
            $('#menu').style.animation = `scaleIn ${overlay.animation_duration}ms forwards`;
            overlay.instance_open = true;
        }, timeout);
    },
    /**
     * Hide the menu dialog
     */
    hide() {
        $('#menuRoot').style.animation = `fadeOut ${overlay.animation_duration}ms forwards`;
        $('#menu').style.animation = `scaleOut ${overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
    }
}

/** 
 * Looks for updates to the android app and opens an alert dialog if update is available.
 */
export const checkForApkUpdates = () => {
    if (!EXISTS_ANDROID_INTERFACE) return;
    log('[APK]: checking for update');
    try { 
        switch (Android.updateAvailable()) {
            case 'true':
                log('alertDialog: launch: update available');
                dialog.display('alert', 'Update available', 'A new version of this Android app is available.', 'Download', () => {
                   setTimeout(() => {
                        Android.showToast('Downloading app, look into your notification panel');
                        Android.download('https://sozialnmedien.web.app/downloads/chat.app.web.sozialnmedien.apk', 'chat.app.web.sozialnmedien.apk');
                    }, 500);
                    dialog.hide('alert');
                    log('[AND]: downloaded Android app');
                });
                break;
            case 'failed':
                err('update check failed');
                break;
        }
    }
    catch (error) {
        err(error);
    }
}

/**
 * Scrolls down a view smoothly if amount of element below viewport is less than
 * 720 pixels.
 * @param {Node}              element  The element to scroll down.
 * @param {Boolean} get_behavior_only  If true, only returns scroll behavior based on amount of element below viewport
 * @param {Boolean}        not_smooth  Explicitly mention to scroll without animations.
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
    log(`smoothscroll(): element = ${element.nodeName} class = ${element.className} diff = ${element.scrollHeight - element.scrollTop}`);
    element.scrollTop = element.scrollHeight;
}

/**
 * @deprecated
 * This function was supposed to reload the dynamic accent colors
 * of the newly added chat bubbles. But currently we're using
 * a all teal accent (former WhatsApp brand colors). So this won't be needed.
 */
export const loadTheme = () => {
    if (!LOAD_THEME) return;
    // custom accents: primary background color
    for (let element of $('.prim_bg')) {
        element.style.backgroundColor = ACCENT_PRIMARY_BGCOLOR;
        element.style.borderColor = ACCENT_PRIMARY_BGCOLOR;
        element.style.color = ACCENT_FG_COLOR;
    }
    // custom accents: secondary background color without alpha
    for (let element of $('.sec_bg')) {
        element.style.backgroundColor = ACCENT_SECONDARY_BGCOLOR;
        element.style.borderColor = ACCENT_SECONDARY_BGCOLOR;
        element.style.color = '#222';
    }
    // custom accents: tertiary background color without alpha
    for (let element of $('.tert_bg')) {
        element.style.backgroundColor = ACCENT_TERTIARY_BGCOLOR;
        element.style.borderColor = ACCENT_TERTIARY_BGCOLOR;
        element.style.color = '#222';
    }
    log('loadTheme(): loaded');
}
