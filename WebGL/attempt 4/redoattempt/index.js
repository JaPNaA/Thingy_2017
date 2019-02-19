const C = document.getElementById('c'),
    X = C.getContext('webgl') || C.getContext('experimental-webgl');

function makeShader(type, src) {
    var shader = X.createShader(type);
    X.shaderSource(shader, src);
    X.compileShader(shader);
    console.log(X.getShaderInfoLog(shader));
    return shader;
}

function createProgram() {
    var program = X.createProgram(),
        frag = makeShader(X.FRAGMENT_SHADER, FRAGSrc),
        vert = makeShader(X.VERTEX_SHADER, VERTSrc);
    X.attachShader(program, frag);
    X.attachShader(program, vert);
    X.linkProgram(program);
    return program;
}

function createBuffer() {
    var posbuff = X.createBuffer(),
        posdata = [
             1,  1,
            -1,  1,
             1, -1,
            -1, -1
        ];
    X.bindBuffer(X.ARRAY_BUFFER, posbuff);
    X.bufferData(
        X.ARRAY_BUFFER, 
        new Float32Array(posdata), 
        X.STATIC_DRAW
    );
    return {
        pos: posbuff
    };
}

function render(program, programInfo, buffer) {
    var projectionMatrix = mat4.create(),
        modelViewMatrix = mat4.create();

    X.clearColor(0, 0, 0, 1);
    X.clearDepth(1);
    X.enable(X.DEPTH_TEST);
    X.depthFunc(X.LEQUAL);
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);

    // set a_VertexPosition
    X.bindBuffer(X.ARRAY_BUFFER, buffer.pos);
    X.vertexAttribPointer(
        programInfo.a_VertexPosition,
        2, // number of components
        X.FLOAT, // type
        false, // normalize
        0, // stride
        0, // offset
    );
    X.enableVertexAttribArray(
        programInfo.a_VertexPosition
    );

    X.useProgram(program);

    // set u_ProjectionMatrix
    mat4.perspective(
        projectionMatrix,
        10 * Math.PI / 180, // fov
        X.canvas.width / X.canvas.height, // aspect ratio
        0.1, // near
        100 // far
    );

    X.uniformMatrix4fv(
        programInfo.u_ProjectionMatrix, // location
        false, // transpose
        projectionMatrix
    );

    // set u_ModelViewMatrix
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [0, 0, -6]
    );

    X.uniformMatrix4fv(
        programInfo.u_ModelViewMatrix,
        false,
        modelViewMatrix
    );

    // draw
    X.drawArrays(
        X.TRIANGLE_STRIP, 
        0, // offset
        4 // verticies
    );
}

function main() {
    var program = createProgram(),
        buffer = createBuffer(),
        programInfo = {
            a_VertexPosition: X.getAttribLocation(program, "a_VertexPosition"),
            u_ProjectionMatrix: X.getUniformLocation(program, "u_ProjectionMatrix"),
            u_ModelViewMatrix: X.getUniformLocation(program, "u_ModelViewMatrix")
        };
    render(program, programInfo, buffer);
}

main();