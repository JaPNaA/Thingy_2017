#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec2 pos = gl_FragCoord.xy / u_resolution;
    bool ax = false, ay = false;

    if (mod(pos.x, 0.1) < 0.05) {
        ax = true;
    }
    
    if (mod(pos.y, 0.1) < 0.05) {
        ay = true;
    }

    if (ax == ay) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}