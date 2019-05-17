"use strict";

let elem = document.getElementById('gray');
elem.addEventListener("click", function () {
    let nwindow = window.open('', 'histogram', 'toolbar=0,location=30,menubar=0,width=550,height=580');
    draw(nwindow, 0);
});

function grayscale(from, to) {
    let t0 = performance.now();
    load();
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for(let y = 0; y < pixels.height; y++){
        for(let x = 0; x < pixels.width; x++){
            let i = (y * 4) * pixels.width + x * 4;
            let avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
            if (avg > from && avg < to) {
                pixels.data[i] = avg;
                pixels.data[i + 1] = avg;
                pixels.data[i + 2] = avg;
                pixels.data[i + 3] = 255;
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