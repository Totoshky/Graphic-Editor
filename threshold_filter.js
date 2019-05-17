"use strict";

let thresholdElem = document.getElementById('threshold');
thresholdElem.addEventListener("click", function () {
    let nwindow = window.open('', 'histogram', 'toolbar=0,location=30,menubar=0,width=550,height=580');
    draw(nwindow, 1);
});

function binarize(from, to) {
    let t0 = performance.now();
    load();
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const rStep = 0.2126,
        gStep = 0.7152,
        bStep = 0.0722;

    for(let y = 0; y < pixels.height; y++){
        for(let x = 0; x < pixels.width; x++){
            let i = (y * 4) * pixels.width + x * 4;
            let r = pixels.data[i];
            let g = pixels.data[i + 1];
            let b = pixels.data[i + 2];
            pixels.data[i + 3] = 255;

            let val = rStep * r + gStep * g + bStep * b;

            if (val > from && val < to) {
                pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
            }
            else {
                pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 0;
            }
        }
    }

    ctx.putImageData(pixels, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();
    ctx.drawImage(img, 0, 0);
    cPush();
    let t1 = performance.now();

    return t1 - t0;
}