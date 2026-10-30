//======
let login_mail = document.getElementById("login-mail");
let login_password = document.getElementById("login-password");
let login_confirm = document.getElementById("login-confirm");
//======
let signup_mail = document.getElementById("signup-mail");
let signup_password = document.getElementById("signup-password");
let signup_confirm = document.getElementById("signup-confirm");
//======


//======
let pages = {
    login_page: document.getElementById("login-page"),
    signup_page:  document.getElementById("signup-page"),
}

//======
if (await checkStatus()==false){
    for (let d of Object.values(pages)){
        d.style.display = "none";
    }
    pages.login_page.style.display = "block";
}