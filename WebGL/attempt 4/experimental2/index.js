const C = document.getElementById("c"),
    X = C.getContext('webgl') || C.getContext('experimental-webgl');

var FRAG = "",
    VERT = "";

if (!X) {
    console.error("NO SUPPORT LOL");
}

/**
 * Gets file data, then calls callback
 * @param {!string} e Path of file to get
 * @param {!function} c callback function
 * @returns undefined
 */
function getFile(e, c) {
    let x = new XMLHttpRequest();
    x.open("GET", e);
    x.addEventListener("load", () => c(x.response));
    x.send();
}

/**
 * Gets files 'verts.glsl' and 'frag.glsl' and calls main once both are loaded
 */
function load() {
    var otherLoaded = false;
    getFile("vert.glsl", e => {
        VERT = e;
        if (otherLoaded) main();
        otherLoaded = true;
    });
    getFile("frag.glsl", e => {
        FRAG = e;
        if (otherLoaded) main();
        otherLoaded = true;
    });
}

/**
 * creates a WebGLShader, sets its source(string), and compiles it
 * @param {!WebGLRenderingContext} X 
 * @param {!number} type like X.FRAGMENT_SHADER or X.VERTEX_SHADER
 * @param {!string} SRC the code for the type of shader
 * @returns {WebGLShader} compiled program
 */
function loadShader(X, type, SRC) {
    var shader = X.createShader(type);
    X.shaderSource(shader, SRC);
    X.compileShader(shader);

    // error checking
    if (!X.getShaderParameter(shader, X.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + X.getShaderInfoLog(shader));
        X.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * creates shaders and compiles them, then links in "program"
 * @param {!WebGLRenderbuffer} X 
 * @param {string} VERT vertex shader code
 * @param {string} FRAG fragment shader code
 */
function initializeShaderProgram(X, VERT, FRAG) {
    var vertS = loadShader(X, X.VERTEX_SHADER, VERT),
        fragS = loadShader(X, X.FRAGMENT_SHADER, FRAG),
        prog = X.createProgram();

    X.attachShader(prog, vertS);
    X.attachShader(prog, fragS);
    X.linkProgram(prog);

    // error checking
    if (!X.getProgramParameter(prog, X.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + X.getProgramInfoLog(prog));
        return null;
    }

    return prog;
}

/**
 * Creates buffers targeting ARRAY_BUFFER, and sets values to be a square
 * @param {!WebGLRenderingContext} X 
 */
function initializeBuffers(X) {
    // currently creates buffer for SQUARE location
    var positionsBuffer = X.createBuffer(),
        positions = [
            1.0, 1.0, // top right
            -1.0, 1.0, // top left
            1.0, -1.0, // bottom right
            -1.0, -1.0 // bottom left
        ];

    X.bindBuffer(X.ARRAY_BUFFER, positionsBuffer); // X.ARRAY_BUFFER is a target?
    X.bufferData(
        X.ARRAY_BUFFER, // 'target'
        new Float32Array(positions), // data
        X.STATIC_DRAW // not likey to chage, 
        // gl.STATIC_DRAW: likely to be used often and not change often.
        // gl.DYNAMIC_DRAW: likely to be used often and change often. 
        // gl.STREAM_DRAW: likely to not be used often. 
    ); // set data for buffer

    return {
        positions: positionsBuffer
    };
}

function render(X, programInfo, buffers) {
    var projectionMatrix = [
            1.3579951524734497, 0, 0, 0,
            0, 2.4142136573791504, 0, 0,
            0, 0, -1.0020020008087158, -1,
            0, 0, -0.20020020008087158, 0
        ],
        modelViewMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -3, 1
        ];
    {
        const numComponents = 2; // pull out 2 values per iteration
        const type = X.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        X.bindBuffer(X.ARRAY_BUFFER, buffers.positions);
        X.vertexAttribPointer(
            programInfo.attribute.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        X.enableVertexAttribArray(
            programInfo.attribute.vertexPosition);
    }
    // Tell WebGL to use our program when drawing

    X.useProgram(programInfo.prog);

    // Set the shader uniforms

    X.uniformMatrix4fv(
        programInfo.uniform.projectionMatrix,
        false,
        projectionMatrix);
    X.uniformMatrix4fv(
        programInfo.uniform.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        X.drawArrays(X.TRIANGLE_STRIP, offset, vertexCount);
    }
}

/**
 * main function, everything happens here
 */
function main() {
    var program = initializeShaderProgram(X, VERT, FRAG), // create program with vertex and fragment shaders
        dt = { // programInfo, could be a class
            prog: program,
            attribute: {
                vertexPosition: X.getAttribLocation(program, "attributeVec4_VertexPosition")
            },
            uniform: {
                modelViewMatrix: X.getUniformLocation(program, "uniformMat4_ModelViewMatrix"),
                projectionMatrix: X.getUniformLocation(program, "uniformMat4_ProjectionMatrix")
            }
        },
        buffers = initializeBuffers(X);

    X.enable(X.DEPTH_TEST);
    X.depthFunc(X.LEQUAL); // could be wrong
    X.clearColor(0.0, 0.0, 0.0, 1.0);
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);

    render(X, dt, buffers);
}

load(); // call preload to main