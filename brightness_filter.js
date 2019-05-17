"use strict";

let brightElem = document.getElementById('bright');
brightElem.addEventListener("click", function () {
    let delta = 30;
    let time = brightness(delta);

    updateContent(time);
});

function brightness(delta) {
    let t0 = performance.now();
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for(let y = 0; y < pixels.height; y++){
        for(let x = 0; x < pixels.width; x++){
            let i = (y * 4) * pixels.width + x * 4;
            pixels.data[i] += delta;
            pixels.data[i + 1] += delta;
            pixels.data[i + 2] += delta;
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