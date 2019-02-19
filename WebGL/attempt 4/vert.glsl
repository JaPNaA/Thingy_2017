attribute vec4 attributeVec4_VertexPosition;

uniform mat4 uniformMat4_ModelViewMatrix;
uniform mat4 uniformMat4_ProjectionMatrix;

void main() {
    gl_Position = 
        uniformMat4_ProjectionMatrix * 
        uniformMat4_ModelViewMatrix * 
        attributeVec4_VertexPosition;
}