"use strict";

let canvas, gl, program;
let modelMatrix, viewMatrix, projectionMatrix;
let modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc, colorLoc;

let rotationAngle = 0;

let cameraSettings = {
    fovy: 45,
    camPosX: 0,
    camPosY: 2,
    camPosZ: 5,
    targetX: 0,
    targetY: 0,
    targetZ: 0
};

let windmillSettings = {
    speed: 0.5
};

let transformSettings = {
    posX: 0,
    posY: 0,
    posZ: 0,
    scale: 1,
    rotX: 0,
    rotY: 0,
    rotZ: 0
};

let colorSettings = {
    colorR: 0.0,
    colorG: 0.0,
    colorB: 0.0
};

let coneBuffer, smallConeBuffer, groundBuffer, bladeBuffer, baseBuffer;

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShadersFromText(gl, vertexShaderText, fragmentShaderText);
    gl.useProgram(program);

    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    colorLoc = gl.getUniformLocation(program, "uColor");

    setupBuffers();
    setupCameraControls();
    setupWindmillControls();
    setupTransformControls();
    setupColorControls();
    updateCamera();
    render();
    animateWindmill();
};


function initShadersFromText(gl, vertexShaderText, fragmentShaderText) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}

function setupBuffers() {
    const numSegments = 28;

    const coneVertices = [];
    coneVertices.push(vec3(0, 1, 0));

    for (let i = 0; i <= numSegments; i++) {
        const theta = (i * 2 * Math.PI) / numSegments;
        coneVertices.push(vec3(
            0.5 * Math.cos(theta),
            0,
            0.5 * Math.sin(theta)
        ));
    }

    coneBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coneVertices), gl.STATIC_DRAW);

    const baseVertices = [];
    baseVertices.push(vec3(0, 0, 0));

    for (let i = 0; i <= numSegments; i++) {
        const theta = (i * 2 * Math.PI) / numSegments;
        baseVertices.push(vec3(
            0.5 * Math.cos(theta),
            0,
            0.5 * Math.sin(theta)
        ));
    }

    baseBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, baseBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(baseVertices), gl.STATIC_DRAW);

    const smallConeVertices = [];
    smallConeVertices.push(vec3(0, 0.2, 0));

    for (let i = 0; i <= numSegments; i++) {
        const theta = (i * 2 * Math.PI) / numSegments;
        smallConeVertices.push(vec3(
            0.1 * Math.cos(theta),
            0,
            0.1 * Math.sin(theta)
        ));
    }

    smallConeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(smallConeVertices), gl.STATIC_DRAW);

 
    const bladeVertices = [
        vec3(-0.1, 0, 0),
        vec3(0.1, 0, 0),
        vec3(0.1, 0.5, 0),
        vec3(-0.1, 0.5, 0)
    ];

    bladeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bladeVertices), gl.STATIC_DRAW);

    
    const groundVertices = [
        vec3(-2, 0, -2),
        vec3(2, 0, -2),
        vec3(2, 0, 2),
        vec3(-2, 0, 2)
    ];
    groundBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(groundVertices), gl.STATIC_DRAW);
}

function animateWindmill() {
    rotationAngle += windmillSettings.speed;
    setTimeout(animateWindmill, 16); 
}

function setupCameraControls() {
    document.getElementById("camPosX").oninput = function (event) {
        cameraSettings.camPosX = parseFloat(event.target.value);
        updateValue('camPosXVal', event.target.value);
        updateCamera();
    };

    document.getElementById("camPosY").oninput = function (event) {
        cameraSettings.camPosY = parseFloat(event.target.value);
        updateValue('camPosYVal', event.target.value);
        updateCamera();
    };

    document.getElementById("camPosZ").oninput = function (event) {
        cameraSettings.camPosZ = parseFloat(event.target.value);
        updateValue('camPosZVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetX").oninput = function (event) {
        cameraSettings.targetX = parseFloat(event.target.value);
        updateValue('targetXVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetY").oninput = function (event) {
        cameraSettings.targetY = parseFloat(event.target.value);
        updateValue('targetYVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetZ").oninput = function (event) {
        cameraSettings.targetZ = parseFloat(event.target.value);
        updateValue('targetZVal', event.target.value);
        updateCamera();
    };
}


function setupWindmillControls() {
    document.getElementById("speed").oninput = function (event) {
        windmillSettings.speed = parseFloat(event.target.value);
        updateValue('speedVal', event.target.value);
    };
}

function setupTransformControls() {
    document.getElementById("posX").oninput = function(event) {
        transformSettings.posX = parseFloat(event.target.value);
        updateValue('posXVal', event.target.value);
        render(); 
    };

    document.getElementById("posY").oninput = function(event) {
        transformSettings.posY = parseFloat(event.target.value);
        updateValue('posYVal', event.target.value);
        render();
    };

    document.getElementById("posZ").oninput = function(event) {
        transformSettings.posZ = parseFloat(event.target.value);
        updateValue('posZVal', event.target.value);
        render();
    };

    document.getElementById("scale").oninput = function(event) {
        transformSettings.scale = parseFloat(event.target.value);
        updateValue('scaleVal', event.target.value);
        render();
    };

    document.getElementById("rotX").oninput = function(event) {
        transformSettings.rotX = parseFloat(event.target.value);
        updateValue('rotXVal', event.target.value);
        render();
    };

    document.getElementById("rotY").oninput = function(event) {
        transformSettings.rotY = parseFloat(event.target.value);
        updateValue('rotYVal', event.target.value);
        render();
    };

    document.getElementById("rotZ").oninput = function(event) {
        transformSettings.rotZ = parseFloat(event.target.value);
        updateValue('rotZVal', event.target.value);
        render();
    };
}


function setupColorControls() {
    document.getElementById("colorR").oninput = function(event) {
        colorSettings.colorR = parseFloat(event.target.value);
        updateValue('colorRVal', event.target.value);
        render();
    };

    document.getElementById("colorG").oninput = function(event) {
        colorSettings.colorG = parseFloat(event.target.value);
        updateValue('colorGVal', event.target.value);
        render();
    };

    document.getElementById("colorB").oninput = function(event) {
        colorSettings.colorB = parseFloat(event.target.value);
        updateValue('colorBVal', event.target.value);
        render();
    };
}

function updateCamera() {

    const eye = vec3(cameraSettings.camPosX, cameraSettings.camPosY, cameraSettings.camPosZ);
    const at = vec3(cameraSettings.targetX, cameraSettings.targetY, cameraSettings.targetZ);
    const up = vec3(0, 1, 0);


    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(cameraSettings.fovy, canvas.width / canvas.height, 0.1, 100);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawGround();
    drawCombinedShape();

    requestAnimationFrame(render); 
}




function drawGround() {
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(mat4()));
    gl.uniform4fv(colorLoc, vec4(0.6, 0.4, 0.2, 1.0)); 
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mat4();
    transform = mult(transform, translate(0, 0, 0)); 
    transform = mult(transform, scalem(transformSettings.scale, transformSettings.scale, transformSettings.scale));
    transform = mult(transform, rotateX(transformSettings.rotX));
    transform = mult(transform, rotateY(transformSettings.rotY));
    transform = mult(transform, rotateZ(transformSettings.rotZ));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
    gl.uniform4fv(colorLoc, vec4(colorSettings.colorR, colorSettings.colorG, colorSettings.colorB, 1.0)); // Siyah büyük koni

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 31);

    gl.bindBuffer(gl.ARRAY_BUFFER, baseBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniform4fv(colorLoc, vec4(0.2, 0.2, 0.2, 1.0)); 
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}

function drawBlades() {
    const colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0)  
    ];

    
    const smallConeZScale = 1.5; 
    const smallConeBaseHeight = 0.2; 
    const bladeCenterZ = smallConeBaseHeight * smallConeZScale; 

    for (let i = 0; i < 3; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

        let transform = mat4();
        transform = mult(transform, translate(0, 1.0, bladeCenterZ));
        transform = mult(transform, rotateZ(rotationAngle + i * 120)); 
        transform = mult(transform, translate(0.5, 0, 0)); 
        transform = mult(transform, rotateZ(90)); 

        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
        gl.uniform4fv(colorLoc, colors[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}



function drawSmallCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mat4();

    transform = mult(transform, translate(0, 1.0, 0)); 
    transform = mult(transform, scalem(0.8, 0.8, 1.5));
    transform = mult(transform, rotateX(90)); 

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}

function drawCombinedShape() {
    let mainTransform = mat4();
    mainTransform = mult(mainTransform, translate(transformSettings.posX, transformSettings.posY, transformSettings.posZ)); // Ana pozisyon
    mainTransform = mult(mainTransform, rotateX(transformSettings.rotX)); 
    mainTransform = mult(mainTransform, rotateY(transformSettings.rotY));
    mainTransform = mult(mainTransform, rotateZ(transformSettings.rotZ));
    mainTransform = mult(mainTransform, scalem(transformSettings.scale, transformSettings.scale, transformSettings.scale)); 

    drawConeWithTransform(mainTransform);

    drawSmallConeWithTransform(mainTransform);

    drawBladesWithTransform(mainTransform);
}

function drawConeWithTransform(parentTransform) {
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mult(parentTransform, translate(0, 0, 0));
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
    gl.uniform4fv(colorLoc, vec4(colorSettings.colorR, colorSettings.colorG, colorSettings.colorB, 1.0)); 

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 31);

    gl.bindBuffer(gl.ARRAY_BUFFER, baseBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniform4fv(colorLoc, vec4(0.2, 0.2, 0.2, 1.0));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}

function drawSmallConeWithTransform(parentTransform) {
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mult(parentTransform, translate(0, 1.0, 0));
    transform = mult(transform, scalem(0.8, 0.8, 1.5));
    transform = mult(transform, rotateX(90));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0)); 
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}


function drawBladesWithTransform(parentTransform) {
    const colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0), 
        vec4(0.0, 0.0, 1.0, 1.0)  
    ];

    const smallConeZScale = 1.5; 
    const smallConeBaseHeight = 0.2; 
    const bladeCenterZ = smallConeBaseHeight * smallConeZScale; 

    for (let i = 0; i < 3; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

        let transform = mult(parentTransform, translate(0, 1.0, bladeCenterZ)); 
        transform = mult(transform, rotateZ(rotationAngle + i * 120)); 
        transform = mult(transform, translate(0.5, 0, 0)); 
        transform = mult(transform, rotateZ(90)); 

        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
        gl.uniform4fv(colorLoc, colors[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); 
    }
}