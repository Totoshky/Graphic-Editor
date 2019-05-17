"use strict";

let element = document.getElementById('noise');
element.addEventListener('click', function () {
    let radius = 4;
    let time = noiseReduction(radius);
    updateContent(time);
});

function noiseReduction(radius) {
    let t0 = performance.now();

    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let width = pixels.width;
    let height = pixels.height;
    let output = pixels.data;

    function median(numbers) {
        let median = 0,
            numsLen = numbers.length;
        numbers.sort();

        if (numsLen % 2 === 0) {
            median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
        } else {
            median = numbers[(numsLen - 1) / 2];
        }
        return median;
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4;
            let bufferRed = [];
            let bufferGreen = [];
            let bufferBlue = [];
            let bufferAlpha = [];
            for (let cx = 0; cx < radius; cx++) {
                for (let cy = 0; cy < radius; cy++) {
                    if (x + cx < width && y + cy < height) {
                        let idx = (x + cx + (y + cy) * width) * 4;
                        bufferRed.push(pixels.data[idx]);
                        bufferGreen.push(pixels.data[idx + 1]);
                        bufferBlue.push(pixels.data[idx + 2]);
                        bufferAlpha.push(pixels.data[idx + 3]);
                    }
                }
            }
            output[index] = median(bufferRed.sort());
            output[index + 1] = median(bufferGreen.sort());
            output[index + 2] = median(bufferBlue.sort());
            output[index + 3] = median(bufferAlpha.sort());
        }
    }

    var imageData = new ImageData(output, width, height);
    ctx.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();
    ctx.drawImage(img, 0, 0);
    cPush();

    let t1 = performance.now();

    return t1 - t0;
}