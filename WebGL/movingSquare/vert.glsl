precision mediump float;

attribute vec2 aPos;
uniform mat4 cameraM;

void main()
{
    gl_Position = cameraM * vec4(aPos, 1.0, 1.0);
}