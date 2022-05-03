import { createAsteroidPath, createButtonPath, createExplosionPath, createFalconPath, createLaserPath, createShieldPath } from "./objects.paths.js";
import { playActivateShieldSound, playDeactivateShieldSound, playShotSound } from "../sound/sound.controlls.js";


/**
 * This Function takes in a Object containing the context,
 * and builds the base Object for differen Objects.
 * 
 * @param {Object} drawingContext 
 * @returns Object containing all Functions to controll a object
 */
export function object(drawingContext){
    /** @type {CanvasRenderingContext2D}*/
    let ctx = drawingContext.context;
    let objInfo = {
        x: 0,
        y: 0,
        alpha: 0,
        scale: 1,
        path: [],
        fillStyle: [],
        strokeStyle: [],
        dx: 0,
        dy: 1
    }
    let matrix = new DOMMatrix();
    let needUpdate = false;
    let inverse;
    let initialGrabbed;
    let touchID;

    function draw(parentMatrix){
        update();

        let localMatrix = DOMMatrix.fromMatrix(parentMatrix);
        localMatrix.multiplySelf(matrix);
        ctx.transform(localMatrix.a, localMatrix.b, localMatrix.c, localMatrix.d, localMatrix.e, localMatrix.f);
    }

    function move(newX, newY){
        objInfo.x = newX;
        objInfo.y = newY;
        needUpdate = true;
        update();
    }

    function deltaMove(newX, newY){
        objInfo.x += newX;
        objInfo.y += newY;
        needUpdate = true;
        update();
    }

    function rotate(newA){
        objInfo.alpha = newA;
        needUpdate = true;
        update();
    }

    function setactiveDirection(newDX, newDY){
        objInfo.dx = newDX;
        objInfo.dy = newDY;
    }

    function setScale(newS){
        objInfo.scale = newS;
        needUpdate = true;
        update();
    }

    function setFillStyle(newFillStyle){
        objInfo.fillStyle = newFillStyle;
    }

    function setStrokeStyle(newStrokeStyle){
        objInfo.strokeStyle = newStrokeStyle;
    }

    function setFontSize(newFontSize){
        objInfo.fontSize = newFontSize;
    }

    function setPath(newPath){
        objInfo.path = newPath;
    }

    function getMatrix(){
        update();
        return matrix;
    }

    function getX(){
        return objInfo.x;
    }

    function getY(){
        return objInfo.y;
    }

    function isTouched(finger, identifier, objMatrix){
        let localInverse = DOMMatrix.fromMatrix(matrix);
        localInverse.invertSelf();
        let localTouchPoint = localInverse.transformPoint(new DOMPoint(finger.pageX, finger.pageY));
        if(ctx.isPointInPath(objInfo.path[0], localTouchPoint.x, localTouchPoint.y)){
            touchID = identifier;

            inverse = new DOMMatrix(objMatrix);
            inverse.invertSelf();

            initialGrabbed = new DOMMatrix(objMatrix);
            initialGrabbed.preMultiplySelf(inverse);

            return true;
        }
        return false;
    }

    function grab(finger, identifier, objMatrix){
        if(touchID === identifier){
            matrix = new DOMMatrix(initialGrabbed);
            matrix.multiplySelf(objMatrix);

            objInfo.x = finger.pageX;
            objInfo.y = finger.pageY;
            needUpdate = true;
            return true;
        }
        return false;
    }

    function touchEnd(identifier){
        if(touchID === identifier){
            touchID = undefined;
            return true;
        }
        return false;
    }

    function update(){
        if(needUpdate){
            matrix = new DOMMatrix();
            matrix.translateSelf(objInfo.x, objInfo.y);
            matrix.rotateSelf(objInfo.alpha);
            matrix.scaleSelf(objInfo.scale);
            needUpdate = false; 
        }
    }

    return {
        move, rotate, setScale, getMatrix, draw, grab, isTouched, touchEnd,
        setFillStyle, setPath, getX, getY, setStrokeStyle, setFontSize, deltaMove, setactiveDirection, objInfo
    }

}

/**
 * This function will create a Object with the form of a 2D Path.
 * Provides full controll over object including moving and turning.
 * 
 * @param {Object} contextObject 
 * @param {number} scale 
 * @param {Array} fillStyle 
 * @param {Function} pathFunc 
 * @param {boolean} turnable 
 * @returns A Object containing functions to control a Path.
 */
function pathObject(contextObject, scale = 10, fillStyle = ["white"], strokeStyle = ["black"], pathFunc, turnable = true){
    let ctx = contextObject.context;
    let obj = object(contextObject);
    obj.setPath(pathFunc());
    obj.setFillStyle(fillStyle);
    obj.setStrokeStyle(strokeStyle);
    obj.setScale(scale);
    
    obj.draw = () => {
        ctx.save();
        ctx.translate(obj.objInfo.x, obj.objInfo.y);
        ctx.rotate(obj.objInfo.alpha);
        ctx.scale(obj.objInfo.scale, obj.objInfo.scale);
        ctx.lineWidth = 0.1;
        for(let i = 0; i < obj.objInfo.path.length; i++){
            ctx.fillStyle = obj.objInfo.fillStyle[i];
            ctx.fill(obj.objInfo.path[i]);
            ctx.strokeStyle = obj.objInfo.strokeStyle[i];
            ctx.stroke(obj.objInfo.path[i]);
        }
        ctx.restore();
    }

    if(turnable){
        const MIN_DIST = 10;
        const SAMPLES = 10;
        let pipe = [];

        obj.getAngleFromMove = () => {
            pipe.push({ oldX: obj.objInfo.x, oldY: obj.objInfo.y });
            if (pipe.length > SAMPLES) {
                let { oldX, oldY } = pipe.shift();
                let d = calcDistance(obj.objInfo.x, obj.objInfo.y, oldX, oldY);
                if (d > MIN_DIST) {
                    let dx = oldX - obj.objInfo.x;
                    let dy = oldY - obj.objInfo.y;
                    obj.objInfo.alpha = Math.atan2(dy, dx)  - Math.PI/2;
                    obj.setactiveDirection(dx/d,dy/d)
                }
            }
        }
    }

    return obj;
}

/**
 * This function creates a Millenium Falcon and provides full controll over it.
 * 
 * @param {Object} contextObject 
 * @param {number} scale 
 * @returns A Object containing functions to control a model Millenium Falcon.
 */
export function createFalconObject(contextObject, scale = 10, turnable = true){
    let ctx = contextObject.context;
    let falcon = pathObject(contextObject, scale, ["#B3B3B3", "#999999", "#B3B3B3", "#808080"], 
                            ["black", "black", "black", "black"], createFalconPath, turnable);
    falcon.move(ctx.canvas.width/2, ctx.canvas.height/2);

    let preDraw = falcon.draw;
    falcon.draw = () => {
        preDraw();
        if(falcon.objInfo.shield.obj){
            falcon.objInfo.shield.obj.draw();
        }
    }

    falcon.objInfo.shots = [];
    falcon.shoot = () => {
        playShotSound();

        let laser = pathObject(contextObject, 4, ["red"], ["red"], createLaserPath, false);
        let currentIndex = falcon.objInfo.shots.length;

        const speed = 10;
        let dx = falcon.objInfo.dx * speed;
        let dy = falcon.objInfo.dy * speed;

        laser.move(falcon.objInfo.x, falcon.objInfo.y);
        laser.rotate(falcon.objInfo.alpha);
        let preDraw = laser.draw;

        laser.isOutOfBound = () => {
            if(laser.objInfo.x < 0 || laser.objInfo.x > ctx.canvas.width || 
               laser.objInfo.y < 0 || laser.objInfo.y > ctx.canvas.height){
                delete falcon.objInfo.shots[currentIndex];
            }
        }

        laser.delete = () => {
            delete falcon.objInfo.shots[currentIndex];
        }

        laser.draw = () => {
            ctx.save();
            laser.deltaMove(-dx, -dy);
            preDraw();
            ctx.restore();
            laser.isOutOfBound()
        }
        falcon.objInfo.shots[currentIndex] = laser;
    }

    falcon.objInfo.shield = {
        obj : undefined,
        maxScale: 6
    }
    falcon.createShield = () => {
        if(!falcon.objInfo.shield.obj){
            playActivateShieldSound();
            falcon.objInfo.shield.obj = pathObject(contextObject, 0, ["rgba(137,207,240,0.5)"], ["black"], createShieldPath, false);
            falcon.objInfo.shield.obj.move(falcon.objInfo.x, falcon.objInfo.y);
            setTimeout(() => {
                playDeactivateShieldSound();
                delete falcon.objInfo.shield.obj;
            }, 3000);
        }
    }

    return falcon;
}

export function createAsteroidObject(contextObject, scale){
    let astroid = pathObject(contextObject, scale, ["#464646", "#595959", "#737373"], ["black", "transparent", "transparent"], createAsteroidPath, false);
    astroid.move(contextObject.canvas.width/2,contextObject.canvas.height/2);
    return astroid;
}

export function createExplosionObject(contextObject, scale, x, y){
    let explosion = pathObject(contextObject, scale, ["yellow"], ["red"], createExplosionPath, false);
    explosion.move(x, y);
    return explosion;
}

export function createButton(contextObject, scale = 20, text, fontSize){
    let ctx = contextObject.context;
    let button = pathObject(contextObject, scale, ["#4f5b66"], ["#343d46"], createButtonPath, false);
    button.objInfo.fontSize = fontSize;
    button.objInfo.text = text;
    let preDraw = button.draw;

    button.draw = () => {
        ctx.save();
        preDraw();
        ctx.font = button.objInfo.fontSize + "px DistantGalaxy";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFE81F"
        ctx.fillText(button.objInfo.text, button.objInfo.x, button.objInfo.y + button.objInfo.scale/3);
        ctx.restore();
    }
    
    return button;
}

/**
 * This function calculates the Distance between Point A (x1, y1) and Point B (x2, y2)
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns The Distance between the Points
 */
export function calcDistance(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}