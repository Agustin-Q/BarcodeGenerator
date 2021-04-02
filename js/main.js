let barc = new barcode("Hello World");
let ctx;
let barcodeIndex = 0;

document.addEventListener('DOMContentLoaded', init);

function init(){
    const input = document.getElementById("textareaCodes");
    ctx = document.getElementById("canvas").getContext("2d");
    input.addEventListener("input", onInput);
    input.value = "Your Codes Here!";
    document.getElementById("saveButton").addEventListener("click",savePDF);
    document.getElementById("prevBarcode").addEventListener("click",prevBarcode);
    document.getElementById("nextBarcode").addEventListener("click",nextBarcode);
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    inputWidth.value = 150;
    inputHeight.value = 100;
    ctx.canvas.width = window.innerWidth*0.7;
    ctx.canvas.height = ctx.canvas.width * inputHeight.value / inputWidth.value;
    inputWidth.addEventListener("input", resize);
    inputHeight.addEventListener("input", resize);
    window.addEventListener('resize', resize);
    drawBarcode();  
}

function onInput(e){    
    drawBarcode();
}

function drawBarcode(){
    if(barcodeIndex > getCodes().length - 1){
        barcodeIndex = getCodes().length - 1;
    }
    barc = new barcode(getCodes()[barcodeIndex]);
    background("#ffffff");
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let margins = 0.05;
    barc.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,ctx);
    let mmToPx = w/document.getElementById("width").value;
    ctx.fillStyle = "#FFFFFF";
    let fontSizeInPt = 16;
    let ptToMm = 0.3527;
    let fontSizeInPX = fontSizeInPt*ptToMm*mmToPx;
    ctx.font = `${fontSizeInPX}px helvetica`;
    //let bw = 4*barc.str.length;
    let bw = ctx.measureText(barc.str).width + 1*mmToPx;
    ctx.fillRect(w/2-(bw/2), h-fontSizeInPt*ptToMm*mmToPx, bw,fontSizeInPt*ptToMm*mmToPx);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#000000";
    ctx.fillText(barc.str, w/2,h);
}



function resize(e){
    let w = document.getElementById("width").value;
    let h = document.getElementById("height").value;
    ctx.canvas.width = window.innerWidth*0.7;
    ctx.canvas.height = ctx.canvas.width * h / w;
    drawBarcode();
}

function background(c){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillRect(x,y,w,h){
    this.rect(x,y,w,h,"F");
}



function savePDF(){
    const { jsPDF } = window.jspdf;

    const inputWidth = Number(document.getElementById("width").value);
    const inputHeight = Number(document.getElementById("height").value);
    let orientation = "landscape";
    if(inputWidth < inputHeight){
        orientation = "portrait";
    }
    const doc = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: [inputWidth, inputHeight]
    });    
    doc.fillRect = fillRect;

    let codes = getCodes();
    for (let code of codes){
        makeLabel(doc,code,inputWidth,inputHeight);
        doc.addPage();
    }
    doc.deletePage(codes.length +1); //remove last empty page
    let docName = `${codes[0]}.pdf`;
    if(codes.length>1){
        docName = `${codes[0]}-${codes[codes.length-1]}.pdf`
    }
    doc.save(docName);
}

function makeLabel(doc, str,w,h){

    let margins = 0.05;
    let bar = new barcode(str);
    bar.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,doc);
    let opt = {
        align: "center",
        baseline: "bottom",
    }
    doc.setFillColor(255);
    let fontSizeInPt = 16;
    let ptToMm = 0.3527;
    let bw = ctx.measureText(bar.str).width * document.getElementById("width").value / ctx.canvas.width + 1;
    doc.rect(w/2-bw/2, h-fontSizeInPt*ptToMm, bw,fontSizeInPt*ptToMm,"F");
    console.log(doc.getFont());
    doc.text(bar.str, w/2, h, opt);
}

function getCodes(){
    let text = document.getElementById("textareaCodes").value;
    let codes = text.split("\n");
    return codes;
}

function nextBarcode(){
    if(barcodeIndex<getCodes().length-1){
        barcodeIndex++;
    }
    drawBarcode();
}

function prevBarcode(){
    if(barcodeIndex>0){
        barcodeIndex--;
    }
    drawBarcode();
}