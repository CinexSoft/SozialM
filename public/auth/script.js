// root visibility flag
let rootFlag = "login";
const toogleRoot = () => {
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
    $("#login_err").style.display = "none";
    email = $("#login_email").value;
    password = $("#login_pass").value;
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("User.isLoggedIn", "true");
        localStorage.setItem("userdata.uid", user.uid);
    })
    .catch((error) => {
        $("#login_err").innerHTML = (error.code != "auth/invalid-argument" && error.code != "auth/internal-error") ?
                                     error.message : "An error occurred, try again later";
        $("#login_err").style.display = "block";
        err("Error: " + error.message + " code: " + error.code);
    });
});
// signup button clicked
$("#btn_signup").addEventListener("click", (e) => {
    $("#signup_err").style.display = "none";
    email = $("#signup_email").value;
    if ($("#signup_pass").value !=
        $("#signup_pass_c").value) {
        $("#signup_err").style.display = "block";
        $("#signup_err").innerHTML = "Password don't match";
        return;
    }
    password = $("#signup_pass").value;
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        let user = userCredential.user;
        localStorage.setItem("User.isLoggedIn", "true");
        localStorage.setItem("userdata.uid", user.uid);
    })
    .catch((error) => {
        $("#signup_err").innerHTML = (error.code != "auth/invalid-argument" && error.code != "auth/internal-error") ?
                                      error.message : "An error occurred, try again later";
        $("#signup_err").style.display = "block";
        err("Error: " + error.message + " code: " + error.code);
    });
});
log("document and script load complete");
