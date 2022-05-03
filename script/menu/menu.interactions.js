import { getGameState, setGameState } from "../app.js";
import { playClickSound, startFlySound } from "../sound/sound.controlls.js";

let fullscreen = false;

export function menuInteractions(contextObject, buttons){
    let canvas = contextObject.canvas;
    let fingers = [];

    function setFingers(touches) {
        for(let touch of touches){
            for(let button of buttons){
                if(button.btn.isTouched(touch, touch.identifier, button.btn.getMatrix())){
                    break;
                }
            }
            fingers[touch.identifier] = touch;
        }
    }

    function removeFingers(touches) {
        for(let touch of touches){
            delete fingers[touch.identifier];

            for(let button of buttons){
                if(button.btn.isTouched(touch, touch.identifier, button.btn.getMatrix())){
                    playClickSound();
                    button.action();
                }
                button.btn.touchEnd(touch.identifier);
            }
        }
    }

    canvas.addEventListener("touchstart", (e) => {
        if(getGameState() == "menu"){
            e.preventDefault();
            setFingers(e.changedTouches);
        }
    }, true);

    canvas.addEventListener("touchend", (e) => {
        if(getGameState() == "menu"){
            e.preventDefault();
            removeFingers(e.changedTouches);
        }
    }, true);
}

export function playButtonAction(){
    setGameState("play");
    startFlySound();
}

export function tutorialButtonAction(){
    setGameState("tutorial");
}

export function fullscreenButtonAction(){
    let documentElement = document.documentElement;
    if(!fullscreen){
        if (documentElement.requestFullscreen) {
            documentElement.requestFullscreen();
        } else if (documentElement.webkitRequestFullscreen) {
            documentElement.webkitRequestFullscreen();
        } else if (documentElement.msRequestFullscreen) {
            documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

window.addEventListener("fullscreenchange", () => {
    fullscreen ? fullscreen = false : fullscreen = true;
})