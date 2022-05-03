export function createBackground(contextObject){
    const MAX_STARS = 200;
    const MAX_STAR_RADIUS = 2;
    const MIN_STAR_RADIUS = 0.2;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let context = contextObject.context;

    let starCollection = [];

    function createStars(){
        for(let i = 0; i < MAX_STARS; i++){
            let radius = getRandomValue(MIN_STAR_RADIUS, MAX_STAR_RADIUS);
            let x = getRandomValue(0, windowWidth);
            let y = getRandomValue(0, windowHeight);

            starCollection[i] = {
                x: x,
                y: y,
                radius
            }
        }
    }

    function createNewStars(){
        for(let i = 0; i < MAX_STARS; i++){
            if(!starCollection[i]){
                let radius = getRandomValue(MIN_STAR_RADIUS, MAX_STAR_RADIUS);
                let x = getRandomValue(0, windowWidth);
                let y = - getRandomValue(MAX_STAR_RADIUS, 250);
                
                starCollection[i] = {
                    x: x,
                    y: y,
                    radius
                }
            }
        }
    }

    function updateStars(){
        for(let i = 0; i < MAX_STARS; i++){
            starCollection[i].y += getRandomValue(0.05, 0.25);
            if(starCollection[i].y > windowHeight + MAX_STAR_RADIUS){
                starCollection[i] = undefined;
            }
        }
        createNewStars();
    }

    function drawStars(){
        updateStars();

        context.save();
        context.fillStyle = "#FFFFFF"
        for(let star of starCollection){
            context.beginPath();
            context.arc(star.x, star.y, star.radius, 0, Math.PI*2);
            context.fill();
            context.closePath();
        }
        context.restore();
    }

    function getRandomValue(minValue, maxValue){
        return Math.random() * (maxValue - minValue + 1) + minValue;
    }

    window.addEventListener("resize", () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        
        createStars();

    }, true);

    createStars();

    return {
        drawStars
    }
}