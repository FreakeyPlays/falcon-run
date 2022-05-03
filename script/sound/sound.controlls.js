let isMusicEnabled = false;

export function switchIsMusicEnabled(){
    isMusicEnabled = !isMusicEnabled
    if(isMusicEnabled){
        playBackgoundSound();
    }else{
        stopBackgroundSound();
    }
}

const shotSound = new Audio("../../sounds/shot.mp3");
shotSound.volume = 0.3;
export function playShotSound(){
    shotSound.currentTime = 0;
    if(isMusicEnabled){
        shotSound.play();
    }
}

const explodeSound = new Audio("../../sounds/explode.wav");
explodeSound.volume = 0.3;
export function playExplodeSound(){
    explodeSound.currentTime = 0;
    if(isMusicEnabled){
        explodeSound.play();
    }
}

const flySound = new Audio("../../sounds/fly.mp3");
flySound.volume = 0;

export function startFlySound(){
    flySound.play();
}

export function playFlySound(playFly){
    if(isMusicEnabled){
        if(playFly){
            flySound.volume = 0.25;
        }else{
            flySound.volume = 0;
        }  
    }
}

flySound.addEventListener("ended", () => {
    flySound.currentTime = 0;
    flySound.play();
}, false);

const backgroundSound = new Audio("../../sounds/background.mp3");
export function playBackgoundSound(){
    if(isMusicEnabled){
        backgroundSound.volume = 0.2;
        backgroundSound.currentTime = 0;
        backgroundSound.play(); 
    }
}

export function stopBackgroundSound(){
    backgroundSound.volume = 0;
}

backgroundSound.addEventListener("ended", () => {
    backgroundSound.currentTime = 0;
    backgroundSound.play();
}, false);

const activateShieldSound = new Audio("../../sounds/activateShield.wav");
export function playActivateShieldSound(){
    if(isMusicEnabled){
        activateShieldSound.play(); 
    }
}

const deactivateShieldSound = new Audio("../../sounds/deactivateShield.wav");
export function playDeactivateShieldSound(){
    if(isMusicEnabled){
        deactivateShieldSound.play();
    }
}

const clickSound = new Audio("../../sounds/click.mp3");
clickSound.volume = 0.7;
export function playClickSound(){
    clickSound.play();
}