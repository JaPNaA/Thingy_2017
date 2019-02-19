var gl; // ! THIS IS COPIED -- COMMENTED SECTION BELOW IS NOT.

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram,
        "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram,
        "uMVMatrix");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}



var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        0.0, 1.0, 0.0, -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0,
        pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}



function webGLStart() {
    var canvas = document.querySelector("canvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
webGLStart();
/*var cvs = $("canvas", 1),
    x, shaderProgram,
    triangleVertexPositionBuffer, squareVertexPositionBuffer, //Normally, you would not have 2 buffers.
    mvMatrix = mat4.create(), pMatrix=mat4.create();

function start() { //Start
    initGL(cvs); //Not defined
    initShaders(); //Not defined
    initBuffers(); //Create buffers for the data/shapes - Makes loading faster
    x.clearColor(0, 0, 0, 1); // Clear canvas with black;
    x.enable(x.DEPTH_TEST); // Proper overlapping
    drawFrame(); //Draw
}

function drawFrame() {
    x.viewport(0, 0, x.viewportWidth, x.viewportHeight);
    x.clear(x.COLOR_BUFFER_BIT | x.DEPTH_BUFFER_BIT);
    mat4.perspective(45, x.viewportWidth / x.viewportHeight, 0.1, 100, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-1.5, 0, -7.0]);
    x.bindBuffer(x.ARRAY_BUFFER, triangleVertexPositionBuffer);
    x.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        triangleVertexPositionBuffer.itemSize, x.FLOAT, false, 0, 0);
    setMatrixUniforms();
    x.drawArrays(x.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mat4.translate(mvMatrix, [3, 0, 0]);
    x.bindBuffer(x.ARRAY_BUFFER, squareVertexPositionBuffer);
    x.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        squareVertexPositionBuffer.itemSize, x.FLOAT, false, 0, 0);
    setMatrixUniforms();
    x.drawArrays(x.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

function setMatrixUniforms() {
    x.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    x.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initShaders() {
    var fragmentShader = getShader(x, "shader-fs"),
        vertexShader = getShader(x, "shader-vs");

    shaderProgram = x.createProgram();
    x.attachShader(shaderProgram, vertexShader);
    x.attachShader(shaderProgram, fragmentShader);
    x.linkProgram(shaderProgram);
    if(!x.getProgramParameter(shaderProgram, x.LINK_STATUS)){
        alert("Ya failed with shaders.");
        return;
    }
    x.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = x.getAttribLocation(shaderProgram,
        "aVertexPosition");
    x.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = x.getUniformLocation(shaderProgram,
        "uPMatrix");
    shaderProgram.mvMatrixUniform = x.getUniformLocation(shaderProgram,
        "uMVMatrix");
}

function getShader(x, id) {
    var shaderScript = $("#" + id, 1), shader, k;
    if (!shaderScript) return;
    var str = "",
        k = shaderScript.firstChild,
        shader;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = x.createShader(x.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = x.createShader(x.VERTEX_SHADER);
    } else {
        return;
    }
    x.shaderSource(shader, str);
    x.compileShader(shader);
    if (!x.getShaderParameter(shader, x.COMPILE_STATUS)) {
        alert(x.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

function initGL(e) {
    try {
        x = e.getContext("experimental-webgl");
        x.viewportWidth = canvas.width;
        x.viewportHeight = canvas.height;
    } catch (e) {}
    e || alert("Ya failed");
}

function initBuffers() {
    triangleVertexPositionBuffer = x.createBuffer(); //Creates a buffer for triangleVer...
    x.bindBuffer(x.ARRAY_BUFFER, triangleVertexPositionBuffer); // bind an ARRAY_BUFFER with triangleVer...
    x.bufferData(x.ARRAY_BUFFER, new Float32Array([ //New array with coordinates
        0, 1, 0, //  .
        -1, -1, 0, //
        1, -1, 0 // . .
    ]), x.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3; // Numbers "Across"
    triangleVertexPositionBuffer.numItems = 3; // Numbers "Vertically"

    squareVertexPositionBuffer = x.createBuffer(); // Same for Square
    x.bindBuffer(x.ARRAY_BUFFER, squareVertexPositionBuffer);
    x.bufferData(x.ARRAY_BUFFER, new Float32Array([
        1, 1, 0, // . .
        -1, 1, 0, //
        1, -1, 0 // . .
        - 1, -1, 0
    ]), x.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3; // X / Y / Z
    squareVertexPositionBuffer.numItems = 4; // Amount of coordinates
}

(window.onresize = function() {
    $("canvas").setAttribute("width", innerWidth);
    $("canvas").setAttribute("height", innerHeight);
    start();
})();
*/
