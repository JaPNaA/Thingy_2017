#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 a_vertexPos;

uniform vec2 u_scale;
uniform vec2 u_rotation;

void main() {
    vec2 rotatedPos = vec2(
        a_vertexPos.x * u_rotation.y +
        a_vertexPos.y * u_rotation.x,
        a_vertexPos.y * u_rotation.y - 
        a_vertexPos.x * u_rotation.x
    );

    gl_Position = vec4(rotatedPos * u_scale, 0.0, 1.0);
}