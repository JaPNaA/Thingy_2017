/**
 * resize canvas and webgl rendering context
 * @param {HTMLCanvasElement} C canvas
 * @param {WebGLRenderingContext} X rendering context
 */
function resize(C, X) {
    C.width = innerWidth;
    C.height = innerHeight;

    X.viewport(0, 0, C.width, C.height);
}

/**
 * creates a shader with type and source
 * @param {WebGLRenderingContext} X context
 * @param {Number} type shader type
 * @param {String} source shader code
 * @returns {WebGLShader} compiled shader
 */
function createShader(X, type, source) {
    const shader = X.createShader(type);
    X.shaderSource(shader, source);
    X.compileShader(shader);
    
    if (!X.getShaderParameter(shader, X.COMPILE_STATUS)) {
        console.warn(X.getShaderInfoLog(shader));
        
        X.deleteShader(shader);
    }

    return shader;
}

/**
 * Creates a linked program with fragment and vertext shader
 * @param {WebGLRenderingContext} X context
 * @param {String} fragSrc fragment shader code
 * @param {String} vertSrc vertext shader code
 * @returns {WebGLProgram} program
 */
function createProgram(X, fragSrc, vertSrc) {
    const fragShader = createShader(X, X.FRAGMENT_SHADER, fragSrc),
        vertShader = createShader(X, X.VERTEX_SHADER, vertSrc),
        program = X.createProgram();

    X.attachShader(program, fragShader);
    X.attachShader(program, vertShader);
    X.linkProgram(program);

    X.validateProgram(program);

    if (!X.getProgramParameter(program, X.LINK_STATUS)) {
        console.warn(X.getProgramInfoLog(program));

        X.deleteProgram(program);
    }

    return program;
}

function main(fragSrc, vertSrc) {
    /** @type {HTMLCanvasElement} */
    const C = document.getElementById("c");

    /** @type {WebGLRenderingContext} */
    const X = C.getContext("webgl");

    resize(C, X);
    
    const program = createProgram(X, fragSrc, vertSrc);
    X.useProgram(program);

    X.clearColor(0, 0, 0, 1);
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);

    // Create buffers
    // -----------------------------------------------------------------------------
    // buffer data
    const vertices = new Float32Array([
        1,   1, 1.0,
        -1, -1, 1.0,
        1,  -1, 1.0,

        -1, -1, 1,
        -1, 1, 1,
        1, 1, 1
    ]);

    // upload data
    const verticesBuffer = X.createBuffer();
    X.bindBuffer(X.ARRAY_BUFFER, verticesBuffer);

    X.bufferData(X.ARRAY_BUFFER, vertices, X.STATIC_DRAW);

    // link buffer with .glsl variables
    const pVertPos = X.getAttribLocation(program, "vertPos");
    X.vertexAttribPointer(
        pVertPos,
        3,
        X.FLOAT,
        false,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    X.enableVertexAttribArray(pVertPos);

    // Set uniforms
    // -----------------------------------------------------------------------------
    // transformation matrices
    const pWorldMatrix = X.getUniformLocation(program, "worldMatrix");
    X.uniformMatrix4fv(pWorldMatrix, false, Mat.identity());

    const pViewMatrix = X.getUniformLocation(program, "viewMatrix");
    X.uniformMatrix4fv(pViewMatrix, false, Mat.identity());

    const pProjectionMatrix = X.getUniformLocation(program, "projectionMatrix");
    X.uniformMatrix4fv(pProjectionMatrix, false, Mat.identity());

    const pUResolution = X.getUniformLocation(program, "resolution");
    X.uniform2f(pUResolution, C.width, C.height);

    const pTime = X.getUniformLocation(program, "time");
    X.uniform1f(pTime, 0);

    // Draw
    // -----------------------------------------------------------------------------
    X.drawArrays(X.TRIANGLES, 0, 3);

    function reqanf(e) {
        X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);
        X.uniform1f(pTime, e / 1000);
        X.drawArrays(X.TRIANGLES, 0, 6);
        requestAnimationFrame(reqanf);
    }
    requestAnimationFrame(reqanf);
}

async function load() {
    let frag = await fetch("myFrag.glsl").then(e => e.text()),
        vert = await fetch("vert.glsl").then(e => e.text());
    
    main(frag, vert);
}

load();