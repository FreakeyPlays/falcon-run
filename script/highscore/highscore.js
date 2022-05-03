const key = "highscore";

let highscore = localStorage.getItem(key);
let activeScore = 0;

if(!highscore){
    localStorage.setItem(key, "0");
    highscore = 0;
}else{
    highscore = parseInt(highscore);
}

export function increaseHighscore(){
    activeScore += 10;
}

export function saveHighscore(){
    if(activeScore > highscore){
        localStorage.setItem(key, activeScore.toString());
        highscore = activeScore;
    }
    activeScore = 0;
}

export function drawActiveHighscore(contextObject){
    let context = contextObject.context;

    context.save();
    context.font = "30px DistantGalaxy";
    context.fillStyle = "#FFE81F";
    context.fillText("Score: " + activeScore.toString(), 10, 40);
    context.restore();
}

export function drawHighscore(contextObject){
    let context = contextObject.context;

    context.save();
    context.font = "30px DistantGalaxy";
    context.fillStyle = "#FFE81F";
    context.fillText("Highscore: " + highscore.toString(), 10, 40);
    context.restore();
}