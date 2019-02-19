class Square {
    constructor(x, y, z) {
        this.verts = [
            [0, 0],
            [0, 1],
            [1, 1],
            
            [0, 0],
            [1, 1],
            [1, 0]
        ];

        this.vertColor = [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 1],

            [0, 1, 1],
            [0, 0, 1],
            [1, 0, 1]
        ];

        this.x = x;
        this.y = y;
        this.z = z || 0;
    }

    calcBuffer() {
        let buff = new Float32Array(Square.bufHeight * Square.bufWidth);

        for (let i = 0; i < Square.bufHeight; i++) {
            buff[Square.bufWidth * i + 0] = this.verts[i][0];
            buff[Square.bufWidth * i + 1] = this.verts[i][1];
            
            buff[Square.bufWidth * i + 2] = this.x;
            buff[Square.bufWidth * i + 3] = this.y;
            buff[Square.bufWidth * i + 4] = this.z;

            buff[Square.bufWidth * i + 5] = this.vertColor[i][0];
            buff[Square.bufWidth * i + 6] = this.vertColor[i][1];
            buff[Square.bufWidth * i + 7] = this.vertColor[i][2];
        }

        return buff;
    }
}

Square.bufWidth = 8;
Square.bufHeight = 6;

async function main() {
    const X = new WebGL();
    X.appendTo(document.body);
    X.width = 1280;
    X.height = 720;
    X.enableDepth();
    
    const program = await X.createProgramPromise(
        fetch("shaders/frag.glsl").then(e => e.text()), 
        fetch("shaders/vert.glsl").then(e => e.text())
    );
    X.useProgram(program);

    const objects = [],
        squareBufSize = Square.bufHeight * Square.bufWidth;

    objects.push(new Square(-0.75, 0.25, -0.1)); // drawn first, but should still be on top
    objects.push(new Square(0, 0));
    objects.push(new Square(-1.5, 0.25));

    let buffer = new Float32Array(objects.length * squareBufSize);
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        buffer.set(object.calcBuffer(), i * squareBufSize);
    }

    X.createBuffer(buffer, Square.bufWidth, "STATIC_DRAW");

    X.setAttrib("aPos", "FLOAT", 2, 0, false);
    X.setAttrib("aModelT", "FLOAT", 3, 2, false);
    X.setAttrib("aColor", "FLOAT", 3, 5, false);

    const cameraM = new Mat4();
    cameraM.aspect(X.canvas.width / X.canvas.height);

    let cameraMScale = 1;
    let cameraMScalet = 1;

    X.setUniform("cameraM", "Matrix4f", cameraM, false);

    addEventListener("wheel", function(e) {
        if (e.deltaY > 0) {
            // scroll down (zoom out)
            cameraMScalet *= 0.9;
        } else {
            // scroll up (zoom in)
            cameraMScalet /= 0.9;
        }
    });


    function reqanf() {
        cameraMScale += (cameraMScalet - cameraMScale) / 8;

        let mmat = Mat4.scale(cameraM, cameraMScale, cameraMScale);
        X.setUniform("cameraM", "Matrix4f", mmat, false);

        X.render();
        requestAnimationFrame(reqanf);
    }
    requestAnimationFrame(reqanf);
}

main();