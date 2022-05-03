import { getCanvas } from "./canvas.setup.js";
import { playerInteractions } from "./player/player.interactions.js";
import { createBackground } from "./background/background.js";
import { createMenu } from "./menu/menu.js";
import { fullscreenButtonAction, menuInteractions, playButtonAction, tutorialButtonAction } from "./menu/menu.interactions.js";
import { createFalconObject } from "./objects/objects.js";
import { drawAsteroids, startAsteroidShower } from "./asteroids/asteroids.js";
import { drawActiveHighscore, drawHighscore } from "./highscore/highscore.js";
import { switchIsMusicEnabled } from "./sound/sound.controlls.js";
import { startTutorial } from "./tutorial/tutorial.js";
import { tutorialInteractions } from "./tutorial/tutorial.interactions.js";

let gameState = "menu";

window.onload = () => {
    let contextObject = getCanvas("canvas");
    
    let backgroundObject = createBackground(contextObject);

    let menuButtons = [];
    let spaceships = [];
    
    let menuObject = createMenu(contextObject);
    menuButtons.push(menuObject.addButton("Sound", switchIsMusicEnabled));
    menuButtons.push(menuObject.addButton("Fullscreen", fullscreenButtonAction));
    menuButtons.push(menuObject.addButton("Tutorial", tutorialButtonAction));
    menuButtons.push(menuObject.addButton("Play", playButtonAction));

    spaceships.push(createFalconObject(contextObject, 10));
    
    let tutorialObjects = startTutorial(contextObject);

    menuInteractions(contextObject, menuButtons);
    playerInteractions(contextObject, spaceships);
    tutorialInteractions(contextObject);

    function draw() {
        contextObject.clearAndReset();
        
        backgroundObject.drawStars();

        switch (gameState) {
            case "menu":
                menuObject.draw();
                menuObject.drawTitle();
                drawHighscore(contextObject);
                break;
            case "tutorial":
                tutorialObjects.draw(contextObject);
                break;
            case "play":3
                startAsteroidShower(contextObject);
                for(let ship of spaceships){
                    for(let shot of ship.objInfo.shots){
                        if(shot){
                            shot.draw(ship.getMatrix());
                        }
                    }
                    ship.draw();
                }
                drawAsteroids(spaceships);
                drawActiveHighscore(contextObject);
                break;
            default:
                alert("Error with state in app.js\nError: " + gameState);
                menuObject.draw();
                break;
        }

        window.requestAnimationFrame(draw);
    }
    draw();
}

export function setGameState(newState){
    gameState = newState;
}

export function getGameState(){
    return gameState;
}