let defaultElem = document.getElementById("source");
defaultElem.addEventListener('click', load);

function load() {
    const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d");

    const img = new Image();
    img.src = fileUrl;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
}