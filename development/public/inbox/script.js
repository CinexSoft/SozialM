import { Auth, Database, DB_ROOT } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { log, err, } from '/common/js/logging.js';
import { checkForApkUpdates, getURLQueryFieldValue, } from '/common/js/generalfunc.js';
import { $, } from '/common/js/domfunc.js';
import { Dialog, } from '/common/js/overlays.js';

const storeChatRoomId = (chat_room_id) => {
    chat_room_id = (chat_room_id || 'ejs993ejiei3').replace(/[^A-Za-z0-9]/g, '');
    log(`Inbox: chat room id: ${chat_room_id}`);
    // stores the chat room id into localStorage to be used by '/chat'.
    localStorage.setItem('Chat.roomid', chat_room_id);
}

const getChatHTML = ({ chatroomid, dp_src, sender, date_time, message }) => {
    chatroomid = chatroomid || 'ejs993ejiei3';
    dp_src = dp_src || 'https://';
    sender = sender || 'Demo Chat';
    date_time = date_time || '01/01/2000 02:05';
    message = message || 'No recent message';
    return (
         `<div id="${chatroomid}" class="chat">`
       +     `<img src="${dp_src}" class="dp">`
       +     `<div class="message">`
       +         `<div class="info">`
       +             `<span class="sender">${sender}</span>`
       +             `<span class="time">${date_time}</span>`
       +         `</div>`
       +         `<div class="body">`
       +             `<span class="content">${message}</span>`
       +         `</div>`
       +     `</div>`
       + `</div>`
    );
}

const main = () => {
    let chat_room_id;
    let chatrooms = [];
    let all_chat_data = {};
    // If chatroom id exists as a URL query field, store it
    if ((chat_room_id = getURLQueryFieldValue('room'))
    && !Array.isArray(chat_room_id)) storeChatRoomId(chat_room_id);
    // checking if user is logged in
    if (!localStorage.getItem('Auth.user')) {
        console.log('Log: not signed in, redirect to /auth');
        location.href = '/auth';
        return;
    }
    // If chatroom id already exists in localStorage, go to /chat
    if (chat_room_id = localStorage.getItem('Chat.roomid')) {
        location.href = '/chat';
        return;
    }
    FirebaseDatabase.get(FirebaseDatabase.ref(`${USER_ROOT}/${USER_ID}/chatrooms`)).then((snapshot) => {
        for ({ key } of snapshot) {
            chatrooms.push(key);
        }
    }).catch((error) => {
        err(`Inbox: ${error}`);
    });
    FirebaseDatabase.get(FirebaseDatabase.ref(`${DB_ROOT}/chat`)).then((snapshot) => {
        all_chat_data = snapshot.val();
        localStorage.setItem('Chat.data', JSON.stringify(all_chat_data));
    }).catch((error) => {
        Dialog.display('alert', 'Fatal error', (
              '<pre style="'
            +     'margin: 0;'
            +     'padding: 0;'
            +     'width: 100%;'
            +     'overflow: auto;'
            +     'text-align:left;'
            +     'font-size: 0.8rem;'
            +     'font-family: sans-serif; ">'
            +     '<p>Please copy the following error report it to <a href="mailto:cinexsoft@gmail.com">cinexsoft@gmail.com</a></p>.'
            +     '<code>'
            +         error // JSON.stringify({ error.name, error.message, error.stack, }, null, 4)
            +     '</code>'
            + '</pre>'
        ));
        err(`Inbox: ${error}`);
    });
    /* If chatroom id doesn't exist, user will be prompted for it.
     * this prompt is a temporary code while the inbox is being built
     */
    if (true) Dialog.display('alert', 'Chat Room',
          '<p><b>Hi there!</b></p>'
        + '<p>The inbox UI is not ready yet. While that is being done, you can access the chat system by entering new or old chat room IDs.</p>'
        + '<p>This way you will setup or enter a chat room and can connect with people.</p>'
        + '<p>To connect with you using a specific room, the second person needs to enter the same chat ID from their side.</p>'
        + '<input type="text" id="chatroomid" placeholder="Enter chat room ID">',
        'Load chat', () => {
        Dialog.hide('alert', () => {
            storeChatRoomId($('#chatroomid').value);
            location.href = '/chat';
        });
    });
}

main();
