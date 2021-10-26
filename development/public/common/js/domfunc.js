/**
 * WARNING:
 * Before making modifications to this file, make absolutely sure that
 * you've used the functions and their respective flags (if any) properly.
 * These functions work for almost every webpage, so there are more chances
 * you've used something incorrectly.
 *
 * When making modifications, you also need to test out if the modified code
 * works for each and every webpage.
 */

/**
 * Select HTML element/s from the document root using CSS syntax.
 * @param {String} val The CSS representation of the element.
 * @return {Node} The HTML element or,
 * @return {HTMLCollection} A collection of similar HTML elements.
 */
export const $ = (val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) return document.querySelectorAll(val);
    switch (val.charAt(0)) {
        case '#':
            return document.getElementById(val.substring(1));
        case '.':
            return document.getElementsByClassName(val.substring(1));
        default:
            return document.getElementsByTagName(val);
    }
}

/**
 * Select HTML element/s from an HTML node using CSS syntax.
 * @param {Node} element The element from which other elements will be selected.
 * @param {String} val The CSS representation of the element.
 * @return {Node} The HTML element or,
 * @return {HTMLCollection} A collection of similar HTML elements.
 */
export const getChildElement = (element, val) => {
    val = val.trim();
    if (/ |,|\[|\]|>|:/.test(val)) return element.querySelectorAll(val);
    switch (val.charAt(0)) {
        case '#':
            return document.getElementById(val.substring(1));
        case '.':
            return element.getElementsByClassName(val.substring(1));
        default:
            return element.getElementsByTagName(val);
    }
}

/**
 * Checks if the given child has the given parent.
 * @param {Node} child The child in concern.
 * @param {Node} parent The parent in concern.
 * @return {Boolean} If true, the given child has the given parent.
 */
export const childHasParent = (child, parent) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) return true;
        node = node.parentNode;
    }
    return false;
}

/**
 * Takes an HTML string, converts it to a node and attatches it to the element passed.
 * This is done by detaching and reattaching the element to its parent to improve performance.
 * @param {Node} element The element to which HTML will be appended.
 * @param {String} str The HTML string.
 * @param {Boolean} reversed  Prepends the HTML to the node.
 */
export const appendHTMLString = (element, str = '', reversed = false) => {
    let parent =  element.parentNode;
    let next = element.nextSibling;
    if (!parent) return;                                   // No parent node? Abort!
    parent.removeChild(element);                           // Detach node from DOM.
    if (!reversed) element.innerHTML += str;               // append html string
    else element.innerHTML = `${str}${element.innerHTML}`; // reversed append html
    parent.insertBefore(element, next);                    // Re-attach node to DOM.
}

/**
 * Scrolls down a view smoothly if amount of element below viewport is less than 720 pixels.
 * @param {Node} element The element to scroll down.
 * @param {Boolean} get_behavior_only If true, only returns scroll behavior based on amount of element below viewport.
 * @param {Boolean} not_smooth Explicitly mention to scroll without animations.
 * @return {String} The scroll behavior (conditional).
 */
export const smoothScroll = (element, get_behavior_only = false, smooth = true) => {
    // check if down scrollable part of element is < 720 px
    if (smooth && element.scrollHeight - (document.body.clientHeight - 110) - element.scrollTop < 720) {
        if (get_behavior_only) return 'smooth';
        element.style.scrollBehavior = 'smooth';
    } else {
        if (get_behavior_only) return 'auto';
        element.style.scrollBehavior = 'auto';
    }
    element.scrollTop = element.scrollHeight;
}

console.log('module domfunc.js loaded');
