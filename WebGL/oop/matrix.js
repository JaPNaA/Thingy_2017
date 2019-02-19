class Mat4 extends Float32Array {
    constructor() {
        super(16);

        this.identity();
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
    }

    static scale(mat, x, y) {
        return mat.copy().scale(x, y);
    }

    copy() {
        let m = new Mat4();

        m[0] = this[0];
        m[1] = this[1];
        m[2] = this[2];
        m[3] = this[3];

        m[4] = this[4];
        m[5] = this[5];
        m[6] = this[6];
        m[7] = this[7];

        m[8] = this[8];
        m[9] = this[9];
        m[10] = this[10];
        m[11] = this[11];

        m[12] = this[12];
        m[13] = this[13];
        m[14] = this[14];
        m[15] = this[15];

        return m;
    }

    scale(x, y) {
        this[0] *= x;
        this[5] *= y;

        return this;
    }

    aspect(asp) {
        this[0] *= 1 / asp;
        this[5] = 1;

        return this;
    }
}