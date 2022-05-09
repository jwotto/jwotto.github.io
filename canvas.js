//get DOM elelemnts
var button = document.querySelector('#play-button');
var slider = document.getElementById("tempo-slider");
var header = document.getElementById("header");
var footer = document.getElementById("footer");

var screenOfset;
var canvasHeight;
var canvasWidth;

var grid = { length: 8, height: 10, blockW: 0, blockH: 0 }
block = [];
var rhythem = { height: 3, kPatter: [], sPatter: [], hPatter: [] }
var melody = { key: ["A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"], pattern: [] }
var bass = { key: ["A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"], pattern: [] }
var playHead = 0;

//synth tone.js elements
const synth = new Tone.Synth().toDestination();


function setup() {
    frameRate(60);
    var canvas = createCanvas(windowWidth, windowHeight - footer.offsetHeight - header.offsetHeight);
    canvas.parent('sketch-holder');
    setPatterns();
    setScreen();
    setGrid();
}



function draw() {
    background((255 - ((playHead) % 2) * 200));
    drawGrid();
    drawBlocks();

    ellipse(mouseX, mouseY, 30, 30);
   // text(mouseY, windowWidth / 2, windowHeight / 2);

}

// music loop
Tone.Transport.scheduleRepeat(time => { repeat(time); }, "16n");
function repeat(time) {

    if (melody.pattern[playHead] >= 0) {
        synth.triggerAttackRelease(melody.key[melody.pattern[playHead]], "16n", time);
}

    playHead = (playHead + 1) % grid.length;
}


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

function setPatterns() {
    for (var i = 0; i < grid.length; i++) {
        melody.pattern.push(-1);
        bass.pattern.push(-1);
        rhythem.kPatter.push(false);
        rhythem.sPatter.push(false);
        rhythem.hPatter.push(false);
    }
}


slider.onchange = function changeTime() { Tone.Transport.bpm.value = slider.value; }


function windowResized() {
    setScreen();
    setGrid();
    resizeCanvas(windowWidth, canvasHeight);
}

function setScreen() {
    canvasHeight = windowHeight - footer.offsetHeight - header.offsetHeight;
    canvasWidth = windowWidth;

    if (windowWidth > windowHeight) {
        screenOfset = (windowWidth - windowHeight);
    }
    else {
        screenOfset = 0;
    }
}





















