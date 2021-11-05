import { Database, } from '/common/js/firebaseinit.js';
import * as FirebaseDB from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { USER_ID, setVariable, CHAT_ROOT, } from '/common/js/variables.js';
import { checkForApkUpdates, getURLQueryFieldValue, decode, } from '/common/js/generalfunc.js';
import { log, err, } from '/common/js/logging.js';
import { $, smoothScroll, } from '/common/js/domfunc.js';
import { Overlay, SplashScreen, Dialog, } from '/common/js/overlays.js';

import * as Init from '/common/js/init.js';

/**
 * Stores the chat room id for /messaging/inbox and /messaging/chat
 * @type {String}
 */
export let CHAT_ROOM_ID;

/* The entire chat is downloaded and stored here.
 * The data has unique random values as keys.
 * @type {Object}
 */
export let ChatData = {};

/**
 * Returns true if chat room id is valid.
 * @param {String} room_id Chat room id.
 * @return {Boolean} true if valid.
 */
export const isValid = (room_id = 'ejs993ejiei3') => {
    let valid = false;
    const uids = room_id?.split(':u1:u2:');
    valid = typeof room_id == 'string' && (room_id == 'ejs993ejiei3'
        ||  uids != null
        &&  uids.length == 2
        &&  uids[0] < uids[1]
        &&  uids.includes(USER_ID)
        &&  !/[^A-Za-z0-9:]/.test(room_id));
    if (!uids.includes(USER_ID) && !valid ) {
        localStorage.removeItem('Chat.roomid');
        err('messaging: isValid(): unauth room_id');
        Dialog.display('alert', 'Fatal Error!', 'You are not allowed to view this page.', 'Return to inbox', () => {
            Dialog.hide('alert', () => {
                location.href = '/messaging/inbox';
            });
        });
        throw `Error: messaging: isValid(): unauth room_id = ${room_id}`;
    }
    else if (!valid) {
        localStorage.removeItem('Chat.roomid');
        err('messaging: isValid(): invalid room_id');
        Dialog.display('alert', 'Fatal Error!',
            '<p class="justify">Can\'t load this chat. Make sure you\'ve provided a valid UID.</p>'
          + '<p class="justify">If you\'ve not entered a UID, and instead you\'re visiting a link, it\'s invalid.</p>',
            'Return to inbox', () => {
            Dialog.hide('alert', () => {
                location.href = '/messaging/inbox';
            });
        });
        throw `Error: messaging: isValid(): invalid room_id = ${room_id}`;
    }
    return valid;
}

/**
 * Stores the chat room id in localStorage. It also sets the value of CHAT_ROOT.
 * @param {String} room_id The chat room id.
 * @return {String} CHAT_ROOM_ID.
 */
export const storeChatRoomId = (room_id) => {

    room_id = (room_id || 'ejs993ejiei3').replace(/[^A-Za-z0-9:]/g, '');
    if (localStorage.getItem('Auth.UID') && !isValid(room_id)) return isValid(room_id);

    // stores the chat room id into localStorage and sets CHAT_ROOT, to be used by '/messaging/chat'.
    localStorage.setItem('Chat.roomid', room_id);
    setVariable('CHAT_ROOT', room_id);
    return CHAT_ROOM_ID = room_id;
}

/**
 * Generates and stores CHAT_ROOM_ID | CHAT_ROOM_ID has format `${uid1}:u1:u2:${uid2}`, uid1 < uid2.
 * It also sets the value of CHAT_ROOT.
 * @param {String} user_id ID of the other user.
 * @return {String} CHAT_ROOM_ID.
 */
export const generateChatRoomId = (user_id) => {
    let room_id;
    if (user_id) room_id = [ USER_ID, user_id, ].sort()[0]
                         + ':u1:u2:'
                         + [ USER_ID, user_id, ].sort()[1];
    return storeChatRoomId(room_id);
}

const downloadMessages = (onDownload) => {

    if (typeof onDownload != 'function') throw `Error: messaging: downloadMessages(): onDownload is ${typeof func}, expected function`;

    /* NOTE that the following code must not run outside the chat UI.
     * Otherwise it will simply fail, taking the chat UI down with it.
     * Once placeholder is successfully placed, download the entire
     * chat to localStorage, and save a copy in ChatData variable.
     */
    FirebaseDB.get(FirebaseDB.ref(Database, CHAT_ROOT)).then((snapshot) => {
        snapshot.forEach(({ key }) => {
            const pushkey = key;
            const data = snapshot.child(pushkey).val();
            if (data == 'default-placeholder') return;
            ChatData[pushkey] = {
                pushkey,
                uid: data.uid,
                message: HtmlSanitizer.SanitizeHtml(decode(data.message)),
                time: data.time,
            };
        });
        onDownload();
    }).catch((error) => {
        if (/permission|denied/i.test(String(error))) {
            Dialog.display('alert', 'Fatal Error!', 'You are not allowed to view this page.');
        }
        err(`messaging: init(): FirebaseDB.get(): ${error}`);
    });
}

/**
 * Initialises common variables for /messaging/inbox and /messaging/chat.
 */
export const init = () => {

    let room_id;

    // If chatroom id is provided as URL parameter, store it
    if ((room_id = getURLQueryFieldValue('id'))
    && !Array.isArray(room_id)) storeChatRoomId(room_id);

    Init.init();

    // checking if chat room exists and is valid, if so, /messaging/chat is loaded
    if ((room_id = localStorage.getItem('Chat.roomid')) && isValid(room_id)) {

        CHAT_ROOM_ID = room_id;

        /* This code writes a placeholder in the database which allows onChildAdded
         * to be triggered.
         * onChildAdded doesn't trigger on an empty database, so this code is meant
         * specifically for empty databases.
         * This code is harmless for non-empty databases.
         */
        FirebaseDB.update(FirebaseDB.ref(Database, CHAT_ROOT), {
            ' placeholder': 'default-placeholder',
        }).then(() => {
            if (!location.href.includes('/chat')) {
                location.href = `/messaging/chat?id=${CHAT_ROOM_ID}`;
                return;
            }
            downloadMessages(() => {
                // localStorage.setItem(`ChatData.${CHAT_ROOM_ID}`, JSON.stringify(ChatData));ages(() => {
                localStorage.removeItem('Chat.roomid');

                /* Although deprecated, this function is used because
                 * the SplashScreen is not shown using SplashScreen.display().
                 * Instead it's shown using CSS style 'visibility: visible'.
                 * This is done to make the dialog visible immediately after the page
                 * is loaded.
                 */
                Overlay.setInstanceOpen(SplashScreen.visible = true);

                 /* Note that SplashScreen needs to be hidden regardless of pushkey being a placeholder.
                  * The sole purpose of the placeholder is to trigger onChildAdded, so that it can call
                  * the SplashScreen.hide().
                  */
                 SplashScreen.hide();
            });
        }).catch((error) => {
            if (/permission|denied/i.test(String(error))) {
                Dialog.display('alert', 'Fatal Error!', 'You are not allowed to view this page.');
            }
            err(`messaging: init(): FirebaseDB.update(): ${error}`);
        });
        return;
    }

    // if above check fails, inbox is loaded
    log('messaging: init(): room_id = undefined');
    if (!location.href.includes('/inbox')) location.href = '/messaging/inbox';
}

log('module /messaging/script.js loaded');
