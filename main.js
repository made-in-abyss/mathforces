//======
let login_mail = document.getElementById("login-mail");
let login_password = document.getElementById("login-password");
let login_confirm = document.getElementById("login-confirm");
let signup_transition = document.getElementById("signup-transition");
let logout_confirm = document.getElementById("logout-confirm");
//======
let signup_mail = document.getElementById("signup-mail");
let signup_password = document.getElementById("signup-password");
let signup_confirm = document.getElementById("signup-confirm");
let login_transition = document.getElementById("login-transition");
//======
let answer_field = document.getElementById("answer-field");
let problems_box = document.getElementById("problems-box");
let description_tab = document.getElementById("description-tab");
let submit_btn = document.getElementById("submit-btn");
//======
let viewprofile_btn = document.getElementById("viewprofile-btn");
let back_btn = document.getElementById("back-btn");
let username_field = document.getElementById("username-field");
let rating_field = document.getElementById("rating-field");
let solved_problems_box = document.getElementById("solved-problems-box");
//======
let is_mainpage = false;
let currentID = -1;
//======
let pages = {
    login_page: document.getElementById("login-page"),
    signup_page:  document.getElementById("signup-page"),
    main_page: document.getElementById("main-page"),
    profile_page:  document.getElementById("profile-page"),
}
let problem_cache = {
    ["Division 4"]:[],
    ["Division 3"]:[],
    ["Division 2"]:[],
    ["Division 1"]:[],
    ["Division 0"]:[],
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
    if (currentID == -1 || is_mainpage == false){
        alert("empty submission");
        return;
    }
    let username = await getUsername();
    let answer = document.getElementById("answer-field").value;
    answer_field.value = "";
    if (username == null || answer == null || answer.length == 0 ){
        alert("empty submission.");
        return;
    }
    answer = answer.toLowerCase().replace(/\s+/g, '');
    if (answer.length >=200){
        alert("submission is too long.");
        return;
    }
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
    profileSwitch_debounce = true
    let p = await getProblemById(id);
    description_tab.style.display = "block";
    problems_box.style.display = "none";
    let description_box = document.getElementById("description-box");
    let problem_title = document.getElementById("problem-title");
    problem_title.value = p.id + " : " + p.name;
    description_box.textContent = p.description;

    currentID = id;
}

let tabSwitch_debounce = false;
async function loadProblems(divName) {
    tabSwitch_debounce = true;
    problems_box.innerHTML = "";
    let problem_list = problem_cache[divName];
    let username = await getUsername();
    let solvedIds = await getSolvedProblemIds(username); 
    for (let problem of problem_list){
        let isSolved = solvedIds.includes(problem.id);
        let cardColor = isSolved?"#00aa5b":"#d8f0f8";
        let statusBadge = isSolved?"SOLVED":"UNSOLVED";
        problems_box.innerHTML += `
            <div class="problem-card" style="border: 2px solid ${cardColor};">
                 <h5 style="color: ${cardColor};">#${problem.id}: ${problem.name} [${statusBadge}]</h5>
                <p>${problem.base_points}PTS</p>
                <button onclick="viewProblem(${problem.id})">VIEW</button>
            </div>
            <br>
        `;
    }
    tabSwitch_debounce = false;
}

async function OnPress(something) {
    for (let i of division_btns){
        i.style.color= "rgb(0, 0, 0)";
    }
    description_tab.style.display = "none";
    problems_box.style.display = "block";
    let divName = something.textContent;
    something.style.color = "rgb(0, 85, 255)";
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
    reload();
});

signup_confirm.addEventListener("click",function(){
    let mail = signup_mail.value;
    let pass = signup_password.value;
    if (mail.length >= 40 || pass.length>=20 || pass.length<=7)alert("either password or mail is either too long or too short.");
    else{
        signUp(mail,pass);
        reload();
    }
});

async function logout2(){
    return await logOut();
}
 let profileSwitch_debounce = false;
async function profileView() {
    let username = await getUsername();
    if (username == null) return false;
    let userData = await getPlayerStats(username);
    if (userData == null) return false;
    profileSwitch_debounce = true;
    username_field.value =  userData.name;
    rating_field.value = userData.points;
    let solvedIds = await getSolvedProblemIds(username);
    let problem_list = await getProblemsByIds(solvedIds);
    solved_problems_box.innerHTML = "";
    for (let problem of problem_list){
        let cardColor = "#00aa5b";
        let statusBadge = "SOLVED";
        solved_problems_box.innerHTML += `
            <div class="problem-card" style="border: 2px solid ${cardColor};">
                 <h5 style="color: ${cardColor};">#${problem.id}: ${problem.name} [${statusBadge}]</h5>
                <p>${problem.base_points}PTS</p>
            </div>
            <br>
        `;
    }
    profileSwitch_debounce = false;
}

logout_confirm.addEventListener("click",function(){
    let ok = logout2();
    reload();
});

submit_btn.addEventListener("click",function(){
    submit();
});

viewprofile_btn.addEventListener("click",function(){
    if (profileSwitch_debounce ==true) return;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.profile_page.style.display ="block";
    is_mainpage = false;
    profileView();
});

back_btn.addEventListener("click",function(){
    if (profileSwitch_debounce ==true) return;
    profileSwitch_debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.main_page.style.display ="block";
    is_mainpage = true;
    profileSwitch_debounce = false;
});

reload();
//========
for (let i of division_btns){
    i.addEventListener("click",function(){
        if (tabSwitch_debounce == true) return;
        tabSwitch_debounce = true;
        OnPress(i);
    });
}
tabSwitch_debounce = true;
async function loadcached() {
    for (let [key,value] of Object.entries(problem_cache)) {
        problem_cache[key] = await loadProblemsByLevel(key);
    }
    tabSwitch_debounce = false;
}
loadcached();