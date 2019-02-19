precision mediump float;

uniform mat4 worldMatrix; // model to world
uniform mat4 viewMatrix; // world to camera
uniform mat4 projectionMatrix; // camera to screen

attribute vec3 vertPos;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPos, 1.0);
}