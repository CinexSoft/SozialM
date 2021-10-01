import { Auth, Database, } from '/common/js/firebaseinit.js';
import { ref, update, } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { log, err, } from '/common/js/logging.js';
import { checkForApkUpdates, getURLQueryFieldValue, } from '/common/js/generalfunc.js';
import { $, } from '/common/js/domfunc.js';
import { Dialog, } from '/common/js/overlays.js';

const loadChatRoom = (chat_room_id) => {
    chat_room_id = (chat_room_id || 'ejs993ejiei3').replace(/[^A-Za-z0-9]/g, '');
    log(`Inbox: chat room id: ${chat_room_id}`);
    // stores the chat room id into localStorage to be used by '/chat'.
    localStorage.setItem('Chat.roomid', chat_room_id);
    // checking if user is logged in
    if (!localStorage.getItem('Auth.user')) {
        console.log('Log: not signed in, redirect to /auth');
        location.href = '/auth';
        return;
    }
    // launches chat
    location.href = '/chat';
}
    
const main = () => {
    // If chatroom id exists as a URL query field
    if (let chat_room_id = getURLQueryFieldValue('chatroomid')
    && !Array.isArray(chat_room_id)
    && !/[^A-Za-z0-9]/.test(chat_room_id)) {
        loadChatRoom(chat_room_id);
        return;
    }
    // If chatroom id already exists in localStorage
    if (let chat_room_id = localStorage.getItem('Chat.roomid')) {
        loadChatRoom(chat_room_id);
        return;
    }
    /* If chatroom id doesn't exist, user will be prompted for it.
     * this prompt is a temporary code while the inbox is being built
     */
    Dialog.display('alert', 'Chat Room',
          '<p><b>Hi there!</b></p>'
        + '<p>The inbox UI is not ready yet. While that is being done, you can access the chat system by entering new or old chat room IDs.</p>'
        + '<p>This way you will setup or enter a chat room and can connect with people.</p>'
        + '<p>To connect with you using a specific room, the second person needs to enter the same chat ID from their side.</p>'
        + '<input type="text" id="chatroomid" placeholder="Enter chat room ID">',
        'Load chat', () => {
        Dialog.hide('alert', () => {
            loadChatRoom($('#chatroomid').value);
        });
    });
}

main();
