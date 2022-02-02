var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth / 2 - 70;
canvas.height = window.innerHeight / 2 - 10;

var c = canvas.getContext('2d');

// DOM elements
var mousePosDisplay = document.getElementById("mousepos");
var statusDisplay = document.getElementById("status");

// Variables
var canvasMousepos = [-1, -1];
var mousedown = false;
var lastPoint = [-1, -1];
var paintInterval;
var recordInterval;
var frameIndex;
var recording = false;
var painting = false;
var recordedData = []
var firstPoint = false;

// Canvas configuration
c.lineWidth = 2;
c.lineCap = "round";

function printLastPoint() {
    console.log(lastPoint);
}

// Erase the canvas.
function erase() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

// Get mouse location on canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// When mouse is hovered over the canvas.
canvas.addEventListener("mousemove", function (evt) {

    var mousePos = getMousePos(canvas, evt);
    canvasMousepos = [mousePos.x, mousePos.y]

    mousePosDisplay.innerHTML = mousePos.x + ',' + mousePos.y;

    // Save the last point only if 
    // mousedown.
    if (mousedown == true) {
        lastPoint = [mousePos.x, mousePos.y];
        c.lineTo(lastPoint[0], lastPoint[1])
        c.stroke();
        // recordedData.push(lastPoint)
        // printLastPoint()
    }


}, false);

// When mouse button is down on canvas.
canvas.addEventListener("mousedown", function (evt) {
    console.log('Mousedown')

    var mousePos = getMousePos(canvas, evt);
    canvasMousepos = [mousePos.x, mousePos.y]

    lastPoint = [mousePos.x, mousePos.y];
    mousedown = true;
    firstPoint = true;
    // recordedData.push(lastPoint)
    // printLastPoint();

    c.beginPath();
    c.moveTo(mousePos.x, mousePos.y)

}, false);


// When pressed mouse button is upped.
canvas.addEventListener("mouseup", function (evt) {
    console.log('Mouseup')
    mousedown = false;
}, false);

// When mouse enters the canvas.
canvas.addEventListener("mouseenter", function (evt) {
    console.log('Mouseenter')
}, false);

function startRec() {

    if (recording == true) {
        recording = false;
        clearInterval(recordInterval);
        console.log(recordedData);
        statusDisplay.innerHTML = '';
    } else {
        recording = true;
        recordInterval = setInterval(record, 33);
        statusDisplay.innerHTML = 'Recording';
    }
}

function record() {
    if (firstPoint == true) {
        recordedData.push([lastPoint[0], lastPoint[1], 1]);
        firstPoint = false;
    } else {
        recordedData.push(lastPoint);
    }

}

function startPaint() {
    if (painting == true) {
        painting = false;
        clearInterval(paintInterval);
        statusDisplay.innerHTML = '';
    } else {
        erase();
        painting = true;
        frameIndex = 0;
        paintInterval = setInterval(paint, 33)
        statusDisplay.innerHTML = 'Painting';
    }
}

function paint() {

    frame = recordedData[frameIndex];

    if (frame[0] != -1) {
        if (frame[2] == 1) {
            c.beginPath()
            c.moveTo(...frame);
        } else {
            c.lineTo(...frame);
            c.stroke();
        }
    }
    
    frameIndex++;

    if (frameIndex == recordedData.length) {
        clearInterval(paintInterval);
    }
}