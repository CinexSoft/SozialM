// Markdown converter
const mdtohtml = new showdown.Converter();
mdtohtml.setFlavor("github");
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
            $(".msgbox")[0].animate("fadeIn 200ms");
        });
        loadTheme();
        if (debug) log("Log: db update fetched");
    });
}
// user token is used to mark a message
userToken = localStorage.getItem("Chat.userToken");
if (userToken == undefined) {
    userToken = generateToken(64);
    localStorage.setItem("Chat.userToken", userToken);
    if (debug) log("Log: new token = " + userToken);
}
else {
    userToken = userToken;
    if (debug) log("Log: token = " + userToken);
}
// on key up listener
document.addEventListener("keyup", e => {
    let key = e.key;
    if (debug) log("Log: keypress: key = " + key);
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
    $("#msgpreview").innerHTML = "<font class=\"header\" color=\"#7d7d7d\">Markdown preview</font>" + "<font color=\"#7d7d7d\">Preview appears here</font>";
    $("#msgpreview").style.display = "none";
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
            dialog.display("Message", "Text exceeds limit of 2KB", "Close");
            $(".msgbox")[0].animate("fadeOut 200ms");
            return;
        }
        $("#txtmsg").focus();
        database.ref(dbRoot + chatRoot + getTimeStamp()).update({
            message: encode(mdtohtml.makeHtml(msg)),
            token: userToken
        })
        .then(function() {
            $("#txtmsg").value = "";
            if (debug) log("Log: data pushed");
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
// global onclick listeners
document.body.addEventListener("click", e => {
    if (debug) log("Log: id = " + e.target.id + "\n" +
                   "node = " + e.target.nodeName + "\n" +
                   "class = " + e.target.className);
    if (e.target.nodeName.toLowerCase() == "img") {
        location.href = e.target.src;
        if (debug) log("Log: img onclick(): src = " + e.target.src);
    }
    else if (e.target.className == "dialogRoot") {
        dialog.hide(function() {
            $(".msgbox")[0].animate("fadeIn 200ms");
        });
    }
    else if (e.target.className == "menuRoot") {
        // hide menu
        if (debug) log("Log: menuRoot: className = " + e.target.className);
        menu.hide();
    }
    else if (e.target.id == "btn_dialog" &&
             e.target.innerHTML == "Close") {
        dialog.hide(function() {
            $(".msgbox")[0].animate("fadeIn 200ms");
        });
    }
});
// timer variable
let longPressTimer;
let longPressTimeout;
// on mouse down listener
document.body.addEventListener("pointerdown", e => {
    if (debug) log("Log: id = " + e.target.id + "\n" +
                   "node = " + e.target.nodeName + "\n" +
                   "class = " + e.target.className);
    if (e.target.className == "bubbles") {
        longPressTimer = setTimeout(function() {
            e.target.style.transform = "scale(0.95)";
            e.target.style.userSelect = "none";
        }, 200);
        longPressTimeout = setTimeout(function() {
            if (debug) log("Log: long press triggered");
            e.target.style.transform = "scale(1)";
            clearTimeout(longPressTimer);
            // show menu
            menu.display();
        }, 1000);
    }
});
// on mouse up listener
document.body.addEventListener("pointerup", e => {
    if (debug) log("Log: pointer up");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
    
});
// swipe gesture listener
document.body.addEventListener("touchmove", e => {
    if (debug) log("Log: swiped");
    e.target.style.transform = "scale(1)";
    e.target.style.userSelect = "auto";
    clearTimeout(longPressTimer);
    clearTimeout(longPressTimeout);
});
startDBListener();
