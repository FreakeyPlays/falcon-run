export function createButtonPath(){
    let button = new Path2D();
    button.arc(-3, 0, 1, Math.PI/2, (3*Math.PI)/2);
    button.lineTo(3, -1);
    button.arc(3, 0, 1, (3*Math.PI)/2, Math.PI/2);
    button.closePath();

    return [button];
}

export function createAsteroidPath(){
    let asteroid = new Path2D();
    asteroid.arc(0,0,1,0,Math.PI*2);
    asteroid.closePath();

    let layerOne = new Path2D();
    layerOne.arc(0.45,0.4, 0.25, 0, Math.PI*2);
    layerOne.moveTo(0.1, 0.6);
    layerOne.arc(-0.35, 0.2, 0.35, 0, Math.PI*2)
    layerOne.closePath();

    let layerTwo = new Path2D();
    layerTwo.arc(-0.05, -0.5, 0.2, 0, Math.PI*2);
    layerTwo.closePath();

    return [asteroid, layerOne, layerTwo];
}

export function createExplosionPath(){
    let explosion = new Path2D();
    explosion.moveTo(0,-0.6);
    explosion.lineTo(0.4, -1);
    explosion.lineTo(0.3, -0.6);
    explosion.lineTo(0.9, -0.5);
    explosion.lineTo(0.4, -0.3);
    explosion.lineTo(0.8, 0);
    explosion.lineTo(0.4, 0.2);
    explosion.lineTo(0.6, 0.7);
    explosion.lineTo(0.1, 0.3);
    explosion.lineTo(-0.3, 0.8);
    explosion.lineTo(-0.2, 0.2);
    explosion.lineTo(-0.8, 0.5);
    explosion.lineTo(-0.5, -0.1);
    explosion.lineTo(-0.9, -0.2);
    explosion.lineTo(-0.5, -0.4);
    explosion.lineTo(-0.6, -0.9);
    explosion.lineTo(-0.2, -0.6);
    explosion.lineTo(0, -1);
    explosion.closePath();

    return [explosion];
}

export function createLaserPath(){
    let laser = new Path2D();
    laser.arc(0,-1, 1, Math.PI, 0);
    laser.lineTo(1, 1);
    laser.arc(0, 1, 1, 0, Math.PI);
    laser.closePath();

    return [laser];
}

export function createShieldPath(){
    let shield = new Path2D();
    shield.arc(0,0,10,0,Math.PI*2);
    shield.closePath();
    return [shield]
}

export function createFalconPath(){
    let basePath = new Path2D();
    basePath.arc(0,1,4,-Math.PI*0.2,Math.PI*1.2);
    basePath.moveTo(-3.236, -1.351);
    basePath.lineTo(-1.5,-4.6);
    basePath.lineTo(-0.5, -4.6);
    basePath.lineTo(-0.5, -1.4);
    basePath.lineTo(0.5,-1.4);
    basePath.lineTo(0.5,-4.6);
    basePath.lineTo(1.5, -4.6);
    basePath.lineTo(3.236, -1.351);
    basePath.lineTo(3.236,-2);
    basePath.lineTo(4,-2);
    basePath.lineTo(4,1);
    basePath.moveTo(-3.236, -1.351);
    basePath.closePath();

    let firstDetailLayer = new Path2D();
    firstDetailLayer.moveTo(0,1);
    firstDetailLayer.arc(0,1,4,Math.PI/4,3*Math.PI/4);
    firstDetailLayer.lineTo(0,1);
    firstDetailLayer.moveTo(-4,0.5);
    firstDetailLayer.rect(-4,0.5,8,1);
    firstDetailLayer.moveTo(-0.5,-1.351);
    firstDetailLayer.rect(-0.5, -1.351, 1,2);
    firstDetailLayer.moveTo(-1.25, -2);
    firstDetailLayer.arc(-1.75, -2,0.5, 0, Math.PI*2);
    firstDetailLayer.moveTo(-0.75, -3.25);
    firstDetailLayer.arc(-1.25, -3.25,0.5, 0, Math.PI*2);
    firstDetailLayer.moveTo(2.25, -2);
    firstDetailLayer.arc(1.75, -2,0.5, 0, Math.PI*2);
    firstDetailLayer.moveTo(1.75, -3.25);
    firstDetailLayer.arc(1.25, -3.25,0.5, 0, Math.PI*2);
    firstDetailLayer.closePath();

    let secondDetailLayer = new Path2D();
    secondDetailLayer.moveTo(0,1.75);
    secondDetailLayer.arc(0,1.5,3,(Math.PI/4)+0.03,(3*Math.PI/4)-0.03);
    secondDetailLayer.lineTo(0, 1.75);
    secondDetailLayer.moveTo(-3.5,0.7);
    secondDetailLayer.rect(-3.5,0.7,7,0.6);
    secondDetailLayer.closePath();

    let thirdDetailLayer = new Path2D();
    thirdDetailLayer.moveTo(1.5,1);
    thirdDetailLayer.arc(0,1,1.5,0,Math.PI*2);
    thirdDetailLayer.closePath();

    return [basePath, firstDetailLayer, secondDetailLayer, thirdDetailLayer];
}