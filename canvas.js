var melodyLength = 8;
var melodyHeight = 10;

var melody = [];

var root = 60;

var key = [440.00, 523.25, 587.33, 659.26, 783.99,
    440.00 * 2, 523.25 * 2, 587.33 * 2, 659.26 * 2, 783.99 * 2,
    440.00 * 4, 523.25 * 4, 587.33 * 4, 659.26 * 4, 783.99 * 4,
    440.00 * 8, 523.25 * 8, 587.33 * 8, 659.26 * 8, 783.99 * 8



];

var playHead = false;



//canvass size
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 105;

// grid size
var blockWidth = canvas.width / melodyLength;
var blockHeight = canvas.height / melodyHeight;

//mouse cordinates
var mouseX = 0;
var mouseY = 0;

//get play button
var button = document.querySelector('#play-button');
var playClick = false;

//get slider value
var slider = document.getElementById("tempo-slider");
var tempo = 0.2;

// get canvas elements
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//animate loop 60 fps
const refreshRate = 1000 / 60;

//synth tone.js elements
const synth = new Tone.Synth();
synth.toDestination();

const synthB = new Tone.Synth();
synthB.toDestination();



//setup
createMelodyArray();
drawGrid();


function drawLoop() {
    //refresh brackground
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    //mouse
    ctx.fillStyle = "blue";
    ctx.globalAlpha = 0.01
    ctx.fillRect(mouseX - 10, mouseY - 10, 20, 20);
    ctx.globalAlpha = 1;
}


// music loop
Tone.Transport.scheduleRepeat(time => {
    repeat(time);
}, "16n");


function repeat(time) {

    for (let i = 0; i < melodyHeight; i++) {

        // dit triggered nu 8 x
        if (melody[playHead + (i * melodyLength)] == false) {

            synth.triggerAttackRelease(key[melodyHeight - 1 - i], "16n", time);
            var b = key[melodyHeight - 1 - i] / 4;
            synthB.triggerAttackRelease(b, "16n", time);
        }
    }

    playHead = (playHead + 1) % melodyLength;
}




//mouse cordiantes
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY - 40; //mousey - header
});


// refresh draw loop
window.setInterval(() => {
    drawLoop();
}, refreshRate);


//when canvas is  resized
window.onresize = function (event) {
    resizeCanvas();
    drawGrid();
};
var colorOfset = 0;
function drawGrid() {

    for (let i = 0; i < melodyLength; i++) {
        for (let j = 0; j < melodyHeight; j++) {

            ctx.beginPath();

            //color 4block
            if ((i % 4) == 0) { ctx.fillStyle = "#cccccc"; } else { ctx.fillStyle = "#d9d9d9"; }

            //color play head
            if (i == ((playHead + (melodyLength - 1)) % melodyLength) && playClick === true) {
                ctx.fillStyle = "hsl(" + (360 / melodyLength) * i + ",20%,70%)";
            }

            //color mouseover
            if (((mouseX > (i * blockWidth)) && mouseX < ((i + 1) * blockWidth)) && ((mouseY > (j * blockHeight)) && mouseY < ((j + 1) * blockHeight))) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "grey";
            }

            // color note clicked
            var nColor = (360 - (j * (360 / 5) + 160) % 360);
            if (melody[(i + (j * melodyLength))] == false) { ctx.fillStyle = "hsl(" + nColor + ",100%,50%)"; }

            //draw grid
            ctx.fillRect(i * blockWidth, j * blockHeight, blockWidth - 1, blockHeight - 1);

            ctx.globalAlpha = 1;
        }
    }

}

// resize grid elements
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 105;

    blockWidth = canvas.width / melodyLength;
    blockHeight = canvas.height / melodyHeight;
}


//get back array nummer on hover
function getMelodyHoover() {
    for (let i = 0; i < melodyLength; i++) {
        for (let j = 0; j < melodyHeight; j++) {
            if (((mouseX > (i * blockWidth)) && mouseX < ((i + 1) * blockWidth)) && ((mouseY > (j * blockHeight)) && mouseY < ((j + 1) * blockHeight))) {
                return i + (j * melodyLength)

            }
        }
    }
    return 0;
}


// when mouse is pressed
canvas.onmousedown = function mouseChangeMelody() {

    // when clicked active note
    if (melody[getMelodyHoover()] == false) {
        melody[getMelodyHoover()] = !melody[getMelodyHoover()];
    } else {


        //make the rest false for mono synth
        var x = getMelodyHoover() % melodyLength;
        for (let i = 0; i < melodyHeight; i++) {

            melody[((x) + (i * melodyLength))] = true;
        }

        melody[getMelodyHoover()] = false;
        var y = (getMelodyHoover() - x) / melodyLength;

        //play tone when clicked
        synth.triggerAttackRelease(key[melodyHeight - 1 - y], "16n");
        synthB.triggerAttackRelease(key[melodyHeight - 1 - y] / 4, "16n");

    }

}







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



slider.onchange = function changeTime() {

    Tone.Transport.bpm.value = slider.value;
}

function createMelodyArray() {
    for (let i = 0; i < melodyLength; i++) {
        for (let j = 0; j < melodyHeight; j++) {
            melody.push("true");
        }
    }

}








