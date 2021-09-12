// root visibility flag
let ROOTFLAG = "login";
// called when the eye-slash icon is pressed
const toogleRoot = () => {
    /* hide login and signup info, $ is a css style selector function
     * Thi isn't jQuery, it's my custom function, see common.js
     * for definition
     */
    $("#signup_info").style.display = "none";
    $("#login_info").style.display = "none";
    // if root of login visibile
    if (ROOTFLAG == "login") {
        $("#login").style.display = "none";
        $(".swinfo")[0].innerHTML = "Already have an account? ";
        $(".switchlink")[0].innerHTML = "Log In";
        ROOTFLAG = "signup";
        log("ROOTFLAG = " + ROOTFLAG);
    }
    // if root of signup visibile
    else if (ROOTFLAG == "signup") {
        $("#signup").style.display = "none";
        $(".swinfo")[0].innerHTML = "Don't have an account? ";
        $(".switchlink")[0].innerHTML = "Sign Up";
        ROOTFLAG = "login";
        log("ROOTFLAG = " + ROOTFLAG);
    }
    document.getElementById(ROOTFLAG).style.display = "block";
}
// toggle password visibility
const togglePass = () => {
    for (element of $(".password")) {
        log("togglePass(): type = " + element.type);
        if (element.type == "password") {
            element.type = "text";
            for (element of $(".fa-eye-slash")) {
                element.style.color = "#aaa";
            }
        }
        else if (element.type == "text") {
            element.type = "password";
            for (element of $(".fa-eye-slash")) {
                element.style.color = "#128c7e";
            }
        }
    }
}
// login button clicked
$("#btn_login").addEventListener("click", (e) => {
    $("#login_info").style.color = "#555";
    $("#login_info").innerHTML = "Logging you in, please wait...";
    $("#login_info").style.display = "block";
    email = $("#login_email").value;
    password = $("#login_pass").value;
    AUTH.signInWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("Auth.isLoggedIn", "true");
        localStorage.setItem("Auth.user", JSON.stringify(user));
        location.href = "/";
    })
    .catch((error) => {
        $("#login_info").style.color = "red";
        let outputmsg = error.code != "auth/operation-not-allowed" &&
                        error.code != "auth/invalid-argument" &&
                        error.code != "auth/internal-error" ?
                        error.message : "An error occurred, try again later";
        if (outputmsg.length > 64) {
            outputmsg = outputmsg.slice(0, 65) + "...";
        }
        $("#login_info").innerHTML = outputmsg;
        $("#login_info").style.display = "block";
        err("Code: " + error.code + " msg: " + error.message);
    });
});
// signup button clicked
$("#btn_signup").addEventListener("click", (e) => {
    $("#signup_info").style.color = "#555";
    $("#signup_info").innerHTML = "Signing you up, please wait...";
    $("#signup_info").style.display = "block";
    email = $("#signup_email").value;
    if ($("#signup_pass").value != $("#signup_pass_c").value) {
        $("#signup_info").style.color = "red";
        $("#signup_info").style.display = "block";
        $("#signup_info").innerHTML = "Password don't match";
        return;
    }
    password = $("#signup_pass").value;
    AUTH.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("Auth.isLoggedIn", "true");
        localStorage.setItem("Auth.user", JSON.stringify(user));
        location.href = "/";
    })
    .catch((error) => {
        $("#signup_info").style.color = "red";
        let outputmsg = error.code != "auth/operation-not-allowed" &&
                        error.code != "auth/invalid-argument" &&
                        error.code != "auth/internal-error" ?
                        error.message : "An error occurred, try again later";
        if (outputmsg.length > 64) {
            outputmsg = outputmsg.slice(0, 65) + "...";
        }
        $("#signup_info").innerHTML = outputmsg;
        $("#signup_info").style.display = "block";
        err("Code: " + error.code + " msg: " + error.message);
    });
});
log("document and script load complete");
