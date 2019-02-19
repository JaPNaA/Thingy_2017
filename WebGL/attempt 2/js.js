const cvs = document.getElementById("cvs"),
    X = cvs.getContext("webgl"),
    X2D = cvs.getContext("2d"),
    shaders = {
        vertex: `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying lowp vec4 vColor;

            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
            }
        `,
        fragment: `
            varying lowp vec4 vColor;

            void main() {
                gl_FragColor = vColor;
            }
        `,
        init: function() {
            const VS = this.load(X.VERTEX_SHADER, this.vertex),
                FS = this.load(X.FRAGMENT_SHADER, this.fragment),
                PROG = X.createProgram();
            X.attachShader(PROG, VS);
            X.attachShader(PROG, FS);
            X.linkProgram(PROG);
            if (!X.getProgramParameter(PROG, X.LINK_STATUS)) {
                alert("Failed shader");
            }
            return PROG;
        },
        load: function(t, s) {
            const S = X.createShader(t);
            X.shaderSource(S, s);
            X.compileShader(S);
            if (!X.getShaderParameter(S, X.COMPILE_STATUS)) {
                alert("Failed compile");
                X.deleteShader(S);
            }
            return S;
        },
        info: null
    },
    buffers = {
        init: function() {
            const posB = X.createBuffer(),
                colB = X.createBuffer();
            X.bindBuffer(X.ARRAY_BUFFER, posB);
            X.bufferData(
                X.ARRAY_BUFFER,
                new Float32Array([
                    // Front face
                  -1.0, -1.0,  1.0,
                   1.0, -1.0,  1.0,
                   1.0,  1.0,  1.0,
                  -1.0,  1.0,  1.0,

                  // Back face
                  -1.0, -1.0, -1.0,
                  -1.0,  1.0, -1.0,
                   1.0,  1.0, -1.0,
                   1.0, -1.0, -1.0,

                  // Top face
                  -1.0,  1.0, -1.0,
                  -1.0,  1.0,  1.0,
                   1.0,  1.0,  1.0,
                   1.0,  1.0, -1.0,

                  // Bottom face
                  -1.0, -1.0, -1.0,
                   1.0, -1.0, -1.0,
                   1.0, -1.0,  1.0,
                  -1.0, -1.0,  1.0,

                  // Right face
                   1.0, -1.0, -1.0,
                   1.0,  1.0, -1.0,
                   1.0,  1.0,  1.0,
                   1.0, -1.0,  1.0,

                  // Left face
                  -1.0, -1.0, -1.0,
                  -1.0, -1.0,  1.0,
                  -1.0,  1.0,  1.0,
                  -1.0,  1.0, -1.0
              ]),
                X.STATIC_DRAW
            );

            const faceColors = [
                [1.0,  1.0,  1.0,  1.0],    // Front face: white
                [1.0,  0.0,  0.0,  1.0],    // Back face: red
                [0.0,  1.0,  0.0,  1.0],    // Top face: green
                [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
                [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
                [1.0,  0.0,  1.0,  1.0]     // Left face: purple
            ];

            var colors = [];

            for (let i in faceColors) {
                colors.push(i, i, i, i);
            }

            X.bindBuffer(X.ARRAY_BUFFER, colB);
            X.bufferData(
                X.ARRAY_BUFFER,
                new Float32Array(colors),
                X.STATIC_DRAW
            );

            const indexBuffer = X.createBuffer();
            X.bindBuffer(X.ELEMENT_ARRAY_BUFFER, indexBuffer);

            const indices = [
              0,  1,  2,      0,  2,  3,
              4,  5,  6,      4,  6,  7,
              8,  9,  10,     8,  10, 11,
              12, 13, 14,     12, 14, 15,
              16, 17, 18,     16, 18, 19,
              20, 21, 22,     20, 22, 23
            ];

            X.bufferData(X.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices), X.STATIC_DRAW);

            this.dt = {
                pos: posB,
                col: colB,
                indc: indexBuffer
            };
            return this.dt;
        }
    },
    dt = {
        rot: 0,
        then: 0
    };

if (!X) {
    // check support
    X2D.font = "36px Arial";
    X2D.fillText("Your browser doesn't support WebGL", 64, 64);
}

(function() {
    var a = shaders.init();
    shaders.info = {
        prog: a,
        atrLocation: {
            pos: X.getAttribLocation(a, "aVertexPosition"),
            col: X.getAttribLocation(a, "aVertexColor")
        },
        unfLocation: {
            projection: X.getUniformLocation(a, "uProjectionMatrix"),
            modelView: X.getUniformLocation(a, "uModelViewMatrix")
        }
    };
})();

function clear() {
    // X.clearColor(0, 0, 0, 1); // in rgba 0 -> 1
    // X.clear(X.COLOR_BUFFER_BIT);

    X.clearColor(0, 0, 0, 1);
    X.clearDepth(1);
    X.enable(X.DEPTH_TEST);
    X.depthFunc(X.LEQUAL);
    X.clear(X.COLOR_BUFFER_BIT | X.DEPTH_BUFFER_BIT);
}

function drawScene(p, b) {
    const modelViewM = mat4.create(),
        projMatrix = mat4.create();
    clear();
    mat4.rotate(modelViewM, modelViewM, dt.rot, [0, 1, 0]);
    mat4.perspective(
        projMatrix, // projection matrix
        Math.PI / 4, // fov
        cvs.width / cvs.height, // aspect ratio
        0.1, // z near
        100 // z far
    );
    mat4.translate(modelViewM, modelViewM, [-0, 0, -6]);

    X.bindBuffer(X.ARRAY_BUFFER, b.pos);
    X.vertexAttribPointer(
        p.atrLocation.pos,
        3, // num components
        X.FLOAT, // type
        false, // normalize
        0, // stride
        0 // offset
    );
    X.enableVertexAttribArray(p.atrLocation.pos);

    X.bindBuffer(X.ARRAY_BUFFER, b.col);
    X.vertexAttribPointer(p.atrLocation.col, 4, X.FLOAT, false, 0, 0);
    X.enableVertexAttribArray(p.atrLocation.col);

    X.bindBuffer(X.ELEMENT_ARRAY_BUFFER, b.indc);
    X.drawElements(X.TRIANGLES, 36, X.UNSIGNED_SHORT, 0);

    X.useProgram(p.prog);
    X.uniformMatrix4fv(p.unfLocation.modelView, false, modelViewM);
    X.uniformMatrix4fv(p.unfLocation.projection, false, projMatrix);
    X.drawArrays(X.TRIANGLE_STRIP, 0, 4); // offset, vertex count
}

function render(n) {
    dt.rot += (n - dt.then) / (1000 / 1 /* speed */);
    dt.then = n;
    drawScene(shaders.info, buffers.dt);
    requestAnimationFrame(render);
}

drawScene(shaders.info, buffers.init());
render(0);
