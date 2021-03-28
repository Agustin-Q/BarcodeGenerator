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
