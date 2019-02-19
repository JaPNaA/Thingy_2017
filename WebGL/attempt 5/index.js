function loadFile(e) {
    return new Promise(function(ac, re) {
        var x = new XMLHttpRequest();
        x.open("GET", e);
        x.addEventListener("load", function() {
            ac(x.response);
        });
        x.addEventListener("error", function(e) {
            re(e);
        });
        x.send();
    });
}

async function preload() {
    return {
        vertSrc: await loadFile("vert.glsl"),
        fragSrc: await loadFile("frag.glsl")
    };
}

function createShader(X, type, src) {
    var shader = X.createShader(type);
    X.shaderSource(shader, src);
    X.compileShader(shader);

    console.log(X.getShaderInfoLog(shader));
    return shader;
}

function createProgram(X, vertSrc, fragSrc) {
    var program = X.createProgram(),
        vertShader = createShader(X, X.VERTEX_SHADER, vertSrc),
        fragShader = createShader(X, X.FRAGMENT_SHADER, fragSrc);
    
    X.attachShader(program, vertShader);
    X.attachShader(program, fragShader);
    X.linkProgram(program);

    console.log(X.getProgramInfoLog(program));
    return program;
}

function resize(X) {
    X.viewport(0, 0, X.canvas.width, X.canvas.height);
}

function render() {
    X.clearColor(0, 0, 0, 1);
    X.clear(X.COLOR_BUFFER_BIT);

    
}

async function main() {
    const {vertSrc, fragSrc} = await preload(),
        C = document.getElementById("c"),
        X = C.getContext("webgl") || C.getContext("webgl-experimental");
    
    if (!X) throw "WebGL not supported";

    const D = {
        aspectRatio: C.width / C.height,
        rotation: [0, 1],
        scale: [1.0, 1.0],

        vertexArray: new Float32Array([ //* try to make y vary, with z at 1
            -1, 1, 1,
            1, 1, -1,
            -1, 1, 1,
            -1, -1, -1
        ]),
        vertexBuffer: X.createBuffer(),
        vertexNumComponents: 2,
        vertexCount: null,

        uScalingFactor: null,
        uGlobalColor: null,
        uRotationVector: null,
        aVertexPosition: null,

        then: 0,
        degreesPerSecond: Math.PI * 0.5
    };

    D.vertexCount = D.vertexArray.length / D.vertexNumComponents;

    X.bindBuffer(X.ARRAY_BUFFER, D.vertexBuffer);
    X.bufferData(X.ARRAY_BUFFER, D.vertexArray, X.STATIC_DRAW);

    createProgram(X, vertSrc, fragSrc);
    console.log(X);

    resize(X);
}

main();