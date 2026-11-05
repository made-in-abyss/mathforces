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
let ranking_box = document.getElementById("ranking-box");
let description_tab = document.getElementById("description-tab");
let submit_btn = document.getElementById("submit-btn");
//======
let viewprofile_btn = document.getElementById("viewprofile-btn");
let back_btn1 = document.getElementById("back-btn1");
let back_btn2 = document.getElementById("back-btn2");
let ranking_btn = document.getElementById("ranking-btn");
let username_field = document.getElementById("username-field");
let rating_field = document.getElementById("rating-field");
let solved_problems_box = document.getElementById("solved-problems-box");
//======
let current_page = "login";
let currentID = -1;
let debounce = false;
//======
let pages = {
    login_page: document.getElementById("login-page"),
    signup_page:  document.getElementById("signup-page"),
    main_page: document.getElementById("main-page"),
    profile_page:  document.getElementById("profile-page"),
    ranking_page:  document.getElementById("ranking-page"),
}
let problem_cache = {
    ["Division 4"]:[],
    ["Division 3"]:[],
    ["Division 2"]:[],
    ["Division 1"]:[],
    ["Division 0"]:[],
    ["Special"]:[],
}
let leaderboard = [];
let division_btns = [
    document.getElementById("div4-btn"),
    document.getElementById("div3-btn"),
    document.getElementById("div2-btn"),
    document.getElementById("div1-btn"),
    document.getElementById("div0-btn"),
    document.getElementById("special-btn"),
]
//======
async function init() {
    debounce = true;
    let loggedIn=await checkStatus();
    if (loggedIn == false) {
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.login_page.style.display ="block";
        current_page = "login";
    }
    else{
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.main_page.style.display ="block";
        current_page = "main";
    }
    debounce = false;
}
function reload(){
    answer_field.value="";
    init();
}
async function submit() {
    if (currentID == -1||current_page != "main"){
        alert("empty submission");
        return;
    }
    let username=await getUsername();
    let answer=document.getElementById("answer-field").value;
    answer_field.value = "";
    if (username == null ||answer == null ||answer.length == 0 ){
        alert("empty submission.");
        return;
    }
    answer =answer.toLowerCase().replace(/\s+/g, '');
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
            alert(data.message || "incorrect answer.");
        }
    }
}
async function viewProblem(id){
    if (current_page == "profile"){
        if (debounce ==true) return;
        debounce = true;
        for (let d of Object.values(pages)) {
            d.style.display ="none";
        }
        pages.main_page.style.display ="block";
        current_page = "main";
        debounce = false;
    }
    let p = await getProblemById(id);
    description_tab.style.display = "block";
    problems_box.style.display = "none";
    let description_box = document.getElementById("description-box");
    let problem_title = document.getElementById("problem-title");
    problem_title.value = p.id +" : "+p.name;
    description_box.innerText = p.description;
    if (window.renderMathInElement) {
        renderMathInElement(description_box, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$',  right: '$',  display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
    }
    currentID = id;
}
async function loadProblems(divName) {
    if (current_page!="main") return;
    problems_box.innerHTML = "";
    let problem_list = problem_cache[divName] || [];
    let username = await getUsername();
    let solvedIds = await getSolvedProblemIds(username); 
    for (let problem of problem_list){
        let isSolved = solvedIds.includes(problem.id);
        let defaultColor ="#d8f0f8";
        let cardColor =isSolved?"#00aa5b":defaultColor;
        let statusBadge =isSolved?"SOLVED":"UNSOLVED";
        problems_box.innerHTML += `
            <div class="problem-card" style="border: 2px solid ${cardColor};">
                <h6 style="color: ${cardColor};">${problem.division} [${problem.base_points}PTS]</h6>
                <h5 style="color: ${cardColor};">#${problem.id}: ${problem.name} [${statusBadge}]</h5>
                <button onclick="viewProblem(${problem.id})">VIEW</button>
            </div>
            <br>
        `;
    }
}

async function OnPress(something) {
    for (let i of division_btns){
        if (!i) continue;
        i.style.color = "rgb(0, 0, 0)";
    }
    description_tab.style.display = "none";
    problems_box.style.display = "block";
    let divName = something.textContent;
    something.style.color = "rgb(0, 85, 255)";
    await loadProblems(divName);
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

login_confirm.addEventListener("click",async function(){
    let mail = login_mail.value;
    let pass = login_password.value;
    await logIn(mail,pass);
    reload();
});

signup_confirm.addEventListener("click",async function(){
    let mail = signup_mail.value;
    let pass = signup_password.value;
    if (mail.length >= 40 || pass.length>=20 || pass.length<=7)alert("either password or mail is either too long or too short.");
    else{
        await signUp(mail,pass);
        reload();
    }
});
async function profileView(username) {
    if (username == null) return false;
    let userData = await getPlayerStats(username);
    if (userData == null) return false;
    username_field.value =  userData.name;
    username_field.style.color = 
    (userData.points>=200)? ((userData.points>=600)? "#2104da" :
    "#00aa5b"): 
    "#000604";
    rating_field.value = userData.points;
    let solvedIds = await getSolvedProblemIds(username);
    let problem_list = await getProblemsByIds(solvedIds);
    solved_problems_box.innerHTML = "";
    for (let problem of problem_list){
        let cardColor = "#00aa5b";
        let statusBadge = "SOLVED";
        solved_problems_box.innerHTML += `
            <div class="problem-card" style="border: 2px solid ${cardColor};">
                <h6 style="color: ${cardColor};">${problem.division} [${problem.base_points}PTS]</h6>
                <h5 style="color: ${cardColor};">#${problem.id}: ${problem.name} [${statusBadge}]</h5>
                <button onclick="viewProblem(${problem.id})">VIEW</button>
            </div>
            <br>
        `;
    }
}

async function wrapper(username){
    if (debounce ==true) return;
    if (current_page!="main" && current_page!="ranking") return;
    debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    await profileView(username);
    pages.profile_page.style.display ="block";
    current_page = "profile";
    debounce = false;
}

async function loadLeaderBoard(params) {
    ranking_box.innerHTML = ""
    for (let user of leaderboard){
        let cardColor = "#e6f44f";
        ranking_box.innerHTML += `
            </h6><button id = "user-card" onclick="wrapper('${user.username}')" style="background-color: ${cardColor};">${user.username} [${user.total_points}PTS]</button>
            <br>
        `;
    }
}


logout_confirm.addEventListener("click",async function(){
    await logOut();
    reload();
});

submit_btn.addEventListener("click",function(){
    submit();
});

viewprofile_btn.addEventListener("click",async function(){
    if (debounce ==true) return;
    if (current_page!="main") return;
    debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    let username = await getUsername();
    await profileView(username);
    pages.profile_page.style.display ="block";
    current_page = "profile";
    debounce = false;
});

ranking_btn.addEventListener("click",async function(){
    if (debounce ==true) return;
    if (current_page!="main") return;
    debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    await loadLeaderBoard();
    pages.ranking_page.style.display ="block";
    current_page = "ranking";
    debounce = false;
});


back_btn1.addEventListener("click",function(){
    if (debounce ==true) return;
    if (current_page!="profile" && current_page!="ranking") return;
    debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.main_page.style.display ="block";
    current_page = "main";
    debounce = false;
});
back_btn2.addEventListener("click",function(){
    if (debounce ==true) return;
    if (current_page!="profile" && current_page!="ranking") return;
    debounce = true;
    for (let d of Object.values(pages)) {
        d.style.display ="none";
    }
    pages.main_page.style.display ="block";
    current_page = "main";
    debounce = false;
});
//========
for (let i of division_btns){
    if (!i) continue;
    i.addEventListener("click",async function(){
        if (debounce==true) return;
        debounce=true;
        await OnPress(i);
        debounce=false;
    });
}
async function loadcached() {
    debounce = true;
    for (let [key,value] of Object.entries(problem_cache)) {
        problem_cache[key] = await loadProblemsByLevel(key);
    }
    leaderboard = await getLeaderboard();
    debounce = false;
}
loadcached();
reload();
