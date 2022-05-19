function setGrid() {
    grid.blockW = canvasWidth / grid.length;
    grid.blockH = canvasHeight / (grid.height + rhythem.height);
}

function drawGrid() {
    strokeWeight(5);
    fill(255);
    rect(0, 0, canvasWidth, canvasHeight);
    drawPlayhead();
    drawLines();
    drawBlocks();
    strokeWeight(1);
}

function drawLines() {

    for (var i = 0; i < grid.length; i++) {
        strokeWeight(1)
        line( i * grid.blockW, 0, i * grid.blockW, windowHeight);
    }

    for (var j = 0; j < grid.height + rhythem.height; j++) {
        strokeWeight(1);
        if (j == grid.height) { strokeWeight(5); }
        line(0, j * grid.blockH, canvasWidth, j * grid.blockH);
    }

}

function drawBlocks() {
    for (var i = 0; i < grid.length; i++) {
        //draww bass pattern
        let blockPosX = i * grid.blockW;

        if (bass.pattern[i] >= 0) {
            fill(0, 0, 255, 125)
            rect(blockPosX, (grid.height - 1 - bass.pattern[i]) * grid.blockH, grid.blockW, grid.blockH, 10);
            noFill();
        }
        //draw melody pattern
        if (melody.pattern[i] >= 0) {
            fill(255, 0, 0, 125)
            rect(blockPosX, (grid.height - 1 - melody.pattern[i]) * grid.blockH, grid.blockW, grid.blockH, 10);
            noFill();
        }
        //draw rhytem pattern
        var blockCenter = blockPosX + (grid.blockW * 0.5);

        if (rhythem.kPattern[i] == true) {
            fill(20)
            rect((blockPosX), (grid.height + 2) * grid.blockH, grid.blockW, grid.blockH, 10);
        }
        if (rhythem.hPattern[i] == true) {
            fill(20)
            triangle(blockPosX, (grid.height + 1) * grid.blockH, blockPosX + grid.blockW, (grid.height + 1) * grid.blockH, blockCenter, (grid.height) * grid.blockH);
        }
        if (rhythem.sPattern[i] == true) {
            fill(20)
            ellipse(blockCenter, ((grid.height + 1) * grid.blockH) + grid.blockH * 0.5, grid.blockH * 0.8, grid.blockH * 0.8, 10);
        }
    }
}

function drawPlayhead() {
    if (playClick) {
        fill(100);
        rect( ((((playHead + (grid.length - 1)) % grid.length)) * grid.blockW), 0, grid.blockW, canvasHeight);
    }
}

function mouseClicked() {

    var mouseOnNoteGrid = (mouseX >= 0 && mouseX < canvasWidth && (mouseY > 0) && mouseY < canvasHeight - (3 * grid.blockH))
    var mouseOnRhytemGrid = (mouseX >= 0 && mouseX < canvasWidth && (mouseY > (grid.height * grid.blockH)) && mouseY < canvasHeight)
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
}

function quantizeGridPosX(x) {
    var posX = floor(x  / grid.blockW);
    return posX;
}

function quantizeGridPosY(y) {
    posY = floor(y / grid.blockH);
    return grid.height + rhythem.height - posY - 1;
}