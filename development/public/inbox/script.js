import { Auth, Database, DB_ROOT } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { USER_ID } from '/common/js/variables.js';
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

const getChatHTML = ({ chat_room_id, dp_src, sender, date_time, message }) => {
    chat_room_id = chat_room_id || 'ejs993ejiei3';
    dp_src = dp_src || '/common/res/defaultdp.png';
    sender = sender || 'Demo Chat';
    date_time = date_time || '01/01/2000 02:05';
    message = message || 'No recent message';
    return (
         `<div id="${chat_room_id}" class="chat">`
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
    if ((chat_room_id = getURLQueryFieldValue('id'))
    && !Array.isArray(chat_room_id)) storeChatRoomId(chat_room_id);
    // checking if user is logged in
    if (!localStorage.getItem('Auth.user')) {
        console.log('Log: not signed in, redirect to /auth');
        location.href = '/auth';
        return;
    }
    // If chatroom id already exists in localStorage, go to /chat
    if (chat_room_id = localStorage.getItem('Chat.roomid')) {
        location.href = `/chat?id=${chat_room_id}`;
        return;
    }
    FirebaseDatabase.get(FirebaseDatabase.ref(`${USER_ROOT}/${USER_ID}/chatrooms`)).then((snapshot) => {
        for ({ key } of snapshot) {
            chatrooms.push(key);
        }
    }).catch((error) => {
        displayErrorDialog(error, 'Inbox');
    });
    // code to load chats belonging to the user
    /* If chatroom id doesn't exist, user will be prompted for it.
     * this prompt is a temporary code while the inbox is being built
     */
    if (true) Dialog.display('alert', 'Text with',
        + '<p>The inbox UI is not ready yet. While that is being done, you can access the chat system by entering UID of the other user.</p>'
        + '<p>To connect with you, the second person needs to enter your UID.</p>'
        + '<p>You can also copy and send the link to the other user from the address bar after entering the ID and clicking <i>Load Chat</i></p>'
        + '<input type="text" id="other_user_id" placeholder="Enter user\'s ID">',
        'Load chat', () => {
        Dialog.hide('alert', () => {
            const other_user_id = $('#other_user_id').value;
            if (other_user_id) chat_room_id = other_user_id > USER_ID ? `${other_user_id}_${USER_ID}` : `${USER_ID}_${other_user_id}`;
            else chat_room_id = '';
            storeChatRoomId(chat_room_id);
            location.href = `/chat?id=${chat_room_id}`;
        });
    });
}

main();
