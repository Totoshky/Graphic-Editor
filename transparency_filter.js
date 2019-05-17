"use strict";

let channel = document.getElementsByName("alpha");
for(let i = 0; i < channel.length; i++) {
    channel[i].addEventListener('change', function () {
        let time = transparent(i);
        updateContent(time);
    });
}

function transparent(num) {
    let t0 = performance.now();
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if(channel[num].checked) {
        for (let y = 0; y < pixels.height; y++) {
            for (let x = 0; x < pixels.width; x++) {
                let i = (y * 4) * pixels.width + x * 4;
                let avg = 127;
                pixels.data[i + num] = avg;
            }
        }
        ctx.putImageData(pixels, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL();
        ctx.drawImage(img, 0, 0);
        cPush();
    }
    else {
        const img = new Image();
        img.src = fileUrl;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        cPush();
    }
    let t1 = performance.now();

    return t1 - t0;
}