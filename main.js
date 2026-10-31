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
let is_mainpage = false;

//======
let pages = {
    login_page: document.getElementById("login-page"),
    signup_page:  document.getElementById("signup-page"),
    main_page: document.getElementById("main-page"),
}
let division_btns = [
    document.getElementById("div4-btn"),
    document.getElementById("div3-btn"),
    document.getElementById("div2-btn"),
    document.getElementById("div1-btn"),
    document.getElementById("div0-btn"),
]
//======
async function loadProblems(divName) {
    let box = document.getElementById("problems-box");
    box.innerHTML = "";
    let problem_list = await loadProblemsByLevel(divName);
    for (let problem of problem_list){
        box.innerHTML += `
            <div class="problem-card">
                <h4>#${problem.id}: ${problem.name}</h4>
                <p>⭐ ${problem.base_points} PTS</p>
                <button onclick="viewProblem(${problem.id})">VIEW</button>
            </div>
        `;
    }
}
async function OnPress(divName) {
    
}

async function init() {
    let loggedIn=await checkStatus();
    if (loggedIn == false) {
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.login_page.style.display ="block";
        is_mainpage = false;
    }
    else{
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.main_page.style.display ="block";
        is_mainpage = true;
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
    logIn(mail,pass);
});

signup_confirm.addEventListener("click",function(){
    let mail = signup_mail.value;
    let pass = signup_password.value;
    if (mail.length >= 40 || pass.length>=20 || pass.length<=7)alert("either password or mail is either too long or too short.");
    else{
        signUp(mail,pass);
    }
});

function reload(){
    init();
}

reload();



for (let i of division_btns){
    i.addEventListener("click",function(){OnPress(i.textContent);});
}