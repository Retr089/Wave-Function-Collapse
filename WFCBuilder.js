let imageMap = new Map();
let test;
let grid;
let gen;
let intervalId;
let timeoutId;
let step = 0;
let drawText = true;
var startButton;
var speedSlider;
var saveFramesBox;
var growingSizeBox;
var optionsDiv;
var startDiv;
var cnv;

let save = false;
let scalingSize = false;
const dimensions = 800;

const maxSize = 20;
const startSize = 3;
let size = 20;
// const secondDelay = 1;

//PossibleNodes
const PossibleNodes = [
    // 'intersection_0',
    'fork_0',
    'fork_1',
    'fork_2',
    'fork_3',
    'turn_0',
    'turn_1',
    'turn_2',
    'turn_3',
    'path_0',
    'path_1',
    // 'end_0',
    // 'end_1',
    // 'end_2',
    // 'end_3',
    'empty_0'
];

//NodeSocketMap
// Socket 0 = Empty
// Socket 1 = Path
const SocketMap = new Map([
    // ['intersection_0', 'a'],
    ['fork_0', {
        up: 1,
        down: 0,
        right: 1,
        left: 1
    }],
    ['fork_1', {
        up: 1,
        down: 1,
        right: 1,
        left: 0
    }],
    ['fork_2', {
        up: 0,
        down: 1,
        right: 1,
        left: 1
    }],
    ['fork_3', {
        up: 1,
        down: 1,
        right: 0,
        left: 1
    }],
    ['turn_0', {
        up: 1,
        down: 0,
        right: 1,
        left: 0
    }],
    ['turn_1', {
        up: 0,
        down: 1,
        right: 1,
        left: 0
    }],
    ['turn_2', {
        up: 0,
        down: 1,
        right: 0,
        left: 1
    }],
    ['turn_3', {
        up: 1,
        down: 0,
        right: 0,
        left: 1
    }],
    ['path_0', {
        up: 1,
        down: 1,
        right: 0,
        left: 0
    }],
    ['path_1', {
        up: 0,
        down: 0,
        right: 1,
        left: 1
    }],
    //Temp
    ['end_0', {
        up: 0,
        down: 1,
        right: 0,
        left: 0
    }],
    ['end_1', {
        up: 0,
        down: 0,
        right: 0,
        left: 1
    }],
    ['end_2', {
        up: 1,
        down: 0,
        right: 0,
        left: 0
    }],
    ['end_3', {
        up: 0,
        down: 0,
        right: 1,
        left: 0
    }],
    //Temp
    ['empty_0', {
        up: 0,
        down: 0,
        right: 0,
        left: 0
    }],
]);

function preload() {
    imageMap.set('fork_0', loadImage('tiles/fork_0.png'));
    imageMap.set('fork_1', loadImage('tiles/fork_1.png'));
    imageMap.set('fork_2', loadImage('tiles/fork_2.png'));
    imageMap.set('fork_3', loadImage('tiles/fork_3.png'));
    imageMap.set('turn_0', loadImage('tiles/turn_0.png'));
    imageMap.set('turn_1', loadImage('tiles/turn_1.png'));
    imageMap.set('turn_2', loadImage('tiles/turn_2.png'));
    imageMap.set('turn_3', loadImage('tiles/turn_3.png'));
    imageMap.set('path_0', loadImage('tiles/path_0.png'));
    imageMap.set('path_1', loadImage('tiles/path_1.png'));
    imageMap.set('end_0', loadImage('tiles/end_0.png'));
    imageMap.set('end_1', loadImage('tiles/end_1.png'));
    imageMap.set('end_2', loadImage('tiles/end_2.png'));
    imageMap.set('end_3', loadImage('tiles/end_3.png'));
    imageMap.set('empty_0', loadImage('tiles/empty_0.png'));
}
function setup() {
    test = new WFCBuilder(size, size);
    gen = test.start();

    cnv = createCanvas(dimensions, displayHeight);
    cnv.parent('sketch01');

    optionsDiv = createDiv('Options');
    optionsDiv.class('button-descriptor');
    optionsDiv.position(1085, 443);
    optionsDiv.size(193, 30);

    startDiv = createDiv('');
    startDiv.class('button-descriptor');
    startDiv.position(875, 443);
    startDiv.size(193, 30);

    startButton = createButton('Start');
    startButton.class('button');
    startButton.parent('sketch01');

    speedSlider = createSlider(0, 1, 1, 0.01);
    speedSlider.id('slider');
    speedSlider.parent('sketch01');
    speedSlider.position(0, 60)

    saveFramesBox = createCheckbox('Save Frames', save);
    growingSizeBox = createCheckbox('Growing Size', scalingSize);

    startDiv.child(startButton);
    startDiv.child(speedSlider);
    optionsDiv.child(saveFramesBox);
    optionsDiv.child(growingSizeBox);

    startButton.mousePressed(() => {
        if (saveFramesBox.checked()) {
            save = true;
            speedSlider.value(0.81);
        } else {
            save = false;
        }
        if (growingSizeBox.checked()) {
            scalingSize = true;
        } else {
            scalingSize = false;
        }
        if (intervalId) {
            if (scalingSize) {
                size = startSize;
            } else {
                size = maxSize;
            }
            step = 0;
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            test = new WFCBuilder(size, size);
            gen = test.start();
            drawText = true;
            intervalId = setInterval(swapGrid, (1 - (0.99 * speedSlider.value())) * 1000);
        } else {
            if (scalingSize) {
                size = startSize;
                test = new WFCBuilder(size, size);
                gen = test.start();
            }
            intervalId = setInterval(swapGrid, (1 - (0.99 * speedSlider.value())) * 1000);
        }
    })
    speedSlider.mousePressed(() => {
        speedSlider.mouseMoved(() => {
            redraw();
        })
    })
    textAlign(CENTER, CENTER);
    noLoop();
}

function swapGrid() {
    const done = gen.next().done;
    if (done) {
        clearInterval(intervalId);
        drawText = false;
        timeoutId = setTimeout(() => {
            redraw();
            if (scalingSize) {
                if (size < maxSize) {
                    size++;
                    step = 0;
                    test = new WFCBuilder(size, size);
                    gen = test.start();
                    drawText = true;
                    intervalId = setInterval(swapGrid, (1 - (0.99 * speedSlider.value())) * 1000);
                }
            }
            if (save) saveCanvas('step_finished.png');
        }, 1000);
    } else {
        step++;
        redraw();
        if (save) {
            saveCanvas(`step_${step}.png`);
        }
    }
}

function draw() {
    background(100);
    let imgOffsetX = 0;
    let imgOffsetY = 0;
    for (const col of test.grid) {
        for (const node of col) {
            node.name ? image(imageMap.get(node.name), imgOffsetX, imgOffsetY, dimensions / size, dimensions / size) : null;
            if (drawText) {
                if (node.entropy > 0) {
                    textSize(dimensions / size - 5);
                    text(node.entropy, imgOffsetX + (dimensions / size) / 2, imgOffsetY + (dimensions / size) / 2);
                }
            }
            imgOffsetX += dimensions / size;
        }
        imgOffsetY += dimensions / size;
        imgOffsetX = 0;
    }
    textSize(32);
    text('Delay: ' + (1 - (0.99 * speedSlider.value())).toFixed(2), dimensions / 4, dimensions + 30);
    text(`Size: ${size} / ${maxSize}`, dimensions / 4 * 2, dimensions + 30);
    textAlign(LEFT, CENTER);
    text(`Step: ${step} / ${size ** 2}`, dimensions / 4 * 3 - 80, dimensions + 30);
    textAlign(CENTER, CENTER);
}

//WFC Node
class WFCNode {
    constructor(name) {
        this.entropy = PossibleNodes.length;
        this.possibleTypes = PossibleNodes;
        this.collapsed = false;
        if (!this.possibleTypes.includes(name) && name != null)
            throw new Error('Possible Node Type Not Found!');
        this.name = name;
    }
}

const offsets = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
];
class WFCBuilder {
    constructor(width = 5, height = 5) {
        this.width = width;
        this.height = height;
        this.grid = [];
        for (let y = 0; y < height; y++) {
            this.grid.push([]);
            for (let x = 0; x < width; x++) {
                this.grid[y].push(new WFCNode(null));
            }
        }
        this.gridHistory = [];
    }
    *start() {
        let lowestEntropy = this.getLowestEntropy();
        let collapsedNodes = [];
        if (lowestEntropy) {
            while (lowestEntropy) {
                lowestEntropy.name = this.getRandomNode(lowestEntropy.possibleTypes);
                lowestEntropy.entropy = 0;
                lowestEntropy.collapsed = true;
                // collapsedNodes.push(this.getNodeLocation(lowestEntropy));
                // this.collapseSurroundingNodes(lowestEntropy, collapsedNodes);
                this.collapseSurroundingNodes(lowestEntropy);
                lowestEntropy = this.getLowestEntropy();
                yield;
            }
        }
    }
    getGrid() {
        return this.grid;
    }
    displayGrid() {
        let msg = '';
        for (const col of this.grid) {
            for (const node of col) {
                msg += ` ${node.name == null ? `N` : node.name.charAt(0).toUpperCase()} `;
            }
            msg += '\n';
        }
        msg += '\n';
        for (const col of this.grid) {
            for (const node of col) {
                msg += ` ${node.entropy} `;
            }
            msg += '\n';
        }
        msg += '\n\n';
        return msg;
    }
    getNode(nodeLocation) {
        return this.grid[nodeLocation.row][nodeLocation.col];
    }
    getRandomNode(PossibleTypes) {
        return PossibleTypes[Math.floor(Math.random() * PossibleTypes.length)];
    }
    getLowestEntropy() {
        let minEntropy = 999;
        const lowestNodes = [];
        for (const col of this.grid) {
            for (const node of col) {
                if (node.entropy > 0 && node.entropy < minEntropy) {
                    minEntropy = node.entropy;
                }
            }
        }
        // console.log(`minEntropy: ${minEntropy}`);
        if (minEntropy == 999) {
            return undefined;
        }
        for (const col of this.grid) {
            for (const node of col) {
                if (node.entropy == minEntropy) {
                    lowestNodes.push(node);
                }
            }
        }
        return lowestNodes[Math.floor(Math.random() * lowestNodes.length)];
    }
    isWithinGrid(index) {
        if ((index.row > -1 && index.row < this.grid.length) && (index.col > -1 && index.col < this.grid[0].length)) {
            return true;
        }
        else {
            return false;
        }
    }
    getNodeLocation(node) {
        let index = { row: -1, col: -1 };
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col] == node) {
                    index.row = row;
                    index.col = col;
                }
            }
        }
        if (index.row == -1 || index.col == -1) {
            throw new Error('Invalid location!');
        }
        return index;
    }
    collapseSurroundingNodes(node) {
        //Get node's location
        const nodeLocation = this.getNodeLocation(node);
        const nodeSocket = SocketMap.get(node.name);
        //If the location is not on the grid, throw err
        if (!this.isWithinGrid(nodeLocation)) {
            throw new Error('Node Is Not Within Grid!');
        }
        for (let offset_index = 0; offset_index < offsets.length; offset_index++) {
            // Up    = 0
            // Down  = 1
            // Right = 2
            // Left  = 3
            const offset = offsets[offset_index];
            const offsetLocation = { row: nodeLocation.row + offset.row, col: nodeLocation.col + offset.col };
            if (!this.isWithinGrid(offsetLocation))
                continue;
            const offsetNode = this.getNode(offsetLocation);
            if (offsetNode.collapsed)
                continue;
            let compatibleTypes = [];
            switch (offset_index) {
                case 0: //Up
                    compatibleTypes.push(...offsetNode.possibleTypes.filter(fType => nodeSocket.up == SocketMap.get(fType).down));
                    break;
                case 1: //Down
                    compatibleTypes.push(...offsetNode.possibleTypes.filter(fType => nodeSocket.down == SocketMap.get(fType).up));
                    break;
                case 2: //Right
                    compatibleTypes.push(...offsetNode.possibleTypes.filter(fType => nodeSocket.right == SocketMap.get(fType).left));
                    break;
                case 3: //Left
                    compatibleTypes.push(...offsetNode.possibleTypes.filter(fType => nodeSocket.left == SocketMap.get(fType).right));
                    break;
            }
            offsetNode.possibleTypes = compatibleTypes;
            offsetNode.entropy = offsetNode.possibleTypes.length;
            // collapsed.push(offsetLocation);
        }
    }
}