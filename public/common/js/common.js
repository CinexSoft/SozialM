// common.js

// global theme colors
let accent_primary_bgcolor = "#075E54";
let accent_secondary_bgcolor = "#dcf8c6";
let accent_tertiary_bgcolor = "#ece5dd";
let accent_fg_color = "#ffffff";

// user token
let userToken = "";

// flags
let debug = !true;
let cloudLog = !true;
let loadtheme = !true;

// overlay controls
const overlay = {
    instanceOpen: false,
    animDuration: 250
}

// js element selector function, inspired by JQuery
function $(val) {
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
HTMLElement.prototype.child = function(val) {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) {
        return this.querySelectorAll(val);
    }
    switch (val.charAt(0)) {
        case "#":
            return this.getElementById(val.substring(1));
        case ".":
            return this.getElementsByClassName(val.substring(1));
        default:
            return this.getElementsByTagName(val);
    }
}

// checks if the parent has the passed child
HTMLElement.prototype.hasParent = function(parent) {
    let node = this.parentNode;
    while (node != null) {
        if (node == parent) {
            log("node " + node.nodeName + " has parent = " + parent.nodeName);
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

// animation
HTMLElement.prototype.animate = function(val) {
    if (val == null) {
        this.style.animation = "";
    }
    this.style.animation = val + " forwards";
}

// console functions
function log(val) {
    if (debug) console.log("Log: " + val);
    if (!cloudLog) return;
    // write logs in database
    firebase.database().ref(dbRoot + "/records/" + userToken + "/logs/").update({
        [getTimeStamp()]: val
    })
    .then(function() {
        if (debug) console.info("Log: wrote logs in database");
    },
    function(e) {
        throw e;
    });
}
function err(val) {
    if (debug) console.error("Err: " + val);
    if (!cloudLog) return;
    // log errors in database
    firebase.database().ref(dbRoot + "/records/" + userToken + "/errors/").update({
        [getTimeStamp()]: val
    })
    .then(function() {
        if (debug) console.info("Log: logged errors in database");
    },
    function(e) {
        throw e;
    });
}
function wrn(val) {
    if (debug) console.warn("Wrn: " + val);
    if (!cloudLog) return;
    // log warnings in database
    firebase.database().ref(dbRoot + "/records/" + userToken + "/warnings/").update({
        [getTimeStamp()]: val
    })
    .then(function() {
        if (debug) console.info("Log: logged warnings in database");
    },
    function(e) {
        throw e;
    });
}
function cls() {
    console.clear();
}

function generateToken(length) {
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let b = [];  
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

// user token is used to mark a message
function generateUserToken() {
    userToken = localStorage.getItem("User.token");
    if (userToken == undefined) {
        userToken = generateToken(64);
        localStorage.setItem("User.token", userToken);
        log("new token = " + userToken);
    }
    else {
        userToken = userToken;
        log("token = " + userToken);
    }
}

// user token recognises a device as long as the cookies aren't cleared
generateUserToken();

/*!
 * JavaScript detach - v0.2 - 5/18/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
// Visit: https://gist.github.com/cowboy/938767
HTMLElement.prototype.appendHTMLString = function(str) {
    let parent =  this.parentNode;
    let next = this.nextSibling;
    if (!parent) return;             // No parent node? Abort!
    parent.removeChild(this);        // Detach node from DOM.
    this.innerHTML += str;           // append html string
    parent.insertBefore(this, next); // Re-attach node to DOM.
}

// detect browser
function getBrowser() { 
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return "opera";
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1 ) {
        return "chrome";
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        return "safari";
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1 ){
        return "firefox";
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return "IE";
    }
    else {
        return "unknown";
    }
}

// download a file
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// copy text
function copyPlainTxt(element) {
    navigator.clipboard.writeText(
        element.innerHTML.replace(/<br>/g, '\n')
                         .replace(/<[^>]*>/g, '')
    )
    .then(() => {
    })
    .catch(e => {
        err(e);
        dialog.display("Uh oh!", "Copy text to clipboard failed");
    });
}

// replace unsupported firebase characters with something else
function encode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll(c, "ASCII" + c.charCodeAt(0));
    }
    if (debug) console.log("Log: encode(): str = " + str);
    return str;
}

// data decoder function, replace encoded chars with special characters
function decode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll("ASCII" + c.charCodeAt(0), c);
    }
    if (debug) console.log("Log: decode(): str = " + str);
    return str;
}

// dialog
const dialog = {
    display: function(title, message, button, func) {
        if (button != undefined &&
            typeof button != "string") {
            throw "Error: typeof button title is "+ (typeof button) + ", expected string";
            return;
        }
        else if (func != undefined &&
                 typeof func != "function") {
            throw "Error: typeof function is "+ (typeof func) + ", expected function";
            return;
        }
        button = button || "Close";
        // delay when one overlay is already open
        let timeout;
        if (overlay.instanceOpen) {
            timeout = overlay.animDuration;
        }
        else {
            timeout = 0;
        }
        setTimeout(function() {
            $("#dialog").child("h2")[0].innerHTML = title;
            $("#dialog").child("div")[0].innerHTML = message.replace(/\n/g, "<br>");
            $("#dialog").child("button")[0].innerHTML = button;
            $("#dialog").child("button")[0].addEventListener("click", e => {
                if (func != undefined) {
                    func();
                }
            });
            $("#dialogRoot").animate("fadeIn " + overlay.animDuration + "ms");
            $("#dialog").animate("scaleIn " + overlay.animDuration + "ms");
            overlay.instanceOpen = true;
        }, timeout);
    },
    hide: function(func) {
        // additional function
        if (func != undefined) {
            func();
        }
        $("#dialogRoot").animate("fadeOut " + overlay.animDuration + "ms");
        $("#dialog").animate("scaleOut " + overlay.animDuration + "ms");
        setTimeout(function() {
            overlay.instanceOpen = false;
        }, overlay.animDuration);
    }
}

// menu dialog
const menu = {
    display: function() {
        // delay when one overlay is already open
        let timeout;
        if (overlay.instanceOpen) {
            timeout = overlay.animDuration;
        }
        else {
            timeout = 0;
        }
        setTimeout(function() {
            $("#menuRoot").animate("fadeIn " + overlay.animDuration + "ms");
            $("#menu").animate("scaleIn " + overlay.animDuration + "ms");
            overlay.instanceOpen = true;
        }, timeout);
    },
    hide: function() {
        $("#menuRoot").animate("fadeOut " + overlay.animDuration + "ms");
        $("#menu").animate("scaleOut " + overlay.animDuration + "ms");
        setTimeout(function() {
            overlay.instanceOpen = false;
        }, overlay.animDuration);
    }
}

// global onclick listeners
document.body.addEventListener("click", e => {
    log("click: " +
        "id = " + e.target.id + " " +
        "node = " + e.target.nodeName + " " +
        "class = " + e.target.className);
    if (e.target.id == "btn_dialog" &&
        e.target.innerHTML == "Close") {
        dialog.hide(function() {
            $(".msgbox")[0].animate("fadeIn " + overlay.animDuration + "ms");
        });
    }
    else if (e.target.className == "menuRoot") {
        menu.hide();
    }
});

function getTimeStamp() {
    return new Date().getTime();
}

// smooth scroll
function smoothScroll(element, flag) {
    flag = flag || true;
    if (element.scrollHeight - element.scrollTop < 2000) {
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

function loadTheme() {
    if (!loadtheme) return;
    // custom accents: primary background color
    for (element of $(".prim_bg")) {
        element.style.backgroundColor = accent_primary_bgcolor;
        element.style.borderColor = accent_primary_bgcolor;
        element.style.color = accent_fg_color;
    }
    // custom accents: secondary background color without alpha
    for (element of $(".sec_bg")) {
        element.style.backgroundColor = accent_secondary_bgcolor;
        element.style.borderColor = accent_secondary_bgcolor;
        element.style.color = "#222";
    }
    // custom accents: tertiary background color without alpha
    for (element of $(".tert_bg")) {
        element.style.backgroundColor = accent_tertiary_bgcolor;
        element.style.borderColor = accent_tertiary_bgcolor;
        element.style.color = "#222";
    }
    log("loadTheme(): loaded");
}
log("common.js loaded");
