//get DOM elelemnts
var button = document.querySelector('#play-button');
var mButton = document.querySelector('#melody-button');
var bButton = document.querySelector('#bass-button');
var slider = document.getElementById("tempo-slider");
var sliderFx = document.getElementById("fx-slider");
var header = document.getElementById("header");
var footer = document.getElementById("footer");

var screenOfset;
var canvasHeight;
var canvasWidth;

var grid = { length: 8, height: 8, blockW: 0, blockH: 0 }
block = [];
var rhythem = { height: 3, kPattern: [1, 0, 0, 0, 1, 0, 0, 0], sPattern: [0, 0, 0, 0, 0, 0, 0, 0], hPattern: [0, 0, 1, 0, 0, 0, 1, 0] }
var melody = { key: ["A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"], pattern: [0, -1, -1, 1, -1, 2] }
var bass = { key: ["A1", "B1", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"], pattern: [] }
var playHead = 0;

//synth tone.js elements

const freeverb = new Tone.Freeverb({

    "dampening": 500,
    "roomSize": 0.9,
    "wet": 1

}).toDestination();

const filterr = new Tone.Filter(1000, "highpass").toDestination();



const synth = new Tone.MonoSynth({



    'oscillator': {
        'type': 'square'
    },
    'filter': {
        'Q': 6,
        'type': 'lowpass',
        'rolloff': -24
    },
    'envelope': {
        'attack': 0.0,
        'decay': 0.1,
        'sustain': 1,
        'release': 0.1
    },
    'filterEnvelope': {
        'attack': 0,
        'decay': 0.3,
        'sustain': 0.2,
        'release': 0.2,
        'baseFrequency': 100,
        'octaves': 7,
        'exponent': 8
    },
    "portamento": 0.1,
    'volume': -18

});

synth.chain(filterr, freeverb, Tone.Destination);
//synth.toDestination();

const bfilter = new Tone.Filter(400, "lowpass").toDestination();
const bSynth = new Tone.Synth({
    volume: -2
});
bSynth.oscillator.type = "square";
bSynth.connect(bfilter);

const kick = new Tone.MembraneSynth({
    "envelope": {
        decay:0.8
    },
    "pitchDecay": 0.04,
    "volume": -8
}).toDestination();

const snare = new Tone.MembraneSynth({
    "envelope": {
        "decay": 0.03
    },
    "pitchDecay": 0.02,
    "volume": -10
}).toDestination();

const snareNoise = new Tone.NoiseSynth({
    "envelope": {
        "decay": 0.12
    },
    "volume": -12
}).toDestination();


const noisefilter = new Tone.Filter(9000, "highpass").toDestination();
const noise = new Tone.NoiseSynth({
    "envelope": {
        "decay": 0.3
    },
    "volume": -12
});
noise.connect(noisefilter);




function setup() {
    frameRate(30);
    var canvas = createCanvas(windowWidth, windowHeight - footer.offsetHeight - header.offsetHeight);
    canvas.parent('sketch-holder');
    setPatterns();
    setScreen();
    setGrid();
}



function draw() {
    background(255);
    drawGrid();
    drawBlocks();
    synth.filterEnvelope.exponent = sliderFx.value / 30;
}

// music loop
Tone.Transport.scheduleRepeat(time => { repeat(time); }, "16n");
function repeat(time) {

    if (melody.pattern[playHead] >= 0) {
        synth.triggerAttackRelease(melody.key[melody.pattern[playHead]], "16n", time);

    }

    if (bass.pattern[playHead] >= 0) {
        bSynth.triggerAttackRelease(bass.key[bass.pattern[playHead]], "16n", time);
    }

    if (rhythem.kPattern[playHead] == true) { kick.triggerAttackRelease("A1", "16n", time); }
    if (rhythem.hPattern[playHead] == true) { noise.triggerAttackRelease("32n", time); }
    if (rhythem.sPattern[playHead] == true) { snare.triggerAttackRelease("E3", "16n", time); snareNoise.triggerAttackRelease("16n", time); }
    playHead = (playHead + 1) % grid.length;
}


//play button
var playClick = false;
button.onclick = function playSound() {
    if (playClick == false) {
        playHead = 0;
        Tone.Transport.start();
        playClick = !playClick;
    } else {
        playClick = !playClick;
        Tone.Transport.stop();
        playHead = 0;
    }
}

var SelectorBassMelody = false;

bButton.onclick = function () { SelectorBassMelody = false; }
mButton.onclick = function () { SelectorBassMelody = true; }

function setPatterns() {
    for (var i = 0; i < grid.length; i++) {
        melody.pattern.push(-1);
        bass.pattern.push(-1);
        rhythem.kPattern.push(false);
        rhythem.sPattern.push(false);
        rhythem.hPattern.push(false);
    }
}


slider.onchange = function changeSlider() { Tone.Transport.bpm.value = slider.value; }





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

