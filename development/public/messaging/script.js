import { USER_ID, setVariable, } from '/common/js/variables.js';
import { checkForApkUpdates, getURLQueryFieldValue, } from '/common/js/generalfunc.js';
import { displayErrorDialog, } from '/common/js/generalfunc.js';

/**
 * Stores the chat room id for /messaging/inbox and /messaging/chat
 * @type {String}
 */
export let CHAT_ROOM_ID;
// TODO: fix validation: suspect: regex test
/**
 * Returns true if chat room id is valid.
 * @param {String} room_id Chat room id.
 * @return {Boolean} true if valid.
 */
export const isValid = (room_id) => {
    if (room_id == 'ejs993ejiei3') return true;
    const uids = room_id?.split(':u1:u2:');
    if (uids != null
    &&  uids.length == 2
    &&  uids[0] < uids[1]
    && !uids.every((id) => /[^A-Za-z0-9:]/.test(id))
    &&  uids.includes(localStorage.getItem('Auth.UID'))) return true;
    displayErrorDialog(`Error: messaging: isValid(): invalid room_id = ${room_id}`);
    return false;
}

/**
 * Stores the chat room id in localStorage. It also sets the value of CHAT_ROOT.
 * @param {String} room_id The chat room id.
 * @return {String} CHAT_ROOM_ID.
 */
export const storeChatRoomId = (room_id) => {

    room_id = (room_id || 'ejs993ejiei3').replace(/[^A-Za-z0-9:]/g, '');
    if (!isValid(room_id)) return;

    // stores the chat room id into localStorage and sets CHAT_ROOT, to be used by '/messaging/chat'.
    localStorage.setItem('Chat.roomid', room_id);
    setVariable('CHAT_ROOT', room_id);
    return CHAT_ROOM_ID = room_id;
}
// TODO: fix: generates true instead of proper CHAT_ROOM_ID, somehow it's valid
/**
 * Generates and stores CHAT_ROOM_ID | CHAT_ROOM_ID has format `${uid1}:u1:u2:${uid2}`, uid1 < uid2.
 * It also sets the value of CHAT_ROOT.
 * @param {String} user_id ID of the other user.
 * @return {String} CHAT_ROOM_ID.
 */
export const generateChatRoomId = (user_id) => {
    let room_id = 'ejs993ejiei3';
    if (user_id) room_id = [ USER_ID, user_id, ].sort()[0]
                         + ':u1:u2:'
                         + [ USER_ID, user_id, ].sort()[1];
    return storeChatRoomId(room_id);
}

/**
 * Initialises common variables for /messaging/inbox and /messaging/chat.
 */
export const init = () => {

    let room_id;

    // If chatroom id is provided as URL parameter, store it
    if ((room_id = getURLQueryFieldValue('id'))
    && !Array.isArray(room_id)) storeChatRoomId(room_id);

    // checking if chat room exists and is valid
    if (room_id = localStorage.getItem('Chat.roomid') && isValid(room_id)) {
        CHAT_ROOM_ID = room_id;
        console.log(`Log: chat room found: ${CHAT_ROOM_ID}`);
        if (location.href.includes('/chat')) localStorage.removeItem('Chat.roomid');
        else location.href = `/messaging/chat?id=${CHAT_ROOM_ID}`;
        return;
    }

    // if above check fails
    console.log('Log: chat root not found, it must be created first');
    if (!location.href.includes('/inbox')) location.href = '/messaging/inbox';
}
