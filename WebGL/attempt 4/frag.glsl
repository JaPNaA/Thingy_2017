#ifdef GL_ES
precision mediump float;
#endif

uniform float ang;

vec2 rotate(in vec2 pos, float angle, float ox, float oy) {
    float s = sin(angle);
    float c = cos(angle);
    vec2 rpos;

    rpos.x -= ox;
    rpos.y -= oy;

    rpos.x = pos.x * c - pos.y * s;
    rpos.y = pos.x * s + pos.y * c;

    rpos.x += ox;
    rpos.y += oy;

    return rpos;
}

void main() {
    vec2 pos = rotate(gl_FragCoord.xy, ang, 400.0, 250.0);
    gl_FragColor = vec4(pos.x / 800.0, pos.y / 500.0, 1.0, 1.0);
}