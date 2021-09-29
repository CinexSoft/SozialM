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
import { Database, DB_ROOT, } from '/common/js/firebaseinit.js';
import {
    ref as firebaseDBRef,
    update as firebaseDBUpdate,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { DEBUG, SESSION_TOKEN, USER_TOKEN, setVariable } from '/common/js/variables.js';

/**
 * Gets current time zone, date time or return a date object.
 * @param {Boolean} Optional, if false returns a date object
 * @return {String} Current date in Continent/City/YYYY-MM-DD @ HH:MM:SS format.
 * @return {Object} Date object (conditional).
 */
const getLongDateTime = (long_time = true) => {
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

/**
 * Returns a local timestamp in ms since Unix epoch or in ns since app launch.
 * @param {Boolean} nanosec Optional, if true returns nanosecond time since app launch. If false, returns milliseconds time since Unix epoch.
 * @return {Number} Milliseconds time since Unix epoch.
 * @return {Number} Nanosecond time since app launch (conditional).
 */
const getTimeStamp = (nanosec = false) => {
    if (!nanosec) return new Date().getTime();
    else return Math.floor(performance.now() * 1000);
}

/* Without this code, logging to database will fail
 * SESSION_TOKEN will remain undefined without this code
 */
setVariable('SESSION_TOKEN', getLongDateTime());

// Object to hold logs with nanosecond timestamps as keys
const SessionLogs = {};

/**
 * Console log function.
 * Apart from wrapping console.log, it also allows the logs to be uploaded to database.
 * @param {String} val The stuff to be printed
 */
export const log = (val) => {
    if (DEBUG) console.log(`Log: logging.js: ${val}`);
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
        err(`logging.js: ${error}`);
    });
}
