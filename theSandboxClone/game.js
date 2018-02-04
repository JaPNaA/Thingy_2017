import Canvas from "./canvas.js"; // import canvas
import WebWorker from "./worker.js"; // import webworker lib
import GameInterface from "./gameInterface.js"; // import user interface

export default class Game { // export game
    constructor(canvas) {
        var that = this;

        // index of all the blocks
        this.INDEX = [{
                name: "nothing",
                description: "just nothing",
                color: "rgba(0, 0, 0, 0)"
            },
            {
                name: "Block",
                description: "Some boring block",
                color: "#444444"
            },
            {
                name: "GravityBlock",
                description: "Can only go down",
                color: "#000000"
            },
            {
                name: "AntiGravityBlock",
                description: "Can only go up",
                color: "#FFFFFF"
            },
            {
                name: "RandomWalker",
                description: "VERY confused ducks",
                color: "#FF0000"
            },
            {
                name: "RandomWalkerFreeze",
                description: "Be careful! Freezes your ducks",
                color: "#0000FF"
            }
        ];

        // setup brushUI for user interface
        this.brushUI = [];

        // setup timeUI for user interface
        this.timeUI = [];

        // setup worker
        this.worker = new WebWorker("./workerScript.js");
        this.worker.on("map", e => that.getMap(e));

        // setup canvas
        this.canvas = new Canvas(); // create canvas
        this.canvas.scale = 8; // set canvas's scale to 8px per px
        this.canvas.bg = "rgba(0, 0, 0, 0.25)"; // canvas background color

        // setup userinterface
        this.uiCanvas = new GameInterface({
            width: 184,
            height: 512,
            backgroundColor: "#000",
            color: "#EEEEEE"
        }, [{
                title: "Blocks",
                type: "list",
                selected: 0,
                data: this.INDEX,
                onselect: function (e) {
                    that.ui.selectedBlock = e;
                }
            },
            {
                title: "Brush",
                type: "modules",
                data: this.brushUI
            },
            {
                title: "Time",
                type: "modules",
                data: this.timeUI
            }
        ]);

        // setup self
        this.width = 128;
        this.height = 64;
        this.tickSpeed = 16;
        this.ui = {
            selectedBlock: 0, // currently selected block
            mousedown: false, // is mouse held down
            auxmousedown: false, // is secondary mouse button down
        };

        // create map
        this.MAP = new Uint8Array(this.width * this.height);

        // { // fill map with randoms
        //     let ml = this.MAP.length;
        //     for (let i = 0; i < ml; i++) {
        //         this.MAP[i] = Math.floor(Math.random() + 0.1) ? 1 : 0;
        //     }
        // }

        // register event listeners
        this.events = { // save to removeEventListeners
            mousedown: function (e) {
                // make sure its canvas being clicked
                if(!e.path.includes(that.canvas.canvas)) return;

                var x = Math.floor(e.layerX / that.scale), // get x coord
                    y = Math.floor(e.layerY / that.scale); // get y coord * width

                // is holding
                if (e.button == 0) {
                    that.ui.mousedown = true;
                    that.setBlock(x, y, that.ui.selectedBlock);
                } else if (e.button == 2) {
                    that.ui.auxmousedown = true;
                }
            },
            mouseup: function (e) {
                // is not holding
                if (e.button == 0) {
                    that.ui.mousedown = false;
                } else if (e.button == 2) {
                    that.ui.auxmousedown = false;
                }
            },
            mousemove: function (e) {
                if (that.ui.mousedown || that.ui.auxmousedown) {
                    // is dragging
                    var x = Math.floor(e.layerX / that.scale), // get x coord
                        y = Math.floor(e.layerY / that.scale); // get y coord * width
                    // set position to block
                    if (that.ui.mousedown) {
                        that.setBlock(x, y, that.ui.selectedBlock);
                    } else if (that.ui.auxmousedown) {
                        that.setBlock(x, y, 0);
                    }
                }

            },
            keydown: function (e) {
                // set selectedblock, placeholder, ui will be added
                var k = e.keyCode - 48;
                if (k < 0 || k > 9) return;
                that.ui.selectedBlock = k;
            },
            contextmenu: function (e) {
                e.preventDefault();
            }
        };

        for (let i in this.events) {
            addEventListener(i, this.events[i]);
        }

        // start loops
        this.start();
    }
    get scale() { // forward to canvas
        return this.canvas.scale;
    }
    set scale(e) {
        this.canvas.scale = e;
    }
    get width() { // save copy of width for quick access
        return this._width;
    }
    set width(e) {
        this.canvas.width = e;
        this._width = e;
    }
    get height() { // save copy of height for quick access
        return this._height;
    }
    set height(e) {
        this.canvas.height = e;
        this._height = e;
    }

    start() { // start loops
        this.worker.cmd("setMap", this.MAP, this.width, this.height);
        this.worker.cmd("iterate");

        var that = this;
        this.sI = setInterval(function () {
            that.tick();
        }, this.tickSpeed);
    }
    tick() { // tick, on loop, every iteration
        this.worker.cmd("iterate");
    }
    getMap(e) {
        this.MAP = e[0];
        this.draw();
    }
    setBlock(x, y, b) {
        this.worker.cmd("setBlock", x, y, b);
    }
    draw() { // draw everything
        var height = this.height, // save copy for speed
            width = this.width;

        this.canvas.clear(); // clear canvas

        for (let y = 0; y < height; y++) { // iterate y
            let py = y * width; // for map (1d Uint8Array)

            for (let x = 0; x < width; x++) {

                let it = this.INDEX[this.MAP[py + x]]; // get index item
                if (!it) continue; // if non-existant move on
                this.canvas.set(x, y,
                    it.color
                ); // set pixel
            }
        }
    }
}