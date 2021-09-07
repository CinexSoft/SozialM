// common.js

// let font = "sans-serif";
let accent_primary_bgcolor = "#075E54";
let accent_secondary_bgcolor = "#dcf8c6";
let accent_tertiary_bgcolor = "#ece5dd";
let accent_fg_color = "#ffffff";

// user token
let userToken = "";

// flags
let debug = !true;
let loadtheme = !true;

// overlay control
const overlay = {
    overlay: "",
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

// animation
HTMLElement.prototype.animate = function(val) {
    this.style.animation = val + " forwards";
}

// console functions
function log(val) {
    console.log(val);
}
function err(val) {
    console.error(val);
}
function wrn(val) {
    console.warn(val);
}
function cls() {
    console.clear();
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
function copy(node) {
    let ret = false;
    navigator.clipboard.writeText(
        node.innerHTML.replace(/<br>/g, '\n')
                      .replace(/<[^>]*>/g, '')
    )
    .then(() => {
        ret = true;
    })
    .catch(e => {
        ret = false;
        if (debug) throw (e);
    });
    return ret;
}

// replace unsupported firebase characters with something else
function encode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll(c, "ASCII" + c.charCodeAt(0));
    }
    if (debug) console.info ("Log: encode(): str = " + str);
    return str;
}

// data decoder function, replace encoded chars with special characters
function decode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll("ASCII" + c.charCodeAt(0), c);
    }
    if (debug) console.info ("Log: decode(): str = " + str);
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
        // delay when one overlay is already open
        let timeout;
        if (overlay.overlay != "") {
            timeout = overlay.animDuration;
            if (overlay.overlay == "dialog") dialog.hide();
            else if (overlay.overlay == "menu") menu.hide();
        }
        else {
            timeout = 0;
        }
        setTimeout(function() {
            $("#dialog").child("h2")[0].innerHTML = title;
            $("#dialog").child("div")[0].innerHTML = message.replace(/\n/g, "<br>");
            if (button != undefined) {
                $("#dialog").child("button")[0].style.visibility = "visible";
                $("#dialog").child("button")[0].innerHTML = button;
                $("#dialog").child("button")[0].addEventListener("click", e => {
                    if (func != undefined) {
                        func();
                    }
                });
            }
            else {
                $("#dialog").child("button")[0].style.visibility = "hidden";
            }
            $("#dialogRoot").animate("fadeIn " + overlay.animDuration + "ms");
            $("#dialog").animate("scaleIn " + overlay.animDuration + "ms");
            overlay.instanceOpen = true;
            overlay.overlay = "dialog";
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
            overlay.overlay = "";
        }, overlay.animDuration);
    }
}

// menu dialog
const menu = {
    display: function() {
        // delay when one overlay is already open
        let timeout;
        if (overlay.overlay != "") {
            timeout = overlay.animDuration;
            if (overlay.overlay == "dialog") dialog.hide();
            else if (overlay.overlay == "menu") menu.hide();
        }
        else {
            timeout = 0;
        }
        setTimeout(function() {
            $("#menuRoot").animate("fadeIn " + overlay.animDuration + "ms");
            $("#menu").animate("scaleIn " + overlay.animDuration + "ms");
            overlay.instanceOpen = true;
            overlay.overlay = "menu";
        }, timeout);
    },
    hide: function() {
        $("#menuRoot").animate("fadeOut " + overlay.animDuration + "ms");
        $("#menu").animate("scaleOut " + overlay.animDuration + "ms");
        setTimeout(function() {
            overlay.instanceOpen = false;
            overlay.overlay = "";
        }, overlay.animDuration);
    }
}

function getTimeStamp() {
    return new Date().getTime();
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

// smooth scroll
function smoothScroll(element) {
    if (element.scrollHeight - element.scrollTop < 1024) {
        element.style.scrollBehavior = "smooth";
    }
    else {
        element.style.scrollBehavior = "auto";
    }
    if (debug) log("Log: scroll:\nelement = " + element + "\ndiff = " + (element.scrollHeight - element.scrollTop));
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
    // custom accents: secondary background color with alpha
    for (element of $(".sec_bgalpha")) {
        element.style.backgroundColor = accent_secondary_bgcolor + "bb";
        element.style.borderColor = accent_secondary_bgcolor + "bb";
        element.style.color = "#222";
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
    log("Log: loadTheme(): loaded");
}
log("Log: common.js loaded");
