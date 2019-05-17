"use strict";

let elemSharp = document.getElementById('conv');
elemSharp.addEventListener("click", function () {
    let inputs = document.getElementById('matrix').getElementsByTagName('input');
    let weights = [];
    for(let i = 0; i < inputs.length; i++) {
        weights.push(parseFloat(inputs[i].value));
    }
    let time = convolution(weights);
    updateContent(time);
});

function convolution(weights) {
    let t0 = performance.now();
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side/2);

    let src = pixels.data;

    let width = pixels.width;
    let height = pixels.height;

    let output = new ImageData(pixels.data, width, height);
    let dest = output.data;

    let alphaFac = 1;

    for(let y = 0; y < pixels.height; y++){
        for(let x = 0; x < pixels.width; x++){
            let sy = y;
            let sx = x;
            let i = (y * 4) * pixels.width + x * 4;
            let r = 0, g = 0, b = 0, a = 0;
            for (let cy=0; cy<side; cy++) {
                for (let cx=0; cx<side; cx++) {
                    let scy = sy + cy - halfSide;
                    let scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                        let srcOff = (scy*width+scx)*4;
                        let wt = weights[cy*side+cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff+1] * wt;
                        b += src[srcOff+2] * wt;
                        a += src[srcOff+3] * wt;
                    }
                }
            }
            dest[i] = r;
            dest[i + 1] = g;
            dest[i + 2] = b;
            dest[i + 3] = a + alphaFac*(255-a);

        }
    }
    let imageData = new ImageData(dest, width, height);
    ctx.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();
    ctx.drawImage(img, 0, 0);
    cPush();

    let t1 = performance.now();
    return t1 - t0;
}