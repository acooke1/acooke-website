var canvas = document.getElementById('canvas'),
    canvasRect = canvas.getBoundingClientRect()
    ctx = canvas.getContext('2d'),
    elements = [];
ctx.translate(0.5, 0.5);
const cellSize = 5;
const gridWidth = canvas.width/cellSize;
const gridHeight = canvas.height/cellSize;
const randomAlivePercent = 0.5;
const cellColor = 'rgba(210, 210, 80, 1)';
const emptyColor = 'rgba(70, 70, 70, 1)';
const lineWidth = 0.5;
const framerate = 7;
var running = false;

let grid = {};
let updateList = [];

class Cell {
    constructor(x, y, isAlive) {
        this.x = x;
        this.y = y;
        this.isAlive = isAlive;
    }
}

Cell.prototype.toggleAlive = function() {
    this.isAlive = !this.isAlive;
}

Cell.prototype.draw = function() {
    if (this.isAlive) {
        ctx.beginPath();
        ctx.fillRect(this.x*cellSize+lineWidth, this.y*cellSize+lineWidth, cellSize-2*lineWidth, cellSize-2*lineWidth);
        ctx.closePath();
        ctx.fillStyle = cellColor;
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.fillRect(this.x*cellSize+lineWidth, this.y*cellSize+lineWidth, cellSize-2*lineWidth, cellSize-2*lineWidth);
        ctx.closePath();
        ctx.fillStyle = emptyColor;
        ctx.fill();
    }
    
}

Cell.prototype.update = function() {
    let neighbors = []
    if (grid[this.x-1] === undefined) {
        neighbors.push(undefined);
        neighbors.push(undefined);
        neighbors.push(undefined);
    } else {
        neighbors.push(grid[this.x-1][this.y-1]);
        neighbors.push(grid[this.x-1][this.y]);
        neighbors.push(grid[this.x-1][this.y+1]);
    }
    if (grid[this.x+1] === undefined) {
        neighbors.push(undefined);
        neighbors.push(undefined);
        neighbors.push(undefined);
    } else {
        neighbors.push(grid[this.x+1][this.y-1]);
        neighbors.push(grid[this.x+1][this.y]);
        neighbors.push(grid[this.x+1][this.y+1]);
    }
    neighbors.push(grid[this.x][this.y+1]);
    neighbors.push(grid[this.x][this.y-1]);
    let numNeighborsAlive = 0;
    for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i] !== undefined) {
            if (neighbors[i].isAlive) {
                numNeighborsAlive++;
            }
        }
    }
    
    if (this.isAlive) {
        if (numNeighborsAlive !== 2 && numNeighborsAlive !== 3) {
            updateList.push([this.x, this.y])
        }
    } else {
        if (numNeighborsAlive === 3) {
            updateList.push([this.x, this.y])
        }
    }
}

for (let i = 0; i < gridWidth; i++) {
    grid[i] = {}
    for (let j = 0; j < gridHeight; j++) {
        let cell = new Cell(i, j, false);
        grid[i][j] = cell;
    }
}

function fillRandom() {
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = {}
        for (let j = 0; j < gridHeight; j++) {
            let isAlive = Math.random() < randomAlivePercent;
            let cell = new Cell(i, j, isAlive);
            cell.draw();
            grid[i][j] = cell;
        }
    }
}

canvas.addEventListener('click', toggleCellAt);

function toggleCellAt(event) {
    var x = event.pageX - canvasRect.x,
        y = event.pageY - canvasRect.y;
    var gridX = Math.trunc(gridWidth * (x/canvasRect.width));
    var gridY = Math.trunc(gridHeight * (y/canvasRect.height));
    grid[gridX][gridY].toggleAlive();
    console.log(grid[gridX][gridY].isAlive)
    grid[gridX][gridY].draw();
}

var raf;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    loop();
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

function clear() {
    ctx.fillStyle = emptyColor;
    ctx.fillRect(0, 0, gridWidth*cellSize, gridHeight*cellSize);
}

function drawGrid() {
    clear()
    ctx.lineWidth = lineWidth;
    for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i*cellSize, 0);
        ctx.lineTo(i*cellSize, gridHeight*cellSize);
        ctx.stroke();
    }
    for (let i = 0; i <= gridHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i*cellSize);
        ctx.lineTo(gridWidth*cellSize, i*cellSize);
        ctx.stroke()
    }
}

function getNextGeneration() {
    for (let i = 0; i < updateList.length; i++) {
        let cellToUpdate = updateList[i];
        grid[cellToUpdate[0]][cellToUpdate[1]].toggleAlive();
    }
    updateList = [];
}

function loop() {
    //clear();
    raf = window.requestAnimationFrame(loop);
    
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval && running) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j++) {
                grid[i][j].draw();
                grid[i][j].update();
            }
        }
        getNextGeneration();

    }
}

function toggleAnimation() {
    running = !running;
}

drawGrid();
startAnimating(framerate);