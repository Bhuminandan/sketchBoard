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
let currentColor = "white" // Setting initial color
let currentPenWidth = 5; // setting initial width of the pen
let currentEeaserWidth = 20; // Setting initial width of th eraser
let undoRedoCache = [canvas.toDataURL()]; // Making the cache array to store 
// the current progress for workin of the redo undo and setting the current img for first reference
let currentUrlIndex = 0; // for current img referece

// Variable to maintain the current state of the pencil
isPencilActive = false;
pencilCont.addEventListener("click", () => handlePencilCont(true));

// Variable to maintain the current state of the earaer
isEraserActive = false;
eraserCont.addEventListener("click", handleEaraserCont);


// function to handle when clicked on the pencil
function handlePencilCont() {
    if (!isPencilActive) { // if pencil is active then enter this loop (! isPencilActive === true);
        if (isEraserActive) { // checking when user clicked on the pencil is the eraser active or not, 
            // if it is active we are calling function and making it inactive
            handleEaraserCont();
            isEraserActive = false;
        }
        // setting pencil properties dropdown as block
        pencilOptionsDiv.style.display = "block";
        isPainting = false;
        changeCursorStyle("pencil", false); // Changing the cursor into pencil img
        pencilCont.classList.add("active-tool-container"); // giving styles of active to the pencil
        isPencilActive = true;
    } else {
        // Doing everything opposite what we have did ubove when user clickes again
        pencilOptionsDiv.style.display = "none";
        changeCursorStyle("", true);
        pencilCont.classList.remove("active-tool-container");
        isPencilActive = false;
    }
}

// Same way handling the earaser click like we handled the pencil click
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

// function to toggle the style of the cusor (for pencil and eraser click)
function changeCursorStyle(clikedItem, convertToNormal) {
    if (convertToNormal) {
        body.style.cursor = `default`;
    } else {
        body.style.cursor = `url('./assets/cursor images/${clikedItem}.png'), auto`;
    }
}

// Adding eventlisteners to each pencil color option
pencilColorArr.forEach((singleEle) => {
    singleEle.addEventListener("click", (e) => {
        e.stopPropagation();
        isPencilActive = false;
        currentColor = e.target.id;
        handlePencilCont(false);
    })
})


// Adding eventlisteners to the range input for stroke width of the pencil
rangeInputEle.addEventListener("change", (e) => {
    e.stopPropagation();
    isPencilActive = true;
    currentPenWidth = e.target.value;
    handlePencilCont(false);
})

// Adding eventlisteners to the range input for stroke width of the eraser
easerRangeInputEle.addEventListener("change", (e) => {
    e.stopPropagation();
    isEraserActive = true;
    currentEeaserWidth = e.target.value;
    handleEaraserCont(false);
})

// Handling the download funcitonality
downloadCont.addEventListener("click", () => {
    let url = canvas.toDataURL("image/jpeg"); // Specify the MIME type here
    const blob = dataURItoBlob(url); // seting the url to to the custome obj to convert the url in to blob
    const link = document.createElement("a"); // creating the anchor element
    link.href = URL.createObjectURL(blob); // Convert blob to downloadable URL
    link.download = "whiteboard.jpeg";
    // Trigger the download
    link.click();
});


// Custome function that takes and URL and converts it into blob
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

// Triggering the inputfile element when someone click on the img icon
uploadCont.addEventListener("click", () => {
    fileInput.click();
})


// handling the uploaded file by attaching change eventlistener
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) { // Additional check for file input
        const reader = new FileReader();
        reader.onload = (loadEvent) => { // when reader is ready trigger this
            const image = new Image(); // Creating instance of img
            image.src = loadEvent.target.result; // adding the url in event in img src
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

// Getting the 2D context in ctx
const ctx = canvas.getContext('2d');

// Function to draw on canvas
const draw = (e) => {

    if (!isPainting) {
        return;
    }
    // Checking if the isPainting is active and one of the pencil and easer is active
    if (isPainting && isPencilActive || isEraserActive) {
        ctx.lineWidth = lineWidth;
        if (isEraserActive) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = currentEeaserWidth;
        } else {
            ctx.lineWidth = currentPenWidth;
            ctx.strokeStyle = `${currentColor}`;
        }

        // Making the strokes smooth here
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Adjusting the offsets
        ctx.lineTo(e.clientX - canvasOffsetX - 0, e.clientY - -30);
        ctx.stroke();
    }
}

// On mousedown event & handler
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
    clearCanvas()
});

// On mousemove calling draw function
canvas.addEventListener('mousemove', draw);

// On mouseup event & handler
canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke(); // Adding the stroke till here
    ctx.beginPath(); // If we do not add this line pen takes the last stopped line as bigin path

    // converting the current state into url
    let url = canvas.toDataURL();
    // Pushing it in and array that maintains states (in our case it is undoredoCasche)
    undoRedoCache.push(url);
    // Setting the current index as the last state
    currentUrlIndex = undoRedoCache.length - 1;
});

// Undo click event handler
undoCont.addEventListener("click", () => {
    if (currentUrlIndex > 0) {
        currentUrlIndex--;
        renderUrlOnCanvas(currentUrlIndex);
    }

})

// redo click event handler
redoCont.addEventListener("click", () => {
    if (currentUrlIndex < undoRedoCache.length - 1) {
        currentUrlIndex++;
        renderUrlOnCanvas(currentUrlIndex);
    }

})

// Function to render the state for undo and redo
function renderUrlOnCanvas(index) {
    let url = undoRedoCache[index];
    let img = new Image();
    img.src = url;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clearing the prev state before adding the new state
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// Function to remove any dropdowns when we start drawing on the canvas
function clearCanvas() {
    let pencilOptionsDiv = document.querySelector(".pencil-options-div");
    pencilOptionsDiv.style.display = "none";
    let eraserOptionsDiv = document.querySelector(".eraser-options-div");
    eraserOptionsDiv.style.display = "none";
}

// Handling the sitcky notes container
stickylCont.addEventListener("click", handleSticyCont);

// Initial count of the stickynotes for sticky notes heading 
let stikyNotesCount = 1;

// stiky notes handler
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

    // Minimize stiky notes functionality
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

    // delete stiky notes functionality
    remove.addEventListener("click", () => {
        wrapperDiv.remove();
        stikyNotesCount--;
    })

    let currstikyNote = wrapperDiv;
    let maoveIcon = wrapperDiv.querySelector(".movable-icon"); // icon to grab and drag the stiky note

    // Making the whole stiky note draggable
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

