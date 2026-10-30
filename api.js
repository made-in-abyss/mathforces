const SUPABASE_URL ="https://dmlxnpserjqmtrhoqxvg.supabase.co";
const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbHhucHNlcmpxbXRyaG9xeHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjQ1NTEsImV4cCI6MjEwODk0MDU1MX0.JpcLskIrZS7fPHuJoDOYJI41Cwzx3Cy2gYbYyPpXup8";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
//=======================API==================================================
async function loadProblemsByLevel(levelName) {
    let { data, error } =await db
        .from('problems')
        .select('id, name, description, base_points')
        .eq('level', levelName);
    if (error) {
        return [];
    }
    return data;
}

async function submitProblem(username,problemId,userAnswer) {
    let {data, error} = await db.rpc('submit_problem_answer', {
        p_username:username,
        p_problem_id:parseInt(problemId),
        p_answer:userAnswer.toString()
    });
    if (error) {
        return null;
    }
    //{success: true,is_correct:true,points_earned: 10,message: "..."}
    return data;
}

async function getPlayerStats(username) {
    let {data: player} = await db
        .from('players')
        .select('*')
        .eq('username',username)
        .single();
    let {data: solvedList} = await db
        .from('submissions')
        .select('problem_id, problems(name, level), points_earned, created_at')
        .eq('username',username)
        .eq('is_correct',true);
    let accuracy = 0;
    if (player && player.total_solved>0) {
        accuracy = ((player.first_try_solves/player.total_solved)*100).toFixed(1);
    }
    return {
        points: player?.total_points || 0,
        solvedCount: player?.total_solved || 0,
        totalTries: player?.total_tries || 0,
        accuracy: accuracy,
        solvedProblems: solvedList || []
    };
}
async function getLeaderboard() {
    let {data,error} =await db
        .from('players')
        .select('username, total_points,total_solved')
        .order('total_points', {ascending:false })
        .limit(10);
    return data || [];
}

async function signUp(email,password,chosenUsername) {
    let {data, error} = await db.auth.signUp({
        email:email,
        password:password,
        options: {
            data: {
                username: chosenUsername
            }
        }
    });
    if (error) {
        alert("failed: "+error.message);
        return null;
    }
    alert("Mathforces welcomes you, " + chosenUsername);
    return data.user;
}
async function logIn(email, password) {
    let {data, error} = await db.auth.signInWithPassword({
        email:email,
        password:password
    });
    if (error) {
        alert("failed: "+error.message);
        return null;
    }
    alert("Logged in successfully");
    return data.user;
}
async function checkStatus() {
    let {data: {user}} = await db.auth.getUser();
    if (!user) return false;
    return true;
}
//=======================API==================================================