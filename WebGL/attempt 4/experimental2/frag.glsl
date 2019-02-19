#ifdef GL_ES
precision mediump float;
#endif

void main() {
    // vec2 pos = gl_FragCoord.xy;
    gl_FragColor = vec4(gl_FragCoord.x / 800.0, gl_FragCoord.y / 500.0, 1.0, 1.0);
}