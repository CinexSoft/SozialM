import { Database, DB_ROOT } from '/common/js/firebaseinit.js';
import {
    ref as firebaseDBRef,
    push as firebaseDBPush,
    update as firebaseDBUpdate,
    onValue as firebaseOnRtdbDataChanged,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import {
    USER_ID,
    DEBUG,
    EXISTS_ANDROID_INTERFACE,
    Overlay,
    getTimeStamp,
    getLongDateTime,
    log,
    err,
    encode,
    decode,
    download,
    copyPlainTxt,
    getBrowser,
    $,
    getChildElement,
    childHasParent,
    appendHTMLString,
    dialog,
    menu,
    checkForApkUpdates,
    smoothScroll,
    loadTheme,
} from '/common/js/modules.js';

// Markdown converter
const MDtoHTML = new showdown.Converter();
MDtoHTML.setFlavor('github');

// other variables
let PREVIOUS_HEIGHT = document.body.clientHeight;
let PREVIOUS_WIDTH = document.body.clientWidth;
let CHATAREA_SCROLL_HEIGHT = $('#chatarea').scrollHeight;
let QUOTE_REPLY_TEXT = '';
let LONG_PRESSED_ELEMENT;
let SOFTBOARD_OPEN = false;

// the entire chat is downloaded and stored here
// the data has unique random values as keys
const ChatData = JSON.parse(localStorage.getItem(CHAT_ROOT)) || {};

// database listener
const startDBListener = () => {
    // db listener, fetches new msg on update
    firebaseOnRtdbDataChanged(firebaseDBRef(Database, DB_ROOT + CHAT_ROOT), (snapshot) => {
        // setting up html
        $('#chatarea').innerHTML = '<div class="info noselect sec_bg" style="font-family:sans-serif">'
                                 + '<p class="fa fa-info-circle">&ensp;Messages in this chat are only server-to-end encrypted.</p>'
                                 + '</div>';
        snapshot.forEach(({ key }) => {
            const pushkey = key;
            const data = snapshot.child(pushkey).val();
            const uid = data.uid;
            // store data in local variable
            ChatData[pushkey] = {
                uid,
                pushkey,
                message: data.message,
                time: data.time,
            };
            // cache chat in local storage
            localStorage.setItem(CHAT_ROOT, JSON.stringify(ChatData));
            // get html from msg
            const getHTML = decode(data.message);
            if (uid == USER_ID) {
                appendHTMLString($('#chatarea'), `<div class="bubbles" id="${pushkey}"><div class="this chatbubble_bg">${getHTML}</div></div>`);
                if (DEBUG) console.log(`Log: Chat: this: pushkey = ${pushkey}`);
                if (DEBUG) console.log(`Log: Chat: this: html = ${$('#chatarea').innerHTML}`);
            } else {
                appendHTMLString($('#chatarea'), `<div class="bubbles" id="${pushkey}"><div class="that">${getHTML}</div></div>`);
                if (DEBUG) console.log(`Log: Chat: that: pushkey = ${pushkey}`);
                if (DEBUG) console.log(`Log: Chat: that: html = ${$('#chatarea').innerHTML}`);
            }
            /* this delay makes sure the entire chatarea is loaded before it's scrolled to place
             * it's not smooth scrolled, that's the 3rd parameter
             */
            smoothScroll($('#chatarea'), true, true);
        });
        if ($('#chatarea').innerHTML.match(/pre/i) &&
            $('#chatarea').innerHTML.match(/code/i)) {
            hljs.highlightAll();
        }
        dialog.hide('alert', () => {
            checkForApkUpdates();
        });
        loadTheme();
        log('Chat: db update fetched');
    });
}

// on key up listener
document.addEventListener('keyup', (e) => {
    const key = e.keyCode || e.charCode;
    log(`Chat: keypress: key = ${key}`);
    const HTML = QUOTE_REPLY_TEXT + MDtoHTML.makeHtml($('#txtmsg').value.trim());
    if (HTML) {
        $('#msgpreview').style.display = 'block';
        $('#txtmsg').style.borderRadius = '0 0 10px 10px';
        $('#msgpreview').innerHTML = `<font class="header" color="#7d7d7d">Markdown preview</font>${HTML}`;
        smoothScroll($('#msgpreview'));
    } else {
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font><font color="#7d7d7d">Preview appears here</font>';
    }
    const KEY_DEL = 8,
          KEY_BACKSPACE = 46;
    if ((key == KEY_DEL || key == KEY_BACKSPACE) && !$('#txtmsg').value.trim()) {
        QUOTE_REPLY_TEXT = '';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font><font color="#7d7d7d">Preview appears here</font>';
    }
    // if html contains code, run highlighter
    if (HTML.match(/pre/i) && HTML.match(/code/i)) {
        hljs.highlightAll();
    }
});

// soft keyboard launch triggers window resize event
window.addEventListener('resize', (e) => {
    // detects soft keyboard switch
    if (PREVIOUS_HEIGHT != document.body.clientHeight && PREVIOUS_WIDTH == document.body.clientWidth) {
        SOFTBOARD_OPEN = !SOFTBOARD_OPEN;
        log(`Chat: keyboard: switched? height diff = ${document.body.clientHeight - PREVIOUS_HEIGHT}`);
    }
    if (document.body.clientHeight - PREVIOUS_HEIGHT < 0) $('#chatarea').scrollTop += Math.abs(document.body.clientHeight - PREVIOUS_HEIGHT);
    PREVIOUS_WIDTH = document.body.clientWidth;
    PREVIOUS_HEIGHT = document.body.clientHeight;
    // switches visibility of msgpreview
    const HTML = QUOTE_REPLY_TEXT + MDtoHTML.makeHtml($('#txtmsg').value.trim());
    if (HTML != '' && SOFTBOARD_OPEN) {
        $('#msgpreview').innerHTML = `<font class="header" color="#7d7d7d">Markdown preview</font>${HTML}`;
        $('#msgpreview').style.display = 'block';
        $('#txtmsg').style.borderRadius = '0 0 10px 10px';
        smoothScroll($('#msgpreview'));
        return;
    }
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
    const msg = QUOTE_REPLY_TEXT + msgbackup.trim();
    if (msg.length > 1024 * 2) {
        dialog.display('alert', 'Warning', 'Text exceeds limit of 2KB');
        $('#txtmsg').value = msgbackup;
        return;
    }
    QUOTE_REPLY_TEXT = '';
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
    const messageHTML = MDtoHTML.makeHtml(msg);
    /* this append is temporary and is overwritten when db update is fetched
     * which is why the class this has no pushkey id
     */
    appendHTMLString($('#chatarea'), `<div class="bubbles"><div class="this chatbubble_bg">${messageHTML}</div></div>`);
    smoothScroll($('#chatarea'), true, true);
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
        const pushkey = firebaseDBPush(firebaseDBRef(Database, DB_ROOT + CHAT_ROOT)).key;
        firebaseDBUpdate(firebaseDBRef(Database, DB_ROOT + CHAT_ROOT + pushkey + '/'), {
            time,
            pushkey,
            message: encode(messageHTML),
            uid: USER_ID,
        }).then(() => {
            log('Chat: data pushed');
            loadTheme();
        }).catch((error) => {
            err(error);
            $('#txtmsg').value = msgbackup;
        });
    }, Overlay.animation_duration);
});

/**
 * Variable should only be used by bubble highlighter block inside the 'click' event listener.
 * @type {Number} Stores a timer id 
 */
let QUOTED_REPLY_HIGHLIGHT_TIMEOUT;

// onclick listeners
document.body.addEventListener('click', (e) => {
    /**
     * Variable should only be used by bubble highlighter block.
     * Purpose is to store the node that is to be highlighted when someone taps on a reply message.
     * @type {Node} HTML element
     */
    let highlight_target;
    // title bar back arrow click
    if (e.target.className == 'backarrow') {
        log('Chat: history: going back');
        history.back();
    }
    // menu copy button click
    else if (e.target.id == 'menu_copy') {
        menu.hide();
        copyPlainTxt(LONG_PRESSED_ELEMENT.innerHTML);
    }
    // menu unsend button click
    else if (e.target.id == 'menu_unsend') {
        menu.hide();
        // this delay is to prevent a lag that occurrs when writing to db, within which the dialog is hidden
        setTimeout(() => {
            // unsend not possible if not sent by user
            if (ChatData[LONG_PRESSED_ELEMENT.id].uid != USER_ID) {
                dialog.display('alert', 'Not allowed', 'You can unsend a message only if you have sent it.');
                return;
            }
            // unsend not possible after 1 hour
            if (getTimeStamp() - parseInt(ChatData[LONG_PRESSED_ELEMENT.id].time.stamp) > 3600000) {
                dialog.display('alert', 'Not allowed', 'You can only unsend a message within 1 hour of sending it.');
                return;
            }
            firebaseDBUpdate(firebaseDBRef(Database, DB_ROOT + CHAT_ROOT), {
                [LONG_PRESSED_ELEMENT.id]: null
            }).then(() => {
                log('Chat: msg deleted, data updated');
            }).catch((error) => {
                err(error);
            });
        }, Overlay.animation_duration);
    }
    // menu reply button click
    else if (e.target.id == 'menu_reply') {
        menu.hide();
        QUOTE_REPLY_TEXT = `<blockquote id="tm_${LONG_PRESSED_ELEMENT.id}">${getChildElement(LONG_PRESSED_ELEMENT, 'div')[0].innerHTML}</blockquote>\n\n`;
        $('#txtmsg').focus();
    }
    // menu details button click
    else if (e.target.id == 'menu_details') {
        menu.hide();
        const message = ChatData[LONG_PRESSED_ELEMENT.id];
        const time = message.time;
        // innerHTML of dialog
        const infoHTML = '<table style="width:100%; text-align:left">'
                       +     `<tr><td>Sent by: </td><td><pre style="margin:0; padding:0; font-family:sans-serif; overflow:auto; width:180px;">${ChatData[LONG_PRESSED_ELEMENT.id].uid == USER_ID ? 'You' : ChatData[LONG_PRESSED_ELEMENT.id].uid}</pre></td></tr>`
                       +     `<tr><td>Sent on: </td><td>${time.dayname.slice(0, 3)}, ${time.monthname.slice(0, 3)} ${time.date}, ${time.year}</td></tr>`
                       +     `<tr><td>Sent at: </td><td><pre style="margin:0; padding:0; font-family:sans-serif; overflow:auto; width:180px;">${time.time}</pre></td></tr>`
                       + '</table>'
        // display dialog
        dialog.display('action', 'Message details', infoHTML, 'Advanced', () => {
            dialog.hide('action');
            /* display excess JSON of chat
             * WARNING: Take care when modifying the regex and order of replace function.
             */
            dialog.display('alert', 'Message details',
                '<pre style="overflow:auto; text-align:left;">'
                    + decode(
                        JSON.stringify(message, null, 4)
                        .replace(/\n    /g, '\n')
                        .replace(/"|'|,/g, '')
                    )
                    .replace (/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n}/g, '')
                    .replace(/{\n\S/g, '')
                    .replace(/{/g, '')
                + '</pre>'
            );
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
        log(`Chat: highlight: bubble target id = #${highlight_target.id}`);
        if (QUOTED_REPLY_HIGHLIGHT_TIMEOUT) clearTimeout(QUOTED_REPLY_HIGHLIGHT_TIMEOUT);
        highlight_target.style.animation = '';
        const behavior = smoothScroll(highlight_target, false);
        highlight_target.scrollIntoView(true, {
            behavior,
        });
        highlight_target.style.animation = 'highlight 10s';
        QUOTED_REPLY_HIGHLIGHT_TIMEOUT = setTimeout(() => {
            highlight_target.style.animation = '';
        }, 10000);
    }
    /* -------------------------------------------- DO NOT TOUCH ENDS ------------------------------------ */
});

// timer variable
let LONGPRESS_TIMER;
let LONGPRESS_TIMEOUT;

// on mouse down listener
document.body.addEventListener('pointerdown', (e) => {
    log(`Chat: pointerdown: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
    // bubble container long press
    if (e.target.className == 'bubbles') {
        LONGPRESS_TIMER = setTimeout(() => {
            e.target.style.transform = 'scale(0.93)';
            e.target.style.userSelect = 'none';
        }, 200);
        LONGPRESS_TIMEOUT = setTimeout(() => {
            log('Chat: long press triggered');
            LONG_PRESSED_ELEMENT = e.target;
            e.target.style.transform = 'scale(1)';
            clearTimeout(LONGPRESS_TIMER);
            // show menu
            menu.display();
        }, 600);
    }
    // image long pressed
    else if (e.target.nodeName == 'IMG' && e.target.parentNode.parentNode.parentNode.className == 'bubbles') {
        // get parent bubble container (.bubbles) of the image
        const parent_bubble = e.target.parentNode.parentNode.parentNode;
        // 200 ms delay
        LONGPRESS_TIMER = setTimeout(() => {
            // shrink the parent slightly
            parent_bubble.style.transform = 'scale(0.93)';
        }, 200);
        LONGPRESS_TIMEOUT = setTimeout(() => {
            log('Chat: long press triggered');
            LONG_PRESSED_ELEMENT = parent_bubble;
            parent_bubble.style.transform = 'scale(1)';
            clearTimeout(LONGPRESS_TIMER);
            if (EXISTS_ANDROID_INTERFACE) dialog.display('action', 'Download image', 'Do you wish to download this image?', 'Download', () => {
                dialog.hide('action');
                setTimeout(() => {
                    try {
                        Android.showToast('Look into your notification panel for download progress');
                        download(e.target.src, `${e.target.alt.trim()}_sozialnmedien_${getTimeStamp()}.png`);
                    }
                    catch (error) {
                        dialog.display('alert', 'Download failed', `Failed to download file. Click <a href="${e.target.src}">here</a> to visit file in browser.`);
                        return;
                    }
                }, 1000);
            });
        }, 600);
    }
    // if it's a link, copy it
    else if (e.target.nodeName == 'A') {
        if (EXISTS_ANDROID_INTERFACE) LONGPRESS_TIMEOUT = setTimeout(() => {
            log('Chat: long press triggered');
            copyPlainTxt(e.target.href);
        }, 500);
    }
});

// on mouse up listener
document.body.addEventListener('pointerup', (e) => {
    log('Chat: pointer up');
    if (LONG_PRESSED_ELEMENT) LONG_PRESSED_ELEMENT.style.transform = 'scale(1)';
    e.target.style.transform = 'scale(1)';
    e.target.style.userSelect = 'initial';
    clearTimeout(LONGPRESS_TIMER);
    clearTimeout(LONGPRESS_TIMEOUT);
});

// swipe gesture listener
document.body.addEventListener('touchmove', (e) => {
    log(`Chat: swiped: id = ${e.target.id} node = ${e.target.nodeName} class = ${e.target.className}`);
    if (LONG_PRESSED_ELEMENT) LONG_PRESSED_ELEMENT.style.transform = 'scale(1)';
    e.target.style.transform = 'scale(1)';
    e.target.style.userSelect = 'initial';
    clearTimeout(LONGPRESS_TIMER);
    clearTimeout(LONGPRESS_TIMEOUT);
});

/* Although deprecated, this function is used because
 * the 'Loading chats' dialog is not shown using dialog.display().
 * Instead it's shown using CSS style 'visibility: visible'.
 * This is done to make the dialog visible immediately after the page
 * is loaded.
 */
Overlay.setInstanceOpen(true);

// start listening for arrival/departure of messages
startDBListener();

log('Chat: document and script load complete');
