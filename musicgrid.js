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
        if (melody.pattern[i] >= 0) {
            fill(20)
            rect(GridLeftMargin + i * grid.blockW, (grid.height - 1 - melody.pattern[i]) * grid.blockH, grid.blockW, grid.blockH, 10);
            noFill();
        }
    }
}

function drawPlayhead() {
    if (playClick) {
        fill(100);
        rect(GridLeftMargin + ((((playHead + grid.length - 1) % grid.length)) * grid.blockW), 0, grid.blockW, canvasHeight);
    }
}


function mousePressed() {
    var mouseOnGrid = (mouseX > screenOfset / 2 && mouseX < (windowWidth - screenOfset / 2) && (mouseY > 0) && mouseY < canvasHeight)
    var sameNoteClicked = (melody.pattern[quantizeGridPosX(mouseX)] == quantizeGridPosY(mouseY) - 3)
    if (mouseOnGrid) {

        console.log("X" + quantizeGridPosX(mouseX) + " " + "Y" + quantizeGridPosY(mouseY));


        melody.pattern[quantizeGridPosX(mouseX)] = quantizeGridPosY(mouseY) - 3;
        if (sameNoteClicked) {
            melody.pattern[quantizeGridPosX(mouseX)] = -1;
        }

    }
}


function quantizeGridPosX(x) {
    var posX = floor((x - (screenOfset / 2)) / grid.blockW);
    return posX;
}
function quantizeGridPosY(y) {
    posY = floor(y / grid.blockH);
    return grid.height + rhythem.height - posY - 1;
}