/** @type {HTMLCanvasElement} */
const C = document.getElementById("c");
/** @type {WebGLRenderingContext} */
const X = C.getContext("webgl");

function createShader(type, src) {
    const shader = X.createShader(type);
    X.shaderSource(shader, src);
    X.compileShader(shader);

    if (!X.getShaderParameter(shader, X.COMPILE_STATUS)) {
        console.warn("Failed to compile shader\n" + X.getShaderInfoLog(shader));
    }

    return shader;
}

function createProgram(VERT, FRAG) {
    const program = X.createProgram(),
        vert = createShader(X.VERTEX_SHADER, VERT),
        frag = createShader(X.FRAGMENT_SHADER, FRAG);

    X.attachShader(program, vert);
    X.attachShader(program, frag);
    X.linkProgram(program);

    return program;
}

let camX = 0,
    camY = 0,
    camVX = 0,
    camVY = 0,
    camAX = 0,
    camAY = 0;

function draw(mainspace) {
    camVX *= 0.95;
    camVY *= 0.95;

    camX += camVX;
    camY += camVY;

    camVX += camAX;
    camVY += camAY;

    mainspace.updateCameraPosition(camX, camY);

    X.clear(X.COLOR_BUFFER_BIT);
    X.drawArrays(X.TRIANGLES, 0, 12);
}

function main(VERT, FRAG) {
    X.clearColor(0, 0, 0, 1);

    C.width = innerWidth;
    C.height = innerHeight;

    X.viewport(0, 0, C.width, C.height);

    const program = createProgram(VERT, FRAG);
    X.useProgram(program);

    const bufferData = new Float32Array([
        0, 0,
        0, 1,
        1, 1,

        0, 0,
        1, 1,
        1, 0,

        2, 2,
        2, 3,
        3, 3,

        2, 2,
        3, 3,
        3, 2
    ]);
    const buffer = X.createBuffer();
    X.bindBuffer(X.ARRAY_BUFFER, buffer);
    X.bufferData(X.ARRAY_BUFFER, bufferData, X.STATIC_DRAW);

    const paPos = X.getAttribLocation(program, "aPos");
    X.vertexAttribPointer(
        paPos, 
        2,
        X.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    X.enableVertexAttribArray(paPos);

    function updateCameraPosition(x, y) {
        const aspect = C.width / C.height,
            scale = 0.1;

        const pCameraM = X.getUniformLocation(program, "cameraM");
        X.uniformMatrix4fv(pCameraM, false, new Float32Array([
            1 / aspect * scale, 0, 0, 0,
            0, scale, 0, 0,
            0, 0, 1, 0,
            -x, -y, 0, 1
        ]));
    }


    addEventListener("keydown", function (e) {
        switch (e.keyCode) {
        case 87:
            camAY = 0.001;
            break;
        case 83:
            camAY = -0.001;
            break;
        case 68:
            camAX = 0.001;
            break;
        case 65:
            camAX = -0.001;
            break;
        }
    });
    addEventListener("keyup", function (e) {
        switch (e.keyCode) {
        case 87:
        case 83:
            camAY = 0;
            break;
        case 68:
        case 65:
            camAX = 0;
            break;
        }
    });

    function reqanf() {
        draw({
            updateCameraPosition: updateCameraPosition
        });
        requestAnimationFrame(reqanf);
    }

    reqanf();
}

async function load() {
    const VERT = await fetch("vert.glsl").then(e => e.text()),
        FRAG = await fetch("frag.glsl").then(e => e.text());
    
    main(VERT, FRAG);
}

load();