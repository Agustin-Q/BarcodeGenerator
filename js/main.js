class glyph{
    constructor(code){
        this.pattern = Array.from(code128Pattern[code]);
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
    }

    show(x,y,w,h){
        let endPos = 0;
        let sum = 0;
        let currBar =1;
        for(let i = 0; i<this.pattern.length;i++){
            this.pattern[i] == 0 ? ctx.fillStyle = this.backgroundColor : ctx.fillStyle = this.foregroundColor;
            if (i == this.pattern.length -1||this.pattern[i+1]!= currBar){
                ctx.fillRect(x+w*i-sum*w,y,w*(sum+1),h);
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

    show(x,y,w,h){
        let pos = x;
        for(let i =0; i<this.glyphs.length; i++){
            pos = this.glyphs[i].show(pos, y, w, h)
        }
    }

    showTotalWidth(x,y,totWidth,h){
        let len = this.chars.length * 11 + 11*3+2;
        this.show(x,y,totWidth/len,h);
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
    barc.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins);
    showSVG("SVGContainer");
}


function init(){
    ctx = new C2S(600,150);
    const input = document.getElementById("code");
    input.addEventListener("input", onInput);
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    inputWidth.value = ctx.canvas.width;
    inputHeight.value = ctx.canvas.height;
    inputWidth.addEventListener("input", resize);
    inputHeight.addEventListener("input", resize);
    drawBarcode();
    
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

function showSVG(id){
    let cont = document.getElementById(id);
    cont.innerHTML = "";
    cont.innerHTML = ctx.getSerializedSvg(true);
}

document.addEventListener('DOMContentLoaded', init);

