attribute vec3 a_position;

vec3 offset = vec3(200.0, 200.0, 0.0);

void main(void) {
    gl_Position = vec4(a_position - offset, 1.0);
}