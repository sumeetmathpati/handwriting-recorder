var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth/2 - 70;
canvas.height = window.innerHeight/2 - 10;

// Canvas context.
var c = canvas.getContext('2d');
// Recording on or not.
var recording = false;
// Painting and recording interval.
var paintInterval = undefined;
var recordInterval = undefined;
// Elements
var mouseposDisplay = document.getElementById("mousepos");
var statusDisplay = document.getElementById("status");
// Mouse
mousedown = false;
// Variables
var i = 0;
var recordedData = [];
var canvasMousepos;
var firstPoint = true;
var lineWidth = 4;
var color = '000000';

function setColor(c) {
    color = c;
}

function zoomIn() {
    canvas.height = canvas.height*(1.2);
    canvas.width = canvas.width*(1.2);
    c.scale(1.2, 1.2);   
}

function zoomOut() {
    canvas.height = canvas.height*(0.8333);
    canvas.width = canvas.width*(0.8333);
    c.scale(0.8333, 0.8333);
}


// Erase the canvas.
function erase() {

    if (recording == true) {
        startRec();
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
}

// Initialize the painting interval.
function startPaint() {
    i = 0
    erase();
    
    paintInterval = setInterval(paint, 20);
}

// Initialize the recording interval.
function startRec() {

    if (recording == false) {
        recordedData = [];
        recording = true;
        statusDisplay.innerHTML = "Recording";
        recordInterval = setInterval(record, 20);
    } else {
        recording = false;
        statusDisplay.innerHTML = "";
        clearInterval(recordInterval);
        console.log(recordedData);
    }
}

// Get mouse location on canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    // alert(mousePos.x + ',' + mousePos.y);
    canvasMousepos = [mousePos.x, mousePos.y]
    mouseposDisplay.innerHTML = mousePos.x + ',' + mousePos.y;
}, false);

canvas.addEventListener("mousedown", function (evt) {
    mousedown = true;
    firstPoint = true;
    // var mousePos = getMousePos(canvas, evt);
    // alert(mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener("mouseup", function (evt) {
    mousedown = false;
    // var mousePos = getMousePos(canvas, evt);
    // alert(mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener("mouseleave", function (evt) {
    mousedown = false;
}, false);

// Recording interval
function record() {
    if (mousedown) {
        if (firstPoint) {
            recordedData.push([canvasMousepos[0], canvasMousepos[1], 1, color]);
            firstPoint = false;

            // Draw while recording.
            c.closePath();
            c.beginPath();
            c.strokeStyle = '#'.concat(color);
            c.moveTo(canvasMousepos[0], canvasMousepos[1])
        } else {
            recordedData.push([canvasMousepos[0], canvasMousepos[1], 0]);
            c.lineTo(canvasMousepos[0], canvasMousepos[1]);
            c.stroke();
        }
        console.log(recordedData[recordedData.length - 1]);
    } else {
        recordedData.push([-1]);
    }
}

// Painting interval
function paint() {
    if (i == recordedData.length) {
        clearInterval(paintInterval);
    }
    if (recordedData[i][0] != -1) {
        if (recordedData[i][2] == 1) {
            c.closePath();
            c.beginPath();
            c.strokeStyle = '#'.concat(recordedData[i][3]);
            c.moveTo(recordedData[i][0], recordedData[i][1])
        } else {
            c.lineTo(recordedData[i][0], recordedData[i][1]);
            c.stroke();
        }
    }

    i++;
    
    
}