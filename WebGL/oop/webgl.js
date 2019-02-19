class WebGL {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement("canvas");

        /** @type {WebGLRenderingContext} */
        this.context = this.canvas.getContext("webgl");

        /** @type {WebGLProgram} */
        this.program = null;

        /** @type {WebGLBuffer} */
        this.buffer = null;

        /** @type {Number[]} */
        this.background = [0, 0, 0, 1];

        this.sizeMap = {
            "FLOAT": 4
        };
        this.context.clearDepth(1);
    }

    /**
     * appends canvas to parent
     * @param {Element} parent parent to append to
     */
    appendTo(parent) {
        parent.appendChild(this.canvas);
    }

    get width() {
        return this.canvas.width;
    }
    set width(e) {
        this.canvas.width = e;
        this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    get height() {
        return this.canvas.height;
    }
    set height(e) {
        this.canvas.height = e;
        this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    get background() {
        return this._background;
    }
    set background(e) {
        this._background = e;
        this.context.clearColor(e[0], e[1], e[2], e[3]);
    }

    /**
     * Creates a WebGL shader
     * @param {Number} type this.context.VERTEX_SHADER or this.context.FRAGMENT_SHADER
     * @param {String} src shader source code
     * @returns {WebGLShader} shader
     */
    createShader(type, src) {
        const shader = this.context.createShader(type);
        this.context.shaderSource(shader, src);
        this.context.compileShader(shader);

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            throw new Error(
                "Failed to create shader\n" +
                this.context.getShaderInfoLog(shader)
            );
        }

        return shader;
    }

    /**
     * Creates a vertex shader
     * @param {String} src shader source code
     * @return {WebGLShader} vertex shader
     */
    createVertexShader(src) {
        return this.createShader(this.context.VERTEX_SHADER, src);
    }

    /**
     * Creates a fragment shader
     * @param {String} src shader source code
     * @return {WebGLShader} fragment shader
     */
    createFragmentShader(src) {
        return this.createShader(this.context.FRAGMENT_SHADER, src);
    }

    /**
     * Creates a program and attaches a fragment and vertex shader
     * @param {String} frag fragment shader source code
     * @param {String} vert vertex shader source code
     * @returns {WebGLProgram} program
     */
    createProgram(frag, vert) {
        const prog = this.context.createProgram(),
            fragS = this.createFragmentShader(frag),
            vertS = this.createVertexShader(vert);

        this.context.attachShader(prog, fragS);
        this.context.attachShader(prog, vertS);
        this.context.linkProgram(prog);
        this.context.validateProgram(prog);

        if (!this.context.getProgramParameter(prog, this.context.LINK_STATUS)) {
            throw new Error(
                "Failed to create program\n" +
                this.context.getProgramInfoLog(prog)
            );
        }

        return prog;
    }

    /**
     * Asynchronously creates a program
     * @param {Promise<String>} frag promise to return string for fragment shader code
     * @param {Promise<String>} vert promise to return string for vertex shader code
     * @returns {Promise<WebGLProgram>} promise to return program
     */
    createProgramPromise(frag, vert) {
        return Promise.all([frag, vert]).then(e => this.createProgram(e[0], e[1]));
    }

    /**
     * Switch active program
     * @param {WebGLProgram} program existing program to switch to
     */
    useProgram(program) {
        this.program = program;
        this.context.useProgram(program);
    }

    /**
     * Creates a buffer and loads data into it
     * @param {Array<Number>} data data to go in buffer
     * @param {Number} elements amount of elements in a row
     * @param {"STATIC_DRAW"|"DYNAMIC_DRAW"|"STREAM_DRAW"} mode how much this buffer will be updated
     * @returns {WebGLBuffer} buffer
     */
    createBuffer(data, elements, mode) {
        const buffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(data), this.context[mode]);
        buffer.elements = elements;
        buffer.size = data.length;
        this.buffer = buffer;
        return buffer;
    }

    /**
     * Switches active buffer
     * @param {WebGLBuffer} buffer existing buffer to switch to
     */
    setBuffer(buffer) {
        this.buffer = buffer;
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    }

    /**
     * Set attribute variable's pointer to somewhere in buffer
     * @param {String} name name of variable in program
     * @param {"FLOAT"} type type of variable in program
     * @param {Number} dimensions vec2 -> 2, vec3 -> 3, etc.
     * @param {Number} offset Offset to read current buffer
     * @param {Boolean} normalized are the values normalized?
     */
    setAttrib(name, type, dimensions, offset, normalized) {
        if (!this.program) throw new Error("No program active");

        const id = this.context.getAttribLocation(this.program, name);
        this.context.vertexAttribPointer(
            id,
            dimensions,
            this.context[type],
            normalized,
            this.buffer.elements * this.sizeMap[type],
            offset * this.sizeMap[type]
        );
        this.context.enableVertexAttribArray(id);
    }

    /**
     * Set uniform variable's value
     * @param {String} name name of variable in program
     * @param {"Matrix4f"} type type of variable on program
     * @param {Array<Number>} data data
     * @param {Boolean} transpose transpose?
     */
    setUniform(name, type, data, transpose) {
        if (!this.program) throw new Error("No program active");

        const id = this.context.getUniformLocation(this.program, name);
        this.context["uniform" + type + "v"](
            id, transpose, new Float32Array(data)
        );
    }

    enableDepth() {
        this.context.enable(this.context.DEPTH_TEST);
        this.context.depthFunc(this.context.LEQUAL);
    }

    render(start, amount) {
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        this.context.drawArrays(
            this.context.TRIANGLES,
            start || 0,
            amount || this.buffer.size / this.buffer.elements || 0
        );
    }
}