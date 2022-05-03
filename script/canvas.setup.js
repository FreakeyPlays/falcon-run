export function getCanvas(id, width, height){
    const drawingWidth = width || window.innerWidth;
    const drawingHeight = height || window.innerHeight;
    
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById(id);
    /** @type {CanvasRenderingContext2D}*/
    let context = canvas.getContext("2d");
    canvas.width = drawingWidth;
    canvas.height = drawingHeight;

    let ctxObj = {};

    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.onresize = () => { resize() }
    resize();

    ctxObj.clearAndReset = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctxObj.canvas = canvas;
    ctxObj.context = context;

    return ctxObj;
}