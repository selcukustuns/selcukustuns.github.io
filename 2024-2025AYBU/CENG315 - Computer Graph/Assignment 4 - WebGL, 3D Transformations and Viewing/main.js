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
    // Canvas ve WebGL başlatma
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // WebGL ayarları
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Shader programını oluştur
    program = initShadersFromText(gl, vertexShaderText, fragmentShaderText);
    gl.useProgram(program);

    // Uniform değişkenlerin yerlerini al
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    colorLoc = gl.getUniformLocation(program, "uColor");

    // Buffer'ları kur
    setupBuffers();

    // Kontrolleri başlat
    setupCameraControls();    // Kamera ayarlarını kontrol eden fonksiyon
    setupWindmillControls();  // Rüzgar gülü hızını kontrol eden fonksiyon
    setupTransformControls(); // Transform ayarlarını kontrol eden fonksiyon
    setupColorControls();     // Renk ayarlarını kontrol eden fonksiyon

    // İlk kamera ayarlarını uygula
    updateCamera();

    // Çizim döngüsünü başlat
    render();

    // Rüzgar gülünü animasyona başlat
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
    const numSegments = 30; // Segment sayısı

    // Büyük koni vertex verileri
    const coneVertices = [];
    coneVertices.push(vec3(0, 1, 0)); // Tepe nokta

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

    // Koninin taban vertex verileri
    const baseVertices = [];
    baseVertices.push(vec3(0, 0, 0)); // Taban merkezi

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

    // Küçük koni vertex verileri
    const smallConeVertices = [];
    smallConeVertices.push(vec3(0, 0.2, 0)); // Tepe nokta

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

    // Pervane vertex verileri
    const bladeVertices = [
        vec3(-0.1, 0, 0),
        vec3(0.1, 0, 0),
        vec3(0.1, 0.5, 0),
        vec3(-0.1, 0.5, 0)
    ];

    bladeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bladeVertices), gl.STATIC_DRAW);

    // Zemin vertex verileri
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
    rotationAngle += windmillSettings.speed; // Sadece hız ayarıyla etkilenir
    setTimeout(animateWindmill, 16); // ~60 FPS için
}

function setupCameraControls() {
    document.getElementById("fovy").oninput = function(event) {
        cameraSettings.fovy = parseFloat(event.target.value);
        updateValue('fovyVal', event.target.value);
        updateCamera();
    };

    document.getElementById("camPosX").oninput = function(event) {
        cameraSettings.camPosX = parseFloat(event.target.value);
        updateValue('camPosXVal', event.target.value);
        updateCamera();
    };

    document.getElementById("camPosY").oninput = function(event) {
        cameraSettings.camPosY = parseFloat(event.target.value);
        updateValue('camPosYVal', event.target.value);
        updateCamera();
    };

    document.getElementById("camPosZ").oninput = function(event) {
        cameraSettings.camPosZ = parseFloat(event.target.value);
        updateValue('camPosZVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetX").oninput = function(event) {
        cameraSettings.targetX = parseFloat(event.target.value);
        updateValue('targetXVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetY").oninput = function(event) {
        cameraSettings.targetY = parseFloat(event.target.value);
        updateValue('targetYVal', event.target.value);
        updateCamera();
    };

    document.getElementById("targetZ").oninput = function(event) {
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
        render(); // Yalnızca çizimi günceller
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
    viewMatrix = lookAt(
        vec3(cameraSettings.camPosX, cameraSettings.camPosY, cameraSettings.camPosZ),
        vec3(cameraSettings.targetX, cameraSettings.targetY, cameraSettings.targetZ),
        vec3(0, 1, 0)
    );
    projectionMatrix = perspective(cameraSettings.fovy, canvas.width / canvas.height, 0.1, 100);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    // Kamera güncellemesi render döngüsünü tetiklemez
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Çizim fonksiyonları
    drawGround();
    drawCone();
    drawSmallCone();
    drawBlades();

    requestAnimationFrame(render); // Çizimi sürekli tekrar eder
}



function drawGround() {
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(mat4()));
    gl.uniform4fv(colorLoc, vec4(0.6, 0.4, 0.2, 1.0)); // Kahverengi zemin
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mat4();
    transform = mult(transform, translate(0, -0.2, 0)); // Büyük koniyi biraz daha aşağı taşı
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

    gl.uniform4fv(colorLoc, vec4(0.2, 0.2, 0.2, 1.0)); // Taban için ayrı bir renk
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}

function drawBlades() {
    const colors = [
        vec4(1.0, 0.0, 0.0, 1.0), // Kırmızı
        vec4(0.0, 1.0, 0.0, 1.0), // Yeşil
        vec4(0.0, 0.0, 1.0, 1.0)  // Mavi
    ];

    for (let i = 0; i < 3; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

        let transform = mat4();
        transform = mult(transform, translate(0, 1.0, 0)); // Küçük koninin y eksenindeki uç noktasına taşı
        transform = mult(transform, translate(0, 0, 0)); // Pervaneleri küçük koninin z eksenindeki merkezine sabitle
        transform = mult(transform, rotateZ(rotationAngle + i * 120)); // Bıçakları 120° aralıklarla döndür
        transform = mult(transform, translate(0.5, 0, 0)); // Çember üzerindeki mesafeyi ayarla
        transform = mult(transform, rotateZ(90)); // Dikdörtgeni dik hale getir

        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
        gl.uniform4fv(colorLoc, colors[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // Dikdörtgen çizimi
    }
}

function drawSmallCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mat4();
    transform = mult(transform, translate(0, 1.0, 0)); // Küçük koniyi büyük koninin en ucuna yerleştir
    transform = mult(transform, scalem(0.5, 0.5, 0.5)); // Küçük koniyi uygun boyutta ölçeklendir
    transform = mult(transform, rotateX(90)); // Küçük koniyi z eksenine hizala

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));
    gl.uniform4fv(colorLoc, vec4(0.6, 0.6, 0.6, 1.0)); // Gri renk
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);
}
