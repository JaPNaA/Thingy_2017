importScripts("./utils.js");

const D = {
        map: null,
        width: null,
        height: null,
        then: Date.now()
    },
    C = {
        throttle: 10
    };

function blockLogic(t, i, m, mc, ml, w, h) { // logic for every block
    switch (t) {
        case 2: // GravityBlock
            if (m[i + w] === 0) { // if below is air
                m[i + w] = t; // move down
                m[i] = 0;
            }
            break;

        case 3: // AntiGravityBlock
            if (m[i - w] === 0) { // if above is air
                m[i - w] = t; // move up
                m[i] = 0;
            }
            break;

        case 4: // RandomWalk
        case 5: // RandomWalkBlue
            if (m[i + w] === 5 || m[i - w] === 5 || m[i - 1] === 5 || m[i + 1] === 5) {
                m[i] = 5;
                break;
            }
            switch (Math.floor(Math.random() * 4)) { // get random 0 -> 3
                case 0:
                    if (m[i + w] === 0) {
                        m[i + w] = t;
                        m[i] = 0;
                    }
                    break;
                case 1:
                    if (m[i + 1] === 0) {
                        m[i + 1] = t;
                        m[i] = 0;
                    }
                    break;
                case 2:
                    if (m[i - 1] === 0) {
                        m[i - 1] = t;
                        m[i] = 0;
                    }
                    break;
                case 3:
                    if (m[i - w] === 0) {
                        m[i - w] = t;
                        m[i] = 0;
                    }
            }
            break;
    }
}

function iterateMap() {
    var ml = D.map.length,
        m = D.map,
        w = D.width,
        h = D.height,
        mc = copyUint8Array(m);
    for (let i = 0; i < ml; i++) {
        blockLogic(mc[i], i, m, mc, ml, w, h);
    }
}

function sendMap() {
    send(["map", D.map]);
}

function setBlock(pos, b) {
    D.map[pos] = b;
}

function send(e) {
    var now = Date.now();
    if(D.then + C.throttle <= now) {
        postMessage(e);
        D.then = now;
    }
}

function parseMessage(e) {
    switch (e[0]) {
        case "setMap":
            D.map = e[1];
            D.width = e[2];
            D.height = e[3];
            break;
        case "iterate":
            iterateMap();
            sendMap();
            break;
        case "setBlock":
            setBlock(e[1] + e[2] * D.width, e[3]);
    }
}

addEventListener("message", function (e) {
    parseMessage(e.data);
});