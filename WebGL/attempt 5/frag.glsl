#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec2 pos = gl_FragCoord.xy * 0.5 + 0.5;
    gl_FragColor = vec4(pos, 1.0, 1.0);
}