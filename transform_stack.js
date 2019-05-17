let cPushArray = new Array();
let cStep = -1;
let ctx;

let elemUndo = document.getElementById('undo');
elemUndo.addEventListener("click", cUndo);

let elemRedo = document.getElementById('redo');
elemRedo.addEventListener("click", cRedo);

function cPush() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
    }
    cPushArray.push(document.getElementById('canvas').toDataURL());
}

function cUndo() {
    if (cStep > 0) {
        cStep--;
        let canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
}

function cRedo() {
    if (cStep < cPushArray.length-1) {
        cStep++;
        let canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
}