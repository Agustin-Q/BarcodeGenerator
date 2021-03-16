class glyph{
    constructor(code){
        this.pattern = Array.from(code128Pattern[code]);
        this.foregroundColor = 0;
        this.backgroundColor = 255;
    }

    show(x,y,w,h){
        noStroke();
        let endPos = 0;
        for(let i = 0; i<this.pattern.length;i++){
            this.pattern[i] == 0 ? fill(this.backgroundColor) : fill(this.foregroundColor);
            rect(x+w*i,y,w,h);
            endPos = x+w*(i+1);
        }
        //noFill();
        //stroke(255,0,0);
        //strokeWeight(w/2);
        //rect(x,y,w*this.pattern.length,h);
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
}

//--------------------------------------
let barc = new barcode("HOLA PIPI");
let input;

function onInput(){
    barc = new barcode(input.value());
}

function setup() {
    let cnv = createCanvas(1000, 500);
    cnv.parent("container");
    input = select("#code");
    input.changed(onInput);

}

function draw() {
    background(255);
    barc.show(50,50,4,350);
}

function windowResized() {
    
}

