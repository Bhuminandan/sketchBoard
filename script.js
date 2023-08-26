// Getting DOM Elements
const pencilCont = document.querySelector(".pencil-container");
const eraserCont = document.querySelector(".eraser-container");
const undoEle = document.querySelector(".pencil-container img");
const redoEle = document.querySelector(".pencil-container img");
const textlEle = document.querySelector(".pencil-container img");
const stickylEle = document.querySelector(".pencil-container img");
const downloadEle = document.querySelector(".pencil-container img");
const uploadEle = document.querySelector(".pencil-container img");
const body = document.querySelector("body");
const canvas = document.querySelector("canvas");

isPencilActive = false;
pencilCont.addEventListener("click", handlePencilCont)

isEraserActive = false;
eraserCont.addEventListener("click", handleEaraserCont)


function handlePencilCont() {
    if (!isPencilActive) {
        if (isEraserActive) {
            handleEaraserCont();
        }
        changeCursorStyle("pencil", false);
        pencilCont.classList.add("active-tool-container");
        isPencilActive = true;
    } else {
        changeCursorStyle("", true);
        pencilCont.classList.remove("active-tool-container");
        isPencilActive = false;
    }
}


function handleEaraserCont() {
    if (!isEraserActive) {
        if (isPencilActive) {
            handlePencilCont();
        }
        changeCursorStyle("eraser", false);
        eraserCont.classList.add("active-tool-container");
        isEraserActive = true;
    } else {
        changeCursorStyle("", true);
        eraserCont.classList.remove("active-tool-container");
        isEraserActive = false;
    }
}


function changeCursorStyle(clikedItem, convertToNormal) {
    if (convertToNormal) {
        body.style.cursor = `default`;
    } else {
        body.style.cursor = `url('./assets/cursor images/${clikedItem}.png'), auto`;
    }
}