var GridLeftMargin;
var screenWidth;


function setGrid() {
    grid.blockW = (windowWidth - screenOfset) / grid.length;
    grid.blockH = canvasHeight / (grid.height + rhythem.height);

    GridLeftMargin = screenOfset / 2;
    screenWidth = windowWidth - GridLeftMargin;

    //push the melody and rhytem arrays
}

function drawGrid() {
    strokeWeight(5)
    fill(255);
    rect(screenOfset / 2, 0, windowWidth - screenOfset, canvasHeight);

    drawPlayhead();
    drawLines();
    drawBlocks();



    strokeWeight(1)
}

function drawLines() {

    for (var i = 0; i < grid.length; i++) {
        strokeWeight(1)
        line(GridLeftMargin + i * grid.blockW, 0, GridLeftMargin + i * grid.blockW, windowHeight);
    }

    for (var j = 0; j < grid.height + rhythem.height; j++) {
        strokeWeight(1);
        if (j == 10) { strokeWeight(5); }
        line(GridLeftMargin, j * grid.blockH, screenWidth, j * grid.blockH);
    }

}

function drawBlocks() {
    for (var i = 0; i < grid.length; i++) {
        //draww bass pattern
        if (bass.pattern[i] >= 0) {
            fill(40)
            rect(GridLeftMargin + i * grid.blockW, (grid.height - 1 - bass.pattern[i]) * grid.blockH, grid.blockW, grid.blockH, 10);
            noFill();
        }
        //draw melody pattern
        if (melody.pattern[i] >= 0) {
            fill(80)
            rect(GridLeftMargin + i * grid.blockW, (grid.height - 1 - melody.pattern[i]) * grid.blockH, grid.blockW, grid.blockH, 10);
            noFill();
        }
        //draw rhytem pattern
        if (rhythem.kPattern[i] == true) {
            fill(20)
            rect(GridLeftMargin + i * grid.blockW, (grid.height + 2) * grid.blockH, grid.blockW, grid.blockH, 10);
        }
        if (rhythem.hPattern[i] == true) {
            fill(20)
            rect(GridLeftMargin + i * grid.blockW, (grid.height) * grid.blockH, grid.blockW, grid.blockH, 10);
        }
        if (rhythem.sPattern[i] == true) {
            fill(20)
            rect(GridLeftMargin + i * grid.blockW, (grid.height + 1) * grid.blockH, grid.blockW, grid.blockH, 10);
        }
    }
}

function drawPlayhead() {
    if (playClick) {
        fill(100);
        rect(GridLeftMargin + ((((playHead + grid.length - 1) % grid.length)) * grid.blockW), 0, grid.blockW, canvasHeight);
    }
}


function mouseClicked() {
    var mouseOnNoteGrid = (mouseX > screenOfset / 2 && mouseX < (windowWidth - screenOfset / 2) && (mouseY > 0) && mouseY < canvasHeight - (3 * grid.blockH))
    var mouseOnRhytemGrid = (mouseX > screenOfset / 2 && mouseX < (windowWidth - screenOfset / 2) && (mouseY > (10 * grid.blockH)) && mouseY < canvasHeight)
    var sameNoteClickedMelody = (melody.pattern[quantizeGridPosX(mouseX)] == quantizeGridPosY(mouseY) - 3)
    var sameNoteClickedBass = (bass.pattern[quantizeGridPosX(mouseX)] == quantizeGridPosY(mouseY) - 3)
    if (mouseOnNoteGrid) {

        if (SelectorBassMelody) {
        melody.pattern[quantizeGridPosX(mouseX)] = quantizeGridPosY(mouseY) - 3;
            if (sameNoteClickedMelody) {
                melody.pattern[quantizeGridPosX(mouseX)] = -1;
            }
        } else {
            bass.pattern[quantizeGridPosX(mouseX)] = quantizeGridPosY(mouseY) - 3;
            if (sameNoteClickedBass) {
                bass.pattern[quantizeGridPosX(mouseX)] = -1;
            }

        }

    }
    if (mouseOnRhytemGrid) {
        if (quantizeGridPosY(mouseY) == 0) {
            rhythem.kPattern[quantizeGridPosX(mouseX)] = !rhythem.kPattern[quantizeGridPosX(mouseX)];
        }
        if (quantizeGridPosY(mouseY) == 1) {
            rhythem.sPattern[quantizeGridPosX(mouseX)] = !rhythem.sPattern[quantizeGridPosX(mouseX)];
        }
        if (quantizeGridPosY(mouseY) == 2) {
            rhythem.hPattern[quantizeGridPosX(mouseX)] = !rhythem.hPattern[quantizeGridPosX(mouseX)];
        }


    }
   // console.log("X" + quantizeGridPosX(mouseX) + " " + "Y" + quantizeGridPosY(mouseY));
}


function quantizeGridPosX(x) {
    var posX = floor((x - (screenOfset / 2)) / grid.blockW);
    return posX;
}
function quantizeGridPosY(y) {
    posY = floor(y / grid.blockH);
    return grid.height + rhythem.height - posY - 1;
}