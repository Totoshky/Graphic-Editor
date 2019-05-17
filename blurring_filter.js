"use strict";

let blurElem = document.getElementById('blur');
blurElem.addEventListener("click", function () {
    let k = 1/9;
    let time = blurring(k);

    updateContent(time);
});

function blurring(k) {
    let t0 = performance.now();
    let weights = [];

    for(let i = 0; i < 9; i++) {
        weights.push(k);
    }
    convolution(weights);

    let t1 = performance.now();

    return t1 - t0;
}