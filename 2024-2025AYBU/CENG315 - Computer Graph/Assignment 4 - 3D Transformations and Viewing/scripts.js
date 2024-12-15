"use strict";

var canvas;
var gl;

var bufferTri, bufferRect1, bufferRect2, bufferRect3, bodyBuffer, topBuffer;
var vPosition, modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc, colorLoc;
var modelMatrix, viewMatrix, projectionMatrix;

var translation = [0.0, 0.0, 0.0];
var scale = 1.0;
var rotation = [0.0, 0.0, 0.0];
var speed = 0.5;
var angle = 0;
var triangleColor = [0.0, 0.0, 0.0];

var eye = [0, 1, 3];
var target = [0, 0, 0];
var up = [0, 1, 0];
var fovy = 45;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);

    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    colorLoc = gl.getUniformLocation(program, "uColor");

    initBodyCone();
    initTopCone();
    initWindmill();

    document.getElementById("inp_objX").oninput = function(event) {
        translation[0] = parseFloat(event.target.value);
    };
    document.getElementById("inp_objY").oninput = function(event) {
        translation[1] = parseFloat(event.target.value);
    };
    document.getElementById("inp_objZ").oninput = function(event) {
        translation[2] = parseFloat(event.target.value);
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale = parseFloat(event.target.value);
    };
    document.getElementById("inp_obj_rotX").oninput = function(event) {
        rotation[0] = parseFloat(event.target.value);
    };
    document.getElementById("inp_obj_rotY").oninput = function(event) {
        rotation[1] = parseFloat(event.target.value);
    };
    document.getElementById("inp_obj_rotZ").oninput = function(event) {
        rotation[2] = parseFloat(event.target.value);
    };
    document.getElementById("eyeX").oninput = function(event) {
        eye[0] = parseFloat(event.target.value);
    };
    document.getElementById("eyeY").oninput = function(event) {
        eye[1] = parseFloat(event.target.value);
    };
    document.getElementById("eyeZ").oninput = function(event) {
        eye[2] = parseFloat(event.target.value);
    };
    document.getElementById("targetX").oninput = function(event) {
        target[0] = parseFloat(event.target.value);
    };
    document.getElementById("targetY").oninput = function(event) {
        target[1] = parseFloat(event.target.value);
    };
    document.getElementById("targetZ").oninput = function(event) {
        target[2] = parseFloat(event.target.value);
    };
    document.getElementById("fovSlider").oninput = function(event) {
        fovy = parseFloat(event.target.value);
    };
    document.getElementById("redSlider").oninput = function(event) {
        triangleColor[0] = parseFloat(event.target.value);
    };
    document.getElementById("greenSlider").oninput = function(event) {
        triangleColor[1] = parseFloat(event.target.value);
    };
    document.getElementById("blueSlider").oninput = function(event) {
        triangleColor[2] = parseFloat(event.target.value);
    };

    render();
};

function initWindmill() {
    console.log("Windmill initialized");
    // Add logic to initialize windmill components here
}

function createCone(baseRadius, height, segments) {
    var vertices = [];
    for (let i = 0; i <= segments; i++) {
        let theta = (i / segments) * 2 * Math.PI;
        vertices.push(vec3(baseRadius * Math.cos(theta), 0, baseRadius * Math.sin(theta)));
    }
    vertices.push(vec3(0, height, 0));
    return vertices;
}

function initBodyCone() {
    var coneVertices = createCone(0.2, 0.5, 32);
    bodyBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coneVertices), gl.STATIC_DRAW);
}

function drawBodyCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    var bodyTransform = mat4();
    bodyTransform = mult(bodyTransform, translate(0, -0.5, 0));
    bodyTransform = mult(bodyTransform, scalem(1.0, 1.0, 1.0));
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(bodyTransform));

    gl.uniform3fv(colorLoc, [0.6, 0.3, 0.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 34);
}

function initTopCone() {
    var coneVertices = createCone(0.1, 0.3, 32);
    topBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, topBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coneVertices), gl.STATIC_DRAW);
}

function drawTopCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, topBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    var topTransform = mat4();
    topTransform = mult(topTransform, translate(0, 0.3, 0));
    topTransform = mult(topTransform, rotateY(angle));
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(topTransform));

    gl.uniform3fv(colorLoc, [0.0, 0.0, 1.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 34);
}

function applyTransformations() {
    var transformMatrix = mat4();
    transformMatrix = mult(transformMatrix, translate(translation[0], translation[1], translation[2]));
    transformMatrix = mult(transformMatrix, rotateX(rotation[0]));
    transformMatrix = mult(transformMatrix, rotateY(rotation[1]));
    transformMatrix = mult(transformMatrix, rotateZ(rotation[2]));
    transformMatrix = mult(transformMatrix, scalem(scale, scale, scale));
    return transformMatrix;
}

function updateMatrices() {
    modelMatrix = applyTransformations();
    viewMatrix = lookAt(eye, target, up);
    projectionMatrix = perspective(fovy, 1.0, 0.1, 100.0);

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateMatrices();
    drawBodyCone();
    drawTopCone();

    angle += speed;
    window.requestAnimFrame(render);
}
