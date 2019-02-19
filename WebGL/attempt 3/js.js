const CVS = document.getElementById("cvs"),
    X = CVS.getContext("webgl"),
    D = {
        vertexShader: `
        // an attribute will receive data from a buffer
        attribute vec4 a_position;

        // all shaders have a main function
        void main() {

            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = a_position;
        }`,
        fragmentShader: `
        // fragment shaders don't have a default precision so we need
        // to pick one. mediump is a good default. It means "medium precision"
        precision mediump float;

        void main() {
            // gl_FragColor is a special variable a fragment shader
            // is responsible for setting
            gl_FragColor = vec4(1, 0, 1, 1); // return redish-purple
        }
        `
    };

function createShader(t, v){
    var shader = X.createShader(t);
    X.shaderSource(shader, v);
    X.compileShader(shader);
    if(X.getShaderParameter(shader, X.COMPILE_STATUS)){
        return shader;
    }
    console.log("Failed shaders");
    X.deleteShader(shader);
}

function createProgram(v, f){
    var program = X.createProgram();
    X.attachShader(program, v);
    X.attachShader(program, f);
    X.linkProgram(program);
    if(X.getProgramParameter(program, X.LINK_STATUS)){
        return program;
    }
    console.log("Failed program");
    X.deleteProgram(program);
}

var vertexShader = createShader(X.VERTEX_SHADER, D.vertexShader),
    fragmentShader = createShader(X.FRAGMENT_SHADER, D.fragmentShader),
    program = createProgram(vertexShader, fragmentShader),
    posAL = X.getAttribLocation(program, "a_position"),
    positionBuffer = X.createBuffer();

X.bindBuffer(X.ARRAY_BUFFER, positionBuffer);
X.bufferData(X.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0.5, 0.7, 0]), X.STATIC_DRAW);

CVS.width = innerWidth;
CVS.height = innerHeight;

X.viewport(0, 0, CVS.width, CVS.height);
X.clearColor(0, 0, 0, 1);
X.clear(X.COLOR_BUFFER_BIT);

X.useProgram(program);
X.enableVertexAttribArray(posAL);

X.bindBuffer(X.ARRAY_BUFFER, positionBuffer);
X.vertexAttribPointer(posAL, 2, X.FLOAT, false, 0, 0);

X.drawArrays(X.TRIANGLES, 0, 3);
