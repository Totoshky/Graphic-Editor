"use strict";

function array256(default_value) {
    let arr = [];
    for (let i=0; i<256; i++) { arr[i] = default_value; }
    return arr;
}

function draw(nwindow, type) {
    nwindow.document.head.innerHTML = "<style>\n" +
        "        section.range-slider {\n" +
        "            position: relative;\n" +
        "            width: 510px;\n" +
        "            height: 35px;\n" +
        "            text-align: center;\n" +
        "        }\n" +
        "\n" +
        "        section.range-slider input {\n" +
        "            pointer-events: none;\n" +
        "            position: absolute;\n" +
        "            overflow: hidden;\n" +
        "            left: 0;\n" +
        "            top: 15px;\n" +
        "            width: 510px;\n" +
        "            outline: none;\n" +
        "            height: 18px;\n" +
        "            margin: 0;\n" +
        "            padding: 0;\n" +
        "        }\n" +
        "\n" +
        "        section.range-slider input::-webkit-slider-thumb {\n" +
        "            pointer-events: all;\n" +
        "            position: relative;\n" +
        "            z-index: 1;\n" +
        "            outline: 0;\n" +
        "        }\n" +
        "\n" +
        "        section.range-slider input::-moz-range-thumb {\n" +
        "            pointer-events: all;\n" +
        "            position: relative;\n" +
        "            z-index: 10;\n" +
        "            -moz-appearance: none;\n" +
        "            width: 9px;\n" +
        "        }\n" +
        "\n" +
        "        section.range-slider input::-moz-range-track {\n" +
        "            position: relative;\n" +
        "            z-index: -1;\n" +
        "            background-color: rgba(0, 0, 0, 1);\n" +
        "            border: 0;\n" +
        "        }\n" +
        "        section.range-slider input:last-of-type::-moz-range-track {\n" +
        "            -moz-appearance: none;\n" +
        "            background: none transparent;\n" +
        "            border: 0;\n" +
        "        }\n" +
        "        section.range-slider input[type=range]::-moz-focus-outer {\n" +
        "            border: 0;\n" +
        "        }\n" +
        "    </style>";
    nwindow.document.body.innerHTML = "<canvas id='canv' height='500' width='500'></canvas>\n" +
        "    <section class='range-slider'>\n" +
        "        <span class='rangeValues'></span>\n" +
        "        <input value='0' min='0' max='255' step='1' type='range'>\n" +
        "        <input value='255' min='0' max='255' step='1' type='range'>\n" +
        "    </section>\n" +
        "<p style='text-align: center'></p><button id='append'>Применить</button>";

    let canvas = document.getElementById("canvas");
    let canv = nwindow.document.getElementById('canv');
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);


    function getVals(){
        let parent = this.parentNode;
        let slides = parent.getElementsByTagName("input");
        let slide1 = parseFloat( slides[0].value );
        let slide2 = parseFloat( slides[1].value );
        if( slide1 > slide2 ){ let tmp = slide2; slide2 = slide1; slide1 = tmp; }

        let displayElement = parent.getElementsByClassName("rangeValues")[0];
        displayElement.innerHTML = slide1 + " - " + slide2;
    }

    nwindow.onload = function(){
        let sliderSections = document.getElementsByClassName("range-slider");
        for( let x = 0; x < sliderSections.length; x++ ){
            let sliders = sliderSections[x].getElementsByTagName("input");
            for( let y = 0; y < sliders.length; y++ ){
                if( sliders[y].type ==="range" ){
                    sliders[y].oninput = getVals;
                    sliders[y].oninput();
                }
            }
        }
    };

    let vals = array256(0);

    for(let y = 0; y < pixels.height; y++){
        for(let x = 0; x < pixels.width; x++){
            let i = (y * 4) * pixels.width + x * 4;
            vals[pixels.data[i]]++;
        }
    }

    let pixelData = {};

    for(let k = 0; k < 256; k++) {
        let key = k.toString();
        let value = vals[k];
        pixelData[key] = value;
    }

    let myBarchart = new Barchart(
        {
            canvas:canv,
            padding:0,
            gridScale:30,
            gridColor:"#fffffb",
            data:pixelData,
            colors:["#000000"]
        }
    );

    myBarchart.draw();

    let appendElem = nwindow.document.getElementById('append');
    appendElem.addEventListener("click", function () {
        let v = countValues(nwindow);
        let from = v[0].value;
        let to = v[1].value;
        if(type === 0) {
            let time = grayscale(from, to);
            updateContent(time);
        }
        if(type === 1) {
            let time = binarize(from, to);
            updateContent(time);
        }
    })
}

function countValues(nwindow) {
    let values = [];
    values = nwindow.document.getElementsByTagName('input');
    return values;
}

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}

let Barchart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    this.draw = function(){
        let maxValue = 0;
        for (let categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ]);
        }

        let canvasActualHeight = this.canvas.height - this.options.padding * 2;
        let canvasActualWidth = this.canvas.width - this.options.padding * 2;

        let gridValue = 0;
        while (gridValue <= maxValue){
            let gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );

            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();

            gridValue+=this.options.gridScale;
        }

        let barIndex = 0;
        let numberOfBars = Object.keys(this.options.data).length;
        let barSize = (canvasActualWidth)/numberOfBars;

        for (let categ in this.options.data){
            let val = this.options.data[categ];
            let barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            drawBar(
                this.ctx,
                this.options.padding + barIndex * barSize,
                this.canvas.height - barHeight - this.options.padding,
                barSize,
                barHeight,
                this.colors[barIndex%this.colors.length]
            );

            barIndex++;
        }

    }
};