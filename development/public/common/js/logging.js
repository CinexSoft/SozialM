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
import { Database, } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { LOGS_ROOT, DEBUG, } from '/common/js/variables.js';
import { getTimeStamp, } from '/common/js/generalfunc.js';

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
    FirebaseDatabase.update(FirebaseDatabase.ref(Database, LOGS_ROOT), SessionLogs).then(() => {
        // do nothing
    }).catch((error) => {
        console.error(`logging.js: uploadSessionLogs(): ${error}`);
    });
}

console.log('module logging.js loaded');
