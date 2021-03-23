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
let barc = new barcode("HOLA PIPI");
let ctx;

function onInput(e){
    background("#ffffff");
    barc = new barcode(e.target.value);
    barc.showTotalWidth(40,20,520,260);
}


function init(){
    let canvas = document.getElementById("canvas2");
    ctx = canvas.getContext("2d");
    background("#ffffff");
    const input = document.getElementById("code");
    input.addEventListener("input", onInput);
    ctx.fillStyle = "black";
    ctx.fillRect(100,100, 50, 50);
    ctx.fillRect(150.1,100, 100, 50);

}

function background(c){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

document.addEventListener('DOMContentLoaded', init);

