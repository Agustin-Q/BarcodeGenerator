class glyph{
    constructor(code){
        this.pattern = Array.from(code128Pattern[code]);
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
    }

    show(x,y,w,h,showCtx){
        
        let endPos = 0;
        let sum = 0;
        let currBar =1;
        for(let i = 0; i<this.pattern.length;i++){
            if (this.pattern[i] == 0){ 
                showCtx.fillStyle ? showCtx.fillStyle = this.backgroundColor : showCtx.setFillColor(this.backgroundColor);
            }else{ 
                showCtx.fillStyle ? showCtx.fillStyle = this.foregroundColor : showCtx.setFillColor(this.foregroundColor);
            }
            if (i == this.pattern.length -1||this.pattern[i+1]!= currBar){
                showCtx.fillRect(x+w*i-sum*w,y,w*(sum+1),h);
                endPos = x+w*(i+1);
                sum =0;
                currBar = this.pattern[i+1];
            } else{
                sum++;
            }            
        }
        return endPos;
    }
}

class barcode{
    constructor(str){
        this.str = str;
        this.glyphs = [];
        this.chars = Array.from(str);
        this.glyphs.push(new glyph(104));
        for(let i =0 ; i < this.chars.length; i++){
            console.log(this.code128BValue(this.chars[i]));
            let g = new glyph(this.code128BValue(this.chars[i]));
            this.glyphs.push(g);
        }
        let check = this.calculateCheckDigit(str);
        this.glyphs.push(new glyph(check));
        this.glyphs.push(new glyph(108));
    }

    calculateCheckDigit(str){
        let sum = 104;
        for(let i = 0; i< str.length; i++){
            sum += this.code128BValue(str.charAt(i))*(i+1);
        }
        return sum % 103;
    }

    code128BValue(char){
        
        return code128BTale[char.charCodeAt(0)];
    }

    show(x,y,w,h,showCtx){
        let pos = x;
        for(let i =0; i<this.glyphs.length; i++){
            pos = this.glyphs[i].show(pos, y, w, h,showCtx)
        }
    }

    showTotalWidth(x,y,totWidth,h,showCtx){
        let len = this.chars.length * 11 + 11*3+2;
        this.show(x,y,totWidth/len,h,showCtx);
    }
}

//--------------------------------------
let barc = new barcode("Hello World");
let ctx;

function onInput(e){    
    barc = new barcode(e.target.value);
    drawBarcode();   
}

function drawBarcode(){
    background("#ffffff");
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let margins = 0.05;
    barc.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,ctx);
}


function init(){
    const input = document.getElementById("code");
    ctx = document.getElementById("canvas").getContext("2d");
    input.addEventListener("input", onInput);
    document.getElementById("saveButton").addEventListener("click",savePDF);
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    inputWidth.value = ctx.canvas.width;
    inputHeight.value = ctx.canvas.height;
    inputWidth.addEventListener("input", resize);
    inputHeight.addEventListener("input", resize);
    drawBarcode();
    //savePDF();
    
}

function resize(e){
    console.log("Resize!");
    console.log(e);
    ctx.canvas.width = document.getElementById("width").value;
    ctx.canvas.height = document.getElementById("height").value;
    drawBarcode();
    
}

function background(c){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


document.addEventListener('DOMContentLoaded', init);

function fillRect(x,y,w,h){
    this.rect(x,y,w,h,"F");
}



function savePDF(){
    const { jsPDF } = window.jspdf;

    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [150, 100]
    });    
    doc.fillRect = fillRect;

    //doc.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //doc.fillStyle = "#ffffff";
    //doc.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let w = 150;
    let h = 100;
    let margins = 0.05;
    barc.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,doc);
    //doc.fillStyle("#ffff00");
    //doc.fillRect(30,30,30,30);
    //doc.addImage(ctx.canvas, "SVG", 0,0,150,100);
    let opt = {
        align: "center",
        baseline: "top",
    }
    doc.setFillColor(255);
    doc.rect(w/2-40, h*0.94, 80,10,"F");
    doc.text(barc.str, w/2, h*0.94, opt);
    doc.save("test.pdf");
}