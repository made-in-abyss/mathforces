//======
let login_mail = document.getElementById("login-mail");
let login_password = document.getElementById("login-password");
let login_confirm = document.getElementById("login-confirm");
let signup_transition = document.getElementById("signup-transition");
//======
let signup_mail = document.getElementById("signup-mail");
let signup_password = document.getElementById("signup-password");
let signup_confirm = document.getElementById("signup-confirm");
let login_transition = document.getElementById("login-transition");
//======


//======
let pages = {
    login_page: document.getElementById("login-page"),
    signup_page:  document.getElementById("signup-page"),
}

//======
async function init() {
    let loggedIn=await checkStatus();
    if (loggedIn == false) {
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.login_page.style.display ="block";
    }
}

//=======
login_transition.addEventListener("click",function(){
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.login_page.style.display ="block";
});

signup_transition.addEventListener("click",function(){
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.signup_page.style.display ="block";
});

login_confirm.addEventListener("click",function(){
    let mail = login_mail.value;
    let pass = login_password.value;
    if (mail.length >= 40 || pass.length>=20)alert("either password or mail is too long");
    else{
        logIn(mail,pass);
    }
});

signup_confirm.addEventListener("click",function(){
    let mail = login_mail.value;
    let pass = login_password.value;
    if (mail.length >= 40 || pass.length>=20)alert("either password or mail is too long");
    else{
        signUp(mail,pass);
    }
});




init();