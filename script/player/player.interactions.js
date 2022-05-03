import { getGameState } from "../app.js";
import { calcDistance } from "../objects/objects.js";
import { playFlySound } from "../sound/sound.controlls.js";

export function playerInteractions(contextObject, spaceships) {
    let canvas = contextObject.canvas;
    let doubleTap = false;
    let initalDistance = undefined;
    let twoFingers = false;
    let cooldownOver = true
    let fingers = [];
    let initialCordinates = [];

    function setFingers(touches) {
        for(let touch of touches){
            for(let ship of spaceships){
                if(ship.isTouched(touch, touch.identifier, ship.getMatrix())){
                    break;
                }
            }
            fingers[touch.identifier] = {
                finger: touch,
                tap: true,
                updateTap(){
                    this.tap = !this.tap;
                }
            };

            initialCordinates[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY
            }
        }

        detectTwoFingers();
    }

    function moveFingers(touches) {
        for(let touch of touches){
            fingers[touch.identifier].finger = touch;

            let distance = calcDistance(initialCordinates[touch.identifier].x, initialCordinates[touch.identifier].y,
                                        touch.clientX, touch.clientY);

            if(distance > 2.5){
                if(fingers[touch.identifier].tap){
                    fingers[touch.identifier].updateTap();
                }
    
                if(!twoFingers){
                    for(let g of spaceships){
                        if(!g.objInfo.shield.obj){
                            if(g.grab(touch, touch.identifier, g.getMatrix())){
                                playFlySound(true);
                            }
                            g.getAngleFromMove();
                        }
                    }
                }
            }
        }

        if(twoFingers){
            let distance = calcDistance(fingers[0].finger.clientX, fingers[0].finger.clientY, 
                                        fingers[1].finger.clientX, fingers[1].finger.clientY);
            
            if(!initalDistance){
                initalDistance = distance;
            }else{
                distance = distance < initalDistance ? initalDistance : distance;
                let scale = (distance / initalDistance) - 1;
                scale = scale > 1 ? 1 : scale;
                for(let ship of spaceships){
                    scale = scale * ship.objInfo.shield.maxScale;
                    if(ship.objInfo.shield.obj){
                        ship.objInfo.shield.obj.setScale(scale, scale);
                    }
                }
            }
        }
    }

    function removeFingers(touches) {
        for(let touch of touches){
            if(fingers[touch.identifier] && fingers[touch.identifier].tap){
                for(let ship of spaceships){
                    if(ship.isTouched(touch, touch.identifier, ship.getMatrix()) && detectDoubleTap() && cooldownOver && !ship.objInfo.shield.obj){
                        ship.shoot();
                        cooldownOver = false;
                        setTimeout(() => {
                            cooldownOver = true;
                        }, 250)
                    }
                }
            }

            delete fingers[touch.identifier];
            delete initialCordinates[touch.identifier];

            for(let ship of spaceships){
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
            for(let ship of spaceships){
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
        if(getGameState() == "play"){
            e.preventDefault();
            setFingers(e.changedTouches);
        }
    }, true);

    canvas.addEventListener("touchmove", (e) => {
        if(getGameState() == "play"){
            e.preventDefault();
            moveFingers(e.changedTouches);
        }    
    }, true);

    canvas.addEventListener("touchend", (e) => {
        if(getGameState() == "play"){
            e.preventDefault();
            removeFingers(e.changedTouches);
        }
    }, true);

}