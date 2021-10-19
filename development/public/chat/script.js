import { Database, DB_ROOT, USER_ROOT, } from '/common/js/firebaseinit.js';
import * as FirebaseDatabase from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { USER_ID, DEBUG, EXISTS_ANDROID_INTERFACE, } from '/common/js/variables.js';
import { log, err, } from '/common/js/logging.js';
import { 
    getTimeStamp,
    getLongDateTime,
    encode,
    decode,
    downloadFile,
    copyPlainTxt,
    getBrowser,
    checkForApkUpdates,
    displayErrorDialog,
} from '/common/js/generalfunc.js';
import {
    $,
    getChildElement,
    childHasParent,
    appendHTMLString,
    smoothScroll,
} from '/common/js/domfunc.js';
import { loadTheme, } from '/common/js/colors.js';
import { Overlay, SplashScreen, Dialog, Menu, } from '/common/js/overlays.js';

// other variables
let CHAT_ROOT;
let CHAT_ROOM_ID;

// the entire chat is downloaded and stored here
// the data has unique random values as keys
let ChatData = {};

/**
 * Loads contents of ChatData into the document UI
 * Before using this function, global variable ChatData must be updated / set.
 */
const loadChatsToUI = () => {
    $('#chatarea').innerHTML = '<div class="info noselect sec_bg" style="font-family:sans-serif">'
                             + '<p class="fa fa-info-circle">&ensp;Your chats are only server-to-end encrypted. Chats are stored without encryption on CinexSoft databases. We\'re yet to implement end-to-end encryption.</p>'
                             + '</div>';
    for (let pushkey in ChatData) {
        const data = ChatData[pushkey];
        const uid = data.uid;
        const getHTML = ChatData[pushkey].message;
        if (uid == USER_ID) {
            appendHTMLString($('#chatarea'), `<div class="bubbles"><div class="this chatbubble_bg" id="${pushkey}">${getHTML}</div></div>`);
            if (DEBUG) console.log(`Log: Chat: this: pushkey = ${pushkey}`);
            if (DEBUG) console.log(`Log: Chat: this: html = ${$('#chatarea').innerHTML}`);
        } else {
            appendHTMLString($('#chatarea'), `<div class="bubbles"><div class="that" id="${pushkey}">${getHTML}</div></div>`);
            if (DEBUG) console.log(`Log: Chat: that: pushkey = ${pushkey}`);
            if (DEBUG) console.log(`Log: Chat: that: html = ${$('#chatarea').innerHTML}`);
        }
        smoothScroll($('#chatarea'), false, false);
    }
    if (/pre/i.test($('#chatarea').innerHTML) &&
        /code/i.test($('#chatarea').innerHTML)) {
        hljs.highlightAll();
    }
    loadTheme();
    smoothScroll($('#chatarea'), false, false);
    log('Chat: loaded messages from ChatData');
}

// database listener
const startDBListener = () => {
    // db listener, fetches new msg on update
    FirebaseDatabase.onValue(FirebaseDatabase.ref(Database, DB_ROOT + CHAT_ROOT), (snapshot) => {
        // storing messages from db to local
        snapshot.forEach({ key }, () => {
            const pushkey = key;
            const data = snapshot.val();
            const uid = data.uid;
            // store data in local variable
            ChatData[pushkey] = {
                uid,
                pushkey,
                message: HtmlSanitizer.SanitizeHtml(decode(data.message)),
                time: data.time,
            };
        });
        // loads messages into the UI
        loadChatsToUI();
        // saves data in localStorage
        localStorage.setItem(`ChatData.${CHAT_ROOM_ID}`, JSON.stringify(ChatData));
        log('Chat: db update fetched');
    }, (error) => {
        displayErrorDialog(error, 'Chat');
    });
}

const main = () => {

    // Markdown converter
    const MDtoHTML = new showdown.Converter();
    MDtoHTML.setFlavor('github');

    // other variables
    let previous_height = document.body.clientHeight;
    let previous_width = document.body.clientWidth;
    let chatarea_scroll_height = $('#chatarea').scrollHeight;
    let quote_reply_text = '';
    let long_pressed_element;
    let scaled_element;
    let softboard_open = false;

    // html sanitizer configuration - additional tags and attributes
    HtmlSanitizer.AllowedTags['h'] = true;
    HtmlSanitizer.AllowedAttributes['alt'] = true;
    HtmlSanitizer.AllowedAttributes['id'] = true;
    HtmlSanitizer.AllowedAttributes['class'] = true;
    HtmlSanitizer.AllowedAttributes['download'] = true;
    HtmlSanitizer.AllowedSchemas.push('mailto:');
    HtmlSanitizer.AllowedCssStyles['width'] = true;
    HtmlSanitizer.AllowedCssStyles['height'] = true;
    HtmlSanitizer.AllowedCssStyles['min-width'] = true;
    HtmlSanitizer.AllowedCssStyles['min-height'] = true;
    HtmlSanitizer.AllowedCssStyles['max-width'] = true;
    HtmlSanitizer.AllowedCssStyles['max-height'] = true;
    HtmlSanitizer.AllowedCssStyles['padding'] = true;
    HtmlSanitizer.AllowedCssStyles['margin'] = true;
    HtmlSanitizer.AllowedCssStyles['border'] = true;
    HtmlSanitizer.AllowedCssStyles['border-radius'] = true;
    HtmlSanitizer.AllowedCssStyles['display'] = true;
    HtmlSanitizer.AllowedCssStyles['overflow'] = true;
    HtmlSanitizer.AllowedCssStyles['transform'] = true;
    HtmlSanitizer.AllowedCssStyles['background'] = true;

    // checking if chat room exists
    if (localStorage.getItem('ChatData.roomid')) {
        CHAT_ROOT = `/chat/${CHAT_ROOM_ID = localStorage.getItem('ChatData.loadid')}/`;
        console.log(`Log: chat room found: ${CHAT_ROOM_ID}`);
        localStorage.removeItem('ChatData.loadid');
    }
    else {
        console.log('Log: chat root not found, it must be created first, redirect to /inbox');
        location.href = '/inbox';
        return;
    }

    /* Collects the user id of the 2nd user
     * line 1 splits the chat room id into an array of 2 uids.
     * line 2 checks if there exists not more than 2 uids, else alerts user with an error.
     * line 3 stores the uid that doesn't contain uid of current user, which is stores in global USER_ID.
     *        since the indexes of the array and hence indexOf(USER_ID) are 0 or 1, !indexOf(USER_ID) returns the other index.
     */
    const user_ids = CHAT_ROOM_ID.split(':u1:u2:')
    if (user_ids.length != 2 || !user_ids.includes(USER_ID)) {
        location.href = `/inbox?id=${CHAT_ROOM_ID}`;
        return;
    }
    const other_user_id = user_ids[!(user_ids.indexOf(USER_ID))];

    /**
     * Push current chat room id to db, doesn't matter if it already exists.
     * This code just creates a list of available rooms, serves UI purposes, no major function.
     */
    FirebaseDatabase.update(FirebaseDatabase.ref(`${USER_ROOT}/${USER_ID}`), {
        chatrooms: {
            [CHAT_ROOM_ID]: true,
        },
        friends: {
            [other_user_id]: {
                /* This is an ES6 feature called OPTIONAL CHAINING. search the web for more info.
                 * what the code does?
                 *     If UserData.friends[other_user_id].name doesn't exist then name is set to other_user_id.
                 */
                name: (UserData?.friends?.[other_user_id]?.name || other_user_id),
            },
        },
    });

    /* loading ChatData from the stored stored already in local storage.
     * it'll be used to render the chat UI, reducing loading times.
     * this code supports loadChatsToUI().
     */
    ChatData = JSON.parse(localStorage.getItem(`ChatData.${CHAT_ROOM_ID}`));

    /* Sets the title of the chat page.
     * The title is based on how the user has saved the name of the firend.
     */
    // TODO: UserData.friends[other_user_id].name; is invalid. UserData is not defined / initialised / loaded.
    // TODO: Replace global USER with UserData, containing all info about user, inc name, email, image, and pref, contacts, etc.
    // TODO: These info will be seperately stored in localStorage
    if (CHAT_ROOM_ID != 'ejs993ejiei3') $('#roomid').innerHTML = UserData.friends[other_user_id].name;

    /* The following contains a lot of event listeners being added
     */

    // on key up listener
    document.addEventListener('keyup', (e) => {

        const key = e.keyCode || e.charCode;
        log(`Chat: keypress: key = ${key}`);
        const HTML = quote_reply_text + MDtoHTML.makeHtml($('#txtmsg').value.trim());

        /* If HTML is not empty, update the HTML of markdown preview, else hide it
         */
        if (HTML) {
            $('#msgpreview').style.display = 'block';
            $('#txtmsg').style.borderRadius = '0 0 10px 10px';
            $('#msgpreview').innerHTML = `<font class="header" color="#7d7d7d">Markdown preview</font>${HtmlSanitizer.SanitizeHtml(HTML)}`;
            smoothScroll($('#msgpreview'));
        } else {
            $('#msgpreview').style.display = 'none';
            $('#txtmsg').style.borderRadius = '40px';
            $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font><font color="#7d7d7d">Preview appears here</font>';
        }

        /* If delete or backspace key is pressed and '#txtmsg' contains no text
         * then hide markdown preview
         */
        const KEY_DEL = 8,
              KEY_BACKSPACE = 46;
        if ((key == KEY_DEL || key == KEY_BACKSPACE) && !$('#txtmsg').value.trim()) {
            quote_reply_text = '';
            $('#msgpreview').style.display = 'none';
            $('#txtmsg').style.borderRadius = '40px';
            $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font><font color="#7d7d7d">Preview appears here</font>';
        }

        // if HTML contains code, run highlighter
        if (/pre/i.test(HTML) &&
            /code/i.test(HTML)) {
            hljs.highlightAll();
        }
    });
    
    // soft keyboard launch triggers window resize event
    window.addEventListener('resize', (e) => {

        // detects soft keyboard switch
        if (previous_height != document.body.clientHeight && previous_width == document.body.clientWidth) {
            softboard_open = !softboard_open;
            /* If height diff +ve means screen returns to original size, i.e., soft board was hidden.
             * If -ve, it means screen size decresed when soft board was hidden.
             */
            log(`Chat: keyboard: switched? height diff = ${document.body.clientHeight - previous_height}`);
        }

        /* Smoothly scrolls up the '#chatarea' to keep the last chat bubble visible.
         * otherwise, the lower chat bubbles get hiddden under the keyboard when screen gets resized.
         * clientHeight is current window height.
         * previous_height is height before keyboard switch.
         * difference < 0 means scroll is made only if softboard comes up, not when it goes away.
         */
        if (document.body.clientHeight - previous_height < 0) {
            $('#chatarea').style.scrollBehavior = 'smooth';
            $('#chatarea').scrollTop += Math.abs(document.body.clientHeight - previous_height);
        }

        // Updates values of previous_width, previous_height
        previous_width = document.body.clientWidth;
        previous_height = document.body.clientHeight;

        /* switches visibility of msgpreview based on visibility of softboard.
         * if softboard is launched and text area has text in it, markdown preview is visible.
         * if keyboard is hidden, preview also gets hidden.
         */
        const HTML = quote_reply_text + MDtoHTML.makeHtml($('#txtmsg').value.trim());
        if (HTML != '' && softboard_open) {
            $('#msgpreview').innerHTML = `<font class="header" color="#7d7d7d">Markdown preview</font>${HtmlSanitizer.SanitizeHtml(HTML)}`;
            $('#msgpreview').style.display = 'block';
            $('#txtmsg').style.borderRadius = '0 0 10px 10px';
            smoothScroll($('#msgpreview'));
            return;
        }

        // hides visibility of msgpreview on softboard hide.
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font><font color="#7d7d7d">Preview appears here</font>';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
    });
    
    // on send button clicked
    $('#btnsend').addEventListener('click', (e) => {

        const msgbackup = $('#txtmsg').value;

        // if msgbackup is empty.
        if (!msgbackup.trim()) {
            $('#txtmsg').value = '';
            $('#txtmsg').focus();
            return;
        }
        const msg = quote_reply_text + msgbackup.trim();
        if (msg.length > 1024 * 2) {
            Dialog.display('alert', 'Warning', 'Text exceeds limit of 2KB');
            $('#txtmsg').value = msgbackup;
            return;
        }

        // Convert and then sanitize html.
        const messageHTML = MDtoHTML.makeHtml(msg);
        if (!messageHTML.trim()) return;
        quote_reply_text = '';
        $('#txtmsg').value = '';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        $('#txtmsg').focus();
        // months array
        const months = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December',
        ];

        // Days array
        const weekdays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];

        /* this append is overwritten when db update is fetched.
         * which is why the class of this div has no pushkey id.
         */
        appendHTMLString($('#chatarea'), `<div class="bubbles"><div class="this chatbubble_bg">${messageHTML}</div></div>`);
        smoothScroll($('#chatarea'), false, false);

        // this delay is to prevent a lag that occurrs when writing to db, within which the dialog is hidden
        setTimeout(() => {

            const Date = getLongDateTime(false);
            const time = {
                year: Date.getFullYear(),
                month: Date.getMonth() + 1,
                monthname: months[Date.getMonth()],
                date: Date.getDate(),
                day: Date.getDay(),
                dayname: weekdays[Date.getDay()],
                stamp: getTimeStamp(),
                time: ('0' + Date.getHours()).slice(-2) + ':'
                    + ('0' + Date.getMinutes()).slice(-2) + ':'
                    + ('0' + Date.getSeconds()).slice(-2) + ' '
                    + Intl.DateTimeFormat().resolvedOptions().timeZone,
            }

            // push generates a unique id which is based on timestamp
            const pushkey = FirebaseDatabase.push(FirebaseDatabase.ref(Database, DB_ROOT + CHAT_ROOT)).key;
            FirebaseDatabase.update(FirebaseDatabase.ref(Database, DB_ROOT + CHAT_ROOT + pushkey + '/'), {
                time,
                pushkey,
                message: encode(messageHTML),
                uid: USER_ID,
            }).then(() => {
                log('Chat: data pushed');
                loadTheme();
            }).catch((error) => {
                $('#txtmsg').value = msgbackup;
                displayErrorDialog(error, 'Chat');
            });
        }, Overlay.animation_duration);
    });
    
    /**
     * Variable should only be used by bubble highlighter block inside the 'click' event listener.
     * @type {Number} Stores a timer id 
     */
    let quoted_reply_highlight_timeout;
    
    // onclick listeners
    document.body.addEventListener('click', (e) => {

        /**
         * Variable should only be used by bubble highlighter block.
         * Purpose is to store the node that is to be highlighted when someone taps on a reply message.
         * @type {Node} HTML element
         */
        let highlight_target;

        // title bar back arrow click
        if (['backdiv', 'backarrow', 'dp acc_bg'].includes(e.target.className)) {
            log('Chat: history: going back');
            location.href = '/inbox';
        }

        // menu copy button click
        else if (e.target.id == 'menu_copy') {
            Menu.hide(() => {
                copyPlainTxt(long_pressed_element.innerHTML);
            });
        }

        // menu unsend button click
        else if (e.target.id == 'menu_unsend') {
            Menu.hide(() => {

                // unsend not possible if not sent by user
                if (ChatData[long_pressed_element.id].uid != USER_ID) {
                    Dialog.display('alert', 'Not allowed', 'You can unsend a message only if you have sent it.');
                    return;
                }

                // unsend not possible after 1 hour
                if (getTimeStamp() - parseInt(ChatData[long_pressed_element.id].time.stamp) > 3600000) {
                    Dialog.display('alert', 'Not allowed', 'You can only unsend a message within 1 hour of sending it.');
                    return;
                }
                FirebaseDatabase.update(FirebaseDatabase.ref(Database, DB_ROOT + CHAT_ROOT), {
                    [long_pressed_element.id]: null
                }).then(() => {
                    log('Chat: msg deleted, data updated');
                }).catch((error) => {
                    err(error);
                });
            });
        }

        // menu reply button click
        else if (e.target.id == 'menu_reply') {
            Menu.hide(() => {
                quote_reply_text = `<blockquote id="tm_${long_pressed_element.id}" style="overflow:auto; max-height:100px;">${long_pressed_element.innerHTML}</blockquote>\n\n`;
                $('#txtmsg').focus();
            });
        }

        // menu details button click
        else if (e.target.id == 'menu_details') {
            Menu.hide(() => {
                const message = ChatData[long_pressed_element.id];
                const time = message.time;

                // innerHTML of dialog
                const infoHTML = '<pre style="'
                               +     'margin: 0;'
                               +     'padding: 0;'
                               +     'width: 100%;'
                               +     'overflow: auto;'
                               +     'text-align:left;'
                               +     'font-size: 0.9rem;'
                               +     'font-family: sans-serif; ">'
                               +     '<table style="text-align:left">'
                               +         `<tr><td>Sent by: </td><td>${ChatData[long_pressed_element.id].uid == USER_ID ? 'You' : ChatData[long_pressed_element.id].uid}</td></tr>`
                               +         `<tr><td>Sent on: </td><td>${time.dayname.slice(0, 3)}, ${time.monthname.slice(0, 3)} ${time.date}, ${time.year}</td></tr>`
                               +         `<tr><td>Sent at: </td><td>${time.time}</td></tr>`
                               +     '</table>'
                               + '</pre>'

                // display dialog
                Dialog.display('action', 'Message details', infoHTML, 'Advanced', () => {
                    Dialog.hide('action', () => {

                        /* display excess JSON of chat
                         * WARNING: Take care when modifying the regex and order of replace function.
                         */
                        Dialog.display('alert', 'Message details', (
                              '<pre style="'
                            +     'margin: 0;'
                            +     'padding: 0;'
                            +     'width: 100%;'
                            +     'overflow: auto;'
                            +     'text-align:left;'
                            +     'font-size: 0.8rem;'
                            +     'font-family: sans-serif; ">'
                            +     '<b style="color:#777">User ID</b>\n'
                            +     `${message.uid}\n\n`
                            +     '<b style="color:#777">Push key</b>\n'
                            +     `${message.pushkey}\n\n`
                            +     '<b style="color:#777">HTML Code</b>\n'
                            +     '<code>'
                            +         decode(message.message)
                                      .replace (/</g, '&lt;')
                                      .replace(/>/g, '&gt;')
                            +     '</code>'
                            + '</pre>'
                        ));
                    });
                });
            });
        }

        /* ------------------------------------- DO NOT TOUCH THIS ELSE IF BLOCK ----------------------------
         * This is the chat bubble highlighter code.
         * The upper indented block is just the condition of the else if statement.
         * The condition contains an anonymous function definition and it's immediate execution.
         * The lower indented block is the actual code.
         */
        else if (highlight_target = (() => {
            if (e.target.id.includes('tm_')) return $(`#${e.target.id.substring(3)}`);
            for (let bq of $('blockquote')) if (childHasParent(e.target, bq) && bq.id.includes('tm_')) {
                log(`Chat: generated id = #${bq.id.substring(3)}`);
                return $(`#${bq.id.substring(3)}`);
            }
        })()) {
            // code starts here
            highlight_target = highlight_target.parentNode;
            log(`Chat: highlight: bubble target id = #${highlight_target.id}`);
            if (quoted_reply_highlight_timeout) clearTimeout(quoted_reply_highlight_timeout);
            highlight_target.style.animation = '';
            const behavior = smoothScroll(highlight_target, true);
            highlight_target.scrollIntoView(true, {
                behavior,
            });
            highlight_target.style.animation = 'highlight 10s';
            quoted_reply_highlight_timeout = setTimeout(() => {
                highlight_target.style.animation = '';
            }, 10000);
        }
        /* -------------------------------------------- DO NOT TOUCH ENDS ------------------------------------ */
    });
    
    // timer variable
    let longpress_timer;
    let longpress_timeout;
    
    // on mouse down listener
    document.body.addEventListener('pointerdown', (e) => {

        log(`Chat: pointerdown: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);

        // bubble container long press
        if (e.target.className == 'bubbles') {
            longpress_timer = setTimeout(() => {
                scaled_element = e.target.firstChild;
                scaled_element.style.transitionDuration = '300ms';
                scaled_element.style.transform = 'scale(0.93)';
                $('#chatarea').style.userSelect = 'none';
            }, 200);
            longpress_timeout = setTimeout(() => {
                log('Chat: long press triggered');
                long_pressed_element = scaled_element;
                long_pressed_element.style.transform = 'scale(1)';
                clearTimeout(longpress_timer);

                // show menu
                Menu.display();
            }, 600);
        }

        // image long pressed
        else if (e.target.nodeName == 'IMG' && e.target.parentNode.parentNode.parentNode.className == 'bubbles') {
            longpress_timer = setTimeout(() => {
                scaled_element = e.target.parentNode.parentNode;
                scaled_element.style.transitionDuration = '300ms';
                scaled_element.style.transform = 'scale(0.93)';
                $('#chatarea').style.userSelect = 'none';
            }, 200);
            longpress_timeout = setTimeout(() => {
                log('Chat: long press triggered');
                long_pressed_element = scaled_element;
                scaled_element.style.transform = 'scale(1)';
                clearTimeout(longpress_timer);
                if (EXISTS_ANDROID_INTERFACE) Dialog.display('action', 'Download image', 'Do you wish to download this image?', 'Download', () => {
                    Dialog.hide('action', () => {
                        try {
                            Android.showToast('Look into your notification panel for download progress');
                            downloadFile(e.target.src, `${e.target.alt.trim() ? e.target.alt.trim() : 'image'}_sozialnmedien_${getTimeStamp()}.png`);
                        }
                        catch (error) {
                            Dialog.display('alert', 'Download failed', `Failed to download file. Click <a href="${e.target.src}">here</a> to visit file in browser.`);
                            return;
                        }
                    });
                });
            }, 600);
        }

        // if it's a link, copy it
        else if (e.target.nodeName == 'A') {
            if (EXISTS_ANDROID_INTERFACE) longpress_timeout = setTimeout(() => {
                log('Chat: long press triggered');
                copyPlainTxt(e.target.href);
            }, 500);
        }
    });
    
    // on mouse up listener
    document.body.addEventListener('pointerup', (e) => {
        log('Chat: pointer up');
        if (long_pressed_element) long_pressed_element.style.transform = 'scale(1)';
        if (scaled_element) scaled_element.style.transform = 'scale(1)';
        $('#chatarea').style.userSelect = 'initial';
        clearTimeout(longpress_timer);
        clearTimeout(longpress_timeout);
    });
    
    // swipe gesture listener
    document.body.addEventListener('touchmove', (e) => {
        log(`Chat: swiped: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
        if (long_pressed_element) long_pressed_element.style.transform = 'scale(1)';
        if (scaled_element) scaled_element.style.transform = 'scale(1)';
        $('#chatarea').style.userSelect = 'initial';
        clearTimeout(longpress_timer);
        clearTimeout(longpress_timeout);
    });
    
    /* Although deprecated, this function is used because
     * the 'Loading chats' dialog is not shown using Dialog.display().
     * Instead it's shown using CSS style 'visibility: visible'.
     * This is done to make the dialog visible immediately after the page
     * is loaded.
     */
    Overlay.setInstanceOpen(true);
    
    /* start listening for arrival/departure of messages.
     * This code will fail if ChatData is not loaded, which is done up above, before the event listeners are added.
     */
    loadChatsToUI();

    // hide splashcreeen
    SplashScreen.hide(() => {
        smoothScroll($('#chatarea'), false, false);
        checkForApkUpdates();
    });

    // start listening for new messages
    startDBListener();
    
    log('Chat: document and script load complete');
}

main();
