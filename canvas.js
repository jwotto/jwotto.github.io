//get DOM elelemnts
var button = document.querySelector('#play-button');
var mButton = document.querySelector('#melody-button');
var bButton = document.querySelector('#bass-button');
var slider = document.getElementById("tempo-slider");
var sliderFx = document.getElementById("fx-slider");
var header = document.getElementById("header");
var footer = document.getElementById("footer");
var screen = document.getElementById("sketch-holder");
var sidebarRight = document.getElementById("sidebarright")
var sidebarLeft = document.getElementById("sidebarleft")

var screenOfset;
var canvasHeight;
var canvasWidth;

var grid = { length: 8, height: 8, blockW: 0, blockH: 0 }
block = [];
var rhythem = { height: 3, kPattern: [1, 0, 0, 0, 1, 0, 0, 0], sPattern: [0, 0, 0, 0, 0, 0, 0, 0], hPattern: [0, 0, 1, 0, 0, 0, 1, 0] }
var melody = { key: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], pattern: [] }
var bass = { key: ["A1", "B1", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"], pattern: [0, -1, 1, 2] }
var playHead = 0;


//fx
const distortion = new Tone.Distortion (1 ).toDestination();
const ffilter = new Tone.Filter(9000, "highpass").toDestination();
feedbackDelay = new Tone.FeedbackDelay({
    'delayTime' : '8n',
    'feedback' : 0.1,
    'maxDelay' : 2,
    'wet' : 0.2

}).toDestination();

//synths
const synth = new Tone.MonoSynth({
    'oscillator': {
        'type': 'sawtooth'
    },
    'filter': {
        'Q': 6,
        'type': 'lowpass',
        'rolloff': -24
    },
    'envelope': {
        'attack': 0.0,
        'decay': 0.5,
        'sustain': 0,
        'release': 0.
    },
    'filterEnvelope': {
        'attack': 0,
        'decay': 0.5,
        'sustain': 0,
        'release': 0,
        'baseFrequency': 100,
        'octaves': 7,
        'exponent': 8
    },
    "portamento": 0.08,
    'volume': -38

});

synth.chain(feedbackDelay,distortion,ffilter, Tone.Destination);
//synth.toDestination();


const bSynth = new Tone.MonoSynth({
    'oscillator': {
        'type': 'sawtooth'
    },
    'filter': {
        'Q': 6,
        'type': 'lowpass',
        'rolloff': -24
    },
    'envelope': {
        'attack': 0.0,
        'decay': 0.5,
        'sustain': 0,
        'release': 0.
    },
    'filterEnvelope': {
        'attack': 0,
        'decay': 0.5,
        'sustain': 0,
        'release': 0,
        'baseFrequency': 100,
        'octaves': 7,
        'exponent': 8
    },
    "portamento": 0.08,
    'volume': -34

});
bSynth.chain(distortion, Tone.Destination);

const kick = new Tone.MembraneSynth({
    "envelope": {
        'attack': 0.0,
        'decay': 0.3,
        'sustain': 0,
        'release': 0.01
    },
    "pitchDecay": 0.04,
    "volume": -10
}).toDestination();

const snare = new Tone.MembraneSynth({
    "envelope": {
        'attack': 0.0,
        'decay': 0.2,
        'sustain': 0,
        'release': 0.
    },
    "pitchDecay": 0.02,
    "volume": -16
}).toDestination();

const snareNoise = new Tone.NoiseSynth({
    "envelope": {
        'attack': 0.0,
        'decay': 0.15,
        'sustain': 0,
        'release': 0.
    },
    "volume": -16
}).toDestination();


const noise = new Tone.NoiseSynth({
    "envelope": {
        'attack': 0.0,
        'decay': 0.1,
        'sustain': 0,
        'release': 0.
        
    },
    "volume": -14
});
noise.connect(ffilter);




function setup() {
    frameRate(30);
    var canvas = createCanvas(windowWidth, windowHeight - footer.offsetHeight - header.offsetHeight);

    canvas.parent('sketch-holder');
    getUrlParameter();
    setPatterns();
    setScreen();
    setGrid();
}



function draw() {
   // background(255);
    drawGrid();
    drawBlocks();
    synth.filterEnvelope.exponent = sliderFx.value / 30;
    bSynth.filterEnvelope.exponent = sliderFx.value / 30;
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


slider.onchange = function changeSlider() { 
    Tone.Transport.bpm.value = slider.value;
    feedbackDelay.delayTime = Tone.Time("8n");

}


function windowResized() {
    setScreen();
    setGrid();
}

function setScreen() {
    canvasHeight = windowHeight - footer.offsetHeight - header.offsetHeight;
    canvasWidth = windowWidth;

    if (windowWidth > windowHeight) {
        screenOfset = windowWidth - windowHeight;
        sidebarLeft.style.width = (windowWidth - windowHeight) / 2 + "px";


        sidebarRight.style.width = (windowWidth - windowHeight) / 2 + "px";
        sidebarRight.style.marginLeft = windowWidth - (windowWidth - windowHeight) / 2 + "px";

        resizeCanvas(windowWidth, canvasHeight);
    }
    else {
        screenOfset = 0;
        sidebarLeft.style.width = 0;
        sidebarRight.style.width = 0;

    }
}



