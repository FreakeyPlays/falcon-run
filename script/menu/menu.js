import { createButton } from "../objects/objects.js";

export function createMenu(contextObject){

    const BUTTON_SPACE = 3;
    const PADDING_BOTTOM = 3;
    const PADDING_RIGHT = 6;
    const MAX_SCALE = 40;
    const MIN_SCALE = 15;
    const BASIC_SCALE = 25;
    const BASIC_FONTSIZE = 1;
    let scale = 25;
    let fontSize = 1.5;

    let buttons = [];
    let context = contextObject.context;
    
    function addButton(text, action){
        buttons[buttons.length] = {
            btn: createButton(contextObject, scale, text, fontSize), 
            action
        };
        calcRatio();
        updateButtons();

        return buttons[buttons.length-1];
    }

    function updateButtons(){
        for(let i = 0; i < buttons.length; i++){
            let btn = buttons[i].btn;
            let x = window.innerWidth - (PADDING_RIGHT * scale);
            let y = window.innerHeight - i * (BUTTON_SPACE * scale) - (PADDING_BOTTOM * scale);

            btn.setScale(scale);
            btn.move(x, y);
            btn.setFontSize(fontSize);
        }
    }

    function drawTitle(){
        context.save();
        context.fillStyle = "#FFE81F";
        context.strokeStyle = "Black";
        context.textAlign = "center";
        context.lineWidth = 2.5;
        let fontSize = (window.innerWidth/1080) * 75;
        fontSize < 50 ? fontSize = 50 : fontSize = fontSize;
        let text = "Falcon\nrun".split("\n");
        let x = context.canvas.width/2;
        let y = context.canvas.height/2
        context.font =  fontSize + "px DistantGalaxy";
        for(let i = 0; i < text.length; i++){
            context.fillText(text[i], x, y + (i * fontSize));
            context.strokeText(text[i], x, y + (i * fontSize));
        }
        context.restore();
    }

    function draw(){
        for(let button of buttons){
            button.btn.draw();
        }
    }

    function calcRatio(){
        let aspectRatio = window.innerWidth/1080;
        let tmpScale = aspectRatio * BASIC_SCALE;
        scale = tmpScale >= MAX_SCALE ? MAX_SCALE : tmpScale <= MIN_SCALE ? MIN_SCALE : tmpScale;
        fontSize = BASIC_FONTSIZE * scale;
    }

    window.addEventListener("resize", () => {
        calcRatio();
        updateButtons();
    }, true);

    return{
        draw, addButton, drawTitle
    }
}