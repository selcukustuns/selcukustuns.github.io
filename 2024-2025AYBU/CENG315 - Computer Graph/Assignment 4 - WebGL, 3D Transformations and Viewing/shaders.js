// Vertex Shader Kodu
const vertexShaderText = `
attribute vec4 vPosition;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}
`;

// Fragment Shader Kodu
const fragmentShaderText = `
precision mediump float;
uniform vec4 uColor;

void main() {
    gl_FragColor = uColor;
}
`;
