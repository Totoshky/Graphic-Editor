"use strict";

let fileUrl;

const read = (file) => {

    const doc = document,
        canvas = doc.getElementById('canvas'),
        canvasContext = canvas.getContext("2d"),
        img = new Image();

    fileUrl = URL.createObjectURL(file);
    img.src = fileUrl;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvasContext.drawImage(img, 0, 0, img.width, img.height);
        cPush();
    }
}

