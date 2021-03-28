let barc = new barcode("Hello World");
let ctx;

document.addEventListener('DOMContentLoaded', init);

function init(){
    const input = document.getElementById("textareaCodes");
    ctx = document.getElementById("canvas").getContext("2d");
    input.addEventListener("input", onInput);
    document.getElementById("saveButton").addEventListener("click",savePDF);
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    inputWidth.value = 150;
    inputHeight.value = 100;
    ctx.canvas.width = window.innerWidth*0.9;
    ctx.canvas.height = ctx.canvas.width * inputHeight.value / inputWidth.value;
    inputWidth.addEventListener("input", resize);
    inputHeight.addEventListener("input", resize);
    drawBarcode();  
}

function onInput(e){    
    barc = new barcode(e.target.value.split("\n")[0]);
    drawBarcode();
}

function drawBarcode(){
    background("#ffffff");
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let margins = 0.05;
    barc.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,ctx);
}



function resize(e){
    let w = document.getElementById("width").value;
    let h = document.getElementById("height").value;
    ctx.canvas.width = window.innerWidth*0.9;
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
    doc.save("barcode.pdf");
}

function makeLabel(doc, str,w,h){

    let margins = 0.05;
    let bar = new barcode(str);
    bar.showTotalWidth(w*margins,w*margins,w-2*w*margins,h-2*w*margins,doc);
    let opt = {
        align: "center",
        baseline: "top",
    }
    doc.setFillColor(255);
    doc.rect(w/2-40, h-16*0.3527, 80,10,"F");
    doc.text(bar.str, w/2, h-16*0.3527, opt);
}

function getCodes(){
    let text = document.getElementById("textareaCodes").value;
    let codes = text.split("\n");
    return codes;
}