import { ref, push, update, onValue } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { Database, DB_ROOT } from '/common/js/firebaseinit.js';
import {
    USERID,
    DEBUG,
    EXISTSANDROIDINTERFACE,
    overlay,
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
} from '../common/js/modules.js';

// Markdown converter
const MDTOHTML = new showdown.Converter();
MDTOHTML.setFlavor('github');

// other variables
let PREVHEIGHT = document.body.clientHeight;
let PREVWIDTH = document.body.clientWidth;
let CHATSCROLLHEIGHT = $('#chatarea').scrollHeight;
let PRETEXT = '';
let LONGPRESSED;
let SOFTBOARDOPEN = false;

// the entire chat is downloaded and stored here
// the data has unique random values as keys
const CHATDATA = JSON.parse(localStorage.getItem(CHAT_ROOT)) || {};

// database listener
const startDBListener = () => {
    // db listener, fetches new msg on update
    onValue(ref(Database, DB_ROOT + CHAT_ROOT), (snapshot) => {
        // setting up html
        let getHTML = '';
        $('#chatarea').innerHTML = '<div class="info noselect" style="font-family: sans-serif">' +
                                   '<p class="fa fa-info-circle">&ensp;Messages in this chat are only server-to-end encrypted.</p>' +
                                   '</div>';
        snapshot.forEach(({ key }) => {
            let pushkey = key;
            let data = snapshot.child(pushkey).val();
            let uid = data.uid;
            // store data in local variable
            CHATDATA[pushkey] = {
                uid,
                pushkey,
                message: data.message,
                time: data.time,
            };
            // cache chat in local storage
            localStorage.setItem(CHAT_ROOT, JSON.stringify(CHATDATA));
            // get html from msg
            getHTML = decode(data.message);
            if (uid == USERID) {
                appendHTMLString($('#chatarea'),
                    '<div class="bubbles" id="' + pushkey + '">' +
                    '<div class="this sec_bg">' +
                    getHTML +
                    '</div>' +
                    '</div>',
                );
                if (DEBUG) console.log('Log: this: pushkey = ' + pushkey);
                if (DEBUG) console.log('Log: this: html = ' + $('#chatarea').innerHTML);
            }
            else {
                appendHTMLString($('#chatarea'),
                    '<div class="bubbles" id="' + pushkey + '">' +
                    '<div class="that">' +
                    getHTML +
                    '</div>' +
                    '</div>'
                );
                if (DEBUG) console.log('Log: that: pushkey = ' + pushkey);
                if (DEBUG) console.log('Log: that: html = ' + $('#chatarea').innerHTML);
            }
            /* this delay makes sure the entire chatarea is loaded before it's scrolled to place
             * it's not smooth scrolled, that's the 3rd flag
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
        log('db update fetched');
    });
}
// on key up listener
document.addEventListener('keyup', (e) => {
    let key = e.keyCode || e.charCode
    log('keypress: key = ' + key);
    let HTML = PRETEXT + MDTOHTML.makeHtml($('#txtmsg').value.trim());
    if (HTML != '') {
        $('#msgpreview').style.display = 'block';
        $('#txtmsg').style.borderRadius = '0 0 10px 10px';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>' + HTML;
        smoothScroll($('#msgpreview'));
    }
    else {
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>' + '<font color="#7d7d7d">Preview appears here</font>';
    }
    if ((key == 8 || key == 46) && $('#txtmsg').value.trim() == '') {
        PRETEXT = '';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>' + '<font color="#7d7d7d">Preview appears here</font>';
    }
    // if html contains code, run highlighter
    if (HTML.match(/pre/i) && HTML.match(/code/i)) {
        hljs.highlightAll();
    }
});
// soft keyboard launch triggers window resize event
window.addEventListener('resize', (e) => {
    // detects soft keyboard switch
    if (PREVHEIGHT != document.body.clientHeight && PREVWIDTH == document.body.clientWidth) {
        SOFTBOARDOPEN = !SOFTBOARDOPEN;
        log('keyboard switch? height diff = ' + (document.body.clientHeight - PREVHEIGHT));
    }
    if (document.body.clientHeight - PREVHEIGHT < 0) {
        $('#chatarea').scrollTop += Math.abs(document.body.clientHeight - PREVHEIGHT);
    }
    PREVWIDTH = document.body.clientWidth;
    PREVHEIGHT = document.body.clientHeight;
    // switches visibility of msgpreview
    let HTML = PRETEXT + MDTOHTML.makeHtml($('#txtmsg').value.trim());
    if (HTML != '' && SOFTBOARDOPEN) {
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>' + HTML;
        $('#msgpreview').style.display = 'block';
        $('#txtmsg').style.borderRadius = '0 0 10px 10px';
        smoothScroll($('#msgpreview'));
    }
    else {
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>' + '<font color="#7d7d7d">Preview appears here</font>';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
    }
});
// on send button clicked
$('#btnsend').addEventListener('click', (e) => {
    let msgbackup = '';
    let msg = (msgbackup = $('#txtmsg').value).trim();
    if (msg == '') {
        $('#txtmsg').value = '';
        $('#txtmsg').focus();
    }
    else {
        msg = PRETEXT + $('#txtmsg').value.trim();
        PRETEXT = '';
        $('#txtmsg').value = '';
        $('#msgpreview').innerHTML = '<font class="header" color="#7d7d7d">Markdown preview</font>';
        $('#msgpreview').style.display = 'none';
        $('#txtmsg').style.borderRadius = '40px';
        if (msg.length > 1024 * 2) {
            dialog.display('alert', 'Warning', 'Text exceeds limit of 2KB');
            $('#txtmsg').value = msgbackup;
            return;
        }
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
        msg = MDTOHTML.makeHtml(msg);
        /* this is temporary and is overwritten when db update is fetched
         * which is why the class this has no pushkey id
         */
        appendHTMLString($('#chatarea'),
            '<div class="bubbles">' +
            '<div class="this sec_bg">' +
            msg +
            '</div>' +
            '</div>'
        );
        smoothScroll($('#chatarea'), true, true);
        // a small delay of 200ms to prevent a lag caused when writing to db
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
                    + ('0' + Date.getSeconds()).slice(-2),
            }
            // push generates a unique id which is based on timestamp
            const pushkey = push(ref(Database, DB_ROOT + CHAT_ROOT)).key;
            update(ref(Database, DB_ROOT + CHAT_ROOT + pushkey + '/'), {
                time,
                pushkey,
                message: encode(msg),
                uid: USERID,
            })
            .then(() => {
                log('data pushed');
                loadTheme();
            })
            .catch((error) => {
                err(error);
                $('#txtmsg').value = msgbackup;
            });
        }, 200);
    }
});
// onclick listeners
document.body.addEventListener('click', (e) => {
    let target;
    // title bar back arrow click
    if (e.target.className == 'backarrow') {
        log('history: going back');
        history.back();
    }
    // menu copy button click
    else if (e.target.id == 'menu_copy') {
        menu.hide();
        copyPlainTxt(LONGPRESSED.innerHTML);
    }
    // menu unsend button click
    else if (e.target.id == 'menu_unsend') {
        menu.hide();
        // this delay of 300ms is to prevent a lag that occurrs when writing to db
        setTimeout(() => {  
            if (CHATDATA[LONGPRESSED.id].uid == USERID) {
                // unsend is possible only within 1 hour
                if (getTimeStamp() - parseInt(CHATDATA[LONGPRESSED.id].time.stamp) < 3600000) {
                    update(ref(Database, DB_ROOT + CHAT_ROOT), {
                        [LONGPRESSED.id]: null
                    })
                    .then(() => {
                        log('msg deleted, data updated');
                    })
                    .catch((error) => {
                        err(error);
                    });
                }
                else {
                    dialog.display('alert', 'Not allowed', 'You can only unsend a message within 1 hour of sending it.');
                }
            }
            else {
                dialog.display('alert', 'Not allowed', 'You can unsend a message only if you have sent it.');
            }
        }, 300);
    }
    // menu reply button click
    else if (e.target.id == 'menu_reply') {
        menu.hide();
        PRETEXT = '<blockquote id="tm_' + LONGPRESSED.id + '">' + getChildElement(LONGPRESSED, 'div')[0].innerHTML + '</blockquote>\n\n';
        $('#txtmsg').focus();
    }
    // menu details button click
    else if (e.target.id == 'menu_details') {
        menu.hide();
        let message = CHATDATA[LONGPRESSED.id];
        let time = message.time;
        // innerHTML of dialog
        let infoHTML = '<table style="width:100%; text-align:left">'
                     +     '<tr><td>Sent by: </td><td><pre style="margin:0; padding:0; font-family:sans-serif; overflow:auto; width:180px;">' + (CHATDATA[LONGPRESSED.id].uid == USERID ? 'You' : CHATDATA[LONGPRESSED.id].uid) + '</pre></td></tr>'
                     +     '<tr><td>Sent on: </td><td>' + time.dayname.slice(0, 3) + ', ' + time.monthname.slice(0, 3) + ' ' + time.date + ', ' + time.year + '</td></tr>'
                     +     '<tr><td>Sent at: </td><td>' + time.time + '</td></tr>'
                     + '</table>'
        // display dialog
        dialog.display('action', 'Message details', infoHTML, 'Advanced', () => {
            dialog.hide('action');
            // display excess JSON of chat
            dialog.display('alert', 'Message details',
                           '<pre style="overflow:auto; text-align:left;">'
                          + decode(JSON.stringify(message, null, 4)
                              .replace(/\n    /g, '\n'))
                              .replace(/"|'|,/g, '')
                              .replace (/</g, '&lt;')
                              .replace(/>/g, '&gt;')
                              .replace(/\n}/g, '')
                              .replace(/{\n\S/g, '')
                              .replace(/{/g, '')
                          + '</pre>');
        });
    }
    /* DO NOT TOUCH THIS CODE, this is the chat bubble highlighter code
     * The upper indented block is the condition of the else if statement
     * The condition contains an anonymous function definition and it's
     * immediate execution.
     * The lower indented block is the actual code
     */
    else if (target = (() => {
        if (e.target.id.includes('tm_')) {
            return $('#' + e.target.id.substring(3));
        }
        for (let bq of $('blockquote')) {
            log('bq id = ' + bq.id);
            if (childHasParent(e.target, bq) && bq.id.includes('tm_')) {
                log('generated id = ' + '#' + bq.id.substring(3));
                return $('#' + bq.id.substring(3));
            }
        }
        return null;
    })() != null)
    // else if condition ends here
    {
        // code starts here
        log('target id = #' + target.id);
        let behavior = smoothScroll(target, false);
        target.scrollIntoView(true, {
            behavior: behavior,
            block: 'center'
        });
        target.style.animation = 'initial';
        target.style.animation = 'highlight 4s';
        setTimeout(() => {
            target.style.animation = '';
        }, 3000);
    }
});
// timer variable
let LONGPRESSTIMER;
let LONGPRESSTIMEOUT;
// on mouse down listener
document.body.addEventListener('pointerdown', (e) => {
    log('pointerdown: ' +
         'id = ' + e.target.id + ' ' +
         'node = ' + e.target.nodeName + ' ' +
         'class = ' + e.target.className);
    // bubble container long press
    if (e.target.className == 'bubbles') {
        LONGPRESSTIMER = setTimeout(() => {
            e.target.style.transform = 'scale(0.93)';
            e.target.style.userSelect = 'none';
        }, 200);
        LONGPRESSTIMEOUT = setTimeout(() => {
            log('long press triggered');
            LONGPRESSED = e.target;
            e.target.style.transform = 'scale(1)';
            clearTimeout(LONGPRESSTIMER);
            // show menu
            menu.display();
        }, 600);
    }
    // image long pressed
    else if (e.target.nodeName == 'IMG' && e.target.parentNode.parentNode.parentNode.className == 'bubbles') {
        // get parent bubble container (.bubbles) of the image
        let parent_bubble = e.target.parentNode.parentNode.parentNode;
        // 200 ms delay
        LONGPRESSTIMER = setTimeout(() => {
            // shrink the parent slightly
            parent_bubble.style.transform = 'scale(0.93)';
        }, 200);
        LONGPRESSTIMEOUT = setTimeout(() => {
            log('long press triggered');
            LONGPRESSED = parent_bubble;
            parent_bubble.style.transform = 'scale(1)';
            clearTimeout(LONGPRESSTIMER);
            if (EXISTSANDROIDINTERFACE) dialog.display('action', 'Download image', 'Do you wish to download this image?', 'Download', () => {
                dialog.hide('action');
                setTimeout(() => {
                    try {
                        Android.showToast('Look into your notification panel for download progress');
                        download(e.target.src, e.target.alt.trim() + '_sozialnmedien_' + getTimeStamp() + '.png');
                    }
                    catch (error) {
                        dialog.display('alert', 'Download failed', 'Failed to download file. Click <a href="' + e.target.src + '">here</a> to visit file in browser.');
                        return;
                    }
                }, 1000);
            });
        }, 600);
    }
    // if it's a link, copy it
    else if (e.target.nodeName == 'A') {
        if (EXISTSANDROIDINTERFACE) LONGPRESSTIMEOUT = setTimeout(() => {
            log('long press triggered');
            copyPlainTxt(e.target.href);
        }, 500);
    }
});
// on mouse up listener
document.body.addEventListener('pointerup', (e) => {
    log('pointer up');
    if (LONGPRESSED) LONGPRESSED.style.transform = 'scale(1)';
    e.target.style.transform = 'scale(1)';
    e.target.style.userSelect = 'initial';
    clearTimeout(LONGPRESSTIMER);
    clearTimeout(LONGPRESSTIMEOUT);
});
// swipe gesture listener
document.body.addEventListener('touchmove', (e) => {
    log('swiped: ' +
         'id = ' + e.target.id + ' ' +
         'node = ' + e.target.nodeName + ' ' +
         'class = ' + e.target.className);
    if (LONGPRESSED) LONGPRESSED.style.transform = 'scale(1)';
    e.target.style.transform = 'scale(1)';
    e.target.style.userSelect = 'initial';
    clearTimeout(LONGPRESSTIMER);
    clearTimeout(LONGPRESSTIMEOUT);
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
