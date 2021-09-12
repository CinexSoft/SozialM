/* common.js
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

// global theme colors
let ACCENT_PRIMARY_BGCOLOR = "#075E54";
let ACCENT_SECONDARY_BGCOLOR = "#dcf8c6";
let ACCENT_TERTIARY_BGCOLOR = "#ece5dd";
let ACCENT_FG_COLOR = "#ffffff";

// user token
let USERTOKEN = "";

// flags
let DEBUG = !true;            // prints debug logs in console
let LOADTHEME = !true;        // deprecated

/* checks if android interface exists
 * The `Android` WebAppInterface is a class available
 * in the Android web app of this project. The interface allows the
 * website to use Android features through javascript without requiring
 * a complete Android app to be developed.
 * The interface is available only when this webpage is loaded on the Android
 * web app.
 */
let EXISTSANDROIDINTERFACE = typeof Android !== "undefined"
                             && typeof Android.isSozialnMedienWebapp === "function"
                             && Android.isSozialnMedienWebapp();

// overlay controls
const overlay = {
    instance_open: false,
    animation_duration: 250
}

// logger data
const SESSIONLOGS = {};

// returns time passed in ms since Unix epoch
const getTimeStamp = () => {
    return new Date().getTime();
}

// gets current time zone, date time in Continent/City YYYY-MM-DD @ HH:MM:SS format
const getLongDateTime = (flag = true) => {
    let date_ob = new Date();
    if (!flag) {
        return date_ob;
    }
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    return Intl.DateTimeFormat().resolvedOptions().timeZone + "/" + year + "-" + month + "-" + date + " @ " + hours + ":" + minutes + ":" + seconds;
}

// session time token
let SESSIONTOKEN = getLongDateTime();

// console functions
const log = (val) => {
    if (DEBUG) console.log("Log: " + val);
    // write logs in local database
    SESSIONLOGS[getTimeStamp()] = val;
}

const err = (val) => {
    if (DEBUG) console.error("Err: " + val);
    // write logs in local database
    SESSIONLOGS[getTimeStamp()] = "[ERR]: " + val;
}

const wrn = (val) => {
    if (DEBUG) console.warn("Wrn: " + val);
    // write logs in local database
    SESSIONLOGS[getTimeStamp()] = "[WRN]: " + val;
}

/* Uploads debug logs to the database
 * for debugging
 */
const uploadSessionLogs = () => {
    firebase.database().ref(DBROOT + "/records/sessionlogs/" + USERTOKEN + "/" + SESSIONTOKEN)
    .update(SESSIONLOGS)
    .then(() => {
        if (DEBUG) console.log("Log: logs written to database");
    })
    .catch((error) => {
        err(error);
    });
}

// creates a random `length` sized bit token
const generateToken = (length = 64) => {
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let b = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

// user token is used to mark a message
const generateUserToken = () => {
    USERTOKEN = localStorage.getItem("User.token");
    if (USERTOKEN == undefined) {
        USERTOKEN = generateToken(64);
        localStorage.setItem("User.token", USERTOKEN);
        log("new token = " + USERTOKEN);
    }
    else {
        log("token = " + USERTOKEN);
    }
}

// replace unsupported firebase characters with something else
const encode = (str) => {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll(c, "ASCII" + c.charCodeAt(0));
    }
    if (DEBUG) console.log("Log: encode(): str = " + str);
    return str;
}

// data decoder function, replace encoded chars with special characters
const decode = (str) => {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll("ASCII" + c.charCodeAt(0), c);
    }
    if (DEBUG) console.log("Log: decode(): str = " + str);
    return str;
}

// download a file
const download = (directurl, filename) => {
    filename = filename || "sozialnmedien_" + getTimeStamp() + ".bin";
    if (EXISTSANDROIDINTERFACE) {
        try {
            Android.download(directurl, filename);
            log("[AND]: download(): through Android WepAppInterface");
        }
        catch (error) {
            err(error);
            throw error;
        }
        return;
    }
    err("android interface doesn't exist");
    throw "android interface doesn't exist";
    let element = document.createElement('a');
    element.setAttribute('href', directurl);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// copy text
const copyPlainTxt = (copytext) => {
    copytext = copytext.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(copytext)
    .then(() => {
        log("text copied to clipboard");
    })
    .catch((error) => {
        err(error);
        if (EXISTSANDROIDINTERFACE) {
            Android.copyToClipboard(copytext);
            log("[AND]: copyPlainTxt(): through Android WepAppInterface");
            Android.showToast("Text copied!");
        }
        else {
            err("android interface doesn't exist");
            dialog.display("alert", "Oops!", "Copy text to clipboard failed");
        }
    });
}

// detect browser
const getBrowser = () => {
    if (navigator.userAgent.matches(/Opera|OPR/)) {
        return "opera";
    }
    if (navigator.userAgent.indexOf("Chrome") != -1 ) {
        return "chrome";
    }
    if (navigator.userAgent.indexOf("Safari") != -1) {
        return "safari";
    }
    if (navigator.userAgent.indexOf("Firefox") != -1 ){
        return "firefox";
    }
    if ((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return "IE";
    }
    return "unknown";
}

// js element selector function, inspired by JQuery
const $ = (val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) {
        return document.querySelectorAll(val);
    }
    switch (val.charAt(0)) {
        case "#":
            return document.getElementById(val.substring(1));
        case ".":
            return document.getElementsByClassName(val.substring(1));
        default:
            return document.getElementsByTagName(val);
    }
}

// get child element using css selectors
const getChildElement = (element, val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) {
        return element.querySelectorAll(val);
    }
    switch (val.charAt(0)) {
        case "#":
            return document.getElementById(val.substring(1));
        case ".":
            return element.getElementsByClassName(val.substring(1));
        default:
            return element.getElementsByTagName(val);
    }
}

// checks if the parent has the passed child
const hasElementAsParent = (child, parent) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            log("node " + node.nodeName + " has parent = " + parent.nodeName);
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/*!
 * JavaScript detach - v0.2 - 5/18/2011
 * http://benalman.com/
 *
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
// Visit: https://gist.github.com/cowboy/938767
const appendHTMLString = (element, str) => {
    let parent =  element.parentNode;
    let next = element.nextSibling;
    if (!parent) return;                // No parent node? Abort!
    parent.removeChild(element);        // Detach node from DOM.
    element.innerHTML += str;           // append html string
    parent.insertBefore(element, next); // Re-attach node to DOM.
}

/* ----------------------------------------- TODO -------------------------------------------
 * The alert and action dialogs need to be made into a single
 * object named dialog.
 */

// alertDialog
const alertDialog = {
    // default button is close
    display(title, message, button = "Close", func) {
        if (typeof button != "string") {
            throw "Error: typeof button title is "+ (typeof button) + ", expected string";
        }
        if (func && typeof func != "function") {
            throw "Error: typeof func is "+ (typeof func) + ", expected function";
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) {
            timeout = overlay.animation_duration;
        }
        setTimeout(() => {
            log("alertDialog display(): timeout = " + timeout);
            getChildElement($("#alertDialog"), "h2")[0].innerHTML = title.replace(/\n/g, "<br>");;
            getChildElement($("#alertDialog"), "div")[0].innerHTML = message.replace(/\n/g, "<br>");
            $("#alertDialog_btn").innerHTML = button;
            $("#alertDialog_btn").addEventListener("click", (e) => {
                if (func != undefined) {
                    func();
                }
            });
            $("#alertDialogRoot").style.animation = "fadeIn " + overlay.animation_duration + "ms forwards";
            $("#alertDialog").style.animation = "scaleIn " + overlay.animation_duration + "ms forwards";
            overlay.instance_open = true;
        }, timeout);
    },
    hide(func) {
        $("#alertDialogRoot").style.animation = "fadeOut " + overlay.animation_duration + "ms forwards";
        $("#alertDialog").style.animation = "scaleOut " + overlay.animation_duration + "ms forwards";
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
        // additional function
        if (func != undefined) {
            if (typeof func != "function") {
                throw "Error: typeof func is "+ (typeof func) + ", expected function";
            }
            func();
        }
    }
}

// actionDialog
const actionDialog = {
    // default button is close
    display(title, message, button = "OK", func) {
        if (typeof button != "string") {
            throw "Error: typeof button title is "+ (typeof button) + ", expected string";
        }
        if (!func || typeof func != "function") {
            throw "Error: typeof func is "+ (typeof func) + ", expected function";
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) {
            timeout = overlay.animation_duration;
        }
        setTimeout(() => {
            log("actionDialog: display(): timeout = " + timeout);
            getChildElement($("#actionDialog"), "h2")[0].innerHTML = title.replace(/\n/g, "<br>");;
            getChildElement($("#actionDialog"), ".content")[0].innerHTML = message.replace(/\n/g, "<br>");
            $("#actionDialog_btnOk").innerHTML = button;
            $("#actionDialog_btnOk").addEventListener("click", (e) => {
                if (func != undefined) {
                    func();
                }
            });
            $("#actionDialogRoot").style.animation = "fadeIn " + overlay.animation_duration + "ms forwards";
            $("#actionDialog").style.animation = "scaleIn " + overlay.animation_duration + "ms forwards";
            overlay.instance_open = true;
        }, timeout);
    },
    hide(func) {
        $("#actionDialogRoot").style.animation = "fadeOut " + overlay.animation_duration + "ms forwards";
        $("#actionDialog").style.animation = "scaleOut " + overlay.animation_duration + "ms forwards";
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
        // additional function
        if (func != undefined) { 
            if (typeof func != "function") {
                throw "Error: typeof func is "+ (typeof func) + ", expected function";
            }
            func();
        }
    }
}

/*--------------------------------------- TODO START -------------------------------------------*/

// dialog
const dialog = {
    display(category, title, message, button, func) {
        if (category == "alert") {
            alertDialog.display(title, message, button, func);
        }
        else if (category == "action") {
            actionDialog.display(title, message, button, func);
        }
    },
    hide(category, func) {
        if (category == "alert") {
            alertDialog.hide(func);
        }
        else if (category == "action") {
            actionDialog.hide(func);
        }
    }
}

/*--------------------------------------- TODO END --------------------------------------------*/

// menu alertDialog
const menu = {
    display(title = "Menu") {
        // delay when one overlay is already open
        let timeout = 0;
        if (overlay.instance_open) {
            timeout = overlay.animation_duration;
        }
        setTimeout(() => {
            log("menu: timeout = " + timeout);
            getChildElement($("#menu"), "h2")[0].innerHTML = title.replace(/\n/g, "<br>");;
            $("#menuRoot").style.animation = "fadeIn " + overlay.animation_duration + "ms forwards";
            $("#menu").style.animation = "scaleIn " + overlay.animation_duration + "ms forwards";
            overlay.instance_open = true;
        }, timeout);
    },
    hide() {
        $("#menuRoot").style.animation = "fadeOut " + overlay.animation_duration + "ms forwards";
        $("#menu").style.animation = "scaleOut " + overlay.animation_duration + "ms forwards";
        setTimeout(() => {
            overlay.instance_open = false;
        }, overlay.animation_duration);
    }
}

// looks for updates to android app
const checkForApkUpdates = () => {
    if (EXISTSANDROIDINTERFACE) {
        let val;
        try {
            val = Android.updateAvailable();
            switch (val) {
                case "true":
                    log("alertDialog: launch: update available");
                    dialog.display("alert", "Update available", "A new version of this Android app is available.", "Download", () => {
                        setTimeout(() => {
                            Android.showToast("Downloading app, look into your notification panel");
                            Android.download("https://sozialnmedien.web.app/downloads/chat.app.web.sozialnmedien.apk", "chat.app.web.sozialnmedien.apk");
                        }, 500);
                        dialog.hide("alert");
                        log("[AND]: downloaded Android app");
                    });
                break;
                case "failed":
                    err("update check failed");
                break;
            }
        }
        catch (error) {
            err(error);
        }
    }
}

// global onclick listeners
document.body.addEventListener("click", (e) => {
    log("click: " + "id = " + e.target.id + " " + "node = " + e.target.nodeName + " " + "class = " + e.target.className);
    if (["alertDialog_btn", "actionDialog_btnClose"].includes(e.target.id) && e.target.innerHTML == "Close") {
        e.target.id.slice(0, 5) == "alert" ? dialog.hide("alert") : dialog.hide("action");
    }
    else if (["menuRoot", "actionDialogRoot"].includes(e.target.className)) {
        e.target.id.slice(0, 4) == "menu" ? menu.hide() : dialog.hide("action");
    }
});

// smooth scroll
const smoothScroll = (element, flag = true) => {
    // check if down scrollable part of element is < 720 px
    if (element.scrollHeight - (document.body.clientHeight - 110) - element.scrollTop < 720) {
        if (!flag) return "smooth";
        element.style.scrollBehavior = "smooth";
    }
    else {
        if (!flag) return "auto";
        element.style.scrollBehavior = "auto";
    }
    log("smoothscroll(): element = " + element.nodeName + " class = " + element.className + " diff = " + (element.scrollHeight - element.scrollTop));
    element.scrollTop = element.scrollHeight;
}

/* @deprecated
 * This function was supposed to reload the dynamic accent colors
 * of the newly added chat bubbles. But currently we're using
 * a all teal accent (WhatsApp theme). So this won't be needed.
 */
const loadTheme = () => {
    if (!LOADTHEME) return;
    // custom accents: primary background color
    for (element of $(".prim_bg")) {
        element.style.backgroundColor = ACCENT_PRIMARY_BGCOLOR;
        element.style.borderColor = ACCENT_PRIMARY_BGCOLOR;
        element.style.color = ACCENT_FG_COLOR;
    }
    // custom accents: secondary background color without alpha
    for (element of $(".sec_bg")) {
        element.style.backgroundColor = ACCENT_SECONDARY_BGCOLOR;
        element.style.borderColor = ACCENT_SECONDARY_BGCOLOR;
        element.style.color = "#222";
    }
    // custom accents: tertiary background color without alpha
    for (element of $(".tert_bg")) {
        element.style.backgroundColor = ACCENT_TERTIARY_BGCOLOR;
        element.style.borderColor = ACCENT_TERTIARY_BGCOLOR;
        element.style.color = "#222";
    }
    log("loadTheme(): loaded");
}

// user token recognises a device as long as the cookies aren't cleared
generateUserToken();

// upload logs in intervals for current session
setInterval(() => {
    uploadSessionLogs();
}, 5000);

log("common.js loaded");
log("[AND]: WebAppInterface: " + EXISTSANDROIDINTERFACE);
