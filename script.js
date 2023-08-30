// Getting DOM Elements
const pencilCont = document.querySelector(".pencil-container");
const eraserCont = document.querySelector(".eraser-container");
const textlCont = document.querySelector(".text-container");
const stickylCont = document.querySelector(".sticky-notes-container");
const undoCont = document.querySelector(".undo-container");
const redoCont = document.querySelector(".redo-container");
const downloadCont = document.querySelector(".download-container");
const uploadCont = document.querySelector(".upload-container");
const pencilOptionsDiv = document.querySelector(".pencil-options-div")
const earaserOptionsDiv = document.querySelector(".eraser-options-div")
const strokeWidthInput = document.querySelector(".pencil-width input");
const easerWidthInput = document.querySelector(".eraser-width input");
const pencilColorArr = document.querySelectorAll(".pencil-color-item");
const rangeInputEle = document.getElementById("vol");
const easerRangeInputEle = document.getElementById("easervol");
const fileInput = document.getElementById("fileInput");
const body = document.querySelector("body");
const canvas = document.querySelector("canvas");

// Global Varible
let currentColor = "white"
let currentPenWidth = 5;
let currentEeaserWidth = 20;
let undoRedoCache = [canvas.toDataURL()];
let currentUrlIndex = 0;


isPencilActive = false;
pencilCont.addEventListener("click", () => handlePencilCont(true))

isEraserActive = false;
eraserCont.addEventListener("click", handleEaraserCont)


function handlePencilCont() {
    if (!isPencilActive) {
        if (isEraserActive) {
            handleEaraserCont();
            isEraserActive = false;
        }
        pencilOptionsDiv.style.display = "block";
        isPainting = false;
        changeCursorStyle("pencil", false);
        pencilCont.classList.add("active-tool-container");
        isPencilActive = true;
    } else {
        pencilOptionsDiv.style.display = "none";
        changeCursorStyle("", true);
        pencilCont.classList.remove("active-tool-container");
        isPencilActive = false;
    }
}


function handleEaraserCont() {
    if (!isEraserActive) {
        if (isPencilActive) {
            handlePencilCont();
            isPencilActive = false;
        }
        earaserOptionsDiv.style.display = "block";
        isPainting = false;
        changeCursorStyle("eraser", false);
        ctx.strokeStyle = "#000000";
        eraserCont.classList.add("active-tool-container");
        isEraserActive = true;
    } else {
        earaserOptionsDiv.style.display = "none";
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


pencilColorArr.forEach((singleEle) => {
    singleEle.addEventListener("click", (e) => {
        e.stopPropagation();
        isPencilActive = false;
        currentColor = e.target.id;
        // pencilOptionsDiv.style.display = "none";
        handlePencilCont(false);
    })
})

rangeInputEle.addEventListener("change", (e) => {
    e.stopPropagation();
    isPencilActive = true;
    currentPenWidth = e.target.value;
    handlePencilCont(false);
})

easerRangeInputEle.addEventListener("change", (e) => {
    e.stopPropagation();
    isEraserActive = true;
    currentEeaserWidth = e.target.value;
    handleEaraserCont(false);
})


downloadCont.addEventListener("click", () => {
    let url = canvas.toDataURL("image/jpeg"); // Specify the MIME type here
    const blob = dataURItoBlob(url);
    const link = document.createElement("a");
    // Convert blob to downloadable URL
    link.href = URL.createObjectURL(blob);
    link.download = "whiteboard.jpeg";
    // Trigger the download
    link.click();
});

function dataURItoBlob(dataURI) {
    // Split the data URI into the MIME type and data
    const splitDataURI = dataURI.split(",");
    // Extract the MIME type (e.g., "image/jpeg")
    const mime = splitDataURI[0].match(/:(.*?);/)[1];
    // Convert the base64-encoded data to a Uint8Array
    const byteString = atob(splitDataURI[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    // Create a Blob from the Uint8Array
    return new Blob([uint8Array], { type: mime });
}


uploadCont.addEventListener("click", () => {
    fileInput.click();
})



fileInput.addEventListener("change", (event) => {
    console.log("inside upload")
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (loadEvent) => {
            const image = new Image();
            image.src = loadEvent.target.result;

            // When the image is loaded, draw it on the canvas
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
        };

        // Read the uploaded file as a data URL
        reader.readAsDataURL(file);
    }
});



// drawing js -----------------------------------------------

// Getting the offset values of canvas
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

// Setting the width and height of the canvas with subtracting any offset present
canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;


// Declaring global variables
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

const ctx = canvas.getContext('2d');

const draw = (e) => {

    if (!isPainting) {
        return;
    }

    if (isPainting && isPencilActive || isEraserActive) {
        ctx.lineWidth = lineWidth;
        if (isEraserActive) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = currentEeaserWidth;
        } else {
            ctx.lineWidth = currentPenWidth;
            ctx.strokeStyle = `${currentColor}`;
        }
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineTo(e.clientX - canvasOffsetX - 0, e.clientY - -30);
        ctx.stroke();
    }
}



canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
    clearCanvas()
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
    let url = canvas.toDataURL();
    undoRedoCache.push(url);
    currentUrlIndex = undoRedoCache.length - 1;
});


undoCont.addEventListener("click", () => {
    if (currentUrlIndex > 0) {
        currentUrlIndex--;
        renderUrlOnCanvas(currentUrlIndex);
    }

})

redoCont.addEventListener("click", () => {
    if (currentUrlIndex < undoRedoCache.length - 1) {
        currentUrlIndex++;
        renderUrlOnCanvas(currentUrlIndex);
    }

})


function renderUrlOnCanvas(index) {
    let url = undoRedoCache[index];
    let img = new Image();
    img.src = url;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


function clearCanvas() {
    let pencilOptionsDiv = document.querySelector(".pencil-options-div");
    pencilOptionsDiv.style.display = "none";
    let eraserOptionsDiv = document.querySelector(".eraser-options-div");
    eraserOptionsDiv.style.display = "none";
}

stickylCont.addEventListener("click", handleSticyCont);

let stikyNotesCount = 1;
function handleSticyCont() {
    let wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("wrapper-div");
    let stikyNoteInnerHtml = `<div class="stikynote-header">
                                        <p>Note NO. ${stikyNotesCount++}</p>
                                        <div class="movable-icon"></div>
                                            <div class="stiky-options">
                                            <div class="minimize-option"></div>
                                            <div class="close-option"></div>
                                            </div>
                                        </div>
                                        <textarea
                                            name="sticky-text"
                                            id="stickytext"
                                            cols="30"
                                            rows="10"
                                        ></textarea>`
    wrapperDiv.innerHTML = stikyNoteInnerHtml;
    body.append(wrapperDiv);
    let minimize = wrapperDiv.querySelector(".minimize-option");
    let remove = wrapperDiv.querySelector(".close-option");

    minimize.addEventListener("click", () => {
        let textarea = wrapperDiv.querySelector("#stickytext");
        if (textarea.style.display == 'none') {
            textarea.style.display = 'block';
            wrapperDiv.style.height = "150px";
        } else {
            textarea.style.display = 'none';
            wrapperDiv.style.height = "30px";
        }
    })

    remove.addEventListener("click", () => {
        wrapperDiv.remove();
        stikyNotesCount--;
    })

    let currstikyNote = wrapperDiv;
    let maoveIcon = wrapperDiv.querySelector(".movable-icon");
    maoveIcon.onmousedown = function (event) {
        // (1) prepare to moving: make absolute and on top by z-index
        currstikyNote.style.position = 'absolute';
        currstikyNote.style.zIndex = 10;

        // move it out of any current parents directly into body
        // to make it positioned relative to the body
        document.body.append(currstikyNote);

        // centers the currstikyNote at (pageX, pageY) coordinates
        function moveAt(pageX, pageY) {
            currstikyNote.style.left = pageX - currstikyNote.offsetWidth - -300 + 'px';
            currstikyNote.style.top = pageY - currstikyNote.offsetHeight - -200 + 'px';
        }

        // move our absolutely positioned currstikyNote under the pointer
        moveAt(event.pageX, event.pageY);

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // (2) move the currstikyNote on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // (3) drop the currstikyNote, remove unneeded handlers
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
        });

    };
}

