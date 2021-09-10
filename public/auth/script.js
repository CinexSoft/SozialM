// root visibility flag
let rootFlag = "login";
const toogleRoot = () => {
    $("#signup_info").style.display = "none";
    $("#login_info").style.display = "none";
    if (rootFlag == "login") {
        $("#login").style.display = "none";
        $(".swinfo")[0].innerHTML = "Already have an account? ";
        $(".switchlink")[0].innerHTML = "Log In";
        rootFlag = "signup";
        log("rootFlag = " + rootFlag);
    }
    else if (rootFlag == "signup") {
        $("#signup").style.display = "none";
        $(".swinfo")[0].innerHTML = "Don't have an account? ";
        $(".switchlink")[0].innerHTML = "Sign Up";
        rootFlag = "login";
        log("rootFlag = " + rootFlag);
    }
    document.getElementById(rootFlag).style.display = "block";
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
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("User.isLoggedIn", "true");
        localStorage.setItem("user.credentials", JSON.stringify(user));
        location.href = "/";
    })
    .catch((error) => {
        $("#login_info").style.color = "red";
        $("#login_info").innerHTML = ((error.code != "auth/operation-not-allowed" &&
                                      error.code != "auth/invalid-argument" &&
                                      error.code != "auth/internal-error") ?
                                      error.message : "An error occurred, try again later").slice(0, 65) +
                                     (error.message.length > 64 ? "..." : "");
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
    if ($("#signup_pass").value !=
        $("#signup_pass_c").value) {
        $("#signup_info").style.display = "block";
        $("#signup_info").innerHTML = "Password don't match";
        return;
    }
    password = $("#signup_pass").value;
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("User.isLoggedIn", "true");
        localStorage.setItem("user.credentials", JSON.stringify(user));
        location.href = "/";
    })
    .catch((error) => {
        $("#signup_info").style.color = "red";
        $("#signup_info").innerHTML = ((error.code != "auth/operation-not-allowed" &&
                                      error.code != "auth/invalid-argument" &&
                                      error.code != "auth/internal-error") ?
                                      error.message : "An error occurred, try again later").slice(0, 65) +
                                     (error.message.length > 64 ? "..." : "");
        $("#signup_info").style.display = "block";
        err("Code: " + error.code + " msg: " + error.message);
    });
});
log("document and script load complete");
