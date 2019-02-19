const FRAGSrc = `\

precision mediump float;

vec3 getCol(float n) {
    float r = mod(floor(n / 65536.0), 256.0) / 256.;
    float g = mod(floor(n / 256.0), 256.0) / 256.;
    float b = mod(floor(n), 256.0) / 256.;

    return vec3(r, g, b);
}

void main() {
    float width = 1280.0;
    float height = 720.0;

    // float x = gl_FragCoord.x / width;
    // float y = gl_FragCoord.y / height;

    // x *= x;
    // y *= y;

    // gl_FragColor = vec4(x, y, 1.0, 1.0);

    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;

    gl_FragColor = vec4(getCol(
    	mod(x / y * 16777215.0, 16777216.0)
    ), 1.0);
}

`;