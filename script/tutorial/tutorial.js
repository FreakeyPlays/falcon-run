import { setGameState } from "../app.js";
import { createFalconObject } from "../objects/objects.js";
import { setTutorialInteractionState } from "./tutorial.interactions.js";

let tutorialShips = [];
let context;
let tutorialState;

export function startTutorial(contextObject){
    context = contextObject.context;
    tutorialShips.push(createFalconObject(contextObject, 10, true));

    tutorialShips[0].move(context.canvas.width/2, context.canvas.height/2);

    tutorialState = "move";

    function draw(){
        setTutorialInteractionState(tutorialState);

        switch (tutorialState) {
            case "move":
                moveTutorial();
                break;
            case "shoot":
                shootTutorial();
                break;
            case "shield":
                shieldTutorial();
                break;
            default:
                setGameState("menu");
                break;
        }
    }

    return {
        draw
    }
}

function moveTutorial(){
    for(let ship of tutorialShips){
        ship.draw();
    }

    drawText("Move the spaceship by touching it,\nand moving your Finger on the Screen.");
}

function shootTutorial(){
    for(let ship of tutorialShips){
        for(let shot of ship.objInfo.shots){
            if(shot){
                shot.draw();
            }
        }
        ship.draw();
    }

    drawText("To shoot, double tap the Spaceship.\nIf you destroy an Asteroid,\nyou gain some Points.");
}

function shieldTutorial(){
    for(let ship of tutorialShips){
        ship.draw();
    }

    drawText("To activate the Shield for 3s,\ntouch the screen with two fingers\nand move them apart.\nUnder the Shield, you cannot gain points.");
}

export function finishTutorial(move = false, shoot = false, shield = false){
    if(move){
        tutorialState = "shoot";
    }else if(shoot){
        tutorialState = "shield";
    }else if(shield){
        setGameState("menu");
        tutorialState = "move";
    }

    tutorialShips[0].move(context.canvas.width/2, context.canvas.height/2);
    tutorialShips[0].objInfo.dx = 0;
    tutorialShips[0].objInfo.dy = 1;
    tutorialShips[0].rotate(0);
}

function drawText(tutText){
    context.save();
    context.fillStyle = "#FFE81F";
    context.textAlign = "center";
    let fontSize = (window.innerWidth/1080) * 20;
    fontSize < 15 ? fontSize = 15 : fontSize = fontSize;
    let text = tutText.split("\n");
    let x = context.canvas.width/2;
    let y = (context.canvas.height/4)*3
    context.font =  fontSize + "px DistantGalaxy";
    for(let i = 0; i < text.length; i++){
        context.fillText(text[i], x, y + (i * fontSize));
    }
    context.restore();
}

export function getTutShips(){
    return tutorialShips;
}