class Mat extends Float32Array {
    constructor(w, h) {
        super(w * h);
        this.width = w;
        this.height = h;
    }

    static perspective(fovY, aspect, near, far) {
        return new Mat(4, 4).perspective(fovY, aspect, near, far);
    }

    static identity() {
        return new Mat(4, 4).identity();
    }

    identity() {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;
        
        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;

        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;

        return this;
    }

    perspective(fovY, aspect, near, far) {
        let f = 1 / Math.tan(fovY / 2), nf;

        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;

        this[8] = 0;
        this[9] = 0;
        // this[10];
        this[11] = -1;

        this[12] = 0;
        this[13] = 0;
        // this[14];
        this[15] = 0;

        if (far === null || far === Infinity) {
            this[10] = -1;
            this[14] = -2 * near;
        } else {
            nf = 1 / (near - far);
            this[10] = (far + near) * nf;
            this[14] = 2 * far * near * nf;
        }

        return this;
    }

    /**
     * Rotates a mat4 by the given angle around the given axis
     * @param {Number} rad the angle to rotate this by
     * @param {Number[]} axis the axis to rotate around
     * @returns {Mat} this
     */
    rotate(rad, axis) {
        let x = axis[0], y = axis[1], z = axis[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;

        if (len < 0.00001) { return null; }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = this[0]; a01 = this[1]; a02 = this[2]; a03 = this[3];
        a10 = this[4]; a11 = this[5]; a12 = this[6]; a13 = this[7];
        a20 = this[8]; a21 = this[9]; a22 = this[10]; a23 = this[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     * 
     * @param {Number[]} eye Position of the viewer
     * @param {Number[]} center Point the viewer is looking at
     * @param {Mumber[]} up vec3 pointing up
     * @returns {Mat} this
     */
    lookAt(eye, center, up) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let eyex = eye[0];
        let eyey = eye[1];
        let eyez = eye[2];
        let upx = up[0];
        let upy = up[1];
        let upz = up[2];
        let centerx = center[0];
        let centery = center[1];
        let centerz = center[2];

        if (Math.abs(eyex - centerx) < 0.00001 &&
            Math.abs(eyey - centery) < 0.00001 &&
            Math.abs(eyez - centerz) < 0.00001) {
            return this.identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        this[0] = x0;
        this[1] = y0;
        this[2] = z0;
        this[3] = 0;
        this[4] = x1;
        this[5] = y1;
        this[6] = z1;
        this[7] = 0;
        this[8] = x2;
        this[9] = y2;
        this[10] = z2;
        this[11] = 0;
        this[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        this[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        this[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        this[15] = 1;

        return this;
    }
}