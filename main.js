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
let answer_field = document.getElementById("answer-field");
let problems_box = document.getElementById("problems-box");
let description_tab = document.getElementById("description-tab");
let submit_btn = document.getElementById("submit-btn");
//======
let is_mainpage = false;
let currentID = -1;
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

function reload(){
    answer_field.value = "";
    init();
}
async function submit() {
    answer_field.value = "";
    if (currentID == -1){
        alert("empty submission");
        return;
    }
    let username = await getUsername();
    let answer = document.getElementById("answer-field").value;
    if (username == null || answer == null) return;
    answer = answer.toLowerCase().replace(/\s+/g, '');
    let data = await submitProblem(username,currentID,answer);
    if (data!=null){
        if (data.is_correct == true){
            alert("you've earned "+ data.points_earned+" rating.");
        }
        else{
            alert("incorrect answer.");
        }
    }
}

async function viewProblem(id){
    let p = await getProblemById(id);
    description_tab.style.display = "block";
    problems_box.style.display = "none";
    
    let description_box = document.getElementById("description-box");
    let problem_title = document.getElementById("problem-title");
    problem_title.value = p.id + " : " + p.name;
    description_box.textContent = p.description;

    currentID = id;
}

async function loadProblems(divName) {
    problems_box.innerHTML = "";
    let problem_list = await loadProblemsByLevel(divName);
    for (let problem of problem_list){
        problems_box.innerHTML += `
            <div class="problem-card">
                <h5>#${problem.id}:${problem.name}</h5>
                <p>${problem.base_points}PTS</p>
                <button onclick="viewProblem(${problem.id})">VIEW</button>
            </div>
            <br>
        `;
    }
}

async function OnPress(something) {
    for (let i of division_btns){
        i.style.color= "rgb(0, 0, 0)";
    }
    description_tab.style.display = "none";
    problems_box.style.display = "block";
    let divName = something.textContent;
    something.style.color = "rgb(0, 191, 255)";
    reload();
    loadProblems(divName);
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

submit_btn.addEventListener("click",function(){
    submit();
});

reload();



for (let i of division_btns){
    i.addEventListener("click",function(){OnPress(i);});
}