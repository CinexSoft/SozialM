import { Auth, } from '/common/js/firebaseinit.js';
import { log, err, } from '/common/js/logging.js';
import { $, } from '/common/js/domfunc.js';
import { Dialog, SplashScreen, } from '/common/js/overlays.js';

import { CHAT_ROOM_ID, } from '/messaging/script.js';
import * as Messaging from '/messaging/script.js'

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

    const chatrooms = [];
    SplashScreen.hide();

    /* code to load chats belonging to the user
     * If chatroom id doesn't exist, user will be prompted for it.
     * this prompt is a temporary code while the inbox is being built
     */
    if (true) Dialog.display('alert', 'Text with',
          '<p class="justify">The inbox UI is not ready yet. While that is being done, you can access the chat system by entering UID of the other user.</p>'
        + '<p class="justify">To connect with you, the second person needs to enter your UID.</p>'
        + '<p class="justify">You can also copy and send the link to the other user from the address bar after entering the ID and clicking Load Chat</p>'
        + '<input type="text" id="other_user_id" placeholder="Enter user\'s ID">',
        'Load chat', () => {
        Dialog.hide('alert', () => {
            const other_user_id = $('#other_user_id').value;
            if (Messaging.generateChatRoomId(other_user_id)) location.href = `/messaging/chat?id=${CHAT_ROOM_ID}`;
        });
    });
}

Messaging.init();
main();

log('site /messaging/inbox loaded');
