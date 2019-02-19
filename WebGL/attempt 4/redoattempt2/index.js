const C = document.getElementById('c'),
    X = C.getContext('webgl') || C.getContext('experimental-webgl'),
    D = {
        program: null,
        buffers: null,
        vars: null
    };

function resize() {
    C.width = innerWidth;
    C.height = innerHeight;
    C.style.position = "fixed";
    document.body.style.margin = document.body.style.padding = document.body.style.border = C.style.left = C.style.top = "0px";

    render();
}

function createShader(t, s) {
    var sh = X.createShader(t);
    X.shaderSource(sh, s);
    X.compileShader(sh);

    console.log(X.getShaderInfoLog(sh));

    return sh;
}

function createProgram(FRAG, VERT) {
    var frag = createShader(X.FRAGMENT_SHADER, FRAG),
        vert = createShader(X.VERTEX_SHADER, VERT),
        prog = X.createProgram();

    X.attachShader(prog, frag);
    X.attachShader(prog, vert);
    X.linkProgram(prog);

    console.log(X.getProgramInfoLog(prog));

    return prog;
}

function createBuffers() {
    var a_vertexPosition = X.createBuffer(),
        positions = [ //
            1, 1, //
            -1, 1, //
            1, -1, //
            -1, -1
        ],
        u_modelViewMatrix = mat4.create(), // these arn't buffers, btw
        u_projectionMatrix = mat4.create();

    mat4.translate(
        u_modelViewMatrix, u_modelViewMatrix, [0, 0, -6]
    );
    mat4.perspective(
        u_projectionMatrix,
        45 * Math.PI / 180,
        C.width / C.height,
        0.1,
        100
    );

    X.bindBuffer(X.ARRAY_BUFFER, a_vertexPosition);
    X.bufferData(
        X.ARRAY_BUFFER,
        new Float32Array(positions),
        X.STATIC_DRAW
    );

    return {
        a_vertexPosition: a_vertexPosition,
        positions: positions,
        u_modelViewMatrix: u_modelViewMatrix,
        u_projectionMatrix: u_projectionMatrix
    };
}

function loadVars() {
    X.useProgram(D.program);

    X.uniformMatrix4fv(
        D.vars.u_modelViewMatrix, false,
        D.buffers.u_modelViewMatrix
    );
    X.uniformMatrix4fv(
        D.vars.u_projectionMatrix, false,
        D.buffers.u_projectionMatrix
    );

    X.bindBuffer(X.ARRAY_BUFFER, D.buffers.a_vertexPosition);
    X.vertexAttribPointer(
        D.buffers.a_vertexPosition,
        2,
        X.FLOAT,
        false,
        0,
        0
    );
    X.enableVertexAttribArray(D.buffers.a_vertexPosition);
}

function main(FRAG, VERT) {
    console.log(FRAG, "\n\n --- \n\n", VERT);

    X.clearColor(0, 0, 0, 1);
    X.enable(X.DEPTH_TEST);
    X.depthFunc(X.LEQUAL);
    X.clearDepth(1);

    D.program = createProgram(FRAG, VERT);
    D.vars = {
        a_vertexPosition: X.getAttribLocation(D.program, "a_vertexPosition"),
        u_modelViewMatrix: X.getUniformLocation(D.program, "u_modelViewMatrix"),
        u_projectionMatrix: X.getUniformLocation(D.program, "u_projectionMatrix"),
    };

    render();
}

function render() {
    X.useProgram(D.program);

    D.buffers = createBuffers();
    loadVars(D.buffers);

    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);
    X.drawArrays(X.TRIANGLE_STRIP, 0, 4);
}

function getFile(src, c) {
    var x = new XMLHttpRequest();
    x.open("GET", src);
    x.responseType = "text";
    x.addEventListener("load", function () {
        c(x.response);
    });
    x.send();
}

function pre() {
    var req = 0,
        load = 0,
        FRAG, VERT;

    function cl() {
        load++;
        if (load >= req) {
            main(FRAG, VERT);
        }
    }

    req++;
    getFile("vert.glsl", e => {
        VERT = e;
        cl();
    });

    req++;
    getFile("frag.glsl", e => {
        FRAG = e;
        cl();
    });
}
pre();

addEventListener('resize', resize);
resize();