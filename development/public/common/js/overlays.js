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

import { $, getChildElement } from '/common/js/domfunc.js';

/**
 * Contains global data for behavior of overlays viz menus and dialogs.
 * The time taken for an overlay to animate out is Overlay.animation_duration ms.
 * Value of instance_open needs to be set to true everytime an overlay opens and to false everytime an overlay closes.
 * This has been made automatic when using dialog and menu functions.
 *
 * How low/high is too low/high?
 *      0 ms and over 5000 milliseconds is too low/high.
 */
export const Overlay = {
    /**
     * @type {Boolean} If an overlay is already open, other overlays are postponed for Overlay.animation_duration ms.
     */
    instance_open: false,
    /**
     * @type {Number} Can be modified to increase or decrease duration of overlay animations. Too low/high values may break the UI.
     */
    animation_duration: 350,
    /**
     * @deprecated The value associated is automatically handled by dialog.hide() and menu.hide().
     * Setter for scripts that import modules.js. Please do not use this function as the process has been made automatic.
     * @param {Boolean} val Is set to true if an overlay is opened. Reverse is true.
     */
    setInstanceOpen(val) {
        this.instance_open = val;
    },
    /**
     * Setter for scripts that import modules.js.
     * @param {Number} val Duration of all overlay animations.
     */
    setAnimDuration(val) {
        this.animation_duration = val;
    },
}

/**
 * Represents a splashscreen.
 * Needs the code for a splashscreen in the HTML document.
 */
export const SplashScreen = {
    visible: false,
    display(innerHTML = '', func) {
        if (func && typeof func != 'function') {
            throw `Error: overlays.js: SplashScreen.display(): func is ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            $('#splashScreen').innerHTML = innerHTML;
            $('#splashScreenRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
            this.visible = true;
            setTimeout(() => {
                if (func) func.call();
            }, Overlay.animation_duration);
        }, timeout);
    },
    hide(func) {
        $('#splashScreen').innerHTML = '';
        $('#splashScreenRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
            this.visible = false;
            // additional function
            if (!func) return;
            if (typeof func != 'function') {
                throw `Error: overlays.js: SplashScreen.hide(): func is ${typeof func}, expected function`;
            }
            func.call();
        }, Overlay.animation_duration);
    }
}

/* ----------------------------------------- TODO -------------------------------------------
 * The alert and action dialogs need to be made into a single
 * object named dialog.
 */

// alertDialog
const AlertDialog = {
    // default button is Close
    display(title = 'Alert!', message = '', button = 'Close', func) {
        if (typeof button != 'string') {
            throw `Error: overlays.js: AlertDialog.display(): button is ${typeof button}, expected String`;
        }
        if (func && typeof func != 'function') {
            throw `Error: overlays.js: AlertDialog.display(): func is ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            getChildElement($('#alertDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#alertDialog'), 'div')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#alertDialog_btn').innerHTML = button;
            // once: true removes listener after it fires atmost once
            if (func) $('#alertDialog_btn').addEventListener('click', func, { once: true });
            $('#alertDialogRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#alertDialog').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    hide(func) {
        $('#alertDialogRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#alertDialog').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
            // additional function
            if (!func) return;
            if (typeof func != 'function') {
                throw `Error: overlays.js: AlertDialog.hide(): func is ${typeof func}, expected function`;
            }
            func.call();
        }, Overlay.animation_duration);
    }
}

// actionDialog
const ActionDialog = {
    onClickFunction: undefined,
    // default button is Ok
    display(title = 'Alert!', message = '', button = 'OK', func) {
        if (typeof button != 'string') {
            throw `Error: overlays.js: ActionDialog.display(): button is ${typeof button}, expected String`;
        }
        if (!func || typeof func != 'function') {
            throw `Error: overlays.js: ActionDialog.display(): func is ${typeof func}, expected function`;
        }
        // delay when one overlay is already open
        let timeout = 0;
        // remove previous button click listener if any
        if (this.onClickFunction) $('#actionDialog_btnOk').removeEventListener('click', this.onClickFunction);
        // the function to run on button click
        this.onClickFunction = func;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            getChildElement($('#actionDialog'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            getChildElement($('#actionDialog'), '.content')[0].innerHTML = message.replace(/\n/g, '<br>');
            $('#actionDialog_btnOk').innerHTML = button;    
            if (this.onClickFunction) $('#actionDialog_btnOk').addEventListener('click', this.onClickFunction);
            $('#actionDialogRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#actionDialog').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    hide(func) {
        $('#actionDialogRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#actionDialog').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        // remove button click listeners while hiding dialog, if any
        if (this.onClickFunction) $('#actionDialog_btnOk').removeEventListener('click', this.onClickFunction);
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
            // additional function
            if (!func) return;
            if (typeof func != 'function') {
                throw `Error: overlays.js: ActionDialog.hide(): func is ${typeof func}, expected function`;
            }
            func.call();
        }, Overlay.animation_duration);
    }
}

/*--------------------------------------- TODO START -------------------------------------------*/

/**
 * Represents a dialog.
 * Needs the code for a dialog in the HTML document.
 */
export const Dialog = {
    /**
     * Display the dialog.
     * @param {String} category Either 'alert' or 'action'.
     * @param {String} title Title of the dialog.
     * @param {String} message Message to be displayed.
     * @param {String} button Title of the default button.
     * @param {Function} func Optional for 'alert' category, function to run if default is button clicked.
     * @throws {Error} If category is invalid.
     * @throws {Error} If no function is provided for 'action' category.
     */
    display(category, title, message, button, func) {
        if (category == 'alert') {
            AlertDialog.display(title, message, button, func);
        } else if (category == 'action') {
            ActionDialog.display(title, message, button, func);
        } else throw `Error: overlays.js: Dialog.display(): category = ${category}, expected 'alert' or 'action'`;
    },
    /**
     * Hide the dialog.
     * @param {String} category Either 'alert' or 'action'.
     * @param {Function} func Optional, function to run once dialog is closed.
     * @throws {Error} If category is invalid.
     * @throws {Error} If typeof func is not function.
     */
    hide(category, func) {
        if (category == 'alert') {
            AlertDialog.hide(func);
        } else if (category == 'action') {
            ActionDialog.hide(func);
        } else throw `Error: overlays.js: Dialog.hide(): category = ${category}, expected 'alert' or 'action'`;
    }
}

/*--------------------------------------- TODO END --------------------------------------------*/

/**
 * Represents a menu.
 * Needs the code for a menu in the HTML document.
 */
export const Menu = {
    /**
     * Display the menu.
     * @param {String} title Optional, default value = 'Menu'. Title of the menu dialog.
     */
    display(title = 'Menu') {
        // delay when one overlay is already open
        let timeout = 0;
        if (Overlay.instance_open) timeout = Overlay.animation_duration;
        setTimeout(() => {
            getChildElement($('#menu'), 'h2')[0].innerHTML = title.replace(/\n/g, '<br>');;
            $('#menuRoot').style.animation = `fadeIn ${Overlay.animation_duration}ms forwards`;
            $('#menu').style.animation = `scaleIn ${Overlay.animation_duration}ms forwards`;
            Overlay.setInstanceOpen(true);
        }, timeout);
    },
    /**
     * Hide the menu.
     * @param {Function} func Optional, function to run once menu is closed.
     * @throws {Error} If typeof func is not function.
     */
    hide(func) {
        $('#menuRoot').style.animation = `fadeOut ${Overlay.animation_duration}ms forwards`;
        $('#menu').style.animation = `scaleOut ${Overlay.animation_duration}ms forwards`;
        setTimeout(() => {
            Overlay.setInstanceOpen(false);
            // additional function
            if (!func) return;
            if (typeof func != 'function') {
                throw `Error: overlays.js: Menu.hide(): func is ${typeof func}, expected function`;
            }
            func.call();
        }, Overlay.animation_duration);
    }
}

console.log('module overlays.js loaded');
