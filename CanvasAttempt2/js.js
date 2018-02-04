alert("Ok, so this is fairly useless... But I mean... I'm learning.... \nFor a full year...");

var vars = {
    ctx: undefined,
    config: {
        fps: 60
    },
    canvas: undefined,
    draw: function() {
        var a = vars.ctx,
            b = vars.canvas;
        a.fillStyle = "white";
        a.fillRect(0, 0, b.width, b.height);
        vars.obs.forEach(function(ob) {
            switch (ob[0]) {
                case "rect":
                    a.fillStyle = ob[1];
                    var f = ob[2].split(',');
                    a.fillRect(f[0], f[1], f[2], f[3]);
                    break;
                case "text":
                    var f = ob[1].split(' ');
                    a.fillStyle = f[0];
                    a.font = f[1] + " " + f[2];
                    f = ob[2].split(',')
                    a.fillText(ob[3], f[0], f[1]);
                    break;
                default:
                    console.warn(
                        'Unknown object inside vars.obs');
                    break;
            }
        });
        setTimeout(function() {
            vars.aniframe()(vars.draw);
        }, 1000 / vars.config.fps);
    },
    obs: [],
    aniframe: undefined,
    coolThing: false,
    started: false,
    keys: {
        up: [],
        down: [],
        left: [],
        right: []
    },
    tInsert: false,
    coolThingI: undefined
};
(function() { //Setup
    var a = document.createElement('canvas');
    a.innerHTML =
        "Your browser does not support the canvas element. <br> Use Chrome, Firefox, Safari, or Edge, and make sure your browsers are up to date.";
    a.setAttribute('width', innerWidth);
    a.setAttribute('height', innerHeight);
    a.style =
        "border:0; margin:0; padding:0; width:100%; height:100%; position:fixed;";
    document.body.appendChild(a);
    vars.ctx = a.getContext('2d');
    vars.ctx.fillRect(0, 0, innerWidth, innerHeight);
    vars.canvas = a;
}());

(function() { //Start frames
    vars.aniframe = function() {
        return requestAnimationFrame ||
            mozRequestAnimationFrame ||
            webkitRequestAnimationFrame ||
            msRequestAnimationFrame ||
            oRequestAnimationFrame;
    }
    vars.draw();
}());

(function() { //Resize Canvas
    window.addEventListener('resize', function() {
        a = vars.canvas;
        a.setAttribute('width', innerWidth);
        a.setAttribute('height', innerHeight);
    }, false);
}());

(function() { //Start actual program
    vars.obs.push(["text", "lightgrey 24px arial", "32,46",
        "Press [Enter] to start/clear."
    ]);
    vars.obs.push(["text", "lightgrey 24px arial", "32,81",
        "Press or hold [Space] to \"Paint\""
    ]);
    vars.obs.push(["text", "lightgrey 24px arial", "32,116",
        "Press or hold [Z] to Undo"
    ]);
    vars.obs.push(["text", "lightgrey 24px arial", "32,151",
        "Press [Q] to toggle Cool Thing"
    ]);

    function move(e, f, g) {
        var k = vars.keys;
        if (vars.started) {
            if (f) {
                switch (e) {
                    case "up":
                        moveB(e);
                        k.up.push(setTimeout(function() {
                            moveB(e);
                            move(e, true, 75);
                        }, g || 200));
                        break;
                    case "down":
                        moveB(e);
                        k.down.push(setTimeout(function() {
                            moveB(e, 10);
                            move(e, true, 75);
                        }, g || 200));
                        break;
                    case "left":
                        moveB(e);
                        k.left.push(setTimeout(function() {
                            moveB(e, 10);
                            move(e, true, 75);
                        }, g || 200));
                        break;
                    case "right":
                        moveB(e);
                        k.right.push(setTimeout(function() {
                            moveB(e, 10);
                            move(e, true, 75);
                        }, g || 200));
                        break;
                    default:
                        console.warn('unkown call:' + e);
                        break;
                }
            } else {
                switch (e) {
                    case "up":
                        k.up.forEach(function(i) {
                            clearInterval(i);
                        });
                        k.up = [];
                        break;
                    case "down":
                        k.down.forEach(function(i) {
                            clearInterval(i);
                        });
                        k.down = [];
                        break;
                    case "left":
                        k.left.forEach(function(i) {
                            clearInterval(i);
                        });
                        k.left = [];
                        break;
                    case "right":
                        k.right.forEach(function(i) {
                            clearInterval(i);
                        });
                        k.right = [];
                        break;
                    default:
                        console.warn('unkown call:' + e);
                        break;
                }
            }
        }
    }

    function moveB(e) {
        var a = vars.obs,
            b = a[a.length - 1][2].split(",");
        switch (e) {
            case "up":
                b[1] = b[1] - 1;
                break;
            case "down":
                b[1] = b[1] - 1 + 2;
                break;
            case "left":
                b[0] = b[0] - 1;
                break;
            case "right":
                b[0] = b[0] - 1 + 2;
                break;
            default:
                console.warn('unkown call on lower level:' + e);
                break;
        }
        if (vars.tInsert) {
            insert(true);
        }
        a[a.length - 1][2] = (function() {
            var g = "";
            b.forEach(function(ob) {
                g += ob + ',';
            });
            return g.substring(0, g.length - 1);
        }());
    }

    function clear() {
        vars.obs = [
            ["rect", "red", "14,14,7,7"]
        ];
    }

    function insert(e) {
        vars.tInsert = e;
        if (e) {
            vars.obs.unshift(['rect', 'black', vars.obs[vars.obs.length - 1]
                [2]
            ]);
        }
    }

    function coolThing(e) {
        if (e) {
            vars.coolThing = !vars.coolThing;
            if (vars.coolThing && vars.started) {
                vars.coolThingI = setInterval(function() {
                    vars.obs.forEach(function(ob, ix) {
                        if (ix!=vars.obs.length-1) {
                            var b = ob[2].split(',');
                            b[0] = b[0] - 1 + 2;
                            vars.obs[ix][2] = (function() {
                                var g = "";
                                b.forEach(function(
                                    ob) {
                                    g += ob +
                                        ',';
                                });
                                return g.substring(
                                    0, g
                                    .length - 1
                                );
                            }());
                        }
                    });
                }, 5);
            } else {
                clearInterval(vars.coolThingI);
            }
        }
    }

    function unsert() {
        if (vars.obs.length > 1) {
            vars.obs.shift();
        }
    }
    window.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 87: //W
                move("up", true);
                break;
            case 38: //up
                move("up", true);
                break;
            case 65: //A
                move("left", true);
                break;
            case 37: //left
                move("left", true);
                break;
            case 83: //S
                move("down", true);
                break;
            case 40: //down
                move("down", true);
                break;
            case 68: //D
                move("right", true);
                break;
            case 39: //right
                move("right", true);
                break;
            case 13: //enter
                clear();
                vars.started = true;
                break;
            case 32: //Space
                insert(true);
                break;
            case 81: //Q
                coolThing(true);
                break;
            case 90: //Z
                unsert();
                break;
            default:
                break;
        }
    }, false);
    window.addEventListener('keyup', function(e) {
        switch (e.keyCode) {
            case 87: //W
                move("up", false);
                break;
            case 38: //up
                move("up", false);
                break;
            case 65: //A
                move("left", false);
                break;
            case 37: //left
                move("left", false);
                break;
            case 83: //S
                move("down", false);
                break;
            case 40: //down
                move("down", false);
                break;
            case 68: //D
                move("right", false);
                break;
            case 39: //right
                move("right", false);
                break;
            case 13: //enter
                clear();
                vars.started = true;
                break;
            case 32: //Space
                insert(false);
                break;
            case 81: //Q
                coolThing(false);
                break;
            default:
                break;
        }
    }, false);
}());
