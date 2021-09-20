import { Auth } from '/common/js/firebaseinit.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import { Colors, log, err, $, checkForApkUpdates } from '/common/js/modules.js';

checkForApkUpdates();

// root visibility flag
let VISIBILE_ROOT = 'login';

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

// called when the eye-slash icon is pressed
$(".switchlink")[0].addEventListener('click', (event) => {
    resetColors();
    if (VISIBILE_ROOT == 'login') {
        $('#login').style.display = 'none';
        $('.swinfo')[0].innerHTML = 'Already have an account? ';
        $('.switchlink')[0].innerHTML = 'Log In';
        VISIBILE_ROOT = 'signup';
    } else if (VISIBILE_ROOT == 'signup') {
        $('#signup').style.display = 'none';
        $('.swinfo')[0].innerHTML = 'Don\'t have an account? ';
        $('.switchlink')[0].innerHTML = 'Sign Up';
        VISIBILE_ROOT = 'login';
    }
    log(`Auth: switch root: VISIBILE_ROOT = ${VISIBILE_ROOT}`);
    document.getElementById(VISIBILE_ROOT).style.display = 'block';
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
    }
});

// login button clicked
$('#btn_login').addEventListener('click', (e) => {
    resetColors();
    $('#login_info').style.color = '#555';
    $('#login_info').innerHTML = 'Logging you in, please wait...';
    $('#login_info').style.display = 'block';
    const email = $('#login_email').value;
    const password = $('#login_pass').value;
    signInWithEmailAndPassword(Auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('Auth.user', JSON.stringify(user));
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
$('#btn_signup').addEventListener('click', (e) => {
    resetColors();
    $('#signup_info').style.color = '#555';
    $('#signup_info').innerHTML = 'Signing you up, please wait...';
    $('#signup_info').style.display = 'block';
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
    createUserWithEmailAndPassword(Auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('Auth.user', JSON.stringify(user));
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
    for (let element of nodes) {
        element.style.color = 'red';
        element.style.borderColor = 'tomato';
    }
    if (innernodes) for (let element of innernodes) {
        element.style.color = 'red';
    }
}

log('Auth: document and script load complete');