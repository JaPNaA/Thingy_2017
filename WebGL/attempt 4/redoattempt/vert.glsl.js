const VERTSrc = `\

attribute vec4 a_VertexPosition;

uniform mat4 u_ModelViewMatrix;
uniform mat4 u_ProjectionMatrix;

void main() {
  gl_Position = u_ProjectionMatrix * u_ModelViewMatrix * a_VertexPosition;
}

`;