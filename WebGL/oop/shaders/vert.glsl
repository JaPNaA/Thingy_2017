precision mediump float;

attribute vec2 aPos;
attribute vec3 aModelT;
attribute vec3 aColor;

uniform mat4 cameraM;

varying vec3 vertColor;

void main()
{
    vertColor = aColor;
    gl_Position = cameraM * vec4(vec3(aPos, 1.0) + aModelT, 1.0);
}