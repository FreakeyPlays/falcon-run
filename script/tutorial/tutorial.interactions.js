import { getGameState } from "../app.js";
import { calcDistance } from "../objects/objects.js";
import { playFlySound } from "../sound/sound.controlls.js";
import { finishTutorial, getTutShips as getTutorialShips } from "./tutorial.js";

let tutorialInteractionState;

export function tutorialInteractions(contextObject) {
    let tutorialShips = getTutorialShips();
    let canvas = contextObject.canvas;
    let doubleTap = false;
    let initalDistance = undefined;
    let twoFingers = false;
    let cooldownOver = true
    let fingers = [];
    let initialCordinates = [];

    let tutorialMove = false;
    let tutorialShoot = false;
    let tutorialShield = false;

    function setFingers(touches) {
        for(let t of touches){
            for(let g of tutorialShips){
                if(g.isTouched(t, t.identifier, g.getMatrix())){
                    break;
                }
            };

            fingers[t.identifier] = {
                finger: t,
                tap: true,
                updateTap(){
                    this.tap = !this.tap;
                }
            };

            initialCordinates[t.identifier] = {
                x: t.clientX,
                y: t.clientY
            };
        }

        detectTwoFingers();
    }

    function moveFingers(touches) {
        for(let touch of touches){
            fingers[touch.identifier].finger = touch;

            let distance = calcDistance(initialCordinates[touch.identifier].x, initialCordinates[touch.identifier].y,
                                        touch.clientX, touch.clientY);

            if(tutorialInteractionState == "move"){
                if(distance > 50){
                    tutorialMove = true;
                }
                
                if(distance > 2.5){
                    if(fingers[touch.identifier].tap){
                        fingers[touch.identifier].updateTap();
                    }
        
                    if(!twoFingers){
                        for(let ship of tutorialShips){
                            if(!ship.objInfo.shield.obj){
                                if(ship.grab(touch, touch.identifier, ship.getMatrix())){
                                    playFlySound(true);
                                }
                                ship.getAngleFromMove();
                            }
                        }
                    }
                }
            }
        }

        if(tutorialInteractionState == "shield"){
            if(twoFingers){
                let distance = calcDistance(fingers[0].finger.clientX, fingers[0].finger.clientY, 
                                            fingers[1].finger.clientX, fingers[1].finger.clientY);
                
                if(!initalDistance){
                    initalDistance = distance;
                }else{
                    distance = distance < initalDistance ? initalDistance : distance;
                    let scale = (distance / initalDistance) - 1;
                    scale = scale > 1 ? 1 : scale;
                    for(let ship of tutorialShips){
                        scale = scale * ship.objInfo.shield.maxScale;
                        if(ship.objInfo.shield.obj){
                            ship.objInfo.shield.obj.setScale(scale, scale);
                        }
                    }
                    if(scale >= 1){
                        tutorialShield = true;
                    }
                }
            }
        }
    }

    function removeFingers(touches) {
        for(let touch of touches){
            if(fingers[touch.identifier] && fingers[touch.identifier].tap){
                for(let ship of tutorialShips){
                    if(tutorialInteractionState == "shoot"){
                        if(ship.isTouched(touch, touch.identifier, ship.getMatrix()) && detectDoubleTap() && cooldownOver && !ship.objInfo.shield.obj){
                            ship.shoot();
                            cooldownOver = false;
                            setTimeout(() => {
                                cooldownOver = true;
                            }, 250)
                            tutorialShoot = true;
                        }
                    }
                }
            }

            delete fingers[touch.identifier];
            delete initialCordinates[touch.identifier];

            for(let ship of tutorialShips){
                if(ship.touchEnd(touch.identifier)){
                    playFlySound(false);
                }
            }
        }

        twoFingers = false;
        initalDistance = undefined;
    }

    function detectTwoFingers(){
        let count = 0;
        for(let finger of fingers){
            if(finger){
                count++;
            }
        }
        if(count == 2){
            twoFingers = true;
            for(let ship of tutorialShips){
                ship.touchEnd(fingers[0].finger.identifier);
                ship.touchEnd(fingers[1].finger.identifier);
                ship.createShield();
            }
        }
    }

    function detectDoubleTap(){
        if(!doubleTap){
            doubleTap = true;
            setTimeout(() => {
                doubleTap = false;
            }, 300);
            return false;
        }
        return true;
    }

    canvas.addEventListener("touchstart", (e) => {
        if(getGameState() == "tutorial"){
            e.preventDefault();
            setFingers(e.changedTouches);
        }
    }, true);

    canvas.addEventListener("touchmove", (e) => {
        if(getGameState() == "tutorial"){
            e.preventDefault();
            moveFingers(e.changedTouches);
        }    
    }, true);

    canvas.addEventListener("touchend", (e) => {
        if(getGameState() == "tutorial"){
            e.preventDefault();
            removeFingers(e.changedTouches);

            if(tutorialMove){
                finishTutorial(true);
                tutorialMove = false;
            }else if(tutorialShoot){
                setTimeout(() => {
                    finishTutorial(false, true);
                    tutorialShoot = false;
                }, 1500);
            }else if(tutorialShield){
                setTimeout(() => {
                    finishTutorial(false, false, true);
                    tutorialShield = false;
                },3200);
            }
        }
    }, true);

}

export function setTutorialInteractionState(newState){
    tutorialInteractionState = newState;
}