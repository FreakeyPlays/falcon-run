import { setGameState } from "../app.js";
import { createAsteroidObject, createExplosionObject, calcDistance } from "../objects/objects.js";
import { increaseHighscore, saveHighscore } from "../highscore/highscore.js";
import { playExplodeSound, playFlySound } from "../sound/sound.controlls.js";

const MAX_ASTEROIDS = 10;
const BORDER_PADDING = 20;

let asteroids = [];
let explosions = [];
let asteroidCount = 0;
let contextObj = undefined;

export function startAsteroidShower(contextObject){
    if(!contextObj){
        contextObj = contextObject;
        createAsteroid();
    }
}

export function stopAsteroidShower(){
    contextObj = undefined;
    asteroidCount = 0;
    asteroids.splice(0, MAX_ASTEROIDS);
}

function createAsteroid(){
    if(asteroidCount < MAX_ASTEROIDS){
        for(let i = 0; i < MAX_ASTEROIDS; i++){
            if(!asteroids[i]){
                let width = contextObj.context.canvas.width;

                let x = getRandomValue(0, width * 0.8) + width * 0.2;
                let y = - getRandomValue(20, 100);
                let speed = getRandomValue(0.5, 1);
                let scale = getRandomValue(12, 22)
                let offset = getRandomValue(-1, 1);

                asteroids[i] = {
                    obj: createAsteroidObject(contextObj, scale),
                    speed,
                    offset,
                    scale,
                    delete(){
                        delete asteroids[i];
                        asteroidCount--;
                    }
                }
                asteroids[i].obj.move(x, y);
                asteroidCount++;
            }
        }
    }
}

function getRandomValue(minValue, maxValue){
    return Math.random() * (maxValue - minValue + 1) + minValue;
}

export function drawAsteroids(spaceships){
    if(asteroidCount < MAX_ASTEROIDS){
        createAsteroid();
    }

    for(let asteroid of asteroids){
        if(asteroid != undefined){
            asteroid.obj.draw();
            asteroid.obj.deltaMove(asteroid.offset, asteroid.speed);
            isAsteroidHit(spaceships);
            destroyAsteroid();
        }
    }

    for(let explosion of explosions){
        explosion.draw();
    }
}

function explodeAsteroid(scale, x, y){
    explosions.push(createExplosionObject(contextObj, scale, x, y));
    
    setTimeout(() => {
        explosions.splice(0, 1);
    }, 200);
}

function isAsteroidHit(spaceships){
    for(let asteroid of asteroids){
        if(asteroid){
            let asteroidX = asteroid.obj.objInfo.x;
            let asteroidY = asteroid.obj.objInfo.y;
            let asteroidRadius = asteroid.obj.objInfo.scale;

            for(let ship of spaceships){
                if(ship.objInfo.shots.length > 0){
                    for(let shot of ship.objInfo.shots){
                        if(shot){
                            let laserX = shot.objInfo.x;
                            let laserY = shot.objInfo.y;
                            let laserRadius = shot.objInfo.scale * 2;

                            let distance = calcDistance(asteroidX, asteroidY, laserX, laserY);
                            if(distance < asteroidRadius + laserRadius){
                                playExplodeSound();
                                increaseHighscore();
                                explodeAsteroid(asteroid.obj.objInfo.scale, asteroid.obj.objInfo.x, asteroid.obj.objInfo.y);
                                shot.delete();
                                asteroid.delete();
                            }
                        }
                    }
                }

                if(ship.objInfo.shield.obj){
                    let shieldX = ship.objInfo.shield.obj.objInfo.x;
                    let shieldY = ship.objInfo.shield.obj.objInfo.y;
                    let shieldRadius = ship.objInfo.shield.obj.objInfo.scale * 10;
                
                    let distance = calcDistance(asteroidX, asteroidY, shieldX, shieldY);
                    if(distance < asteroidRadius + shieldRadius){
                        playExplodeSound();
                        explodeAsteroid(asteroid.obj.objInfo.scale, asteroid.obj.objInfo.x, asteroid.obj.objInfo.y);
                        asteroid.delete();
                    }
                }else{
                    let shipX = ship.objInfo.x;
                    let shipY = ship.objInfo.y;
                    let shipRadius = ship.objInfo.scale * 4.7;

                    let distance = calcDistance(asteroidX, asteroidY, shipX, shipY);
                    if(distance < asteroidRadius + shipRadius){
                        playFlySound(false);
                        playExplodeSound();
                        ship.move(contextObj.canvas.width/2, contextObj.canvas.height/2);
                        stopAsteroidShower();
                        saveHighscore();
                        setGameState("menu");
                    }
                }
            }
        }
    }
}

function destroyAsteroid(){
    for(let i = 0; i < asteroids.length; i++){
        if(asteroids[i] != undefined){
            if(asteroids[i].obj.objInfo.y > contextObj.canvas.height + BORDER_PADDING ||
               asteroids[i].obj.objInfo.x < -BORDER_PADDING || 
               asteroids[i].obj.objInfo.x > contextObj.canvas.width + BORDER_PADDING){
                delete asteroids[i];
                asteroidCount--;
            }
        }
    }
}