"use strict";

var canvas;
var gl;

var bufferTri, bufferRect1, bufferRect2, bufferRect3, triVertices, rectVertices;
var vPosition;
var transformationMatrix, transformationMatrixLoc;
var colorLoc;

var translation = [0.0, 0.0];
var scale = 1.0;
var rotation = 0.0;
var speed = 0.5;
var angle = 0;
var triangleColor = [0.0, 0.0, 0.0];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    triVertices = [
        vec2(-0.1, -0.2),
        vec2(0.1, -0.2),
        vec2(0.0, 0.3)
    ];

    rectVertices = [
        vec2(-0.05, -0.2),
        vec2(0.05, -0.2),
        vec2(-0.05, 0.2),
        vec2(0.05, 0.2)
    ];

    bufferTri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTri);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW);

    bufferRect1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRect1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW);

    bufferRect2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRect2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW);

    bufferRect3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRect3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    transformationMatrixLoc = gl.getUniformLocation(program, "transformationMatrix");
    colorLoc = gl.getUniformLocation(program, "uColor");

    document.getElementById("inp_objX").oninput = function(event) {
        translation[0] = parseFloat(event.target.value);
    };

    document.getElementById("inp_objY").oninput = function(event) {
        translation[1] = parseFloat(event.target.value);
    };

    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale = parseFloat(event.target.value);
    };

    document.getElementById("inp_obj_rotation").oninput = function(event) {
        rotation = parseFloat(event.target.value);
    };

    document.getElementById("inp_wing_speed").oninput = function(event) {
        speed = parseFloat(event.target.value);
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

function applyTransformations() {
    var transformMatrix = mat4();
    transformMatrix = mult(transformMatrix, translate(translation[0] - 0.1, translation[1] - 0.2, 0.0));
    transformMatrix = mult(transformMatrix, rotateZ(rotation));
    transformMatrix = mult(transformMatrix, translate(0.1, 0.2, 0.0));
    transformMatrix = mult(transformMatrix, scalem(scale, scale, 1.0));
    return transformMatrix;
}


function drawWing(buffer, color, angleOffset, baseTransform) {
    var transformMatrix = mult(baseTransform, translate(0.0, 0.3, 0.0));
    transformMatrix = mult(transformMatrix, rotateZ(angle + angleOffset));
    transformMatrix = mult(transformMatrix, translate(0.0, -0.2, 0.0));
    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(transformMatrix));
    gl.uniform3fv(colorLoc, color);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    var baseTransform = applyTransformations();

    gl.uniform3fv(colorLoc, triangleColor);
    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(baseTransform));
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTri);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    drawWing(bufferRect1, [1.0, 0.0, 0.0], 0, baseTransform);
    drawWing(bufferRect2, [0.0, 1.0, 0.0], 120, baseTransform);
    drawWing(bufferRect3, [0.0, 0.0, 1.0], 240, baseTransform);

    angle += speed;
    window.requestAnimFrame(render);
}
