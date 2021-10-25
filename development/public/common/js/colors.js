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

import { LOAD_THEME, } from '/common/js/variables.js';
import { $, } from '/common/js/domfunc.js';

/**
 * Global theme colors.
 * These can be used to modify the accent of the website.
 * It was meant to provide users with custom control over
 * how their account looks and feels.
 * CSS definitions: `/common/css/colors.css`
 *
 * Available Colors:
 - ACCENT_BGCOLOR
 - PRIMARY_BGCOLOR
 - SECONDARY_BGCOLOR
 - CHAT_BUBBLE_BGCOLOR
 - HIGHLIGHT_SELECT_COLOR
 - CONTROL_COLOR
 - FG_COLOR
 - DARK_FG_COLOR
 */
export const Colors = {
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --accent-bgcolor
     */
    ACCENT_BGCOLOR: document.body.style.getPropertyValue('--accent-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --primary-bgcolor
     */
    PRIMARY_BGCOLOR: document.body.style.getPropertyValue('--primary-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --secondary-bgcolor
     */
    SECONDARY_BGCOLOR: document.body.style.getPropertyValue('--secondary-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --chat-bubble-bgcolor
     */
    CHAT_BUBBLE_BGCOLOR: document.body.style.getPropertyValue('--chat-bubble-bgcolor'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --highlight-select-color
     */
    HIGHLIGHT_SELECT_COLOR: document.body.style.getPropertyValue('--highlight-select-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --control-color
     */
    CONTROL_COLOR: document.body.style.getPropertyValue('--control-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --fg-color
     */
    FG_COLOR: document.body.style.getPropertyValue('--fg-color'),
    /**
     * @type {String} Hex string with a `#` or `RGB()`. Do not use `RGBA()`.
     * Custom CSS Property: --dark-fg-color
     */
    DARK_FG_COLOR: document.body.style.getPropertyValue('--dark-fg-color'),
}

/**
 * @deprecated Apparently unnecessary function.
 * This function was supposed to reload the dynamic accent colors of the newly added chat bubbles.
 * But currently we're using an all-teal accent (former WhatsApp brand colors).
 * So this won't be needed.
 */
export const loadTheme = () => {
    if (!LOAD_THEME) return;
    // custom accents: accent background color
    for (let element of $('.acc_bg')) {
        element.style.backgroundColor = ACCENT_BGCOLOR;
        element.style.borderColor = ACCENT_BGCOLOR;
        element.style.color = DARK_FG_COLOR;
    }
    // custom accents: primary background color
    for (let element of $('.prim_bg')) {
        element.style.backgroundColor = PRIMARY_BGCOLOR;
        element.style.borderColor = PRIMARY_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: secondary background color
    for (let element of $('.sec_bg')) {
        element.style.backgroundColor = SECONDARY_BGCOLOR;
        element.style.borderColor = SECONDARY_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: chat bubble background color
    for (let element of $('.chatbubble_bg')) {
        element.style.backgroundColor = CHAT_BUBBLE_BGCOLOR;
        element.style.borderColor = CHAT_BUBBLE_BGCOLOR;
        element.style.color = FG_COLOR;
    }
    // custom accents: controls background color
    for (let element of $('.control_bg')) {
        element.style.backgroundColor = CONTROL_COLOR;
        element.style.borderColor = CONTROL_COLOR;
        element.style.color = DARK_FG_COLOR;
    }
}

console.log('module color.js loaded');
