const CVS = document.getElementById("c");

/**
 * @type {WebGLRenderingContext}
 */
const X = CVS.getContext("webgl");

console.log(X);


/**
 * Gets a file with path
 * 
 * @param {!String} e Path to file to get
 * @returns {Promise} On then, returns data
 */
function getFile(e) {
    return new Promise(
        function (res, rej) {
            var a = new XMLHttpRequest();
            a.open("GET", e);
            a.addEventListener("load", function () {
                res(a.response);
            });
            a.addEventListener("error", function (e) {
                console.error(e);
                rej(e);
            });
            a.send();
        });
}

/**
 * Draws scene then requests next frame
 * 
 * @returns {void}
 */
function draw() {
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);
    X.drawArrays(X.TRIANGLES, 0, 6);
}

/** 
 * Sets up for drawing, can be called after resize
 * 
 * @returns {void}
*/
function setup() {
    X.viewport(0, 0, X.viewportWidth, X.viewportHeight);
}

/** 
 * Main function
 * @returns {void}
 */
async function main() {
    var shaderSource = await getFile("shader.glsl"),
        vertexSource = await getFile("vertex.glsl"),
        shader = X.createShader(X.FRAGMENT_SHADER),
        vertex = X.createShader(X.VERTEX_SHADER),
        program = X.createProgram();

    X.shaderSource(shader, shaderSource);
    X.compileShader(shader);

    console.log("Compiling fragment shader " +
        (X.getShaderParameter(shader, X.COMPILE_STATUS) ? "" : "un") +
        "successful"
    );
    console.log(X.getShaderInfoLog(shader));

    X.shaderSource(vertex, vertexSource);
    X.compileShader(vertex);

    console.log("Compiling vertex shader " +
        (X.getShaderParameter(vertex, X.COMPILE_STATUS) ? "" : "un") +
        "successful"
    );
    console.log(X.getShaderInfoLog(vertex));


    X.attachShader(program, shader);
    X.attachShader(program, vertex);

    X.linkProgram(program);

    console.log("Linking program " +
        (X.getProgramParameter(program, X.LINK_STATUS) ? "" : "un") +
        "successful"
    );


    var positionLocation = X.getAttribLocation(program, "a_position"),
        resolutionLocation = X.getUniformLocation(program, "u_resolution"),
        buffer = X.createBuffer();

    X.bindBuffer(X.ARRAY_BUFFER, buffer);

    // setRectangle called in tutorial
    // much more called
    X.bufferData(X.ARRAY_BUFFER, new Float32Array([
        0, 0,
        400, 0,
        0, 400,
        0, 400,
        400, 0,
        400, 400
    ]), X.STATIC_DRAW);

    X.clearColor(0, 0, 0, 1);
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);

    X.useProgram(program);
    X.enableVertexAttribArray(buffer);

    X.vertexAttribPointer(positionLocation, 2, X.FLOAT, false, 0, 0);
    
    X.uniform2f(resolutionLocation, X.canvas.width, X.canvas.height);

    draw();
}

main();