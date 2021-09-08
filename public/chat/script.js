// Markdown converter
const mdtohtml = new showdown.Converter();
mdtohtml.setFlavor("github");
// other variables
let longPressed;
// database listener
function startDBListener() {
    // db listener, fetches new msg on update
    database.ref(dbRoot + chatRoot).on('value',(snapshot) => {
        let getHTML = "";
        $("#chatarea").innerHTML = "";
        $("#chatarea").appendHTMLString(
            "<div class=\"info\">" +
            "<p class=\"fa fa-info-circle\">&ensp;Messages in this chat are only server-to-end encrypted.</p>" +
            "</div>"
        );
        snapshot.forEach(timestamps => {
            let data = snapshot.child(timestamps.key).val();
            let token = data.token;
            getHTML = decode(data.message);
            if (token == userToken) {
                $("#chatarea").appendHTMLString(
                    "<div class=\"bubbles\">" +
                    "<div class=\"this sec_bgalpha\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
            }
            else {
                $("#chatarea").appendHTMLString(
                    "<div class=\"bubbles\">" +
                    "<div class=\"that\">" +
                    getHTML +
                    "</div>" +
                    "</div>"
                );
            }
        });
        if ($("#chatarea").innerHTML.match(/pre/i) &&
            $("#chatarea").innerHTML.match(/code/i)) {
            hljs.highlightAll();
        }
        setTimeout(function() {
            smoothScroll($("#chatarea"));
        }, 20);
        dialog.hide(function() {
            $(".msgbox")[0].animate("fadeIn " + overlay.animDuration + "ms");
        });
        loadTheme();
        log("Log: db update fetched");
    });
}
// on key up listener
document.addEventListener("keyup", e => {
    let key = e.key;
    log("Log: keypress: key = " + key);
    let HTML = mdtohtml.makeHtml($("#txtmsg").value.trim());
    if (HTML != "") {
        $("#msgpreview").style.display = "block";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + HTML;
    }
    if ($("#txtmsg").value == "") {
        $("#msgpreview").style.display = "none";
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
    }
    // if key pressed is enter, tab or any of the given characters
    if (key == "Unidentified" ||
        key == "Tab" ||
        key == "Enter" ||
        (", .@#₹_&-+()/*\"':;!?~`|^={}\\%[]").includes(key)) {
        hljs.highlightAll();
    }
});
// soft keyboard launch triggers window resize event
window.addEventListener("resize", e => {
    setTimeout(function() {
        smoothScroll($("#chatarea"));
    }, 10);
    previewVisible = false;
    let HTML = mdtohtml.makeHtml($("#txtmsg").value.trim());
    if ($("#txtmsg").value != "") {
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + HTML;
        $("#msgpreview").style.display = "block";
    }
    else {
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
        $("#msgpreview").style.display = "none";
    }
});
// on send button clicked
$("#btnsend").addEventListener("click", e => {
    let msg = $("#txtmsg").value.trim();
    if (msg == "") {
        $("#txtmsg").value = "";
        $("#txtmsg").focus();
    }
    else {
        $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>";
        $("#msgpreview").style.display = "none";
        if (msg.length > 1024 * 2) {
            dialog.display("Warning", "Text exceeds limit of 2KB");
            $(".msgbox")[0].animate("fadeOut " + overlay.animDuration + "ms");
            return;
        }
        $("#txtmsg").focus();
        database.ref(dbRoot + chatRoot + getTimeStamp()).update({
            message: encode(mdtohtml.makeHtml(msg)),
            token: userToken
        })
        .then(function() {
            $("#txtmsg").value = "";
            log("Log: data pushed");
        },
        function(e) {
            err(e);
        });
    }
    setTimeout(function() {
        smoothScroll($("#chatarea"));
    }, 20);
    loadTheme();
});
// onclick listeners
document.body.addEventListener("click", e => {
    if (e.target.nodeName.toLowerCase() == "img") {
        location.href = e.target.src;
        log("Log: img onclick(): src = " + e.target.src);
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
        
    }
    else if (e.target.id == "menu_reply") {
        menu.hide();
        $("#txtmsg").value = "<blockquote>" + longPressed.innerHTML + "</blockquote>\n\n";
        $("#txtmsg").focus();
        txtarea.selectionEnd += $("#txtmsg").value.length;
    }
});
// timer variable
let longPressTimer;
let longPressTimeout;
// on mouse down listener
document.body.addEventListener("pointerdown", e => {
    log("Log: pointerdown\n" +
                   "id    = " + e.target.id + "\n" +
                   "node  = " + e.target.nodeName + "\n" +
                   "class = " + e.target.className);
    if (e.target.className == "bubbles") {
        longPressTimer = setTimeout(function() {
            e.target.style.transform = "scale(0.95)";
            e.target.style.userSelect = "none";
        }, 200);
        longPressTimeout = setTimeout(function() {
            log("Log: long press triggered");
            longPressed = e.target;
            e.target.style.transform = "scale(1)";
            clearTimeout(longPressTimer);
            // show menu
            menu.display();
        }, 1000);
    }
});
// on mouse up listener
document.body.addEventListener("pointerup", e => {
    log("Log: pointer up");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
    
});
// swipe gesture listener
document.body.addEventListener("touchmove", e => {
    log("Log: swiped");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
});
startDBListener();
