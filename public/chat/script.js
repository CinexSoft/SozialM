// Markdown converter
const MDTOHTML = new showdown.Converter();
MDTOHTML.setFlavor("github");

// other variables
let PREVHEIGHT = document.body.clientHeight;
let PREVWIDTH = document.body.clientWidth;
let CHATSCROLLHEIGHT = $("#chatarea").scrollHeight;
let PRETEXT = "";
let LONGPRESSED;
let SOFTBOARDOPEN = false;

// the entire chat is downloaded and stored here
// the data has timestamps as keys
const CHATDATA = {};

// database listener
const startDBListener = () => {
    // db listener, fetches new msg on update
    DATABASE.ref(DBROOT + CHATROOT).on('value', (snapshot) => {
        // setting up html
        let getHTML = "";
        $("#chatarea").innerHTML = "";
        appendHTMLString($("#chatarea"),
            "<div class=\"info\">" +
            "<p class=\"fa fa-info-circle\">&ensp;Messages in this chat are only server-to-end encrypted.</p>" +
            "</div>"
        );
        snapshot.forEach(({ key }) => {
            let timestamp = key;
            let data = snapshot.child(timestamp).val();
            let token = data.token;
            // store data in local variable
            CHATDATA[timestamp] = {
                token: data.token,
                message: data.message,
                time: data.time
            };
            // cache chat in local storage
            localStorage.setItem(CHATROOT, JSON.stringify(CHATDATA));
            // get html from msg
            getHTML = decode(data.message);
            if (token == USERTOKEN) {
                appendHTMLString($("#chatarea"),
                    "<div class=\"bubbles\" id=\"" + timestamp + "\">" +
                    "<div class=\"this sec_bg\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
                if (DEBUG) console.log("Log: this: timestamp = " + timestamp);
                if (DEBUG) console.log("Log: this: html = " + $("#chatarea").innerHTML);
            }
            else {
                appendHTMLString($("#chatarea"),
                    "<div class=\"bubbles\" id=\"" + timestamp + "\">" +
                    "<div class=\"that\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
                if (DEBUG) console.log("Log: that: timestamp = " + timestamp);
                if (DEBUG) console.log("Log: that: html = " + $("#chatarea").innerHTML);
            }
            setTimeout(() => {
                smoothScroll($("#chatarea"));
            }, 20);
        });
        if ($("#chatarea").innerHTML.match(/pre/i) &&
            $("#chatarea").innerHTML.match(/code/i)) {
            hljs.highlightAll();
        }
        dialog.hide("alert", () => {
            checkForApkUpdates();
        });
        loadTheme();
        log("db update fetched");
    });
}
// on key up listener
document.addEventListener("keyup", (e) => {
    let key = e.keyCode || e.charCode
    log("keypress: key = " + key);
    let HTML = PRETEXT + MDTOHTML.makeHtml($("#txtmsg").value.trim());
    if (HTML != "") {
        $("#msgpreview").style.display = "block";
        $("#txtmsg").style.borderRadius = "0 0 10px 10px";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + HTML;
        smoothScroll($("#msgpreview"));
    }
    else {
        $("#msgpreview").style.display = "none";
        $("#txtmsg").style.borderRadius = "40px";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
    }
    if ((key == 8 || key == 46) && $("#txtmsg").value.trim() == "") {
        PRETEXT = "";
        $("#msgpreview").style.display = "none";
        $("#txtmsg").style.borderRadius = "40px";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
    }
    // if html contains code, run highlighter
    if (HTML.match(/pre/i) && HTML.match(/code/i)) {
        hljs.highlightAll();
    }
});
// soft keyboard launch triggers window resize event
window.addEventListener("resize", (e) => {
    // detects soft keyboard switch
    if (PREVHEIGHT != document.body.clientHeight && PREVWIDTH == document.body.clientWidth) {
        SOFTBOARDOPEN = !SOFTBOARDOPEN;
        log("keyboard switch? height diff = " + (document.body.clientHeight - PREVHEIGHT));
    }
    if (document.body.clientHeight - PREVHEIGHT < 0) {
        $("#chatarea").scrollTop += Math.abs(document.body.clientHeight - PREVHEIGHT);
    }
    PREVWIDTH = document.body.clientWidth;
    PREVHEIGHT = document.body.clientHeight;
    // switches visibility of msgpreview
    let HTML = PRETEXT + MDTOHTML.makeHtml($("#txtmsg").value.trim());
    if (HTML != "" && SOFTBOARDOPEN) {
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + HTML;
        $("#msgpreview").style.display = "block";
        $("#txtmsg").style.borderRadius = "0 0 10px 10px";
        smoothScroll($("#msgpreview"));
    }
    else {
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
        $("#msgpreview").style.display = "none";
        $("#txtmsg").style.borderRadius = "40px";
    }
});
// on send button clicked
$("#btnsend").addEventListener("click", (e) => {
    let msgbackup = "";
    let msg = (msgbackup = $("#txtmsg").value).trim();
    if (msg == "") {
        $("#txtmsg").value = "";
        $("#txtmsg").focus();
    }
    else {
        msg = PRETEXT + $("#txtmsg").value.trim();
        PRETEXT = "";
        $("#txtmsg").value = "";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>";
        $("#msgpreview").style.display = "none";
        $("#txtmsg").style.borderRadius = "40px";
        if (msg.length > 1024 * 2) {
            dialog.display("alert", "Warning", "Text exceeds limit of 2KB");
            $("#txtmsg").value = msgbackup;
            return;
        }
        $("#txtmsg").focus();
        // months array
        let months = [
            "January", 
            "February", 
            "March", 
            "April", 
            "May", 
            "June", 
            "July", 
            "August", 
            "September", 
            "October", 
            "November", 
            "December"
        ];
        // Days array
        let weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        let Date = getLongDateTime(false)
        let time = {
            year: Date.getFullYear(),
            month: Date.getMonth() + 1,
            month_name: months[Date.getMonth()],
            date: Date.getDate(),
            day: Date.getDay(),
            day_name: weekdays[Date.getDay()],
            hours: Date.getHours(),
            minutes: Date.getMinutes(),
            seconds: Date.getSeconds()
        }
        DATABASE.ref(DBROOT + CHATROOT + getTimeStamp()).update({
            time,
            message: encode(MDTOHTML.makeHtml(msg)),
            token: USERTOKEN
        })
        .then(() => {
            log("data pushed");
        })
        .catch((error) => {
            err(error);
            $("#txtmsg").value = msgbackup;
        });
    }
    loadTheme();
});
// onclick listeners
document.body.addEventListener("click", (e) => {
    // menu copy button click
    if (e.target.id == "menu_copy") {
        menu.hide();
        copyPlainTxt(LONGPRESSED.innerHTML);
    }
    // menu unsend button click
    else if (e.target.id == "menu_unsend") {
        menu.hide();
        if (CHATDATA[LONGPRESSED.id].token == USERTOKEN) {
            if (getTimeStamp() - parseInt(LONGPRESSED.id) < 3600000) {
                DATABASE.ref(DBROOT + CHATROOT).update({
                    [LONGPRESSED.id]: null
                })
                .then(() => {
                    log("msg deleted, data updated");
                })
                .catch((error) => {
                    err(error);
                });
            }
            else {
                dialog.display("alert", "Not allowed", "You can only unsend a message within 1 hour of sending it.");
            }
        }
        else {
            dialog.display("alert", "Not allowed", "You can unsend a message only if you have sent it.");
        }
    }
    // menu reply button click
    else if (e.target.id == "menu_reply") {
        menu.hide();
        PRETEXT = "<blockquote id=\"tm_" + LONGPRESSED.id + "\">" + getChildElement(LONGPRESSED, "div")[0].innerHTML + "</blockquote>\n\n";
        $("#txtmsg").focus();
    }
    // menu details button click
    else if (e.target.id == "menu_details") {
        menu.hide();
        let time = CHATDATA[LONGPRESSED.id].time;
        // display dialog
        dialog.display("alert", "Message details", "<pre style=\"text-align:left; overflow:auto\">" +
                                                   "Sender: " + (CHATDATA[LONGPRESSED.id].token == USERTOKEN ? "You" : CHATDATA[LONGPRESSED.id].token) + "\n" +
                                                   "Time: " + JSON.stringify(time, null, 4) +
                                                   "</pre>");
    }
    /* DO NOT TOUCH THIS CODE, this is the chat bubble highlighter code
     * The upper indented block is the condition of the else if statement
     * The condition contains an anonymous function definition and it's
     * immediate execution.
     * The lower indented block is the actual code
     */
    else if ((target = (() => {
        if (e.target.id.includes("tm_")) {
            return $("#" + e.target.id.substring(3));
        }
        for (bq of $("blockquote")) {
            log("bq id = " + bq.id);
            if (hasElementAsParent(e.target, bq) && bq.id.includes("tm_")) {
                log("generated id = " + "#" + bq.id.substring(3));
                return $("#" + bq.id.substring(3));
            }
        }
        return null;
    })()) != null)
    // else if condition ends here
    {
        // code starts here
        log("target id = #" + target.id);
        let behavior = smoothScroll(target, false);
        target.scrollIntoView(true, {
            behavior: behavior,
            block: "center"
        });
        target.style.animation = "initial";
        target.style.animation = "highlight 4s";
        setTimeout(() => {
            target.style.animation = "";
        }, 3000);
    }
});
// timer variable
let LONGPRESSTIMER;
let LONGPRESSTIMEOUT;
// on mouse down listener
document.body.addEventListener("pointerdown", (e) => {
    log("pointerdown: " +
         "id = " + e.target.id + " " +
         "node = " + e.target.nodeName + " " +
         "class = " + e.target.className);
    // bubble container long press
    if (e.target.className == "bubbles") {
        LONGPRESSTIMER = setTimeout(() => {
            e.target.style.transform = "scale(0.95)";
            e.target.style.userSelect = "none";
        }, 200);
        LONGPRESSTIMEOUT = setTimeout(() => {
            log("long press triggered");
            LONGPRESSED = e.target;
            e.target.style.transform = "scale(1)";
            clearTimeout(LONGPRESSTIMER);
            // show menu
            menu.display();
        }, 1000);
    }
    // image long pressed
    else if (e.target.nodeName == "IMG" && e.target.parentNode.parentNode.parentNode.className == "bubbles") {
        // get parent bubble container (.bubbles) of the image
        let parent_bubble = e.target.parentNode.parentNode.parentNode;
        // 200 ms delay
        LONGPRESSTIMER = setTimeout(() => {
            // shrink the parent slightly
            parent_bubble.style.transform = "scale(0.95)";
            LONGPRESSED = parent_bubble;
        }, 200);
        LONGPRESSTIMEOUT = setTimeout(() => {
            log("long press triggered");
            parent_bubble.style.transform = "scale(1)";
            clearTimeout(LONGPRESSTIMER);
            if (EXISTSANDROIDINTERFACE) dialog.display("action", "Download image", "Do you wish to download this image?", "Download", () => {
                dialog.hide("action");
                setTimeout(() => {
                    try {
                        Android.showToast("Look into your notification panel for download progress");
                        download(e.target.src, e.target.alt.trim() + "_sozialnmedien_" + getTimeStamp() + ".png");
                    }
                    catch (error) {
                        dialog.display("alert", "Download failed", "Failed to download file. Click <a href=\"" + e.target.src + "\">here</a> to visit file in browser.");
                        return;
                    }
                }, 1000);
            });
        }, 1000);
    }
    // if it's a link, copy it
    else if (e.target.nodeName == "A") {
        if (EXISTSANDROIDINTERFACE) LONGPRESSTIMEOUT = setTimeout(() => {
            log("long press triggered");
            copyPlainTxt(e.target.href);
        }, 500);
    }
});
// on mouse up listener
document.body.addEventListener("pointerup", (e) => {
    log("pointer up");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(LONGPRESSTIMER);
    clearTimeout(LONGPRESSTIMEOUT);
});
// swipe gesture listener
document.body.addEventListener("touchmove", (e) => {
    log("swiped: " +
         "id = " + e.target.id + " " +
         "node = " + e.target.nodeName + " " +
         "class = " + e.target.className);
    LONGPRESSED.style.transform = "scale(1)";
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(LONGPRESSTIMER);
    clearTimeout(LONGPRESSTIMEOUT);
});

overlay.instance_open = true;
startDBListener();
