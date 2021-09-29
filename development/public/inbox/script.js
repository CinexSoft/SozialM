import { ref, update, } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { $, } from '/common/js/domfunc.js';
import { Auth, Database, } from '/common/js/firebaseinit.js';
import { checkForApkUpdates, getURLQueryFieldValue, } from '/common/js/generalfunc.js';
import { log, err, } from '/common/js/logging.js';
import { Dialog, } from '/common/js/overlays.js';

let CHAT_ROOM_ID;

const loadChatRoom = () => {
    log(`Inbox: chat room id: ${CHAT_ROOM_ID}`);
    localStorage.setItem('Chat.roomid', CHAT_ROOM_ID);
    location.href = '/chat';
}

CHAT_ROOM_ID = getURLQueryFieldValue('chatroomid');
if (CHAT_ROOM_ID && !/[^A-Za-z0-9]/.test(CHAT_ROOM_ID)) loadChatRoom();

// this prompt is a temporary code while the inbox is being built
Dialog.display('alert', 'Chat Room',
      '<p><b>Hi there!</b></p>'
    + '<p>The inbox UI is not ready yet. While that is being done, you can access the chat system by entering new or old chat room IDs.</p>'
    + '<p>This way you will setup or enter a chat room and can connect with people.</p>'
    + '<p>To connect with you using a specific room, the second person needs to enter the same chat ID from their side.</p>'
    + '<input type="text" id="chatroomid" placeholder="Enter chat room ID">',
    'Load chat', () => {
    Dialog.hide('alert', () => {
        CHAT_ROOM_ID = ($('#chatroomid').value || 'ejs993ejiei3').replace(/[^A-Za-z0-9]/g, '');
        loadChatRoom();
    });
});
