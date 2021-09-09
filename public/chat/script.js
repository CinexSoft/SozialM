// Markdown converter
const mdtohtml = new showdown.Converter();
mdtohtml.setFlavor("github");

// other variables
let prevHeight = document.body.clientHeight;
let prevWidth = document.body.clientWidth;
let chatScrollHeight = $("#chatarea").scrollHeight;
let preText = "";
let longPressed;
let softboardOpen = false;

// the entire chat is downloaded and stored here
// the data has timestamps as keys
const chatData = {} || JSON.parse(localStorage.getItem(chatRoot));

// database listener
const startDBListener = () => {
    // db listener, fetches new msg on update
    database.ref(dbRoot + chatRoot).on('value', (snapshot) => {
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
            chatData[timestamp] = {
                token,
                message: data.message
            };
            // cache chat in local storage
            localStorage.setItem(chatRoot, JSON.stringify(chatData));
            // get html from msg
            getHTML = decode(data.message);
            if (token == userToken) {
                appendHTMLString($("#chatarea"),
                    "<div class=\"bubbles\" id=\"" + timestamp + "\">" +
                    "<div class=\"this sec_bg\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
                if (debug) console.log("Log: this: timestamp = " + timestamp);
                if (debug) console.log("Log: this: html = " + $("#chatarea").innerHTML);
            }
            else {
                appendHTMLString($("#chatarea"),
                    "<div class=\"bubbles\" id=\"" + timestamp + "\">" +
                    "<div class=\"that\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
                if (debug) console.log("Log: that: timestamp = " + timestamp);
                if (debug) console.log("Log: that: html = " + $("#chatarea").innerHTML);
            }
            setTimeout(() => {
                smoothScroll($("#chatarea"));
            }, 20);
        });
        if ($("#chatarea").innerHTML.match(/pre/i) &&
            $("#chatarea").innerHTML.match(/code/i)) {
            hljs.highlightAll();
        }
        dialog.hide(() => {
            $(".msgbox")[0].style.animation = "fadeIn " + overlay.animDuration + "ms forwards";
        });
        loadTheme();
        log("db update fetched");
    });
}
// on key up listener
document.addEventListener("keyup", (e) => {
    let key = e.keyCode || e.charCode
    log("keypress: key = " + key);
    let HTML = preText + mdtohtml.makeHtml($("#txtmsg").value.trim());
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
        preText = "";
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
    if (prevHeight != document.body.clientHeight && prevWidth == document.body.clientWidth) {
        softboardOpen = !softboardOpen;
        log("keyboard switch? height diff = " + (document.body.clientHeight - prevHeight));
    }
    if (document.body.clientHeight - prevHeight < 0) {
        $("#chatarea").scrollTop += Math.abs(document.body.clientHeight - prevHeight);
    }
    prevWidth = document.body.clientWidth;
    prevHeight = document.body.clientHeight;
    // switches visibility of msgpreview
    let HTML = preText + mdtohtml.makeHtml($("#txtmsg").value.trim());
    if (HTML != "" && softboardOpen) {
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
        msg = preText + $("#txtmsg").value.trim();
        preText = "";
        $("#txtmsg").value = "";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>";
        $("#msgpreview").style.display = "none";
        $("#txtmsg").style.borderRadius = "40px";
        if (msg.length > 1024 * 2) {
            dialog.display("Warning", "Text exceeds limit of 2KB");
            $(".msgbox")[0].style.animation = "fadeOut " + overlay.animDuration + "ms forwards";
            return;
        }
        $("#txtmsg").focus();
        database.ref(dbRoot + chatRoot + getTimeStamp()).update({
            message: encode(mdtohtml.makeHtml(msg)),
            token: userToken
        })
        .then(() => {
            log("data pushed");
        },
        (e) => {
            err(e);
            $("#txtmsg").value = msgbackup;
        });
    }
    loadTheme();
});
// onclick listeners
document.body.addEventListener("click", (e) => {
    if (e.target.nodeName.toLowerCase() == "img") {
        location.href = e.target.src;
        log("img onclick(): src = " + e.target.src);
    }
    else if (e.target.id == "menu_dnImage") {
        
    }
    else if (e.target.id == "menu_copy") {
        menu.hide();
        copyPlainTxt(longPressed)
    }
    else if (e.target.id == "menu_copylinks") {
        
    }
    else if (e.target.id == "menu_unsend") {
        menu.hide();
        if (chatData[longPressed.id].token == userToken) {
            if (getTimeStamp() - parseInt(longPressed.id) < 3600000) {
                database.ref(dbRoot + chatRoot).update({
                    [longPressed.id]: null
                })
                .then(() => {
                    log("msg deleted, data updated");
                },
                (e) => {
                    err(e);
                });
            }
            else {
                dialog.display("Not allowed", "You can only unsend a message within 1 hour of sending it.");
            }
        }
        else {
            dialog.display("Not allowed", "You can unsend a message only if you have sent it.");
        }
    }
    else if (e.target.id == "menu_reply") {
        menu.hide();
        preText = "<blockquote id=\"tm_" + longPressed.id + "\">" + getChildElement(longPressed, "div")[0].innerHTML + "</blockquote>\n\n";
        $("#txtmsg").focus();
        // $("#txtmsg").selectionEnd += $("#txtmsg").value.length;
    }
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
    })()) != null) {
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
let longPressTimer;
let longPressTimeout;
// on mouse down listener
document.body.addEventListener("pointerdown", (e) => {
    log("pointerdown: " +
         "id = " + e.target.id + " " +
         "node = " + e.target.nodeName + " " +
         "class = " + e.target.className);
    if (e.target.className == "bubbles") {
        longPressTimer = setTimeout(() => {
            e.target.style.transform = "scale(0.95)";
            e.target.style.userSelect = "none";
        }, 200);
        longPressTimeout = setTimeout(() => {
            log("long press triggered");
            longPressed = e.target;
            e.target.style.transform = "scale(1)";
            clearTimeout(longPressTimer);
            // show menu
            menu.display();
        }, 1000);
    }
});
// on mouse up listener
document.body.addEventListener("pointerup", (e) => {
    log("pointer up");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
    
});
// swipe gesture listener
document.body.addEventListener("touchmove", (e) => {
    log("swiped: " +
         "id = " + e.target.id + " " +
         "node = " + e.target.nodeName + " " +
         "class = " + e.target.className);
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
});

startDBListener();
