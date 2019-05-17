"use strict";

const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

document.getElementById("download").onclick = () => {
    const canvas = document.getElementById("canvas"),
        dataURL = canvas.toDataURL('image/*');
    downloadURI(dataURL, 'image');
}