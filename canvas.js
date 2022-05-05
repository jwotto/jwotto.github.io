

var melody = { length: 16, height: 10, key: ["A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"] }

var notegrid = [];

var playHead = false;

//canvass size
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 105;

// grid size
var blockWidth = canvas.width / melody.length;
var blockHeight = canvas.height / melody.height;

//mouse cordinates
var mouse = { x: 0, y: 0 }

//get play button
var button = document.querySelector('#play-button');

//get slider value
var slider = document.getElementById("tempo-slider");


// get canvas elements
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//animate loop 60 fps
const refreshRate = 1000 / 60;

//synth tone.js elements
const synth = new Tone.Synth().toDestination();
const synthB = new Tone.Synth().toDestination();

//setup
createMelodyArray();
drawGrid();

window.setInterval(() => { drawLoop(); }, refreshRate);

function drawLoop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

// music loop
Tone.Transport.scheduleRepeat(time => { repeat(time); }, "16n");
function repeat(time) {
    for (let i = 0; i < melody.height; i++) {
        if (notegrid[playHead + (i * melody.length)] == false) {
            synth.triggerAttackRelease(melody.key[melody.height - 1 - i], "16n", time);
        }
    }
    playHead = (playHead + 1) % melody.length;
}

var colorOfset = 0;
function drawGrid() {

    for (let i = 0; i < melody.length; i++) {
        for (let j = 0; j < melody.height; j++) {

            ctx.beginPath();

            //color 4block
            if ((i % 4) == 0) { ctx.fillStyle = "#cccccc"; } else {
                ctx.fillStyle = "#d9d9d9";
            }
            //color play head
            if (i == ((playHead + (melody.length - 1)) % melody.length) && playClick === true) {
                ctx.fillStyle = "hsl(" + (360 / melody.length) * i + ",20%,70%)";
            }
            //when mouse is on block
            if (((mouse.x > (i * blockWidth)) && mouse.x < ((i + 1) * blockWidth)) && ((mouse.y > (j * blockHeight)) && mouse.y < ((j + 1) * blockHeight))) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "grey";
            }
            //get boom whacker make a function for this
            var nColor = (360 - (j * (360 / 7)) % 360);
            if (notegrid[(i + (j * melody.length))] == false) {
                ctx.fillStyle = "hsl(" + nColor + ",100%,50%)";
            }

            //draw grid rect
            ctx.fillRect(i * blockWidth, j * blockHeight, blockWidth - 1, blockHeight - 1);
            ctx.globalAlpha = 1;
        }
    }

}

//when canvas is  resized
window.onresize = (event) => { resizeCanvas(); drawGrid(); };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 105; //- header footer offset

    blockWidth = canvas.width / melody.length;
    blockHeight = canvas.height / melody.height;
}


//get back array nummer on hover
function getMelodyHoover() {
    for (let i = 0; i < melody.length; i++) {
        for (let j = 0; j < melody.height; j++) {
            if (((mouse.x > (i * blockWidth)) && mouse.x < ((i + 1) * blockWidth)) && ((mouse.y > (j * blockHeight)) && mouse.y < ((j + 1) * blockHeight))) {
                return i + (j * melody.length)

            }
        }
    }
    return 0;
}

function createMelodyArray() {
    for (let i = 0; i < melody.length; i++) {
        for (let j = 0; j < melody.height; j++) {
            notegrid.push("true");
        }
    }
}


//mouse cordiantes
document.addEventListener('mousemove', (event) => { mouse.x = event.clientX; mouse.y = event.clientY - 40; });

// when mouse is pressed
canvas.onmousedown = function mouseChangeMelody() {

    // when clicked active note
    if (notegrid[getMelodyHoover()] == false) {
        notegrid[getMelodyHoover()] = !notegrid[getMelodyHoover()];
    } else {

        //make the rest false for mono synth
        var x = getMelodyHoover() % melody.length;
        for (let i = 0; i < melody.height; i++) {
            notegrid[((x) + (i * melody.length))] = true;
        }

        notegrid[getMelodyHoover()] = false;
        var y = (getMelodyHoover() - x) / melody.length;

        //play tone when clicked
        synth.triggerAttackRelease(melody.key[melody.height - 1 - y], "16n");
    }
}

slider.onchange = function changeTime() { Tone.Transport.bpm.value = slider.value; }

//play button
var playClick = false;
button.onclick = function playSound() {
    if (playClick == false) {
        Tone.Transport.start();
        playClick = !playClick;
    } else {
        playHead = 0;
        playClick = !playClick;
        Tone.Transport.stop();
    }
}


/*
function setup() {
    var canvas = createCanvas(windowWidth, windowHeight-104);
    canvas.parent('sketch-holder');
  }

function draw() {
    background(220);
    ellipse(mouseX,mouseY,80,80);
    canvas.parent('sketch-holder');
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

*/











