import { Auth, } from '/common/js/firebaseinit.js';
import { USER_ID, } from '/common/js/variables.js';
import { log, err, } from '/common/js/logging.js';
import { checkForApkUpdates, } from '/common/js/generalfunc.js';
import { $, } from '/common/js/domfunc.js';
import { Colors, } from '/common/js/colors.js';
import { Dialog, } from '/common/js/overlays.js';

// reset colors
const resetColors = () => {
    /* hide login and signup info, $ is a css style selector function
     * Thi isn't jQuery, it's my custom function, see common.js
     * for definition
     */
    $('#signup_info').style.display = 'none';
    $('#login_info').style.display = 'none';
    for (let element of [
        $('#login_email'),
        $('#login_pass').parentNode,
        $('#signup_email'),
        $('#signup_pass').parentNode,
        $('#signup_pass_c').parentNode,
    ]) {
        element.style.color = Colors.FG_COLOR;
        element.style.borderColor = Colors.PRIMARY_BGCOLOR;
    }
    for (let element of [$('#login_pass'), $('#signup_pass'), $('#signup_pass_c')]) {
        element.style.color = Colors.FG_COLOR;
    }
}

// login or signup error handler
const handleError = (state, { code, message, }, nodes, innernodes) => {
    log(`Auth: nodes = ${nodes}`);
    err(`Auth: ${state}: code: ${code} msg: {message}`);
    $(`#${state}_info`).style.color = 'red';
    let outputmsg = code != 'auth/invalid-argument'
                    && code != 'auth/internal-error'
                    ? message : 'Internal error. Please report this to support';
    if (outputmsg.length > 64) {
        outputmsg = outputmsg.slice(0, 65) + '...';
    }
    $(`#${state}_info`).innerHTML = outputmsg;
    $(`#${state}_info`).style.display = 'block';
    $('#btn_login').innerHTML = 'Login';
    $('#btn_signup').innerHTML = 'Sign up';
    $('#btn_login').disabled = false;
    $('#btn_signup').disabled = false;
    for (let element of nodes) {
        element.style.color = 'red';
        element.style.borderColor = 'tomato';
    }
    if (innernodes) for (let element of innernodes) {
        element.style.color = 'red';
    }
}

const main = () => {
    // root visibility flag
    let visibile_root = 'login';
    // checking if user is logged in, local storage does exactly what it says
    if (USER_ID) {
        console.log('Log: already signed in, redirect to /chat');
        location.href = '/inbox';
        return;
    }
    checkForApkUpdates();
    // event when the eye-slash icon is pressed
    $(".switchlink")[0].addEventListener('click', (event) => {
        resetColors();
        if (visibile_root == 'login') {
            $('#login').style.display = 'none';
            $('.swinfo')[0].innerHTML = 'Already have an account? ';
            $('.switchlink')[0].innerHTML = 'Log In';
            visibile_root = 'signup';
        } else if (visibile_root == 'signup') {
            $('#signup').style.display = 'none';
            $('.swinfo')[0].innerHTML = 'Don\'t have an account? ';
            $('.switchlink')[0].innerHTML = 'Sign Up';
            visibile_root = 'login';
        }
        log(`Auth: switch root: visibile_root = ${visibile_root}`);
        document.getElementById(visibile_root).style.display = 'block';
    });
    
    // toggle password visibility
    for (let element of $(".fa-eye-slash")) element.addEventListener('click', (event) => {
        for (let element of $('.password')) {
            log(`Auth: togglePassVisibility: type = ${element.type}`);
            if (element.type == 'password') {
                element.type = 'text';
                for (let element of $('.fa-eye-slash')) {
                    element.style.color = '#aaa';
                }
            } else if (element.type == 'text') {
                element.type = 'password';
                for (let element of $('.fa-eye-slash')) {
                    element.style.color = Colors.CONTROL_COLOR;
                }
            }
        }
    });
    
    // on focus given to an input
    document.body.addEventListener('click', (event) => {
        if (['INPUT', 'DIV'].includes(event.target.nodeName)) {
            resetColors();
        } else if (event.target.id == 'pass_reset') {
            Dialog.display('action', 'Reset Password',
                '<p style="text-align:justify">The Reset Password UI isn\'t yet ready. Please send an e-mail to <a id="mail_cinexsoft" href="mailto:cinexsoft@gmail.com">CinexSoft</a> and we\'ll send you a reset link to your registered email address.</p>' +
                '<p style="text-align:justify">You might need to wait from a couple of hours to about 2 days for the link. If it doesn\'t arrive, request a reset again.</p>',
                'Open mail',
                () => {
                    $('#mail_cinexsoft').click();
                }
            );
        }
    });
    
    // login button clicked
    $('#btn_login').addEventListener('click', async (e) => {
        resetColors();
        const email = $('#login_email').value;
        const password = $('#login_pass').value;
        $('#btn_login').disabled = true;
        $('#btn_signup').disabled = true;
        // code for loading spin animation - a styled div
        $('#btn_login').innerHTML = (
            '<div style="'
          +     'margin: 0 auto;'
          +     'margin-bottom: 2px;'
          +     'border: 1.5px solid var(--accent-bgcolor);'
          +     'border-top: 1.5px solid transparent;'
          +     'border-radius: 50%;'
          +     'width: 0px;'
          +     'height: 0px;'
          +     'background-color: transparent;'
          +     'animation: loadspin 1s linear infinite; ">'
          + '</div>'
        );
        const FirebaseAuth = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js');
        FirebaseAuth.signInWithEmailAndPassword(Auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('UserData.auth', JSON.stringify(user));
            location.href = '/';
        })
        .catch((error) => {
            const nodes = [];
            const innernodes = [];
            if (error.code.includes('mail')) {
                nodes.push($('#login_email'));
            } else if (error.code.includes('pass')) {
                nodes.push($('#login_pass').parentNode);
                innernodes.push($('#login_pass'));
            }
            handleError('login', error, nodes, innernodes);
        });
    });
    
    // signup button clicked
    $('#btn_signup').addEventListener('click', async (e) => {
        resetColors();
        const email = $('#signup_email').value;
        if ($('#signup_pass').value != $('#signup_pass_c').value) {
            handleError('signup', {
                message: 'Passwords don\'t match',
                code:'auth/password-mismatch',
            },
            [
                $('#signup_pass').parentNode,
                $('#signup_pass_c').parentNode,
            ],
            [
                $('#signup_pass'),
                $('#signup_pass_c'),
            ]);
            return;
        }
        const password = $('#signup_pass').value;
        $('#btn_login').disabled = true;
        $('#btn_signup').disabled = true;
        // code for loading spin animation - a styled div
        $('#btn_signup').innerHTML = (
            '<div style="'
          +     'margin: 0 auto;'
          +     'margin-bottom: 2px;'
          +     'border: 1.5px solid var(--accent-bgcolor);'
          +     'border-top: 1.5px solid transparent;'
          +     'border-radius: 50%;'
          +     'width: 0px;'
          +     'height: 0px;'
          +     'background-color: transparent;'
          +     'animation: loadspin 1s linear infinite; ">'
          + '</div>'
        );
        const FirebaseAuth = await import('https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js');
        FirebaseAuth.createUserWithEmailAndPassword(Auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('UserData.auth', JSON.stringify(user));
            location.href = '/';
        })
        .catch((error) => {
            const nodes = [];
            const innernodes = [];
            if (error.code.includes('mail')) {
                nodes.push($('#signup_email'));
            }
            if (error.code.includes('pass')) {
                nodes.push($('#signup_pass').parentNode);
                nodes.push($('#signup_pass_c').parentNode);
                innernodes.push($('#signup_pass'));
                innernodes.push($('#signup_pass_c'));
            }
            handleError('signup', error, nodes, innernodes);
        });
    });
    log('Auth: document and script load complete');
}

main();
