var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth/2 - 70;
canvas.height = window.innerHeight/2 - 10;

var c = canvas.getContext('2d');

// Elements
var mouseposDisplay = document.getElementById("mousepos");
var statusDisplay = document.getElementById("status");

var recordedData = []
var mousedown = false;

var playInterval = undefined;
var recordInterval = undefined;
var frameIndex = 0;
var firstPoint = false;

var recording = false;
var playing = false;

var canvasMousepos = [-1, -1];
var firstPoint = true;
var lineWidth = 3;
var color = '000000';
var canvasData = c.getImageData(0, 0, canvas.width, canvas.height);
var objectType = 0; // 0 for pen, 1 for highlighter, 2 for eraser.

// Convas configuration
c.lineWidth = lineWidth;
c.lineCap = 'round';

// Set objectType
function setObjectType(t) {
    objectType = t;
}

// Set color
function setColor(col) {
    c.strokeStyle = '#' + col;
}

// Erase the canvas.
function erase() {

    if (recording == true) {
        startRec();
    }
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
    mouseposDisplay.innerHTML = mousePos.x + ',' + mousePos.y;
    
    if (mousedown) {
        // recordedData.push(canvasMousepos);
        c.lineTo(canvasMousepos[0], canvasMousepos[1]);
        c.stroke();
    }
    
}, false);

// When mouse button is down on canvas.
canvas.addEventListener("mousedown", function (evt) {
    mousedown = true;
    firstPoint = true;

    // Use current point.
    var mousePos = getMousePos(canvas, evt);
    canvasMousepos = [mousePos.x, mousePos.y]

    c.stroke();
    c.beginPath();

}, false);

// When pressed mouse button is upped.
canvas.addEventListener("mouseup", function (evt) {
    mousedown = false;

    c.stroke();
    c.beginPath();
}, false);

// When mouse leaves the canvas.
canvas.addEventListener("mouseenter", function (evt) {
    // mousedown = false;
    c.beginPath();
}, false);


// When record button is clicked.
function startRec() {

    if (recording == true) {
        recording = false;
        clearInterval(recordInterval);
        console.log('Recording closed');
    } else {
        recording = true;
        recordInterval = setInterval(record, 33);
        console.log(recordedData);
    }
}

function record() {
    if (firstPoint == true) {
        firstPoint = false;
        recordedData.push(canvasMousepos.push(1));
    } else {
        recordedData.push(canvasMousepos);
    }
    
}

function startPlay() {

    if (playing == false) {
        playing = true;
        erase();
        frameIndex = 0;
        playInterval = setInterval(play, 33)
    } else {
        playing = false;
        clearInterval(playInterval);
        console.log('Playing closed');
    }

}

function play() {
    frame = recordedData[frameIndex];
    if (frame[0] != -1) {
        if (frame[2] == 1) {
            c.beginPath()
            c.moveTo(frame[0], frame[1])
        } else {
            c.lineTo(frame[0], frame[1]);
            c.stroke();
        }
    }

    frameIndex++;
    if(frameIndex == recordedData.length) {
        startPlay();
    }

}