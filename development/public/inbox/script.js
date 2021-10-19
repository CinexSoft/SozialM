import { Auth, Database, DB_ROOT, } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { UserData, USER_ID } from '/common/js/variables.js';
import { log, err, } from '/common/js/logging.js';
import { checkForApkUpdates, getURLQueryFieldValue, } from '/common/js/generalfunc.js';
import { $, } from '/common/js/domfunc.js';
import { Dialog, } from '/common/js/overlays.js';

const storeChatRoomId = (chat_room_id) => {

    chat_room_id = (chat_room_id || 'ejs993ejiei3').replace(/[^A-Za-z0-9]/g, '');
    log(`Inbox: chat room id: ${chat_room_id}`);

    /* Collects the user id of the 2nd user
     * line 1 splits the chat room id into an array of 2 uids.
     * line 2 checks if there exists not more than 2 uids, else alerts user with an error.
     */
    const user_ids = chat_room_id.split(':u1:u2:')
    if (user_ids.length != 2 || !user_ids.includes(USER_ID)) {
        displayErrorDialog(`invalid chat room id, array of CHAT_ROOM_ID = ${user_ids}`, 'Chat');
        return;
    }
    
    // stores the chat room id into localStorage to be used by '/chat'.
    localStorage.setItem('ChatData.loadid', chat_room_id);
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

    // If chatroom id exists as a URL query field, store it
    if ((chat_room_id = getURLQueryFieldValue('id'))
    && !Array.isArray(chat_room_id)) storeChatRoomId(chat_room_id);

    // If chatroom id already exists in localStorage, go to /chat
    if (chat_room_id = localStorage.getItem('ChatData.loadid')) {
        location.href = `/chat?id=${chat_room_id}`;
        return;
    }

    // Entire ChatData is downloaded and stored to localStorage
    FirebaseDatabase.onValue(FirebaseDatabase.ref(Database, `${DB_ROOT}/chat`), (snapshot) => {
        const all_chat_data = snapshot.val();
        snapshot.forEach({ key }, () => {
            const room_id = key;
            localStorage.setItem(`ChatData.${room_id}`, JSON.stringify(data[key]));
        });
    }, (error) => {
        displayErrorDialog(error, 'Inbox');
    });

    /* loads a list of all chat rooms, extracts uid of other user,
     * and displays names of your recently contacted friends in a list.
     *
    // TODO: Objects aren't iterable.
    // TODO: UID of the users need to be loaded from the chat id.
    // TODO: Names need to be derived from the user ids.
    const user_list = [];
    for (id of Object.keys(UserData.data.chatrooms)) {
        const user_ids = id.split(':u1:u2:')
        if (user_ids.length != 2 || !user_ids.includes(USER_ID)) {
            displayErrorDialog(`invalid chat room id, array of CHAT_ROOM_ID = ${user_ids}`, 'Chat');
            return;
        }
        const other_user_id = user_ids[!(user_ids.indexOf(USER_ID))];
        user_list.push(UserData.friends[other_user_id].name);
    }

    for (user of user_list) {
        getChatHTML();
    }*/

    /* code to load chats belonging to the user
     * If chatroom id doesn't exist, user will be prompted for it.
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
            if (other_user_id) chat_room_id = other_user_id > USER_ID ? `${other_user_id}:u1:u2:${USER_ID}` : `${USER_ID}_${other_user_id}`;
            else chat_room_id = '';
            storeChatRoomId(chat_room_id);
            location.href = `/chat?id=${chat_room_id}`;
        });
    });
}

main();
